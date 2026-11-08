const $ = id => document.getElementById(id);

function zeileMit(tabelle, teile) {
  const tr = document.createElement("tr");
  teile.forEach(t => { const td = document.createElement("td"); td.textContent = t; tr.appendChild(td); });
  tabelle.appendChild(tr);
}

// ---- Messreihe ----
function messreihe() {
  const fehler = $("m-fehler"), out = $("m-out");
  fehler.hidden = true; out.hidden = true;
  const teile = $("m-werte").value.split(/[\s;]+/).filter(t => t !== "");
  if (teile.length === 0) return;
  const werte = teile.map(num);
  const schlecht = teile.find((t, i) => Number.isNaN(werte[i]));
  if (schlecht !== undefined) {
    fehler.textContent = `„${schlecht}“ ist keine Zahl.`;
    fehler.hidden = false;
    return;
  }
  const s = statistik(werte);
  const tab = $("m-tabelle");
  tab.innerHTML = "";
  zeileMit(tab, ["Anzahl n", String(s.n)]);
  zeileMit(tab, ["Mittelwert x̄", sig(s.mittel, 6)]);
  if (s.n < 2) {
    $("m-ergebnis").textContent = sig(s.mittel, 6);
    $("m-ergebnis95").textContent = "Für eine Unsicherheit sind mindestens 2 Messwerte nötig.";
    out.hidden = false;
    return;
  }
  zeileMit(tab, ["Standardabweichung s", sig(s.s, 4)]);
  zeileMit(tab, ["Standardabweichung des Mittelwerts s/√n", sig(s.sMittel, 4)]);
  zeileMit(tab, ["t-Faktor (95 %, n−1 Freiheitsgrade)", sig(s.t, 4)]);
  zeileMit(tab, ["Vertrauensbereich t · s/√n", sig(s.vb, 4)]);
  zeileMit(tab, ["Relative Standardabweichung", sig((s.s / Math.abs(s.mittel)) * 100, 3) + " %"]);

  const a = rundeMitUnsicherheit(s.mittel, s.sMittel);
  const b = rundeMitUnsicherheit(s.mittel, s.vb);
  $("m-ergebnis").textContent = `${a.wert} ± ${a.unsicherheit}  (± s/√n)`;
  $("m-ergebnis95").textContent = `95 %-Vertrauensbereich: ${b.wert} ± ${b.unsicherheit}`;
  out.hidden = false;
}

// ---- Fortpflanzung ----
const eingaben = {}; // name -> { v, u } (Text), bleibt beim Umschreiben der Formel erhalten
let aktuelleVars = [];

function felder(namen) {
  const box = $("f-felder");
  box.innerHTML = "";
  namen.forEach(n => {
    eingaben[n] = eingaben[n] || { v: "", u: "" };
    [["v", `${n} (Wert)`], ["u", `u(${n}) (Unsicherheit)`]].forEach(([feld, text]) => {
      const l = document.createElement("label");
      l.textContent = text;
      const i = document.createElement("input");
      i.type = "text"; i.inputMode = "decimal"; i.value = eingaben[n][feld];
      i.addEventListener("input", () => { eingaben[n][feld] = i.value; rechne(); });
      l.appendChild(i);
      box.appendChild(l);
    });
  });
}

let baum = null;
function formel() {
  const fehler = $("f-fehler");
  fehler.hidden = true;
  baum = null;
  try {
    baum = parseAusdruck($("f-ausdruck").value);
  } catch (e) {
    fehler.textContent = e.message;
    fehler.hidden = false;
    $("f-felder").innerHTML = ""; aktuelleVars = [];
    $("f-out").hidden = true;
    return;
  }
  const namen = Array.from(variablen(baum));
  if (namen.join() !== aktuelleVars.join()) { aktuelleVars = namen; felder(namen); }
  rechne();
}

function rechne() {
  const out = $("f-out");
  out.hidden = true;
  if (!baum || aktuelleVars.length === 0) return;
  const w = {}, u = {};
  for (const n of aktuelleVars) {
    w[n] = num(eingaben[n].v);
    const ut = eingaben[n].u.trim();
    u[n] = ut === "" ? 0 : num(ut);
    if (Number.isNaN(w[n]) || Number.isNaN(u[n])) return;
  }
  const r = fortpflanzung(baum, w, u);
  if (!isFinite(r.y)) { $("f-ergebnis").textContent = "nicht definiert (Division durch 0 oder ungültiger Wert)"; $("f-rel").textContent = ""; $("f-tabelle").innerHTML = ""; out.hidden = false; return; }
  const g = rundeMitUnsicherheit(r.y, r.u);
  $("f-ergebnis").textContent = `${g.wert} ± ${g.unsicherheit}`;
  $("f-rel").textContent = r.y !== 0 && r.u > 0 ? `Relative Unsicherheit: ${sig((r.u / Math.abs(r.y)) * 100, 3)} %` : "";
  const tab = $("f-tabelle");
  tab.innerHTML = "";
  r.beitraege.forEach(b => zeileMit(tab, [b.name, sig(b.ableitung, 4), sig(b.anteil * 100, 3) + " %"]));
  out.hidden = false;
}

$("m-werte").addEventListener("input", messreihe);
$("f-ausdruck").addEventListener("input", formel);
formel();
