// Daten: pro Zeile ein Array. Neue Zeilen einfach ergänzen.

// [Wellenzahl, Gruppe, IR, Raman]
const IR_RAMAN = [
  ["3600–3650", "O–H frei (Alkohol, Phenol), scharf", "mittel", "schwach"],
  ["3200–3550", "O–H mit H-Brücken (Alkohol), breit", "stark", "schwach"],
  ["2500–3300", "O–H Carbonsäure (Dimer), sehr breit", "stark", "schwach"],
  ["3300–3500", "N–H (prim. Amin: 2 Banden, sek.: 1 Bande)", "mittel", "schwach–mittel"],
  ["≈ 3300", "≡C–H (terminales Alkin), scharf", "stark", "mittel"],
  ["3000–3100", "=C–H (Alken, Aromat)", "mittel", "stark"],
  ["2850–2960", "C–H (Alkan: CH₃, CH₂)", "stark", "stark"],
  ["2700–2850", "C–H Aldehyd (2 Banden, ≈ 2720 und 2820)", "mittel", "mittel"],
  ["2550–2600", "S–H (Thiol)", "schwach", "stark"],
  ["2210–2260", "C≡N (Nitril)", "mittel", "stark"],
  ["2100–2260", "C≡C (terminal ≈ 2100–2140, intern ≈ 2190–2260)", "schwach bis fehlend", "stark"],
  ["1790–1815", "C=O Säurechlorid", "sehr stark", "schwach–mittel"],
  ["1760 und 1820", "C=O Anhydrid (2 Banden)", "sehr stark", "schwach–mittel"],
  ["1735–1750", "C=O Ester", "sehr stark", "schwach–mittel"],
  ["1720–1740", "C=O Aldehyd", "sehr stark", "schwach–mittel"],
  ["1705–1725", "C=O Keton", "sehr stark", "schwach–mittel"],
  ["1700–1725", "C=O Carbonsäure (Dimer)", "sehr stark", "schwach–mittel"],
  ["1630–1690", "C=O Amid (Amid-I-Bande)", "stark", "schwach–mittel"],
  ["1620–1680", "C=C Alken", "schwach–mittel", "stark"],
  ["1640–1690", "C=N Imin", "mittel", "stark"],
  ["1550–1640", "N–H Deformation (Amin, Amid II)", "mittel", "schwach"],
  ["1450–1600", "C=C Aromat (Ringschwingungen)", "mittel", "stark"],
  ["1500–1570 und 1300–1370", "NO₂ Nitro (asym. und sym.)", "stark", "mittel (sym. stark)"],
  ["1400–1450", "N=N Azo", "schwach bis fehlend", "stark"],
  ["≈ 1465 und ≈ 1375", "C–H Deformation (CH₂/CH₃, CH₃ symmetrisch)", "mittel", "mittel"],
  ["1300–1350 und 1120–1160", "S=O Sulfon (asym. und sym.)", "stark", "mittel"],
  ["1030–1060", "S=O Sulfoxid", "stark", "mittel"],
  ["1000–1300", "C–O (Alkohol, Ether, Ester)", "stark", "schwach"],
  ["1000–1400", "C–F", "stark", "schwach"],
  ["≈ 1000", "Ringatmung Benzol (monosubstituiert)", "schwach", "stark"],
  ["690–900", "C–H out-of-plane Aromat (Substitutionsmuster)", "stark", "schwach"],
  ["600–800", "C–Cl", "stark", "stark"],
  ["500–600", "C–Br", "stark", "stark"],
  ["≈ 500", "C–I", "stark", "stark"],
  ["600–700", "C–S", "schwach", "stark"],
  ["500–540", "S–S", "schwach", "stark"],
  ["≈ 980", "SO₄²⁻ (ν₁, symmetrische Streckschwingung)", "schwach", "sehr stark"],
  ["≈ 1050", "NO₃⁻ (ν₁)", "schwach", "sehr stark"],
  ["≈ 1085", "CO₃²⁻ (ν₁, z. B. Calcit)", "schwach", "sehr stark"]
];

// [m/z, Ion, Hinweis]
const MS_IONEN = [
  ["15", "CH₃⁺", "Methylgruppe"],
  ["29", "C₂H₅⁺ oder CHO⁺", "Ethyl; Aldehyd"],
  ["30", "CH₂=NH₂⁺", "primäres Amin (α-Spaltung)"],
  ["31", "CH₂=OH⁺", "primärer Alkohol (α-Spaltung)"],
  ["39", "C₃H₃⁺", "Aromaten, Alkene"],
  ["41", "C₃H₅⁺ (Allyl)", "Alkene, Alkylketten"],
  ["43", "C₃H₇⁺ oder CH₃CO⁺", "Propyl; Acetylgruppe (Methylketon)"],
  ["44", "CH₂=CH–OH⁺• oder CO₂⁺•", "McLafferty bei Aldehyden; Carboxyl"],
  ["45", "CH₃CH=OH⁺ oder COOH⁺", "sekundärer Alkohol, Ether; Carbonsäure"],
  ["51", "C₄H₃⁺", "Aromaten"],
  ["57", "C₄H₉⁺ oder C₂H₅CO⁺", "tert-Butyl; Ethylketon"],
  ["58", "CH₂=C(OH)CH₃⁺•", "McLafferty-Umlagerung, Methylketon"],
  ["60", "CH₂=C(OH)₂⁺•", "McLafferty-Umlagerung, Carbonsäure"],
  ["65", "C₅H₅⁺", "Aromaten (Verlust von C₂H₂ aus m/z 91)"],
  ["69", "CF₃⁺", "Trifluormethylgruppe"],
  ["73", "(CH₃)₃Si⁺", "Trimethylsilyl (TMS-Derivate)"],
  ["74", "CH₂=C(OH)OCH₃⁺•", "McLafferty-Umlagerung, Methylester"],
  ["77", "C₆H₅⁺", "Phenylgruppe"],
  ["91", "C₇H₇⁺ (Benzyl/Tropylium)", "Alkylbenzole, Benzylgruppe"],
  ["105", "C₆H₅CO⁺", "Benzoylgruppe"],
  ["127", "I⁺", "Iod"],
  ["149", "Phthalsäure-Derivat", "Weichmacher (Phthalate), häufige Verunreinigung"]
];

// [Verlust, Teilchen, Hinweis]
const MS_VERLUSTE = [
  ["M − 1", "H•", "Aldehyde, Alkohole, Amine"],
  ["M − 15", "CH₃•", "Methylgruppe, Methylketone"],
  ["M − 17", "•OH oder NH₃", "Alkohole, Carbonsäuren; Amine"],
  ["M − 18", "H₂O", "Alkohole (Dehydratisierung)"],
  ["M − 19", "F•", "Fluorverbindungen"],
  ["M − 20", "HF", "Fluorverbindungen"],
  ["M − 28", "CO oder C₂H₄", "Carbonyle, Phenole; McLafferty"],
  ["M − 29", "C₂H₅• oder CHO•", "Ethylgruppe; Aldehyd"],
  ["M − 31", "•OCH₃", "Methylester, Methylether"],
  ["M − 35 / 37", "Cl•", "Chlorverbindungen"],
  ["M − 36", "HCl", "Chlorverbindungen"],
  ["M − 43", "C₃H₇• oder CH₃CO•", "Propylgruppe; Acetylgruppe"],
  ["M − 44", "CO₂", "Carbonsäuren, Anhydride"],
  ["M − 45", "•OC₂H₅ oder •COOH", "Ethylester; Carbonsäure"],
  ["M − 46", "NO₂•", "Nitroverbindungen"],
  ["M − 79 / 81", "Br•", "Bromverbindungen"],
  ["M − 127", "I•", "Iodverbindungen"]
];

// [Thema, Inhalt]
const REGELN = [
  ["Stickstoffregel", "Ungerade Molmasse des M⁺• bedeutet eine ungerade Zahl an N-Atomen. Gerade Molmasse bedeutet keinen oder eine gerade Zahl N."],
  ["Chlor-Muster", "³⁵Cl : ³⁷Cl ≈ 3 : 1. Ein Cl gibt M : M+2 ≈ 3 : 1, zwei Cl geben M : M+2 : M+4 ≈ 9 : 6 : 1."],
  ["Brom-Muster", "⁷⁹Br : ⁸¹Br ≈ 1 : 1. Ein Br gibt M : M+2 ≈ 1 : 1, zwei Br geben M : M+2 : M+4 ≈ 1 : 2 : 1."],
  ["Schwefel", "³⁴S gibt M+2 mit ca. 4,4 % von M."],
  ["Kohlenstoff", "¹³C gibt M+1 mit ca. 1,1 % pro C-Atom. Schätzung der C-Zahl: (M+1)/M ÷ 1,1 %."],
  ["α-Spaltung", "Bindung neben einem Heteroatom oder einer C=O-Gruppe bricht. Das Ion mit der Ladung am Heteroatom ist stabilisiert (z. B. m/z 31, 30, 43)."],
  ["McLafferty-Umlagerung", "Carbonylverbindung mit γ-H: H-Übertragung über einen 6-Ring, dann Spaltung der β-Bindung. Typische Ionen: m/z 44 (Aldehyd), 58 (Methylketon), 60 (Säure), 74 (Methylester)."],
  ["Benzylspaltung", "Alkylbenzole spalten zum Benzyl-/Tropylium-Ion m/z 91, weiter zu m/z 65."],
  ["Gerade/ungerade Ionen", "Ionen mit gerader Massenzahl (ohne N) entstehen meist durch Umlagerung, ungerade durch einfache Spaltung."]
];

const suche = document.getElementById("suche");
const leer = document.getElementById("leer");

const TABELLEN = [
  { id: "ir", body: "ir-zeilen", daten: IR_RAMAN },
  { id: "ms", body: "ms-zeilen", daten: MS_IONEN },
  { id: "verluste", body: "verlust-zeilen", daten: MS_VERLUSTE },
  { id: "regeln", body: "regel-zeilen", daten: REGELN }
];

function zeige() {
  const q = suche.value.trim().toLowerCase();
  let gesamt = 0;
  TABELLEN.forEach(t => {
    const body = document.getElementById(t.body);
    body.innerHTML = "";
    const treffer = t.daten.filter(z => z.join(" ").toLowerCase().includes(q));
    treffer.forEach(z => {
      const tr = document.createElement("tr");
      z.forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    document.getElementById(t.id).hidden = treffer.length === 0;
    gesamt += treffer.length;
  });
  leer.hidden = gesamt > 0;
}

suche.addEventListener("input", zeige);
zeige();
