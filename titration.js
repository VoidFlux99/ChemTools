const $ = id => document.getElementById(id);
const leer = x => Number.isNaN(x);

// Molmasse aus Formelfeld oder direktem Feld. Gibt { M, fehler } zurück (M = NaN wenn nichts angegeben).
function molmasse(formelId, mId) {
  const f = $(formelId).value.trim();
  if (f) {
    try {
      const teile = parse(f);
      return { M: Object.entries(teile).reduce((a, [el, n]) => a + MASSEN[el] * n, 0), fehler: null };
    } catch (e) { return { M: NaN, fehler: "Formel: " + e.message }; }
  }
  return { M: num($(mId).value), fehler: null };
}

function zeigeZeilen(box, zeilen) {
  box.innerHTML = "";
  zeilen.forEach(([text, gross]) => {
    const p = document.createElement("p");
    if (gross) p.className = "gross";
    p.textContent = text;
    box.appendChild(p);
  });
  box.hidden = false;
}

// ---- Gehaltsbestimmung ----
function gehalt() {
  const out = $("g-out");
  out.hidden = true;
  const c = num($("g-c").value), f = num($("g-f").value), V = num($("g-V").value), nu = num($("g-nu").value);
  if ([c, f, V, nu].some(leer) || c <= 0 || f <= 0 || V <= 0 || nu <= 0) return;
  const { M, fehler } = molmasse("g-formel", "g-M");
  if (fehler) return zeigeZeilen(out, [[fehler, false]]);

  const Va = num($("g-Va").value), Vg = num($("g-Vg").value), mE = num($("g-m").value);
  const nT = (c * f * V) / 1000;
  const nAliquot = nT * nu;
  const zeilen = [[`n(Titrant) = ${sig(nT, 4)} mol`, false]];
  let nGesamt = nAliquot;

  if (!leer(Va) && Va > 0) {
    zeilen.unshift([`c(Analyt) in der Probe = ${sig(nAliquot / (Va / 1000), 4)} mol/L`, true]);
    zeilen.push([`n(Analyt) in ${sig(Va, 4)} mL = ${sig(nAliquot, 4)} mol`, false]);
    if (!leer(Vg) && Vg > 0) {
      nGesamt = nAliquot * (Vg / Va);
      zeilen.push([`n(Analyt) im Gesamtvolumen ${sig(Vg, 4)} mL = ${sig(nGesamt, 4)} mol`, false]);
    }
  } else {
    zeilen.unshift([`n(Analyt) = ${sig(nAliquot, 4)} mol`, true]);
  }
  if (!leer(M) && M > 0) {
    const m = nGesamt * M;
    zeilen.push([`m(Analyt) = ${sig(m, 4)} g (${sig(m * 1000, 4)} mg), mit M = ${sig(M, 6)} g/mol`, false]);
    if (!leer(mE) && mE > 0) zeilen.push([`Massenanteil in der Probe: ${sig((m / mE) * 100, 4)} %`, false]);
  } else if (!leer(mE)) {
    zeilen.push(["Für den Massenanteil bitte Formel oder Molmasse angeben.", false]);
  }
  zeigeZeilen(out, zeilen);
}

// ---- Titerbestimmung ----
function titer() {
  const out = $("t-out");
  out.hidden = true;
  const m = num($("t-m").value), nu = num($("t-nu").value), V = num($("t-V").value), cSoll = num($("t-c").value);
  const { M, fehler } = molmasse("t-formel", "t-M");
  if (fehler) return zeigeZeilen(out, [[fehler, false]]);
  if ([M, m, nu, V, cSoll].some(leer) || [M, m, nu, V, cSoll].some(x => x <= 0)) return;
  const nTitrant = m / M / nu;
  const cIst = nTitrant / (V / 1000);
  const f = cIst / cSoll;
  zeigeZeilen(out, [
    [`Titer f = ${sig(f, 4)}`, true],
    [`c(ist) = ${sig(cIst, 4)} mol/L`, false],
    [`n(Titrant) = ${sig(nTitrant, 4)} mol (M = ${sig(M, 6)} g/mol)`, false],
    f < 0.9 || f > 1.1 ? ["Der Titer liegt außerhalb von 0,9 bis 1,1. Meist ein Hinweis auf einen Fehler bei Einwaage oder Ansatz.", false] : ["", false]
  ].filter(z => z[0] !== ""));
}

// ---- Titrationskurve ----
function farbe(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

function kurve() {
  const typ = $("k-typ").value, staerke = $("k-staerke").value;
  $("k-pk-label").hidden = staerke === "stark";
  $("k-pk-text").textContent = typ === "saeure" ? "pKs" : "pKb";
  const fehler = $("k-fehler"), tab = $("k-tabelle"), canvas = $("k-canvas");
  fehler.hidden = true; tab.hidden = true;

  const c0 = num($("k-c0").value), V0 = num($("k-V0").value), cT = num($("k-cT").value);
  const pk = staerke === "stark" ? NaN : num($("k-pk").value);
  const zeichneLeer = () => { const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); };
  if ([c0, V0, cT].some(leer) || c0 <= 0 || V0 <= 0 || cT <= 0 || (staerke === "schwach" && leer(pk))) { zeichneLeer(); return; }

  // Ka der Säure bzw. des konjugierten Säure-Ions der Base
  let Ka;
  if (typ === "saeure") Ka = staerke === "stark" ? 1e5 : Math.pow(10, -pk);
  else Ka = staerke === "stark" ? 1e-19 : Math.pow(10, -(14 - pk));
  if (staerke === "schwach" && (pk < 0 || pk > 14)) {
    fehler.textContent = "Der pK-Wert sollte zwischen 0 und 14 liegen.";
    fehler.hidden = false;
    zeichneLeer();
    return;
  }

  const Veq = (c0 * V0) / cT;
  const Vmax = Veq * 2;
  const ph = V => phTitration(typ, Ka, c0, V0, cT, V);

  // Zeichnen
  const dpr = window.devicePixelRatio || 1;
  const B = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = B * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const rand = { l: 42, r: 14, o: 14, u: 34 };
  const x = V => rand.l + (V / Vmax) * (B - rand.l - rand.r);
  const y = p => rand.o + (1 - p / 14) * (H - rand.o - rand.u);
  const cText = farbe("--muted"), cRand = farbe("--border"), cAkz = farbe("--accent"), cFg = farbe("--text");

  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (let p = 0; p <= 14; p += 2) {
    ctx.strokeStyle = cRand; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(rand.l, y(p)); ctx.lineTo(B - rand.r, y(p)); ctx.stroke();
    ctx.fillStyle = cText; ctx.fillText(String(p), rand.l - 6, y(p));
  }
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (let i = 0; i <= 4; i++) {
    const V = (Vmax * i) / 4;
    ctx.fillStyle = cText; ctx.fillText(sig(V, 3), x(V), H - rand.u + 6);
  }
  ctx.fillText("V(Titrant) in mL", (B + rand.l) / 2, H - 16);
  ctx.save(); ctx.translate(12, (H - rand.u) / 2); ctx.rotate(-Math.PI / 2); ctx.textBaseline = "middle"; ctx.fillText("pH", 0, 0); ctx.restore();

  // Äquivalenzpunkt senkrecht
  ctx.setLineDash([4, 4]); ctx.strokeStyle = cText;
  ctx.beginPath(); ctx.moveTo(x(Veq), rand.o); ctx.lineTo(x(Veq), H - rand.u); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = cAkz; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i <= 400; i++) {
    const V = (Vmax * i) / 400;
    const p = Math.min(14, Math.max(0, ph(V)));
    i === 0 ? ctx.moveTo(x(V), y(p)) : ctx.lineTo(x(V), y(p));
  }
  ctx.stroke();
  const pEq = ph(Veq);
  ctx.fillStyle = cFg; ctx.beginPath(); ctx.arc(x(Veq), y(Math.min(14, Math.max(0, pEq))), 4.5, 0, 2 * Math.PI); ctx.fill();

  // Tabelle der wichtigen Punkte
  const punkte = [["Start", 0], ["Halbäquivalenzpunkt", Veq / 2], ["Äquivalenzpunkt", Veq], ["Doppeltes Äquivalenzvolumen", Vmax]];
  const body = $("k-zeilen");
  body.innerHTML = "";
  punkte.forEach(([n, V]) => {
    const tr = document.createElement("tr");
    [n, V === 0 ? "0 mL" : sig(V, 4) + " mL", sig(ph(V), 3)].forEach(t => {
      const td = document.createElement("td"); td.textContent = t; tr.appendChild(td);
    });
    body.appendChild(tr);
  });
  tab.hidden = false;
}

["g-c", "g-f", "g-V", "g-nu", "g-formel", "g-M", "g-Va", "g-Vg", "g-m"].forEach(id => $(id).addEventListener("input", gehalt));
["t-formel", "t-M", "t-m", "t-nu", "t-V", "t-c"].forEach(id => $(id).addEventListener("input", titer));
["k-typ", "k-staerke", "k-pk", "k-c0", "k-V0", "k-cT"].forEach(id => $(id).addEventListener("input", kurve));
window.addEventListener("resize", kurve);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", kurve);
kurve();
