// Wertigkeit je Element für die DBÄ-Formel: DBÄ = 1 + Σ n · (Wertigkeit − 2) / 2
const WERTIGKEIT = {
  C: 4, Si: 4,
  N: 3, P: 3, B: 3,
  O: 2, S: 2,
  H: 1, F: 1, Cl: 1, Br: 1, I: 1
};

const eingabe = document.getElementById("formel");
const fehler = document.getElementById("fehler");
const ergebnis = document.getElementById("ergebnis");
const dbaeEl = document.getElementById("dbae");
const deutung = document.getElementById("deutung");
const rechnung = document.getElementById("rechnung");

function berechne() {
  const text = eingabe.value.trim();
  fehler.hidden = true;
  ergebnis.hidden = true;
  if (!text) return;

  let teile;
  try {
    teile = parse(text);
  } catch (e) {
    fehler.textContent = e.message;
    fehler.hidden = false;
    return;
  }

  const fremd = Object.keys(teile).filter(el => !(el in WERTIGKEIT));
  if (fremd.length) {
    fehler.textContent = `Für ${fremd.join(", ")} gilt die DBÄ-Formel nicht (nur organische Moleküle).`;
    fehler.hidden = false;
    return;
  }

  let dbae = 1;
  for (const [el, n] of Object.entries(teile)) dbae += (n * (WERTIGKEIT[el] - 2)) / 2;

  dbaeEl.textContent = dbae.toLocaleString("de-DE");
  rechnung.textContent = "Rechnung: 1 + " +
    Object.entries(teile).filter(([el]) => WERTIGKEIT[el] !== 2)
      .map(([el, n]) => `${n}·(${WERTIGKEIT[el]}−2)/2 [${el}]`).join(" + ");

  if (!Number.isInteger(dbae)) {
    deutung.textContent = "Kein ganzzahliger Wert. Die Formel passt nicht zu einem neutralen Molekül mit geschlossener Schale (Radikal, Ion oder Tippfehler?).";
  } else if (dbae < 0) {
    deutung.textContent = "Negativer Wert. Die Summenformel ist nicht möglich, bitte prüfen.";
  } else if (dbae === 0) {
    deutung.textContent = "Gesättigt: keine Ringe und keine Mehrfachbindungen.";
  } else {
    deutung.textContent = `Insgesamt ${dbae} Ringe bzw. π-Bindungen (eine Doppelbindung zählt 1, eine Dreifachbindung 2, ein Ring 1).`;
  }
  ergebnis.hidden = false;
}

eingabe.addEventListener("input", berechne);
