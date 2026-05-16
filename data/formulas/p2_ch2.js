export const formulas_p2_ch2 = [
  {
    id: "coulombs_law",
    chapterId: "p2_ch2",
    topic: "Coulomb's Law (কুলম্বের সূত্র)",
    nameEn: "Coulomb's Law",
    nameBn: "কুলম্বের সূত্র",
    latex: "F = \\frac{1}{4\\pi\\epsilon_0 K} \\frac{q_1 q_2}{r^2}",
    variables: [
      { symbol: "F", meaning: "Electric Force", unit: "N" },
      { symbol: "q_1, q_2", meaning: "Point charges", unit: "C" },
      { symbol: "r", meaning: "Distance between charges", unit: "m" },
      {
        symbol: "\\epsilon_0",
        meaning: "Permittivity of free space",
        unit: "C²/N·m²",
      },
      {
        symbol: "K",
        meaning: "Dielectric Constant (পরাবৈদ্যুতিক ধ্রুবক)",
        unit: "Unitless",
      },
    ],
    assumptions: "Charges are point charges and stationary.",
    specialCases: [
      {
        condition: "\\text{In Vacuum/Air}",
        latex:
          "K = 1 \\Rightarrow F = \\frac{1}{4\\pi\\epsilon_0}\\frac{q_1 q_2}{r^2}",
      },
      {
        condition: "\\text{Value of } \\frac{1}{4\\pi\\epsilon_0}",
        latex: "9 \\times 10^9 \\text{ N·m}^2/\\text{C}^2",
      },
    ],
    hasVisualization: true,
    vizType: "coulombs_law",
    mcqShortcuts: [
      "If a charge is doubled, force becomes 2x.",
      "If distance is halved, force becomes 4x.",
      "Dielectric constant K = ε/ε₀ = F_vacuum / F_medium.",
    ],
  },
  {
    id: "charge_density",
    chapterId: "p2_ch2",
    topic: "Charge Distribution (আধান বন্টন)",
    nameEn: "Surface Charge Density",
    nameBn: "তলের আধান ঘনত্ব",
    latex: "\\sigma = \\frac{q}{A}",
    variables: [
      { symbol: "\\sigma", meaning: "Surface Charge Density", unit: "C/m²" },
      { symbol: "q", meaning: "Total Charge", unit: "C" },
      { symbol: "A", meaning: "Surface Area", unit: "m²" },
    ],
    assumptions: "Charge is uniformly distributed over the surface.",
    specialCases: [
      {
        condition: "\\text{For a Sphere}",
        latex: "\\sigma = \\frac{q}{4\\pi r^2}",
      },
    ],
    mcqShortcuts: [
      "Charge density is inversely proportional to the square of the radius.",
      "At sharp points, radius of curvature is small, so charge density is very high (action of points).",
    ],
  },
  {
    id: "electric_field",
    chapterId: "p2_ch2",
    topic: "Electric Field (তড়িৎ প্রাবল্য)",
    nameEn: "Electric Field Intensity",
    nameBn: "তড়িৎ প্রাবল্য",
    latex: "E = \\frac{F}{q_0} = \\frac{1}{4\\pi\\epsilon_0 K} \\frac{q}{r^2}",
    variables: [
      { symbol: "E", meaning: "Electric Field Intensity", unit: "N/C or V/m" },
      { symbol: "q", meaning: "Source Charge", unit: "C" },
      { symbol: "r", meaning: "Distance from charge", unit: "m" },
    ],
    assumptions: "Test charge q₀ is infinitesimally small.",
    specialCases: [
      {
        condition: "\\text{Relation with Potential}",
        latex: "E = -\\frac{dV}{dr}",
      },
    ],
    hasVisualization: true,
    vizType: "electric_field",
    mcqShortcuts: [
      "Electric field lines start from +ve charge and end at -ve charge.",
      "Inside a hollow conducting sphere, E = 0.",
    ],
  },
  {
    id: "sphere_field_potential",
    chapterId: "p2_ch2",
    topic: "Spherical Conductor (গোলাকার পরিবাহী)",
    nameEn: "Field & Potential of a Charged Sphere",
    nameBn: "গোলকের প্রাবল্য ও বিভব",
    latex:
      "V = \\frac{1}{4\\pi\\epsilon_0} \\frac{q}{r}, \\quad E = \\frac{1}{4\\pi\\epsilon_0} \\frac{q}{r^2}",
    variables: [
      { symbol: "V", meaning: "Electric Potential", unit: "V" },
      { symbol: "E", meaning: "Electric Field", unit: "N/C" },
      { symbol: "R", meaning: "Radius of Sphere", unit: "m" },
      { symbol: "r", meaning: "Distance from center", unit: "m" },
    ],
    assumptions: "Charge resides on the outer surface.",
    specialCases: [
      {
        condition: "\\text{Outside (} r > R \\text{)}",
        latex: "E \\propto \\frac{1}{r^2}, V \\propto \\frac{1}{r}",
      },
      {
        condition: "\\text{On Surface (} r = R \\text{)}",
        latex:
          "E_{max} = \\frac{1}{4\\pi\\epsilon_0} \\frac{q}{R^2}, V_{max} = \\frac{1}{4\\pi\\epsilon_0} \\frac{q}{R}",
      },
      {
        condition: "\\text{Inside (} r < R \\text{)}",
        latex: "E = 0, V = V_{surface} = \\text{Constant}",
      },
    ],
    hasVisualization: true,
    vizType: "sphere_field_graph",
  },
  {
    id: "combining_drops",
    chapterId: "p2_ch2",
    topic: "Combining Drops (ক্ষুদ্র ফোঁটার সমন্বয়)",
    nameEn: "N Small Drops Forming 1 Big Drop",
    nameBn: "N টি ছোট ফোঁটা মিলে বড় ফোঁটা",
    latex: "R = n^{1/3}r",
    variables: [
      { symbol: "N", meaning: "Number of small drops", unit: "Unitless" },
      { symbol: "R", meaning: "Radius of big drop", unit: "m" },
      { symbol: "r", meaning: "Radius of small drop", unit: "m" },
    ],
    assumptions: "Drops are spherical, charge and volume are conserved.",
    specialCases: [
      {
        condition: "\\text{Charge (Q)}",
        latex: "Q_{big} = n \\cdot q_{small}",
      },
      {
        condition: "\\text{Capacitance (C)}",
        latex: "C_{big} = n^{1/3} c_{small}",
      },
      {
        condition: "\\text{Potential (V)}",
        latex: "V_{big} = n^{2/3} v_{small}",
      },
      {
        condition: "\\text{Electric Field (E)}",
        latex: "E_{big} = n^{1/3} e_{small}",
      },
      { condition: "\\text{Energy (U)}", latex: "U_{big} = n^{5/3} u_{small}" },
    ],
    mcqShortcuts: [
      "Always remember the N^(1/3) rule for radius and capacitance.",
      "Potential scales by N^(2/3).",
    ],
  },
  {
    id: "electric_dipole",
    chapterId: "p2_ch2",
    topic: "Electric Dipole (তড়িৎ দ্বিমেরু)",
    nameEn: "Dipole Moment and Torque",
    nameBn: "দ্বিমেরু ভ্রামক ও টর্ক",
    latex: "p = q(2l), \\quad \\tau = pE \\sin\\theta",
    variables: [
      { symbol: "p", meaning: "Dipole Moment", unit: "C·m" },
      { symbol: "2l", meaning: "Distance between charges", unit: "m" },
      { symbol: "\\tau", meaning: "Torque", unit: "N·m" },
      { symbol: "\\theta", meaning: "Angle with Electric Field", unit: "deg" },
    ],
    assumptions: "Dipole in a uniform electric field.",
    specialCases: [
      {
        condition: "\\text{Work done to rotate}",
        latex: "W = pE(\\cos\\theta_1 - \\cos\\theta_2)",
      },
    ],
    hasVisualization: true,
    vizType: "dipole_torque",
  },
  {
    id: "capacitor_parallel",
    chapterId: "p2_ch2",
    topic: "Capacitance (ধারকত্ব)",
    nameEn: "Parallel Plate Capacitor",
    nameBn: "সমান্তরাল পাত ধারক",
    latex: "C = \\frac{\\epsilon_0 K A}{d}",
    variables: [
      { symbol: "C", meaning: "Capacitance", unit: "F (Farad)" },
      { symbol: "A", meaning: "Area of each plate", unit: "m²" },
      { symbol: "d", meaning: "Distance between plates", unit: "m" },
      { symbol: "K", meaning: "Dielectric Constant", unit: "Unitless" },
    ],
    assumptions: "Edge effects are ignored.",
    specialCases: [
      {
        condition: "\\text{Stored Energy (U)}",
        latex: "U = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C} = \\frac{1}{2}QV",
      },
    ],
    hasVisualization: true,
    vizType: "capacitor",
    mcqShortcuts: [
      "If distance is halved, capacitance doubles.",
      "Inserting a dielectric slab of constant K increases capacitance by factor K.",
    ],
  },
  {
    id: "capacitor_combination",
    chapterId: "p2_ch2",
    topic: "Capacitance (ধারকত্ব)",
    nameEn: "Combination of Capacitors",
    nameBn: "ধারকের সমবায়",
    latex:
      "C_p = C_1 + C_2 + \\dots \\newline \\frac{1}{C_s} = \\frac{1}{C_1} + \\frac{1}{C_2} + \\dots",
    variables: [
      {
        symbol: "C_p",
        meaning: "Equivalent Capacitance (Parallel)",
        unit: "F",
      },
      { symbol: "C_s", meaning: "Equivalent Capacitance (Series)", unit: "F" },
    ],
    assumptions: "",
    specialCases: [
      {
        condition: "\\text{In Series}",
        latex: "\\text{Charge (Q) is same for all.}",
      },
      {
        condition: "\\text{In Parallel}",
        latex: "\\text{Potential Difference (V) is same.}",
      },
    ],
  },
  {
    id: "gauss_law",
    chapterId: "p2_ch2",
    topic: "Gauss's Law (গাউসের সূত্র)",
    nameEn: "Gauss's Law",
    nameBn: "গাউসের সূত্র",
    latex:
      "\\phi = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{\\Sigma q}{\\epsilon_0}",
    variables: [
      { symbol: "\\phi", meaning: "Electric Flux", unit: "N·m²/C" },
      { symbol: "\\Sigma q", meaning: "Total enclosed charge", unit: "C" },
    ],
    assumptions: "Surface must be a closed 'Gaussian' surface.",
    specialCases: [
      {
        condition: "\\text{Infinite Charged Sheet}",
        latex: "E = \\frac{\\sigma}{2\\epsilon_0}",
      },
      {
        condition: "\\text{Infinite Charged Wire}",
        latex: "E = \\frac{\\lambda}{2\\pi\\epsilon_0 r}",
      },
    ],
  },
];
