export const formulas_p1_ch2 = [
  {
    id: "vec_addition",
    chapterId: "p1_ch2",
    topic: "Vector Addition (ভেক্টরের যোগ)",
    nameEn: "Resultant of Two Vectors",
    nameBn: "দুটি ভেক্টরের লব্ধি",
    latex: "R = \\sqrt{P^2 + Q^2 + 2PQ\\cos\\alpha}",
    variables: [
      { symbol: "R", meaning: "Magnitude of Resultant Vector", unit: "N/A" },
      {
        symbol: "P, Q",
        meaning: "Magnitudes of the two given vectors",
        unit: "N/A",
      },
      {
        symbol: "\\alpha",
        meaning: "Angle between vector P and Q",
        unit: "Degree/Radian",
      },
    ],
    assumptions: "Vectors must be of the same physical quantity.",
    specialCases: [
      { condition: "\\alpha = 0^\\circ", latex: "R_{max} = P + Q" },
      { condition: "\\alpha = 180^\\circ", latex: "R_{min} = |P - Q|" },
      { condition: "\\alpha = 90^\\circ", latex: "R = \\sqrt{P^2 + Q^2}" },
    ],
    hasVisualization: true,
    vizType: "vector_addition",
  },
  {
    id: "vec_direction",
    chapterId: "p1_ch2",
    topic: "Vector Addition (ভেক্টরের যোগ)",
    nameEn: "Direction of Resultant",
    nameBn: "লব্ধির দিক",
    latex: "\\tan\\theta = \\frac{Q\\sin\\alpha}{P + Q\\cos\\alpha}",
    variables: [
      {
        symbol: "\\theta",
        meaning: "Angle of resultant with vector P",
        unit: "Degree",
      },
      { symbol: "P", meaning: "Vector with which angle is made", unit: "N/A" },
      { symbol: "Q", meaning: "The other vector", unit: "N/A" },
      {
        symbol: "\\alpha",
        meaning: "Angle between vector P and Q",
        unit: "Degree",
      },
    ],
    assumptions: "P is the base vector.",
    specialCases: [
      { condition: "P = Q", latex: "\\theta = \\frac{\\alpha}{2}" },
    ],
    hasVisualization: true,
    vizType: "vector_addition",
  },
  {
    id: "unit_vector",
    chapterId: "p1_ch2",
    topic: "Vector Components (ভেক্টরের উপাংশ)",
    nameEn: "Unit Vector",
    nameBn: "একক ভেক্টর",
    latex: "\\hat{r} = \\frac{\\vec{R}}{|\\vec{R}|}",
    variables: [
      { symbol: "\\vec{R}", meaning: "A non-zero vector", unit: "N/A" },
      { symbol: "|\\vec{R}|", meaning: "Magnitude of the vector", unit: "N/A" },
    ],
    assumptions: "Vector must not be a null vector.",
    specialCases: [],
  },
  {
    id: "unit_vector_perp",
    chapterId: "p1_ch2",
    topic: "Vector Multiplication (ভেক্টর গুণন)",
    nameEn: "Perpendicular Unit Vector",
    nameBn: "লম্বদিকে একক ভেক্টর",
    latex:
      "\\hat{\\eta} = \\pm \\frac{\\vec{A} \\times \\vec{B}}{|\\vec{A} \\times \\vec{B}|}",
    variables: [
      {
        symbol: "\\vec{A}, \\vec{B}",
        meaning: "Two non-parallel vectors",
        unit: "N/A",
      },
    ],
    assumptions:
      "Generates a unit vector orthogonal to the plane containing A and B.",
    specialCases: [],
  },
  {
    id: "vec_dot_product",
    chapterId: "p1_ch2",
    topic: "Vector Multiplication (ভেক্টর গুণন)",
    nameEn: "Dot Product (Scalar Product)",
    nameBn: "ডট গুণন",
    latex:
      "\\vec{A} \\cdot \\vec{B} = AB\\cos\\theta = A_xB_x + A_yB_y + A_zB_z",
    variables: [
      { symbol: "\\vec{A}, \\vec{B}", meaning: "Two vectors", unit: "N/A" },
      { symbol: "A, B", meaning: "Magnitudes of A and B", unit: "N/A" },
      { symbol: "\\theta", meaning: "Angle between A and B", unit: "Degree" },
    ],
    assumptions: "Useful for finding work done and checking perpendicularity.",
    specialCases: [
      {
        condition: "\\theta = 90^\\circ",
        latex: "\\vec{A} \\cdot \\vec{B} = 0 \\text{ (Perpendicular)}",
      },
    ],
    hasVisualization: false,
  },
  {
    id: "vec_cross_product",
    chapterId: "p1_ch2",
    topic: "Vector Multiplication (ভেক্টর গুণন)",
    nameEn: "Cross Product (Vector Product)",
    nameBn: "ক্রস গুণন",
    latex: "\\vec{A} \\times \\vec{B} = (AB\\sin\\theta)\\hat{\\eta}",
    variables: [
      { symbol: "\\vec{A}, \\vec{B}", meaning: "Two vectors", unit: "N/A" },
      {
        symbol: "\\hat{\\eta}",
        meaning: "Unit vector perpendicular to plane of A and B",
        unit: "N/A",
      },
      { symbol: "\\theta", meaning: "Angle between A and B", unit: "Degree" },
    ],
    assumptions: "Follows right-hand rule for direction.",
    specialCases: [
      {
        condition: "\\theta = 0^\\circ",
        latex: "\\vec{A} \\times \\vec{B} = 0 \\text{ (Parallel)}",
      },
    ],
    hasVisualization: false,
  },
  {
    id: "vec_parallel_condition",
    chapterId: "p1_ch2",
    topic: "Vector Multiplication (ভেক্টর গুণন)",
    nameEn: "Condition for Parallel Vectors",
    nameBn: "সমান্তরাল হওয়ার শর্ত",
    latex: "\\frac{A_x}{B_x} = \\frac{A_y}{B_y} = \\frac{A_z}{B_z}",
    variables: [
      { symbol: "A_i, B_i", meaning: "Components of the vectors", unit: "N/A" },
    ],
    assumptions: "",
    specialCases: [],
  },
  {
    id: "vec_projection",
    chapterId: "p1_ch2",
    topic: "Vector Projection (ভেক্টরের অভিক্ষেপ)",
    nameEn: "Projection of a Vector",
    nameBn: "ভেক্টরের অভিক্ষেপ",
    latex:
      "\\text{Projection of } \\vec{B} \\text{ on } \\vec{A} = \\frac{\\vec{A} \\cdot \\vec{B}}{A}",
    variables: [
      { symbol: "\\vec{A}, \\vec{B}", meaning: "Two vectors", unit: "N/A" },
      { symbol: "A", meaning: "Magnitude of vector A", unit: "N/A" },
    ],
    assumptions: "Projection is a scalar quantity.",
    specialCases: [],
  },
  {
    id: "parallelogram_area",
    chapterId: "p1_ch2",
    topic: "Vector Application (ভেক্টরের প্রয়োগ)",
    nameEn: "Area of Parallelogram",
    nameBn: "সামান্তরিকের ক্ষেত্রফল",
    latex: "\\text{Area} = |\\vec{A} \\times \\vec{B}|",
    variables: [
      {
        symbol: "\\vec{A}, \\vec{B}",
        meaning: "Adjacent sides of the parallelogram",
        unit: "N/A",
      },
    ],
    assumptions: "If A and B are diagonals, Area = 1/2 |A x B|",
    specialCases: [
      {
        condition: "\\text{If diagonals are given}",
        latex: "\\text{Area} = \\frac{1}{2}|\\vec{A} \\times \\vec{B}|",
      },
    ],
  },
  {
    id: "vector_area",
    chapterId: "p1_ch2",
    topic: "Vector Multiplication (ভেক্টর গুণন)",
    nameEn: "Area of Parallelogram",
    nameBn: "সামান্তরিকের ক্ষেত্রফল",
    latex: "Area = |\\vec{A} \\times \\vec{B}| = AB \\sin\\theta",
    variables: [
      {
        symbol: "\\vec{A}, \\vec{B}",
        meaning: "Adjacent sides of parallelogram",
        unit: "m",
      },
      { symbol: "\\theta", meaning: "Angle between vectors", unit: "Degree" },
    ],
    assumptions: "Vectors represent two adjacent sides of a parallelogram.",
    specialCases: [
      {
        condition: "\\text{Area of Triangle}",
        latex: "\\frac{1}{2}|\\vec{A} \\times \\vec{B}|",
      },
    ],
    hasVisualization: true,
    vizType: "vector_area",
  },
  {
    id: "lamis_theorem",
    chapterId: "p1_ch2",
    topic: "Vector Statics (ভেক্টর স্থিতিবিদ্যা)",
    nameEn: "Lami's Theorem",
    nameBn: "লামীর উপপাদ্য",
    latex:
      "\\frac{P}{\\sin\\alpha} = \\frac{Q}{\\sin\\beta} = \\frac{R}{\\sin\\gamma}",
    variables: [
      {
        symbol: "P, Q, R",
        meaning: "Three concurrent forces in equilibrium",
        unit: "N",
      },
      {
        symbol: "\\alpha, \\beta, \\gamma",
        meaning: "Angles between other two forces",
        unit: "Degree",
      },
    ],
    assumptions: "Forces must be concurrent, coplanar, and in equilibrium.",
    specialCases: [],
  },
];
