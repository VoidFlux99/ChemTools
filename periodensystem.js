const pt = document.getElementById("pt");
const detail = document.getElementById("detail");
const suche = document.getElementById("suche");
const legende = document.getElementById("legende");

let gewaehlt = 26; // Eisen als Startwert
let aktiveKat = null;

const zellen = {};

function bauePT() {
  ELEMENTE.forEach(([z, sym, name]) => {
    const p = position(z);
    const b = document.createElement("button");
    b.className = "el k-" + kategorie(z);
    b.style.gridRow = p.zeile;
    b.style.gridColumn = p.spalte;
    b.title = name;
    b.innerHTML = `<small>${z}</small><strong>${sym}</strong>`;
    b.addEventListener("click", () => waehle(z));
    pt.appendChild(b);
    zellen[z] = b;
  });
}

function baueLegende() {
  legende.innerHTML = "";
  Object.entries(KATEGORIEN).forEach(([k, text]) => {
    const b = document.createElement("button");
    b.className = "k-" + k + (aktiveKat === k ? " aktiv" : "");
    b.textContent = text;
    b.addEventListener("click", () => {
      aktiveKat = aktiveKat === k ? null : k;
      baueLegende();
      filtere();
    });
    legende.appendChild(b);
  });
}

function waehle(z) {
  gewaehlt = z;
  const [, sym, name, masse, en] = ELEMENTE[z - 1];
  const p = position(z);
  const gruppe = (z >= 57 && z <= 70) || (z >= 89 && z <= 102) ? "f-Block" : "Gruppe " + p.spalte;
  const periode = z >= 57 && z <= 70 ? 6 : z >= 89 && z <= 102 ? 7 : p.zeile;
  const zeilen = [
    ["Ordnungszahl", z],
    ["Atommasse", masse.replace(".", ",") + (masse.startsWith("[") ? "" : " g/mol")],
    ["Elektronegativität", en === null ? "–" : String(en).replace(".", ",")],
    ["Konfiguration", konfiguration(z)],
    ["Periode / Gruppe", `${periode} / ${gruppe}`],
    ["Kategorie", KATEGORIEN[kategorie(z)]]
  ];
  detail.className = "detail k-" + kategorie(z);
  detail.innerHTML = `<div class="gross-sym">${sym}</div><div><h2>${name}</h2><dl></dl></div>`;
  const dl = detail.querySelector("dl");
  zeilen.forEach(([k, v]) => {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = v;
    dl.append(dt, dd);
  });
  Object.values(zellen).forEach(c => c.classList.remove("gewaehlt"));
  zellen[z].classList.add("gewaehlt");
}

function filtere() {
  const q = suche.value.trim().toLowerCase();
  ELEMENTE.forEach(([z, sym, name]) => {
    const passtSuche = !q || sym.toLowerCase() === q || name.toLowerCase().includes(q) || String(z) === q;
    const passtKat = !aktiveKat || kategorie(z) === aktiveKat;
    zellen[z].classList.toggle("gedimmt", !(passtSuche && passtKat));
  });
  // Erster Treffer bei Suche automatisch anzeigen
  if (q) {
    const t = ELEMENTE.find(([z, sym, name]) => sym.toLowerCase() === q || name.toLowerCase().startsWith(q) || String(z) === q);
    if (t) waehle(t[0]);
  }
}

suche.addEventListener("input", filtere);
bauePT();
baueLegende();
waehle(gewaehlt);
