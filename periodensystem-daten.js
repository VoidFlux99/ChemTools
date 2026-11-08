// Daten: [Ordnungszahl, Symbol, Name, Atommasse, Elektronegativität (Pauling)]
// Atommasse in eckigen Klammern: Massenzahl des langlebigsten Isotops (kein stabiles Element).
// Elektronegativität: null = nicht üblich angegeben.
const ELEMENTE = [
  [1, "H", "Wasserstoff", "1.008", 2.20],
  [2, "He", "Helium", "4.0026", null],
  [3, "Li", "Lithium", "6.94", 0.98],
  [4, "Be", "Beryllium", "9.0122", 1.57],
  [5, "B", "Bor", "10.81", 2.04],
  [6, "C", "Kohlenstoff", "12.011", 2.55],
  [7, "N", "Stickstoff", "14.007", 3.04],
  [8, "O", "Sauerstoff", "15.999", 3.44],
  [9, "F", "Fluor", "18.998", 3.98],
  [10, "Ne", "Neon", "20.180", null],
  [11, "Na", "Natrium", "22.990", 0.93],
  [12, "Mg", "Magnesium", "24.305", 1.31],
  [13, "Al", "Aluminium", "26.982", 1.61],
  [14, "Si", "Silicium", "28.085", 1.90],
  [15, "P", "Phosphor", "30.974", 2.19],
  [16, "S", "Schwefel", "32.06", 2.58],
  [17, "Cl", "Chlor", "35.45", 3.16],
  [18, "Ar", "Argon", "39.948", null],
  [19, "K", "Kalium", "39.098", 0.82],
  [20, "Ca", "Calcium", "40.078", 1.00],
  [21, "Sc", "Scandium", "44.956", 1.36],
  [22, "Ti", "Titan", "47.867", 1.54],
  [23, "V", "Vanadium", "50.942", 1.63],
  [24, "Cr", "Chrom", "51.996", 1.66],
  [25, "Mn", "Mangan", "54.938", 1.55],
  [26, "Fe", "Eisen", "55.845", 1.83],
  [27, "Co", "Cobalt", "58.933", 1.88],
  [28, "Ni", "Nickel", "58.693", 1.91],
  [29, "Cu", "Kupfer", "63.546", 1.90],
  [30, "Zn", "Zink", "65.38", 1.65],
  [31, "Ga", "Gallium", "69.723", 1.81],
  [32, "Ge", "Germanium", "72.630", 2.01],
  [33, "As", "Arsen", "74.922", 2.18],
  [34, "Se", "Selen", "78.971", 2.55],
  [35, "Br", "Brom", "79.904", 2.96],
  [36, "Kr", "Krypton", "83.798", 3.00],
  [37, "Rb", "Rubidium", "85.468", 0.82],
  [38, "Sr", "Strontium", "87.62", 0.95],
  [39, "Y", "Yttrium", "88.906", 1.22],
  [40, "Zr", "Zirconium", "91.224", 1.33],
  [41, "Nb", "Niob", "92.906", 1.6],
  [42, "Mo", "Molybdän", "95.95", 2.16],
  [43, "Tc", "Technetium", "[98]", 1.9],
  [44, "Ru", "Ruthenium", "101.07", 2.2],
  [45, "Rh", "Rhodium", "102.91", 2.28],
  [46, "Pd", "Palladium", "106.42", 2.20],
  [47, "Ag", "Silber", "107.87", 1.93],
  [48, "Cd", "Cadmium", "112.41", 1.69],
  [49, "In", "Indium", "114.82", 1.78],
  [50, "Sn", "Zinn", "118.71", 1.96],
  [51, "Sb", "Antimon", "121.76", 2.05],
  [52, "Te", "Tellur", "127.60", 2.1],
  [53, "I", "Iod", "126.90", 2.66],
  [54, "Xe", "Xenon", "131.29", 2.6],
  [55, "Cs", "Caesium", "132.91", 0.79],
  [56, "Ba", "Barium", "137.33", 0.89],
  [57, "La", "Lanthan", "138.91", 1.10],
  [58, "Ce", "Cer", "140.12", 1.12],
  [59, "Pr", "Praseodym", "140.91", 1.13],
  [60, "Nd", "Neodym", "144.24", 1.14],
  [61, "Pm", "Promethium", "[145]", 1.13],
  [62, "Sm", "Samarium", "150.36", 1.17],
  [63, "Eu", "Europium", "151.96", 1.2],
  [64, "Gd", "Gadolinium", "157.25", 1.2],
  [65, "Tb", "Terbium", "158.93", 1.1],
  [66, "Dy", "Dysprosium", "162.50", 1.22],
  [67, "Ho", "Holmium", "164.93", 1.23],
  [68, "Er", "Erbium", "167.26", 1.24],
  [69, "Tm", "Thulium", "168.93", 1.25],
  [70, "Yb", "Ytterbium", "173.05", 1.1],
  [71, "Lu", "Lutetium", "174.97", 1.27],
  [72, "Hf", "Hafnium", "178.49", 1.3],
  [73, "Ta", "Tantal", "180.95", 1.5],
  [74, "W", "Wolfram", "183.84", 2.36],
  [75, "Re", "Rhenium", "186.21", 1.9],
  [76, "Os", "Osmium", "190.23", 2.2],
  [77, "Ir", "Iridium", "192.22", 2.20],
  [78, "Pt", "Platin", "195.08", 2.28],
  [79, "Au", "Gold", "196.97", 2.54],
  [80, "Hg", "Quecksilber", "200.59", 2.00],
  [81, "Tl", "Thallium", "204.38", 1.62],
  [82, "Pb", "Blei", "207.2", 1.87],
  [83, "Bi", "Bismut", "208.98", 2.02],
  [84, "Po", "Polonium", "[209]", 2.0],
  [85, "At", "Astat", "[210]", 2.2],
  [86, "Rn", "Radon", "[222]", null],
  [87, "Fr", "Francium", "[223]", 0.7],
  [88, "Ra", "Radium", "[226]", 0.9],
  [89, "Ac", "Actinium", "[227]", 1.1],
  [90, "Th", "Thorium", "232.04", 1.3],
  [91, "Pa", "Protactinium", "231.04", 1.5],
  [92, "U", "Uran", "238.03", 1.38],
  [93, "Np", "Neptunium", "[237]", null],
  [94, "Pu", "Plutonium", "[244]", null],
  [95, "Am", "Americium", "[243]", null],
  [96, "Cm", "Curium", "[247]", null],
  [97, "Bk", "Berkelium", "[247]", null],
  [98, "Cf", "Californium", "[251]", null],
  [99, "Es", "Einsteinium", "[252]", null],
  [100, "Fm", "Fermium", "[257]", null],
  [101, "Md", "Mendelevium", "[258]", null],
  [102, "No", "Nobelium", "[259]", null],
  [103, "Lr", "Lawrencium", "[266]", null],
  [104, "Rf", "Rutherfordium", "[267]", null],
  [105, "Db", "Dubnium", "[268]", null],
  [106, "Sg", "Seaborgium", "[269]", null],
  [107, "Bh", "Bohrium", "[270]", null],
  [108, "Hs", "Hassium", "[269]", null],
  [109, "Mt", "Meitnerium", "[278]", null],
  [110, "Ds", "Darmstadtium", "[281]", null],
  [111, "Rg", "Roentgenium", "[282]", null],
  [112, "Cn", "Copernicium", "[285]", null],
  [113, "Nh", "Nihonium", "[286]", null],
  [114, "Fl", "Flerovium", "[289]", null],
  [115, "Mc", "Moscovium", "[290]", null],
  [116, "Lv", "Livermorium", "[293]", null],
  [117, "Ts", "Tenness", "[294]", null],
  [118, "Og", "Oganesson", "[294]", null]
];

const KATEGORIEN = {
  alkali: "Alkalimetalle",
  erdalkali: "Erdalkalimetalle",
  uebergang: "Übergangsmetalle",
  lanthanoid: "Lanthanoide",
  actinoid: "Actinoide",
  metall: "Metalle (Hauptgruppen)",
  halbmetall: "Halbmetalle",
  nichtmetall: "Nichtmetalle",
  halogen: "Halogene",
  edelgas: "Edelgase"
};

function kategorie(z) {
  if ([3, 11, 19, 37, 55, 87].includes(z)) return "alkali";
  if ([4, 12, 20, 38, 56, 88].includes(z)) return "erdalkali";
  if (z >= 57 && z <= 71) return "lanthanoid";
  if (z >= 89 && z <= 103) return "actinoid";
  if ([2, 10, 18, 36, 54, 86, 118].includes(z)) return "edelgas";
  if ([9, 17, 35, 53, 85, 117].includes(z)) return "halogen";
  if ([5, 14, 32, 33, 51, 52].includes(z)) return "halbmetall";
  if ([1, 6, 7, 8, 15, 16, 34].includes(z)) return "nichtmetall";
  if ((z >= 21 && z <= 30) || (z >= 39 && z <= 48) || (z >= 72 && z <= 80) || (z >= 104 && z <= 112)) return "uebergang";
  return "metall"; // 13, 31, 49, 50, 81–84, 113–116
}

// Position im Raster: Periode (Zeile) und Gruppe (Spalte). f-Block in Zeile 9 und 10.
function position(z) {
  if (z === 1) return { zeile: 1, spalte: 1 };
  if (z === 2) return { zeile: 1, spalte: 18 };
  if (z <= 4) return { zeile: 2, spalte: z - 2 };
  if (z <= 10) return { zeile: 2, spalte: z + 8 };
  if (z <= 12) return { zeile: 3, spalte: z - 10 };
  if (z <= 18) return { zeile: 3, spalte: z };
  if (z <= 36) return { zeile: 4, spalte: z - 18 };
  if (z <= 54) return { zeile: 5, spalte: z - 36 };
  if (z <= 56) return { zeile: 6, spalte: z - 54 };
  if (z <= 70) return { zeile: 9, spalte: z - 54 };      // Lanthanoide La–Yb
  if (z <= 86) return { zeile: 6, spalte: z - 68 };      // Lu … Rn
  if (z <= 88) return { zeile: 7, spalte: z - 86 };
  if (z <= 102) return { zeile: 10, spalte: z - 86 };    // Actinoide Ac–No
  return { zeile: 7, spalte: z - 100 };                  // Lr … Og
}

// Elektronenkonfiguration nach Madelung, mit den bekannten Ausnahmen.
const ORBITALE = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10], ["4p", 6],
  ["5s", 2], ["4d", 10], ["5p", 6], ["6s", 2], ["4f", 14], ["5d", 10], ["6p", 6], ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6]];
const EDELGASE = [[86, "Rn"], [54, "Xe"], [36, "Kr"], [18, "Ar"], [10, "Ne"], [2, "He"]];
const AUSNAHMEN = {
  24: "3d5 4s1", 29: "3d10 4s1", 41: "4d4 5s1", 42: "4d5 5s1", 44: "4d7 5s1", 45: "4d8 5s1",
  46: "4d10", 47: "4d10 5s1", 57: "5d1 6s2", 58: "4f1 5d1 6s2", 64: "4f7 5d1 6s2", 78: "5d9 6s1",
  79: "5d10 6s1", 89: "6d1 7s2", 90: "6d2 7s2", 91: "5f2 6d1 7s2", 92: "5f3 6d1 7s2",
  93: "5f4 6d1 7s2", 96: "5f7 6d1 7s2", 103: "5f14 7s2 7p1"
};
const HOCH = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const hoch = n => String(n).replace(/\d/g, d => HOCH[d]);

function konfiguration(z) {
  const kern = EDELGASE.find(([n]) => n < z);
  const praefix = kern ? `[${kern[1]}] ` : "";
  let teile;
  if (AUSNAHMEN[z]) {
    teile = AUSNAHMEN[z].split(" ");
  } else {
    let rest = z;
    const gefuellt = [];
    for (const [o, max] of ORBITALE) {
      if (rest <= 0) break;
      const n = Math.min(max, rest);
      gefuellt.push([o, n]);
      rest -= n;
    }
    // Rumpf (Edelgas) abziehen: Elektronen des Edelgases zuerst entfernen
    let abziehen = kern ? kern[0] : 0;
    const uebrig = [];
    for (const [o, n] of gefuellt) {
      if (abziehen >= n) { abziehen -= n; continue; }
      uebrig.push([o, n - abziehen]);
      abziehen = 0;
    }
    // Schreibweise nach Hauptquantenzahl, dann Nebenquantenzahl (3d vor 4s)
    const l = "spdf";
    uebrig.sort((a, b) => (+a[0][0] - +b[0][0]) || (l.indexOf(a[0][1]) - l.indexOf(b[0][1])));
    teile = uebrig.map(([o, n]) => o + n);
  }
  return praefix + teile.map(t => t.replace(/^(\d[spdf])(\d+)$/, (_, o, n) => o + hoch(n))).join(" ");
}
