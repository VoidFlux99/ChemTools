// Gemeinsam genutzt: Atommassen und Formel-Parser (Molmassen- und DBÄ-Rechner)
// Gerundete Standard-Atommassen in g/mol (IUPAC, abgekürzt)
const MASSEN = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06,
  Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.630,
  As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224,
  Nb: 92.906, Mo: 95.95, Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41,
  In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33,
  La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25,
  Tb: 158.93, Dy: 162.50, Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49,
  Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59,
  Tl: 204.38, Pb: 207.2, Bi: 208.98, Th: 232.04, U: 238.03
};

const SUB = "₀₁₂₃₄₅₆₇₈₉";

// Zerlegt eine Formel in { Element: Anzahl }. Wirft einen Fehler mit verständlicher Meldung.
function parse(text) {
  const s = text.replace(/[₀-₉]/g, c => SUB.indexOf(c)).replace(/\s+/g, "");
  let i = 0;

  function zahl() {
    const m = /^\d+/.exec(s.slice(i));
    if (!m) return null;
    i += m[0].length;
    return parseInt(m[0], 10);
  }

  function addiere(ziel, quelle, faktor) {
    for (const [el, n] of Object.entries(quelle)) ziel[el] = (ziel[el] || 0) + n * faktor;
  }

  // Teil bis zu einer schließenden Klammer oder dem Ende
  function gruppe(schluss) {
    const summe = {};
    while (i < s.length) {
      const c = s[i];
      if (c === ")" || c === "]") {
        if (c !== schluss) throw new Error(`Unerwartete Klammer „${c}“ an Stelle ${i + 1}.`);
        return summe;
      }
      if (c === "(" || c === "[") {
        i++;
        const inner = gruppe(c === "(" ? ")" : "]");
        if (i >= s.length) throw new Error("Eine Klammer wurde nicht geschlossen.");
        i++; // schließende Klammer
        addiere(summe, inner, zahl() ?? 1);
      } else if (/[A-Z]/.test(c)) {
        let el = c;
        i++;
        if (i < s.length && /[a-z]/.test(s[i])) el += s[i++];
        if (!(el in MASSEN)) throw new Error(`Unbekanntes Element „${el}“.`);
        summe[el] = (summe[el] || 0) + (zahl() ?? 1);
      } else if (c === "·" || c === "*" || c === "." || c === "•") {
        i++;
        const k = zahl() ?? 1;
        const rest = gruppe(schluss);
        addiere(summe, rest, k);
        return summe;
      } else {
        throw new Error(`Unerwartetes Zeichen „${c}“ an Stelle ${i + 1}.`);
      }
    }
    if (schluss) throw new Error("Eine Klammer wurde nicht geschlossen.");
    return summe;
  }

  const erg = gruppe(null);
  if (Object.keys(erg).length === 0) throw new Error("Keine Formel erkannt.");
  return erg;
}
