const eingabe = document.getElementById("formel");
const fehler = document.getElementById("fehler");
const ergebnis = document.getElementById("ergebnis");
const summeEl = document.getElementById("summe");
const zeilen = document.getElementById("zeilen");

const fmt = (x, d) => x.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

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

  const gesamt = Object.entries(teile).reduce((a, [el, n]) => a + MASSEN[el] * n, 0);
  summeEl.textContent = fmt(gesamt, 3);
  zeilen.innerHTML = "";
  Object.entries(teile).forEach(([el, n]) => {
    const m = MASSEN[el] * n;
    const tr = document.createElement("tr");
    [el, n, fmt(MASSEN[el], 3), fmt(m, 3), fmt((m / gesamt) * 100, 2) + " %"].forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });
    zeilen.appendChild(tr);
  });
  ergebnis.hidden = false;
}

eingabe.addEventListener("input", berechne);
