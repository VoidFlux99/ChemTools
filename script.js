const liste = document.getElementById("liste");
const leer = document.getElementById("leer");
const suche = document.getElementById("suche");

const BEREICHE = ["Tools", "Datenbanken", "Nützliche Apps"];

function karte(t) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = t.url;
  if (/^https?:/.test(t.url)) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  const h = document.createElement("h3");
  h.textContent = t.name;
  const p = document.createElement("p");
  p.textContent = t.beschreibung;
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = t.kategorie;

  a.append(h, p, tag);
  return a;
}

function zeige() {
  const q = suche.value.trim().toLowerCase();
  const treffer = TOOLS.filter(t =>
    (t.name + " " + t.beschreibung + " " + t.kategorie + " " + t.bereich).toLowerCase().includes(q)
  );

  liste.innerHTML = "";
  BEREICHE.forEach(b => {
    const inBereich = treffer.filter(t => t.bereich === b);
    if (inBereich.length === 0) return;

    const sektion = document.createElement("section");
    const h2 = document.createElement("h2");
    h2.textContent = b;
    const grid = document.createElement("div");
    grid.className = "grid";
    inBereich.forEach(t => grid.appendChild(karte(t)));

    sektion.append(h2, grid);
    liste.appendChild(sektion);
  });
  leer.hidden = treffer.length > 0;
}

suche.addEventListener("input", zeige);
zeige();
