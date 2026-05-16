export const formulas_p2_ch1 = [
  {
    id: "temp_calibration",
    chapterId: "p2_ch1",
    topic: "Thermometry (তাপমিতি)",
    nameEn: "Thermometer Calibration",
    nameBn: "থার্মোমিটারের ক্রমাঙ্কন",
    latex: "\\frac{T - T_{ice}}{T_{steam} - T_{ice}} = \\frac{X - X_{ice}}{X_{steam} - X_{ice}}",
    variables: [
      { symbol: "T", meaning: "Unknown temperature", unit: "°C / K" },
      { symbol: "T_{ice}", meaning: "Ice point (Lower Fixed Point)", unit: "°C / K" },
      { symbol: "T_{steam}", meaning: "Steam point (Upper Fixed Point)", unit: "°C / K" },
      { symbol: "X", meaning: "Thermometric property (Pressure, Resistance, etc.)", unit: "varies" },
    ],
    assumptions: "Linear variation of thermometric property with temperature.",
    specialCases: [
      { condition: "Celsius Scale", latex: "\\frac{C}{100} = \\frac{X - X_{0}}{X_{100} - X_{0}}" },
    ],
    mcqShortcuts: ["X can be Resistance (Rt), Pressure (Pt), or Volume (Vt).", "Standard ice point is 0°C and steam point is 100°C."],
  },
  {
    id: "temp_conversion",
    chapterId: "p2_ch1",
    topic: "Thermometry (তাপমিতি)",
    nameEn: "Temperature Scale Conversion",
    nameBn: "তাপমাত্রা স্কেলের রূপান্তর",
    latex: "\\frac{C}{5} = \\frac{F - 32}{9} = \\frac{K - 273.15}{5}",
    variables: [
      { symbol: "C", meaning: "Celsius temperature", unit: "°C" },
      { symbol: "F", meaning: "Fahrenheit temperature", unit: "°F" },
      { symbol: "K", meaning: "Kelvin temperature", unit: "K" },
    ],
    assumptions: "Standard atmospheric pressure.",
    specialCases: [
      { condition: "C = F", latex: "-40^\circ" },
      { condition: "ΔK = ΔC", latex: "\\text{True}" }
    ],
    mcqShortcuts: ["ΔC : ΔF : ΔK = 5 : 9 : 5", "Kelvin is the absolute scale."],
  },
  {
    id: "resistance_thermometer",
    chapterId: "p2_ch1",
    topic: "Thermometry (তাপমিতি)",
    nameEn: "Resistance Thermometer",
    nameBn: "রোধ থার্মোমিটার",
    latex: "R_t = R_0(1 + \\alpha t)",
    variables: [
      { symbol: "R_t", meaning: "Resistance at t°C", unit: "Ω" },
      { symbol: "R_0", meaning: "Resistance at 0°C", unit: "Ω" },
      { symbol: "\\alpha", meaning: "Temperature coefficient of resistance", unit: "°C⁻¹" },
    ],
    assumptions: "Resistance varies linearly with temperature.",
    specialCases: [],
    mcqShortcuts: ["t = \\frac{R_t - R_0}{R_{100} - R_0} \\times 100"],
  },
  {
    id: "heat_capacity_latent",
    chapterId: "p2_ch1",
    topic: "Thermal Properties (তাপীয় ধর্ম)",
    nameEn: "Heat Capacity and Latent Heat",
    nameBn: "তাপধারণ ক্ষমতা ও সুপ্ততাপ",
    latex: "Q = mc\\Delta\\theta, \\quad Q = mL",
    variables: [
      { symbol: "Q", meaning: "Heat energy", unit: "J" },
      { symbol: "m", meaning: "Mass", unit: "kg" },
      { symbol: "c", meaning: "Specific heat capacity", unit: "J/kg·K" },
      { symbol: "L", meaning: "Latent heat (fusion or vaporization)", unit: "J/kg" },
    ],
    assumptions: "Constant pressure during phase change.",
    specialCases: [
      { condition: "Ice Fusion", latex: "L_f = 336,000 \\text{ J/kg}" },
      { condition: "Water Vaporization", latex: "L_v = 2,260,000 \\text{ J/kg}" }
    ],
    mcqShortcuts: ["During phase change, temperature remains constant.", "Water has highest specific heat (4200 J/kg·K)."],
    hasVisualization: true,
    vizType: "heating_curve"
  },
  {
    id: "first_law_thermo",
    chapterId: "p2_ch1",
    topic: "First Law (তাপগতিবিদ্যার প্রথম সূত্র)",
    nameEn: "First Law of Thermodynamics",
    nameBn: "তাপগতিবিদ্যার প্রথম সূত্র",
    latex: "dQ = dU + dW",
    variables: [
      { symbol: "dQ", meaning: "Heat added to system", unit: "J" },
      { symbol: "dU", meaning: "Change in internal energy", unit: "J" },
      { symbol: "dW", meaning: "Work done by system", unit: "J" },
    ],
    assumptions: "Closed system; Energy conservation.",
    specialCases: [
      { condition: "Isothermal", latex: "dU = 0 \\implies dQ = dW" },
      { condition: "Adiabatic", latex: "dQ = 0 \\implies dU = -dW" }
    ],
    mcqShortcuts: ["dU is a state function.", "dQ = dU + PdV"],
  },
  {
    id: "thermo_processes",
    chapterId: "p2_ch1",
    topic: "Thermodynamic Processes (তাপগতিবিদ্যার প্রক্রিয়া)",
    nameEn: "Gas Processes (Isothermal & Adiabatic)",
    nameBn: "গ্যাসের প্রক্রিয়া (সমোষ্ণ ও রুদ্ধতাপীয়)",
    latex: "PV = \\text{const}, \\quad PV^\\gamma = \\text{const}",
    variables: [
      { symbol: "\\gamma", meaning: "Cp/Cv ratio", unit: "N/A" },
    ],
    assumptions: "Ideal gas.",
    specialCases: [
      { condition: "Adiabatic TV", latex: "TV^{\\gamma-1} = \\text{const}" },
      { condition: "Adiabatic TP", latex: "T^\\gamma P^{1-\\gamma} = \\text{const}" }
    ],
    mcqShortcuts: ["Adiabatic slope is γ times isothermal slope.", "Sudden changes are adiabatic."],
    hasVisualization: true,
    vizType: "process_comparison"
  },
  {
    id: "heat_engine_efficiency",
    chapterId: "p2_ch1",
    topic: "Heat Engines (তাপ ইঞ্জিন)",
    nameEn: "Heat Engine Efficiency",
    nameBn: "তাপ ইঞ্জিনের দক্ষতা",
    latex: "\\eta = \\frac{W}{Q_1} = 1 - \\frac{Q_2}{Q_1} = 1 - \\frac{T_2}{T_1}",
    variables: [
      { symbol: "\\eta", meaning: "Efficiency", unit: "N/A" },
      { symbol: "Q_1", meaning: "Heat absorbed from source", unit: "J" },
      { symbol: "Q_2", meaning: "Heat rejected to sink", unit: "J" },
      { symbol: "T_1, T_2", meaning: "Absolute temperatures of source and sink", unit: "K" },
    ],
    assumptions: "Carnot cycle for temperature relation.",
    specialCases: [],
    mcqShortcuts: ["η < 1 (Efficiency is always less than 100%).", "Efficiency depends on reservoir temperatures."],
    hasVisualization: true,
    vizType: "carnot_cycle"
  },
  {
    id: "refrigerator_cop",
    chapterId: "p2_ch1",
    topic: "Heat Engines (তাপ ইঞ্জিন)",
    nameEn: "Coefficient of Performance (Refrigerator)",
    nameBn: "রেফ্রিজারেটরের কর্মক্ষমতা গুণাঙ্ক",
    latex: "K = \\frac{Q_2}{W} = \\frac{Q_2}{Q_1 - Q_2} = \\frac{T_2}{T_1 - T_2}",
    variables: [
      { symbol: "K", meaning: "Coefficient of Performance (COP)", unit: "N/A" },
      { symbol: "Q_2", meaning: "Heat extracted from cold reservoir", unit: "J" },
      { symbol: "W", meaning: "Work input", unit: "J" },
    ],
    assumptions: "Reverse Carnot cycle.",
    specialCases: [],
    mcqShortcuts: ["COP can be greater than 1.", "K = \\frac{1-\\eta}{\\eta} is not correct, use temperatures."],
  },
  {
    id: "entropy_law",
    chapterId: "p2_ch1",
    topic: "Second Law & Entropy (দ্বিতীয় সূত্র ও এন্ট্রপি)",
    nameEn: "Entropy and Second Law",
    nameBn: "এন্ট্রপি ও দ্বিতীয় সূত্র",
    latex: "dS = \\frac{dQ}{T}, \\quad \\Delta S_{univ} \\ge 0",
    variables: [
      { symbol: "S", meaning: "Entropy", unit: "J/K" },
    ],
    assumptions: "Reversible process for dS = dQ/T.",
    specialCases: [
      { condition: "Isothermal", latex: "\\Delta S = Q/T" },
      { condition: "Adiabatic", latex: "\\Delta S = 0" }
    ],
    mcqShortcuts: ["Entropy of universe is always increasing.", "Measure of disorder."],
  },
];
