export const formulas_p1_ch1 = [
  {
    id: "vernier_constant",
    chapterId: "p1_ch1",
    topic: "Measurement Instruments (পরিমাপক যন্ত্র)",
    nameEn: "Vernier Constant (VC)",
    nameBn: "ভার্নিয়ার ধ্রুবক",
    latex: "VC = s - v = \\frac{s}{n}",
    variables: [
      {
        symbol: "s",
        meaning: "Length of 1 smallest main scale division",
        unit: "mm",
      },
      {
        symbol: "v",
        meaning: "Length of 1 vernier scale division",
        unit: "mm",
      },
      {
        symbol: "n",
        meaning: "Total divisions on the vernier scale",
        unit: "N/A",
      },
    ],
    assumptions: "Main scale divisions are uniform.",
    specialCases: [],
    hasVisualization: false,
    mcqShortcuts: [
      "1 mm = 0.1 cm = 10^-3 m",
      "Common VC: 0.1 mm or 0.05 mm or 0.02 mm",
    ],
  },
  {
    id: "slide_calipers_reading",
    chapterId: "p1_ch1",
    topic: "Measurement Instruments (পরিমাপক যন্ত্র)",
    nameEn: "Reading of Slide Calipers",
    nameBn: "স্লাইড ক্যালিপার্সের পাঠ",
    latex: "L = M + (V \\times VC) \\pm e",
    variables: [
      { symbol: "L", meaning: "Total measured length", unit: "mm, cm" },
      { symbol: "M", meaning: "Main scale reading", unit: "mm, cm" },
      {
        symbol: "V",
        meaning: "Vernier coincidence (division number)",
        unit: "N/A",
      },
      {
        symbol: "e",
        meaning: "Instrumental Error (Zero error)",
        unit: "mm, cm",
      },
    ],
    assumptions:
      "Take positive zero error as negative (subtract), and negative zero error as positive (add).",
    specialCases: [],
    hasVisualization: false,
  },
  {
    id: "screw_gauge_lc",
    chapterId: "p1_ch1",
    topic: "Measurement Instruments (পরিমাপক যন্ত্র)",
    nameEn: "Least Count of Screw Gauge",
    nameBn: "স্ক্রুগজের লঘিষ্ঠ গণন",
    latex: "LC = \\frac{p}{n}",
    variables: [
      { symbol: "p", meaning: "Pitch of the screw", unit: "mm" },
      {
        symbol: "n",
        meaning: "Total divisions on circular scale",
        unit: "N/A",
      },
    ],
    assumptions: "",
    specialCases: [],
    hasVisualization: false,
  },
  {
    id: "screw_gauge_reading",
    chapterId: "p1_ch1",
    topic: "Measurement Instruments (পরিমাপক যন্ত্র)",
    nameEn: "Reading of Screw Gauge",
    nameBn: "স্ক্রুগজের পাঠ",
    latex: "L = L_S + (C \\times LC) \\pm e",
    variables: [
      { symbol: "L", meaning: "Total length/diameter", unit: "mm" },
      { symbol: "L_S", meaning: "Linear scale reading", unit: "mm" },
      { symbol: "C", meaning: "Circular scale coincidence", unit: "N/A" },
    ],
    assumptions: "",
    specialCases: [],
    hasVisualization: false,
  },
  {
    id: "spherometer_radius",
    chapterId: "p1_ch1",
    topic: "Measurement Instruments (পরিমাপক যন্ত্র)",
    nameEn: "Radius of Curvature (Spherometer)",
    nameBn: "বক্রতার ব্যাসার্ধ (স্ফেরোমিটার)",
    latex: "R = \\frac{d^2}{6h} + \\frac{h}{2}",
    variables: [
      {
        symbol: "R",
        meaning: "Radius of curvature of the spherical surface",
        unit: "m, cm",
      },
      { symbol: "d", meaning: "Mean distance between the legs", unit: "m, cm" },
      {
        symbol: "h",
        meaning: "Height or depth of the curved surface",
        unit: "m, cm",
      },
    ],
    assumptions: "The legs form an equilateral triangle.",
    specialCases: [],
    hasVisualization: false,
    imageUrl:
      "https://cdn1.byjus.com/wp-content/uploads/2021/05/spherometer-diagram.png",
  },
  {
    id: "percentage_error",
    chapterId: "p1_ch1",
    topic: "Error Analysis (ত্রুটি বিশ্লেষণ)",
    nameEn: "Percentage Error in Derived Quantity",
    nameBn: "লব্ধ রাশিতে শতকরা ত্রুটি",
    latex:
      "\\frac{\\Delta A}{A} \\times 100\\% = m\\left(\\frac{\\Delta x}{x}\\right) \\times 100\\% + n\\left(\\frac{\\Delta y}{y}\\right) \\times 100\\%",
    variables: [
      {
        symbol: "A",
        meaning: "Derived physical quantity where A = \\pi x^m y^n",
        unit: "N/A",
      },
      { symbol: "\\Delta A", meaning: "Absolute error in A", unit: "N/A" },
      {
        symbol: "\\Delta x, \\Delta y",
        meaning: "Absolute errors in measured quantities",
        unit: "N/A",
      },
      {
        symbol: "m, n",
        meaning: "Powers of the measured quantities",
        unit: "N/A",
      },
    ],
    assumptions: "m and n are integers or fractions.",
    specialCases: [],
    hasVisualization: false,
    mcqShortcuts: [
      "For Volume of sphere V = (4/3)πr³, max % error = 3 × (% error in r)",
    ],
  },
];
