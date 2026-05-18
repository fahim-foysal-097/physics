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
    id: "vec_resolution",
    chapterId: "p1_ch2",
    topic: "Vector Components (ভেক্টরের উপাংশ)",
    nameEn: "Vector Resolution in 2D",
    nameBn: "দ্বিমাত্রিক ভেক্টর বিভাজন",
    latex:
      "A_x = A\\cos\\theta, \\quad A_y = A\\sin\\theta \\newline \\vec{A} = A_x\\hat{i} + A_y\\hat{j}",
    variables: [
      { symbol: "A", meaning: "Magnitude of the vector A", unit: "N/A" },
      {
        symbol: "A_x, A_y",
        meaning: "Horizontal (X) and vertical (Y) components",
        unit: "N/A",
      },
      {
        symbol: "\\theta",
        meaning: "Angle with the positive X-axis",
        unit: "Degree",
      },
    ],
    assumptions: "Orthogonal coordinate system.",
    specialCases: [],
  },
  {
    id: "direction_cosines",
    chapterId: "p1_ch2",
    topic: "Vector Components (ভেক্টরের উপাংশ)",
    nameEn: "Direction Cosines (Angle with axes)",
    nameBn: "দিক কোসাইন (অক্ষের সাথে কোণ)",
    latex:
      "\\cos\\alpha = \\frac{A_x}{A}, \\quad \\cos\\beta = \\frac{A_y}{A}, \\quad \\cos\\gamma = \\frac{A_z}{A}",
    variables: [
      {
        symbol: "\\alpha, \\beta, \\gamma",
        meaning: "Angles with X, Y, Z axes respectively",
        unit: "Degree",
      },
      { symbol: "A", meaning: "Magnitude of Vector A", unit: "N/A" },
    ],
    assumptions: "",
    specialCases: [
      {
        condition: "Relation",
        latex: "\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1",
      },
    ],
    hasVisualization: false,
  },
  {
    id: "river_boat_min_time",
    chapterId: "p1_ch2",
    topic: "Relative Velocity (আপেক্ষিক বেগ)",
    nameEn: "River Crossing in Minimum Time",
    nameBn: "ন্যূনতম সময়ে নদী পারাপার",
    latex: "t_{min} = \\frac{d}{v}, \\quad \\alpha = 90^\\circ",
    variables: [
      { symbol: "t_{min}", meaning: "Minimum time to cross", unit: "s" },
      { symbol: "d", meaning: "Width of the river", unit: "m" },
      { symbol: "v", meaning: "Velocity of boat", unit: "m/s" },
    ],
    assumptions:
      "Boat must be steered straight across (perpendicular to river flow).",
    specialCases: [],
    mcqShortcuts: ["To cross in min time, steer at 90° to the river flow."],
  },
  {
    id: "river_boat_min_dist",
    chapterId: "p1_ch2",
    topic: "Relative Velocity (আপেক্ষিক বেগ)",
    nameEn: "River Crossing in Minimum Distance",
    nameBn: "ন্যূনতম দূরত্বে নদী পারাপার",
    latex:
      "\\alpha = \\cos^{-1}\\left(\\frac{-u}{v}\\right), \\quad t = \\frac{d}{\\sqrt{v^2 - u^2}}",
    variables: [
      {
        symbol: "\\alpha",
        meaning: "Steering angle w.r.t river flow",
        unit: "Degree",
      },
      { symbol: "u", meaning: "Velocity of river stream", unit: "m/s" },
      { symbol: "v", meaning: "Velocity of boat", unit: "m/s" },
      { symbol: "d", meaning: "Width of the river", unit: "m" },
    ],
    assumptions: "Boat velocity (v) must be greater than river velocity (u).",
    specialCases: [],
    hasVisualization: true,
    vizType: "river_boat",
  },
  {
    id: "rain_umbrella",
    chapterId: "p1_ch2",
    topic: "Relative Velocity (আপেক্ষিক বেগ)",
    nameEn: "Rain and Umbrella",
    nameBn: "বৃষ্টি ও ছাতা",
    latex: "\\tan\\theta = \\frac{v_m}{v_r}",
    variables: [
      {
        symbol: "\\theta",
        meaning: "Angle umbrella must be held from vertical",
        unit: "Degree",
      },
      { symbol: "v_m", meaning: "Velocity of man", unit: "m/s" },
      {
        symbol: "v_r",
        meaning: "Velocity of rain falling vertically",
        unit: "m/s",
      },
    ],
    assumptions: "Rain is falling strictly vertically when man is stationary.",
    specialCases: [],
    hasVisualization: true,
    vizType: "rain_umbrella",
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
    id: "vec_parallel_condition",
    chapterId: "p1_ch2",
    topic: "Vector Multiplication (ভেক্টর গুণন)",
    nameEn: "Condition for Parallel Vectors",
    nameBn: "সমান্তরাল হওয়ার শর্ত",
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
    id: "vector_area",
    chapterId: "p1_ch2",
    topic: "Vector Application (ভেক্টরের প্রয়োগ)",
    nameEn: "Area of Parallelogram & Triangle",
    nameBn: "সামান্তরিক ও ত্রিভুজের ক্ষেত্রফল",
    latex:
      "A_p = |\\vec{A} \\times \\vec{B}| = AB \\sin\\theta \\newline A_t = \\frac{1}{2}|\\vec{A} \\times \\vec{B}| = \\frac{1}{2}AB \\sin\\theta",
    variables: [
      {
        symbol: "\\vec{A}, \\vec{B}",
        meaning: "Adjacent sides of parallelogram",
        unit: "m",
      },
      { symbol: "\\theta", meaning: "Angle between vectors", unit: "Degree" },
    ],
    assumptions: "Vectors represent two adjacent sides.",
    specialCases: [
      {
        condition: "\\text{If diagonals are given}",
        latex: "Area = \\frac{1}{2}|\\vec{A} \\times \\vec{B}|",
      },
    ],
    hasVisualization: true,
    vizType: "vector_area",
  },
  {
    id: "nabla_operator",
    chapterId: "p1_ch2",
    topic: "Vector Calculus (ভেক্টর ক্যালকুলাস)",
    nameEn: "Nabla / Del Operator",
    nameBn: "নাবলা অপারেটর",
    latex:
      "\\vec{\\nabla} = \\hat{i}\\frac{\\partial}{\\partial x} + \\hat{j}\\frac{\\partial}{\\partial y} + \\hat{k}\\frac{\\partial}{\\partial z}",
    variables: [
      {
        symbol: "\\vec{\\nabla}",
        meaning: "Differential vector operator",
        unit: "N/A",
      },
    ],
    assumptions: "Used to compute Gradient, Divergence, and Curl.",
    specialCases: [],
  },
  {
    id: "gradient_div_curl",
    chapterId: "p1_ch2",
    topic: "Vector Calculus (ভেক্টর ক্যালকুলাস)",
    nameEn: "Gradient, Divergence & Curl",
    nameBn: "গ্রেডিয়েন্ট, ডাইভারজেন্স ও কার্ল",
    latex:
      "\\text{Grad: } \\vec{\\nabla}\\phi \\quad \\text{Div: } \\vec{\\nabla} \\cdot \\vec{V} \\quad \\text{Curl: } \\vec{\\nabla} \\times \\vec{V}",
    variables: [
      { symbol: "\\phi", meaning: "Scalar field", unit: "N/A" },
      { symbol: "\\vec{V}", meaning: "Vector field", unit: "N/A" },
    ],
    assumptions: "",
    specialCases: [
      {
        condition: "Solenoidal Vector",
        latex: "\\vec{\\nabla} \\cdot \\vec{V} = 0",
      },
      {
        condition: "Irrotational & Conservative",
        latex: "\\vec{\\nabla} \\times \\vec{V} = 0",
      },
    ],
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
    imageUrl: "assets/images/paper-1/lami.webp",
  },
];
