// Gemeinsame Rechenfunktionen (ohne DOM) für Einwaage-, Fehler- und Titrationsrechner.

// Zahl aus Eingabe lesen. Komma oder Punkt als Dezimaltrenner. Leer oder ungültig = NaN.
function num(text) {
  const s = String(text).trim().replace(/\s+/g, "").replace(",", ".");
  if (s === "") return NaN;
  return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s) ? Number(s) : NaN;
}

// Zahl auf n signifikante Stellen, deutsches Format (Komma).
function sig(x, n = 4) {
  if (!isFinite(x)) return "–";
  if (x === 0) return "0";
  const r = Number(x.toPrecision(n));
  const a = Math.abs(r);
  if (a >= 1e7 || a < 1e-4) return r.toExponential(n - 1).replace(".", ",").replace("e", " · 10^").replace("^+", "^");
  return r.toLocaleString("de-DE", { maximumFractionDigits: 12, useGrouping: false });
}

// Zahl mit fester Zahl Nachkommastellen (dec >= 0), deutsches Format.
function fest(x, dec) {
  return x.toFixed(Math.max(0, Math.min(20, dec))).replace(".", ",");
}

// Messwert ± Unsicherheit sinnvoll runden: Unsicherheit auf 1 Stelle (2 Stellen, wenn die erste Ziffer 1 oder 2 ist),
// Messwert auf dieselbe Dezimalstelle. Gibt { wert, unsicherheit } als Text zurück.
function rundeMitUnsicherheit(wert, u) {
  if (!isFinite(wert) || !isFinite(u) || u <= 0) return { wert: sig(wert, 5), unsicherheit: u === 0 ? "0" : "–" };
  let exp = Math.floor(Math.log10(u));
  let lead = Math.floor(u / Math.pow(10, exp));
  let stellen = lead <= 2 ? 2 : 1;
  let dec = stellen - 1 - exp;
  // Aufrunden kann die Größenordnung ändern (z. B. 0,096 -> 0,1): dann neu bestimmen
  const uR = Number(u.toFixed(Math.max(dec, 0)));
  if (dec >= 0 && uR >= Math.pow(10, exp + 1)) {
    exp += 1;
    lead = Math.floor(uR / Math.pow(10, exp));
    stellen = lead <= 2 ? 2 : 1;
    dec = stellen - 1 - exp;
  }
  if (dec >= 0) return { wert: fest(wert, dec), unsicherheit: fest(u, dec) };
  const f = Math.pow(10, -dec);
  const w = Math.round(wert / f) * f, uu = Math.round(u / f) * f;
  return { wert: String(w), unsicherheit: String(uu) };
}

// t-Faktoren (zweiseitig, 95 %) für 1…30 Freiheitsgrade
const T95 = [12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145,
  2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042];
const tFaktor95 = fg => (fg < 1 ? NaN : fg <= 30 ? T95[fg - 1] : 1.96);

// Statistik einer Messreihe
function statistik(werte) {
  const n = werte.length;
  const mittel = werte.reduce((a, b) => a + b, 0) / n;
  const s = n > 1 ? Math.sqrt(werte.reduce((a, b) => a + (b - mittel) ** 2, 0) / (n - 1)) : NaN;
  const sMittel = s / Math.sqrt(n);
  return { n, mittel, s, sMittel, t: tFaktor95(n - 1), vb: tFaktor95(n - 1) * sMittel };
}

// ---------- Formelausdrücke für die Fehlerfortpflanzung ----------
const FUNKTIONEN = {
  sqrt: Math.sqrt, ln: Math.log, log: Math.log10, exp: Math.exp,
  sin: Math.sin, cos: Math.cos, tan: Math.tan, abs: Math.abs
};
const KONSTANTEN = { pi: Math.PI, e: Math.E };

// Gibt einen Syntaxbaum zurück oder wirft Error mit verständlicher Meldung.
function parseAusdruck(text) {
  const tok = [];
  const re = /\s*(?:(\d+[.,]?\d*(?:[eE][+-]?\d+)?|[.,]\d+)|([A-Za-zµα-ωΑ-Ω_][A-Za-z0-9µα-ωΑ-Ω_]*)|(\*\*|[-+*/^()]))/y;
  let pos = 0;
  while (pos < text.length) {
    re.lastIndex = pos;
    const m = re.exec(text);
    if (!m) {
      if (/^\s*$/.test(text.slice(pos))) break;
      throw new Error(`Unerwartetes Zeichen „${text.slice(pos).trim()[0]}“.`);
    }
    pos = re.lastIndex;
    if (m[1] !== undefined) tok.push({ t: "z", v: Number(m[1].replace(",", ".")) });
    else if (m[2] !== undefined) tok.push({ t: "n", v: m[2] });
    else tok.push({ t: "o", v: m[3] === "**" ? "^" : m[3] });
  }
  let i = 0;
  const peek = () => tok[i];
  const op = v => peek() && peek().t === "o" && peek().v === v;

  function ausdruck() {
    let l = term();
    while (op("+") || op("-")) { const o = tok[i++].v; l = { k: "b", o, l, r: term() }; }
    return l;
  }
  function term() {
    let l = unaer();
    while (op("*") || op("/")) { const o = tok[i++].v; l = { k: "b", o, l, r: unaer() }; }
    return l;
  }
  function unaer() {
    if (op("-")) { i++; return { k: "u", a: unaer() }; }
    if (op("+")) { i++; return unaer(); }
    return potenz();
  }
  function potenz() {
    const b = atom();
    if (op("^")) { i++; return { k: "b", o: "^", l: b, r: unaer() }; }
    return b;
  }
  function atom() {
    const t = tok[i++];
    if (!t) throw new Error("Der Ausdruck ist unvollständig.");
    if (t.t === "z") return { k: "z", v: t.v };
    if (t.t === "n") {
      if (op("(")) {
        if (!(t.v in FUNKTIONEN)) throw new Error(`Unbekannte Funktion „${t.v}“. Erlaubt: ${Object.keys(FUNKTIONEN).join(", ")}.`);
        i++;
        const a = ausdruck();
        if (!op(")")) throw new Error("Klammer nicht geschlossen.");
        i++;
        return { k: "f", n: t.v, a };
      }
      if (t.v in KONSTANTEN) return { k: "z", v: KONSTANTEN[t.v] };
      return { k: "v", n: t.v };
    }
    if (t.v === "(") {
      const a = ausdruck();
      if (!op(")")) throw new Error("Klammer nicht geschlossen.");
      i++;
      return a;
    }
    throw new Error(`Unerwartetes Zeichen „${t.v}“.`);
  }

  if (tok.length === 0) throw new Error("Bitte einen Ausdruck eingeben.");
  const baum = ausdruck();
  if (i < tok.length) throw new Error(`Unerwartetes Zeichen „${tok[i].v}“. Malpunkte bitte mit * schreiben.`);
  return baum;
}

function variablen(baum, menge = new Set()) {
  if (baum.k === "v") menge.add(baum.n);
  else if (baum.k === "b") { variablen(baum.l, menge); variablen(baum.r, menge); }
  else if (baum.k === "u" || baum.k === "f") variablen(baum.a, menge);
  return menge;
}

function auswerten(baum, werte) {
  switch (baum.k) {
    case "z": return baum.v;
    case "v": return werte[baum.n];
    case "u": return -auswerten(baum.a, werte);
    case "f": return FUNKTIONEN[baum.n](auswerten(baum.a, werte));
    case "b": {
      const a = auswerten(baum.l, werte), b = auswerten(baum.r, werte);
      return baum.o === "+" ? a + b : baum.o === "-" ? a - b : baum.o === "*" ? a * b : baum.o === "/" ? a / b : Math.pow(a, b);
    }
  }
}

// Gaußsche Fehlerfortpflanzung mit numerischen Ableitungen (zentrale Differenz).
// werte, unsicherheiten: { name: Zahl }. Gibt { y, u, beitraege: [{name, ableitung, anteil}] } zurück.
function fortpflanzung(baum, werte, unsicherheiten) {
  const y = auswerten(baum, werte);
  const teile = Object.keys(werte).map(name => {
    const x = werte[name];
    const h = (x !== 0 ? Math.abs(x) : 1) * 1e-6;
    const hoch = { ...werte, [name]: x + h }, tief = { ...werte, [name]: x - h };
    const d = (auswerten(baum, hoch) - auswerten(baum, tief)) / (2 * h);
    return { name, ableitung: d, quadrat: (d * (unsicherheiten[name] || 0)) ** 2 };
  });
  const summe = teile.reduce((a, t) => a + t.quadrat, 0);
  return {
    y, u: Math.sqrt(summe),
    beitraege: teile.map(t => ({ name: t.name, ableitung: t.ableitung, anteil: summe > 0 ? t.quadrat / summe : 0 }))
  };
}

// ---------- Titrationskurve ----------
const KW = 1e-14;
// Säure HA (Ka) mit starker Base titriert, oder Base B (Ka des BH⁺) mit starker Säure titriert.
// c0, V0: Analyt (mol/L, mL). cT: Titrant (mol/L). V: zugegebenes Volumen (mL). Gibt den pH zurück.
function phTitration(typ, Ka, c0, V0, cT, V) {
  const gesamt = V0 + V;
  const C = (c0 * V0) / gesamt;
  const T = (cT * V) / gesamt;
  const g = typ === "saeure"
    ? h => T + h - (C * Ka) / (Ka + h) - KW / h
    : h => h + (C * h) / (Ka + h) - T - KW / h;
  let lo = -16, hi = 2; // log10(h)
  for (let k = 0; k < 120; k++) {
    const mid = (lo + hi) / 2;
    if (g(Math.pow(10, mid)) > 0) hi = mid; else lo = mid;
  }
  return -(lo + hi) / 2;
}
