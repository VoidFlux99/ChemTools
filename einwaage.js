const $ = id => document.getElementById(id);
const leer = x => Number.isNaN(x);

// ---- Einwaage ----
function einwaage() {
  const out = $("e-out");
  out.hidden = true;
  const formel = $("e-formel").value.trim();
  let M = num($("e-M").value);
  let hinweis = "";
  if (formel) {
    try {
      const teile = parse(formel);
      M = Object.entries(teile).reduce((a, [el, n]) => a + MASSEN[el] * n, 0);
      hinweis = `M (${formel}) = ${sig(M, 6)} g/mol`;
    } catch (e) {
      out.hidden = false;
      out.innerHTML = `<p class="fehler"></p>`;
      out.firstChild.textContent = "Formel: " + e.message;
      return;
    }
  }
  const c = num($("e-c").value), V = num($("e-V").value), m = num($("e-m").value);
  const pText = $("e-p").value.trim();
  const p = pText === "" ? 100 : num(pText);
  if (leer(M) || leer(p) || p <= 0) return;
  const frei = [c, V, m].filter(leer).length;
  if (frei !== 1) return;

  const rein = p / 100;
  let zeilen = [];
  if (leer(m)) {
    const g = (c * V / 1000) * M / rein;
    zeilen = [`<p class="gross">m = <strong>${sig(g, 4)} g</strong> (${sig(g * 1000, 4)} mg)</p>`,
      `<p>n = c · V = ${sig(c * V / 1000, 4)} mol</p>`];
  } else if (leer(c)) {
    const x = (m * rein * 1000) / (M * V);
    zeilen = [`<p class="gross">c = <strong>${sig(x, 4)} mol/L</strong></p>`];
  } else {
    const x = (m * rein * 1000) / (M * c);
    zeilen = [`<p class="gross">V = <strong>${sig(x, 4)} mL</strong></p>`];
  }
  if (hinweis) zeilen.push(`<p></p>`);
  out.innerHTML = zeilen.join("");
  if (hinweis) out.lastChild.textContent = hinweis;
  if (p !== 100) {
    const pe = document.createElement("p");
    pe.textContent = `Reinheit ${sig(p, 4)} % berücksichtigt.`;
    out.appendChild(pe);
  }
  out.hidden = false;
}

// ---- Verdünnung ----
function verduennung() {
  const out = $("v-out");
  out.hidden = true;
  const w = { c1: num($("v-c1").value), V1: num($("v-V1").value), c2: num($("v-c2").value), V2: num($("v-V2").value) };
  const frei = Object.keys(w).filter(k => leer(w[k]));
  if (frei.length !== 1) return;
  const k = frei[0];
  if (k === "c1") w.c1 = (w.c2 * w.V2) / w.V1;
  if (k === "V1") w.V1 = (w.c2 * w.V2) / w.c1;
  if (k === "c2") w.c2 = (w.c1 * w.V1) / w.V2;
  if (k === "V2") w.V2 = (w.c1 * w.V1) / w.c2;
  if (![w.c1, w.V1, w.c2, w.V2].every(x => isFinite(x) && x > 0)) return;

  const einh = { c1: "", c2: "", V1: " mL", V2: " mL" }[k];
  let html = `<p class="gross">${k.replace("1", "₁").replace("2", "₂")} = <strong>${sig(w[k], 4)}${einh}</strong></p>`;
  html += `<p>Verdünnungsfaktor: ${sig(w.c1 / w.c2, 4)}</p>`;
  if (w.V2 >= w.V1) html += `<p>${sig(w.V1, 4)} mL Stammlösung in einen ${sig(w.V2, 4)}-mL-Kolben, mit ${sig(w.V2 - w.V1, 4)} mL Lösungsmittel auffüllen.</p>`;
  else html += `<p class="fehler">V₁ ist größer als V₂: Das wäre eine Aufkonzentrierung, keine Verdünnung.</p>`;
  out.innerHTML = html;
  out.hidden = false;
}

// ---- Verdünnungsreihe ----
function reihe() {
  const out = $("r-out"), fehler = $("r-fehler"), body = $("r-zeilen");
  out.hidden = true; fehler.hidden = true;
  const c = num($("r-c").value), f = num($("r-f").value), n = Math.round(num($("r-n").value)), V = num($("r-V").value);
  if ([c, f, n, V].some(leer)) return;
  if (f <= 1 || n < 1 || n > 20 || V <= 0 || c <= 0) {
    fehler.textContent = "Faktor muss größer als 1 sein, Stufen zwischen 1 und 20.";
    fehler.hidden = false;
    return;
  }
  body.innerHTML = "";
  const uebertrag = V / f;
  for (let i = 0; i <= n; i++) {
    const zellen = i === 0
      ? ["0 (Stamm)", sig(c, 4), "–", "–"]
      : [String(i), sig(c / Math.pow(f, i), 4), sig(uebertrag, 4), sig(V - uebertrag, 4)];
    const tr = document.createElement("tr");
    zellen.forEach(t => { const td = document.createElement("td"); td.textContent = t; tr.appendChild(td); });
    body.appendChild(tr);
  }
  out.hidden = false;
}

["e-formel", "e-M", "e-c", "e-V", "e-m", "e-p"].forEach(id => $(id).addEventListener("input", einwaage));
["v-c1", "v-V1", "v-c2", "v-V2"].forEach(id => $(id).addEventListener("input", verduennung));
["r-c", "r-f", "r-n", "r-V"].forEach(id => $(id).addEventListener("input", reihe));
