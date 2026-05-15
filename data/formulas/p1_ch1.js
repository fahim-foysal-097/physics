export const formulas_p1_ch1 = [
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
      {
        symbol: "d",
        meaning: "Mean distance between the legs of the spherometer",
        unit: "m, cm",
      },
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
        meaning: "Absolute errors in measured quantities x and y",
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
  },
];
