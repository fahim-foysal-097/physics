export const formulas_p1_ch3 = [
  {
    id: "equations_of_motion",
    chapterId: "p1_ch3",
    topic: "Linear Motion (রৈখিক গতি)",
    nameEn: "Equations of Motion",
    nameBn: "গতির সমীকরণ",
    latex:
      "v = u + at \\newline s = ut + \\frac{1}{2}at^2 \\newline v^2 = u^2 + 2as \\newline s = \\left(\\frac{u+v}{2}\\right)t",
    variables: [
      { symbol: "u", meaning: "Initial velocity", unit: "m/s" },
      { symbol: "v", meaning: "Final velocity", unit: "m/s" },
      { symbol: "a", meaning: "Acceleration", unit: "m/s²" },
      { symbol: "t", meaning: "Time", unit: "s" },
      { symbol: "s", meaning: "Displacement", unit: "m" },
    ],
    assumptions: "Acceleration is constant.",
    specialCases: [
      {
        condition: "\\text{Free fall (Drop)}",
        latex: "v = gt, \\quad h = \\frac{1}{2}gt^2, \\quad v^2 = 2gh",
      },
      {
        condition: "\\text{Thrown upwards}",
        latex:
          "v = u - gt, \\quad h = ut - \\frac{1}{2}gt^2, \\quad v^2 = u^2 - 2gh",
      },
    ],
    mcqShortcuts: [
      "If a body is dropped, ratio of distances in 1s, 2s, 3s: 1:4:9 (n²)",
      "Ratio of distances in consecutive 1s intervals: 1:3:5 (2n-1)",
    ],
  },
  {
    id: "nth_second_distance",
    chapterId: "p1_ch3",
    topic: "Linear Motion (রৈখিক গতি)",
    nameEn: "Distance in nth Second",
    nameBn: "তম সেকেন্ডে অতিক্রান্ত দূরত্ব",
    latex: "S_{th} = u + \\frac{1}{2}a(2t - 1)",
    variables: [
      {
        symbol: "S_{th}",
        meaning: "Distance traveled in the t-th second",
        unit: "m",
      },
      { symbol: "u", meaning: "Initial velocity", unit: "m/s" },
      { symbol: "a", meaning: "Acceleration", unit: "m/s²" },
      { symbol: "t", meaning: "Specific second (nth)", unit: "s" },
    ],
    assumptions: "Constant acceleration.",
    specialCases: [],
  },
  {
    id: "bullet_plank",
    chapterId: "p1_ch3",
    topic: "Plank Penetration (তক্তা ভেদ)",
    nameEn: "Bullet Penetration Problem",
    nameBn: "বুলেটের তক্তা ভেদ",
    latex: "s = \\frac{x}{n^2 - 1}",
    variables: [
      {
        symbol: "s",
        meaning: "Further distance penetrated before stopping",
        unit: "m",
      },
      { symbol: "x", meaning: "Thickness of the plank penetrated", unit: "m" },
      {
        symbol: "\\frac{1}{n}",
        meaning: "Fraction of velocity lost",
        unit: "N/A",
      },
    ],
    assumptions: "Retardation is uniform within the plank.",
    specialCases: [
      { condition: "\\text{Velocity becomes half}", latex: "s = \\frac{x}{3}" },
    ],
  },
  {
    id: "projectile_path",
    chapterId: "p1_ch3",
    topic: "Projectile Motion (প্রাসের গতি)",
    nameEn: "Equation of Trajectory",
    nameBn: "প্রাসের গতিপথের সমীকরণ",
    latex: "y = x\\tan\\alpha - \\frac{gx^2}{2u^2\\cos^2\\alpha}",
    variables: [
      { symbol: "y", meaning: "Vertical displacement", unit: "m" },
      { symbol: "x", meaning: "Horizontal displacement", unit: "m" },
      { symbol: "u", meaning: "Velocity of projection", unit: "m/s" },
      { symbol: "\\alpha", meaning: "Angle of projection", unit: "Degree" },
    ],
    assumptions: "Air resistance is neglected.",
    specialCases: [
      {
        condition: "Expressed with Range (R)",
        latex: "y = x\\tan\\alpha \\left(1 - \\frac{x}{R}\\right)",
      },
    ],
    hasVisualization: true,
    vizType: "projectile_advanced",
    mcqShortcuts: [
      "For maximum range, angle of projection θ = 45°.",
      "Two angles θ and (90° - θ) result in the same horizontal range.",
      "If horizontal range R = 4H (Maximum Height), then θ = 45°.",
      "At maximum height, vertical velocity is zero, but horizontal velocity remains u cosθ.",
    ],
  },
  {
    id: "projectile_from_height",
    chapterId: "p1_ch3",
    topic: "Projectile Motion (প্রাসের গতি)",
    nameEn: "Projectile from a Height",
    nameBn: "উচ্চতা থেকে প্রাসের গতি",
    latex:
      "y = ut + \\frac{1}{2}gt^2 \\quad \\text{(if thrown horizontally, } u_y = 0)",
    variables: [
      { symbol: "y", meaning: "Height fallen", unit: "m" },
      { symbol: "u", meaning: "Initial horizontal velocity", unit: "m/s" },
      { symbol: "x", meaning: "Horizontal range (x = u*t)", unit: "m" },
    ],
    assumptions: "Thrown purely horizontally from a tower of height y.",
    specialCases: [
      { condition: "Trajectory Equation", latex: "y = \\frac{g}{2u^2}x^2" },
    ],
  },
  {
    id: "projectile_max_height",
    chapterId: "p1_ch3",
    topic: "Projectile Motion (প্রাসের গতি)",
    nameEn: "Maximum Height & Time",
    nameBn: "সর্বোচ্চ উচ্চতা ও সময়",
    latex:
      "H = \\frac{u^2\\sin^2\\alpha}{2g}, \\quad T = \\frac{2u\\sin\\alpha}{g}",
    variables: [
      { symbol: "H", meaning: "Maximum vertical height", unit: "m" },
      { symbol: "T", meaning: "Total time of flight", unit: "s" },
      { symbol: "u", meaning: "Velocity of projection", unit: "m/s" },
      { symbol: "\\alpha", meaning: "Angle of projection", unit: "Degree" },
    ],
    assumptions: "Launch and landing are on the same horizontal plane.",
    specialCases: [],
  },
  {
    id: "projectile_range",
    chapterId: "p1_ch3",
    topic: "Projectile Motion (প্রাসের গতি)",
    nameEn: "Horizontal Range",
    nameBn: "আনুভূমিক পাল্লা",
    latex: "R = \\frac{u^2\\sin(2\\alpha)}{g}",
    variables: [
      { symbol: "R", meaning: "Horizontal range", unit: "m" },
      { symbol: "u", meaning: "Velocity of projection", unit: "m/s" },
      { symbol: "\\alpha", meaning: "Angle of projection", unit: "Degree" },
    ],
    assumptions: "Same horizontal plane.",
    specialCases: [
      {
        condition: "\\alpha = 45^\\circ",
        latex: "R_{max} = \\frac{u^2}{g}, \\quad H = \\frac{R_{max}}{4}",
      },
      { condition: "\\alpha = 76^\\circ", latex: "R = H" },
    ],
    mcqShortcuts: [
      "For maximum range, angle of projection θ = 45°.",
      "Two angles θ and (90° - θ) result in the same horizontal range.",
      "If R = 4H, then θ = 45°.",
    ],
  },
];
