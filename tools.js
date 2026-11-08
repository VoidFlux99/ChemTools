// Hier trägst du neue Tools ein. Pro Tool ein Block { ... },
// Komma am Ende nicht vergessen.
// bereich: "Tools", "Datenbanken" oder "Nützliche Apps".
const TOOLS = [
  {
    name: "Titrationsrechner",
    bereich: "Tools",
    beschreibung: "Gehalt, Titer und Titrationskurve (pH) berechnen.",
    kategorie: "Auswertung",
    url: "titration.html"
  },
  {
    name: "Fehlerrechnung",
    bereich: "Tools",
    beschreibung: "Mittelwert, Vertrauensbereich und Fehlerfortpflanzung mit richtiger Rundung.",
    kategorie: "Auswertung",
    url: "fehler.html"
  },
  {
    name: "Einwaage und Verdünnung",
    bereich: "Tools",
    beschreibung: "Einwaage, c₁V₁ = c₂V₂ und Verdünnungsreihen.",
    kategorie: "Chemie",
    url: "einwaage.html"
  },
  {
    name: "Periodensystem",
    bereich: "Tools",
    beschreibung: "Klickbar, mit Molmasse, Elektronegativität und Elektronenkonfiguration.",
    kategorie: "Chemie",
    url: "periodensystem.html"
  },
  {
    name: "Spektren-Übersicht",
    bereich: "Tools",
    beschreibung: "Wichtige MS-Fragmente sowie IR- und Raman-Wellenzahlen zum Nachschlagen.",
    kategorie: "Auswertung",
    url: "spektren.html"
  },
  {
    name: "DBÄ-Rechner",
    bereich: "Tools",
    beschreibung: "Doppelbindungsäquivalente (Ringe + Mehrfachbindungen) aus der Summenformel.",
    kategorie: "Chemie",
    url: "dbae.html"
  },
  {
    name: "Molmassen-Rechner",
    bereich: "Tools",
    beschreibung: "Molmasse aus der Summenformel berechnen, mit Anteilen je Element.",
    kategorie: "Chemie",
    url: "molmasse.html"
  },
  {
    name: "MolView",
    bereich: "Tools",
    beschreibung: "Moleküle zeichnen und in 3D ansehen, direkt im Browser.",
    kategorie: "Chemie",
    url: "https://molview.org"
  },
  {
    name: "GESTIS-Stoffdatenbank",
    bereich: "Datenbanken",
    beschreibung: "Gefahrstoff-Infos, H-/P-Sätze und Grenzwerte.",
    kategorie: "Chemie",
    url: "https://gestis.dguv.de"
  },
  {
    name: "PubChem",
    bereich: "Datenbanken",
    beschreibung: "Strukturen, Eigenschaften und Daten zu Millionen Verbindungen.",
    kategorie: "Chemie",
    url: "https://pubchem.ncbi.nlm.nih.gov"
  },
  {
    name: "Zotero",
    bereich: "Nützliche Apps",
    beschreibung: "Literatur sammeln und Quellenangaben automatisch erstellen.",
    kategorie: "Lernen",
    url: "https://www.zotero.org"
  },
  {
    name: "Obsidian",
    bereich: "Nützliche Apps",
    beschreibung: "Notizen als verknüpfte Textdateien.",
    kategorie: "Lernen",
    url: "https://obsidian.md"
  },
  {
    name: "Google Colab",
    bereich: "Nützliche Apps",
    beschreibung: "Python im Browser ausführen, ohne Installation.",
    kategorie: "Auswertung",
    url: "https://colab.research.google.com"
  }
];
