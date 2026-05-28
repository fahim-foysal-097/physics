export const formulas_p1_ch7 = [
  {
    id: "youngs_modulus",
    chapterId: "p1_ch7",
    topic: "Elasticity (স্থিতিস্থাপকতা)",
    nameEn: "Young's Modulus",
    nameBn: "ইয়ং-এর গুণাঙ্ক",
    latex: "Y = \\frac{FL}{Al} = \\frac{mgL}{\\pi r^2 l}",
    variables: [
      { symbol: "Y", meaning: "Young's modulus", unit: "N/m² or Pa" },
      { symbol: "F", meaning: "Applied force", unit: "N" },
      { symbol: "L", meaning: "Original length", unit: "m" },
      { symbol: "A", meaning: "Cross-sectional area", unit: "m²" },
      { symbol: "l", meaning: "Change in length", unit: "m" },
      { symbol: "r", meaning: "Radius of the wire", unit: "m" },
    ],
    assumptions: "Within the elastic limit.",
    specialCases: [],
    hasVisualization: true,
    vizType: "stress_strain_curve",
  },
  {
    id: "elastic_moduli",
    chapterId: "p1_ch7",
    topic: "Elasticity (স্থিতিস্থাপকতা)",
    nameEn: "Moduli of Elasticity",
    nameBn: "স্থিতিস্থাপক গুণাঙ্ক",
    latex:
      "Y = \\frac{FL}{Al}, \\quad K = \\frac{PV}{\\Delta V}, \\quad \\eta = \\frac{F}{A\\tan \\theta}",
    variables: [
      { symbol: "Y", meaning: "Young's Modulus", unit: "Pa" },
      { symbol: "K", meaning: "Bulk Modulus", unit: "Pa" },
      { symbol: "\\eta", meaning: "Modulus of Rigidity", unit: "Pa" },
      { symbol: "F", meaning: "Applied force", unit: "N" },
      { symbol: "L", meaning: "Original length", unit: "m" },
      { symbol: "A", meaning: "Cross-sectional area", unit: "m²" },
      {
        symbol: "\\theta",
        meaning: "Shear angle in radians",
        unit: "rad or degrees",
      },
      { symbol: "P", meaning: "Pressure", unit: "Pa" },
      { symbol: "V", meaning: "Volume", unit: "m³" },
    ],
    hasVisualization: true,
    vizType: "stress_strain_curve",
    assumptions:
      "Because $\\theta$ is small, $\\tan \\theta \\approx \\theta^c$. [$\\theta$ must be in radians.]",
  },
  {
    id: "poissons_ratio",
    chapterId: "p1_ch7",
    topic: "Elasticity (স্থিতিস্থাপকতা)",
    nameEn: "Poisson's Ratio",
    nameBn: "পয়সনের অনুপাত",
    latex: "\\sigma = \\frac{Ld}{lD}",
    variables: [
      { symbol: "\\sigma", meaning: "Poisson's ratio", unit: "Unitless" },
      { symbol: "L", meaning: "Original length", unit: "m" },
      { symbol: "D", meaning: "Original diameter", unit: "m" },
      { symbol: "l", meaning: "Change in length", unit: "m" },
      { symbol: "d", meaning: "Change in diameter", unit: "m" },
    ],
    assumptions:
      "Within the elastic limit. Usually between -1 and 0.5 (practically between 0 and 0.5).",
    specialCases: [
      {
        condition: "\\text{Relation with Moduli}",
        latex: "Y = 3K(1 - 2\\sigma)",
      },
    ],
    hasVisualization: true,
    vizType: "poissons_ratio",
  },
  {
    id: "elastic_relations",
    chapterId: "p1_ch7",
    topic: "Elasticity (স্থিতিস্থাপকতা)",
    nameEn: "Relations between Elastic Constants",
    nameBn: "স্থিতিস্থাপক ধ্রুবকসমূহের মধ্যে পারস্পরিক সম্পর্ক",
    latex:
      "Y = 3K(1 - 2\\sigma) \\newline Y = 2\\eta(1 + \\sigma) \\newline \\sigma = \\frac{3K - 2\\eta}{6K + 2\\eta} \\newline \\frac{9}{Y} = \\frac{3}{\\eta} + \\frac{1}{K}",
    variables: [
      { symbol: "Y", meaning: "Young's Modulus", unit: "Pa" },
      { symbol: "K", meaning: "Bulk Modulus", unit: "Pa" },
      {
        symbol: "\\eta \\text{ or } B",
        meaning: "Modulus of Rigidity",
        unit: "Pa",
      },
      { symbol: "\\sigma", meaning: "Poisson's Ratio", unit: "Unitless" },
    ],
    assumptions:
      "Within the elastic limit for homogeneous and isotropic materials.",
    specialCases: [
      {
        condition: "\\text{Alternative Form of Rigidity}",
        latex: "\\eta = \\frac{Y}{2(1 + \\sigma)}",
      },
      {
        condition: "\\text{Theoretical Range of } \\sigma",
        latex:
          "-1 < \\sigma < 0.5 \\quad (\\text{Practical: } 0 < \\sigma < 0.5)",
      },
    ],
  },
  {
    id: "strain_energy",
    chapterId: "p1_ch7",
    topic: "Elasticity (স্থিতিস্থাপকতা)",
    nameEn: "Energy Stored in Stretched Wire",
    nameBn: "টানানো তারের সঞ্চিত শক্তি",
    latex: "W = \\frac{1}{2}Fl = \\frac{1}{2}\\frac{YAl^2}{L}",
    variables: [
      { symbol: "W", meaning: "Stored potential energy", unit: "Joule (J)" },
      { symbol: "F", meaning: "Applied force", unit: "N" },
      { symbol: "l", meaning: "Change in length", unit: "m" },
      { symbol: "Y", meaning: "Young's Modulus", unit: "Pa" },
      { symbol: "A", meaning: "Cross-sectional area", unit: "m²" },
      { symbol: "L", meaning: "Original length", unit: "m" },
    ],
    assumptions: "Within the elastic limit.",
    specialCases: [],
  },
  {
    id: "elastic_unit_energy",
    chapterId: "p1_ch7",
    topic: "Elasticity (স্থিতিস্থাপকতা)",
    nameEn: "Elastic Energy per Unit Volume",
    nameBn: "একক আয়তনে সঞ্চিত স্থিতিস্থাপক শক্তি (একক শক্তি)",
    latex:
      "U = \\frac{W}{V} = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain} = \\frac{1}{2} Y \\times (\\text{Strain})^2",
    variables: [
      {
        symbol: "u",
        meaning: "Potential energy per unit volume (Unit Energy)",
        unit: "J/m³",
      },
      { symbol: "W", meaning: "Total stored potential energy", unit: "J" },
      { symbol: "V", meaning: "Volume of the wire (A \\times L)", unit: "m³" },
      { symbol: "Y", meaning: "Young's Modulus", unit: "Pa" },
    ],
    assumptions: "Within the elastic limit, uniform stress distribution.",
    specialCases: [],
  },
  {
    id: "surface_tension",
    chapterId: "p1_ch7",
    topic: "Surface Tension (পৃষ্ঠটান)",
    nameEn: "Surface Tension",
    nameBn: "পৃষ্ঠটান",
    latex: "T = \\frac{F}{L}",
    variables: [
      { symbol: "T", meaning: "Surface tension", unit: "N/m" },
      {
        symbol: "F",
        meaning: "Force acting on the imaginary line / pulling force",
        unit: "N",
      },
      { symbol: "L", meaning: "Length of the line", unit: "m" },
    ],
    assumptions: "",
    specialCases: [
      {
        condition:
          "\\text{Circular Ring/Wire Loop (2 boundaries: inner/outer)}",
        latex: "T = \\frac{F_T}{4\\pi r}",
      },
      {
        condition: "\\text{Circular Disk/Plate (1 boundary)}",
        latex: "T = \\frac{F_T}{2\\pi r}",
      },
      {
        condition: "\\text{Thin Rectangular Plate}",
        latex:
          "T = \\frac{F_T}{2(l+t)} \\approx \\frac{F_T}{2l} \\quad (t \\approx 0)",
      },
      {
        condition: "\\text{Square Frame/Loop (2 boundaries)}",
        latex: "T = \\frac{F_T}{8a}",
      },
      {
        condition: "\\text{Square Plate/Solid Cube (1 boundary)}",
        latex: "T = \\frac{F_T}{4a}",
      },
      {
        condition: "\\text{Needle}",
        latex: "T = \\frac{F_T}{2l}",
      },
    ],
  },
  {
    id: "surface_tension_temp",
    chapterId: "p1_ch7",
    topic: "Surface Tension (পৃষ্ঠটান)",
    nameEn: "Temperature and Surface Tension Relation",
    nameBn: "পৃষ্ঠটান ও তাপমাত্রার সম্পর্ক",
    latex: "T_\\theta = T_0(1 - \\alpha \\theta)",
    variables: [
      {
        symbol: "T_\\theta",
        meaning: "Surface tension at temperature \\theta^\\circ\\text{C}",
        unit: "N/m",
      },
      {
        symbol: "T_0",
        meaning: "Surface tension at 0^\\circ\\text{C}",
        unit: "N/m",
      },
      {
        symbol: "\\alpha",
        meaning: "Temperature coefficient of surface tension",
        unit: "/^\\circ\\text{C} \\text{ or } /\\text{K}",
      },
      { symbol: "\\theta", meaning: "Temperature", unit: "^\\circ\\text{C}" },
    ],
    assumptions:
      "Valid for small temperature ranges. Surface tension decreases as temperature increases for most pure liquids.",
    specialCases: [
      {
        condition: "\\text{At Critical Temperature } \\theta_c",
        latex: "T_{\\theta_c} = 0",
      },
    ],
  },
  {
    id: "surface_energy",
    chapterId: "p1_ch7",
    topic: "Surface Tension (পৃষ্ঠটান)",
    nameEn: "Surface Energy per Unit Area",
    nameBn: "প্রতি একক ক্ষেত্রফলে পৃষ্ঠ শক্তি (একক শক্তি)",
    latex: "E_s = \\frac{W}{\\Delta A} = T",
    variables: [
      { symbol: "E_s", meaning: "Surface energy per unit area", unit: "J/m²" },
      {
        symbol: "W",
        meaning: "Work done to increase the surface area",
        unit: "J",
      },
      { symbol: "\\Delta A", meaning: "Increase in surface area", unit: "m²" },
      { symbol: "T", meaning: "Surface tension", unit: "N/m or J/m²" },
    ],
    assumptions: "Isothermal conditions (temperature remains constant).",
    specialCases: [
      {
        condition: "\\text{For a liquid drop}",
        latex: "\\Delta A = 4\\pi (r_2^2 - r_1^2)",
      },
      {
        condition: "\\text{For a soap bubble (2 surfaces)}",
        latex: "\\Delta A = 2 \\times 4\\pi (r_2^2 - r_1^2)",
      },
    ],
  },
  {
    id: "capillary_rise",
    chapterId: "p1_ch7",
    topic: "Surface Tension (পৃষ্ঠটান)",
    nameEn: "Capillary Rise",
    nameBn: "কৈশিক নলে পানির আরোহন",
    latex: "h = \\frac{2T\\cos\\theta}{r\\rho g}",
    variables: [
      { symbol: "h", meaning: "Height of liquid column", unit: "m" },
      { symbol: "T", meaning: "Surface tension", unit: "N/m" },
      { symbol: "\\theta", meaning: "Angle of contact", unit: "rad/deg" },
      { symbol: "r", meaning: "Radius of capillary tube", unit: "m" },
      { symbol: "\\rho", meaning: "Density of liquid", unit: "kg/m³" },
      { symbol: "g", meaning: "Acceleration due to gravity", unit: "m/s²" },
    ],
    assumptions: "Tube is perfectly cylindrical.",
    specialCases: [],
    hasVisualization: true,
    vizType: "capillary_rise_lab",
  },
  {
    id: "capillary_mass",
    chapterId: "p1_ch7",
    topic: "Surface Tension (পৃষ্ঠটান)",
    nameEn: "Mass of Liquid in Capillary Tube",
    nameBn: "কৈশিক নলে তরলের ভর",
    latex: "m = \\frac{2\\pi r T \\cos\\theta}{g}",
    variables: [
      { symbol: "m", meaning: "Mass of liquid column", unit: "kg" },
      { symbol: "r", meaning: "Radius of the capillary tube", unit: "m" },
      { symbol: "T", meaning: "Surface tension", unit: "N/m" },
      { symbol: "\\theta", meaning: "Angle of contact", unit: "rad/deg" },
      { symbol: "g", meaning: "Acceleration due to gravity", unit: "m/s²" },
    ],
    assumptions: "The tube is cylindrical and vertical.",
    specialCases: [
      {
        condition:
          "\\text{For Water and Clean Glass } (\\theta \\approx 0^\\circ)",
        latex: "m = \\frac{2\\pi r T}{g}",
      },
    ],
  },
  {
    id: "excess_pressure",
    chapterId: "p1_ch7",
    topic: "Surface Tension (পৃষ্ঠটান)",
    nameEn: "Excess Pressure inside Bubble/Drop",
    nameBn: "বুদবুদ বা ফোঁটার অভ্যন্তরে অতিরিক্ত চাপ",
    latex:
      "P = \\frac{4T}{r} \\quad \\text{(Bubble)} \\newline P = \\frac{2T}{r} \\quad \\text{(Drop)}",
    variables: [
      { symbol: "P", meaning: "Excess pressure", unit: "Pa" },
      { symbol: "T", meaning: "Surface tension", unit: "N/m" },
      { symbol: "r", meaning: "Radius", unit: "m" },
    ],
    assumptions: "",
    specialCases: [
      {
        condition: "\\text{Air Bubble inside Liquid (1 surface)}",
        latex: "P = \\frac{2T}{r}",
      },
    ],
  },
  {
    id: "terminal_velocity",
    chapterId: "p1_ch7",
    topic: "Viscosity (সান্দ্রতা)",
    nameEn: "Terminal Velocity",
    nameBn: "প্রান্তবেগ",
    latex: "v = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}",
    variables: [
      { symbol: "v", meaning: "Terminal velocity", unit: "m/s" },
      { symbol: "r", meaning: "Radius of the sphere", unit: "m" },
      {
        symbol: "\\eta",
        meaning: "Coefficient of viscosity",
        unit: "Pa·s  or Poiseuille",
      },
      { symbol: "\\rho", meaning: "Density of sphere", unit: "kg/m³" },
      { symbol: "\\sigma", meaning: "Density of fluid", unit: "kg/m³" },
    ],
    assumptions: "Sphere falls through infinite viscous medium.",
    specialCases: [
      {
        condition: "\\text{Stokes' Law (Viscous Force)}",
        latex: "F = 6\\pi\\eta rv",
      },
    ],
    hasVisualization: true,
    vizType: "terminal_velocity_stokes",
  },
  {
    id: "reynolds_number",
    chapterId: "p1_ch7",
    topic: "Viscosity (সান্দ্রতা)",
    nameEn: "Reynolds Number",
    nameBn: "রেনল্ডস সংখ্যা",
    latex: "R_e = \\frac{\\rho v D}{\\eta} = \\frac{2\\rho v r}{\\eta}",
    variables: [
      { symbol: "R_e", meaning: "Reynolds number", unit: "Unitless" },
      { symbol: "\\rho", meaning: "Density of fluid", unit: "kg/m³" },
      { symbol: "v", meaning: "Flow velocity", unit: "m/s" },
      { symbol: "D", meaning: "Diameter of the pipe (D = 2r)", unit: "m" },
      { symbol: "r", meaning: "Radius of the pipe", unit: "m" },
      { symbol: "\\eta", meaning: "Coefficient of viscosity", unit: "Pa·s" },
    ],
    assumptions: "Flow is through a circular pipe.",
    specialCases: [
      {
        condition: "R_e < 2000",
        latex: "\\text{Laminar / Streamline Flow (ধারারেখ প্রবাহ)}",
      },
      {
        condition: "2000 \\le R_e \\le 3000",
        latex: "\\text{Transitional / Unstable Flow (অস্থির প্রবাহ)}",
      },
      {
        condition: "R_e > 3000",
        latex: "\\text{Turbulent Flow (বিক্ষুব্ধ প্রবাহ)}",
      },
    ],
  },
];
