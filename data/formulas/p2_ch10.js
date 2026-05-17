export const formulas_p2_ch10 = [
  {
    id: "diode_equation",
    chapterId: "p2_ch10",
    topic: "Diode & Semiconductor (ডায়োড ও সেমিকন্ডাক্টর)",
    nameEn: "Diode Current & Dynamic Resistance",
    nameBn: "ডায়োড প্রবাহ ও গতিশীল রোধ",
    latex:
      "I = I_0 \\left( e^{\\frac{e V}{\\eta k_B T}} - 1 \\right) \\newline R_d = \\frac{\\Delta V}{\\Delta I} = \\frac{V_2 - V_1}{I_2 - I_1} \\newline R_s = \\frac{V}{I}",
    variables: [
      { symbol: "I", meaning: "Diode current", unit: "A" },
      { symbol: "I_0", meaning: "Reverse saturation current", unit: "A" },
      { symbol: "V", meaning: "Applied voltage across the diode", unit: "V" },
      { symbol: "e", meaning: "Charge of electron", unit: "C" },
      {
        symbol: "k_B",
        meaning: "Boltzmann's constant (1.38 × 10⁻²³)",
        unit: "J/K",
      },
      { symbol: "T", meaning: "Absolute temperature", unit: "K" },
      {
        symbol: "\\eta",
        meaning: "Ideality factor (1 for Germanium, 2 for Silicon)",
        unit: "Dimensionless",
      },
      { symbol: "R_d", meaning: "Dynamic (AC) resistance of diode", unit: "Ω" },
      { symbol: "R_s", meaning: "Static (DC) resistance of diode", unit: "Ω" },
    ],
    assumptions: "Shockley diode equation for ideal P-N junctions.",
    specialCases: [
      {
        condition: "V > 0 \\quad (\\text{Forward Bias})",
        latex:
          "I \\approx I_0 e^{e V / \\eta k_B T} \\quad (\\text{Current increases exponentially})",
      },
      {
        condition: "V < 0 \\quad (\\text{Reverse Bias})",
        latex: "I \\approx -I_0 \\quad (\\text{Negligible leakage current})",
      },
    ],
    hasVisualization: true,
    vizType: "pn_junction",
    mcqShortcuts: [
      "In forward bias, P is connected to positive and N to negative terminal. Depletion layer shrinks, and resistance becomes very low.",
      "In reverse bias, P is connected to negative and N to positive terminal. Depletion layer expands, and resistance is extremely high.",
      "Dynamic resistance $R_d$ is the inverse of the slope of the diode's I-V characteristic curve ($R_d = 1 / \\text{slope}$).",
    ],
  },
  {
    id: "diode_in_circuit",
    chapterId: "p2_ch10",
    topic: "Diode & Semiconductor (ডায়োড ও সেমিকন্ডাক্টর)",
    nameEn: "Ideal Diode & Rectifiers",
    nameBn: "আদর্শ ডায়োড ও একমুখীকরণ",
    latex:
      "\\text{Ideal Diode Switch:} \\newline \\text{Forward Bias} \\implies \\text{Closed Switch } (R = 0, \\, V_{diode} = 0) \\newline \\text{Reverse Bias} \\implies \\text{Open Switch } (R = \\infty, \\, I = 0) \\newline \\text{Half-Wave Rectifier:} \\newline I_{dc} = \\frac{I_m}{\\pi}, \\quad I_{rms} = \\frac{I_m}{2}, \\quad \\eta_{max} \\approx 40.6\\% \\newline \\text{Full-Wave Rectifier:} \\newline I_{dc} = \\frac{2 I_m}{\\pi}, \\quad I_{rms} = \\frac{I_m}{\\sqrt{2}}, \\quad \\eta_{max} \\approx 81.2\\%",
    variables: [
      {
        symbol: "I_{dc}",
        meaning: "Average/DC output current of rectifier",
        unit: "A",
      },
      {
        symbol: "I_{rms}",
        meaning: "Root-mean-square current of rectifier",
        unit: "A",
      },
      { symbol: "I_m", meaning: "Peak AC current input", unit: "A" },
      {
        symbol: "\\eta_{max}",
        meaning: "Maximum rectification efficiency",
        unit: "%",
      },
    ],
    assumptions:
      "Using ideal diodes without diode barrier voltage drop (0.7V for Si, 0.3V for Ge).",
    specialCases: [],
    hasVisualization: true,
    vizType: "pn_junction",
    mcqShortcuts: [
      "Ripple factor measures AC components remaining in output. Half-wave ripple factor is $1.21$, Full-wave is $0.48$.",
      "Bridge rectifier uses 4 diodes. Peak Inverse Voltage (PIV) is equal to peak input voltage $V_m$.",
      "Center-tap full-wave rectifier uses 2 diodes. PIV = $2 V_m$.",
      "Output frequency of full-wave rectifier is double the input frequency ($f_{out} = 2 f_{in}$). For half-wave, $f_{out} = f_{in}$.",
    ],
  },
  {
    id: "transistor_current",
    chapterId: "p2_ch10",
    topic: "Transistor (ট্রানজিস্টর)",
    nameEn: "Transistor Currents Relationship",
    nameBn: "ট্রানজিস্টর প্রবাহ সম্পর্ক",
    latex: "I_e = I_b + I_c",
    variables: [
      {
        symbol: "I_e",
        meaning: "Emitter current (flows out of emitter)",
        unit: "mA",
      },
      {
        symbol: "I_b",
        meaning: "Base current (very small control current)",
        unit: "μA",
      },
      {
        symbol: "I_c",
        meaning: "Collector current (large output current)",
        unit: "mA",
      },
    ],
    assumptions:
      "Valid for both NPN and PNP bipolar junction transistors (BJT).",
    specialCases: [],
    hasVisualization: true,
    vizType: "transistor_amplifier",
    mcqShortcuts: [
      "Emitter current is always the largest current in the transistor ($I_e > I_c > I_b$).",
      "Base current $I_b$ is extremely small, typically only 1% to 5% of the total emitter current.",
      "Collector current $I_c$ is typically 95% to 99% of $I_e$.",
    ],
  },
  {
    id: "transistor_alpha_beta",
    chapterId: "p2_ch10",
    topic: "Transistor (ট্রানজিস্টর)",
    nameEn: "Current Amplification Factors",
    nameBn: "প্রবাহ লাভ ও প্রবাহ গুণক",
    latex:
      "\\alpha = \\frac{I_c}{I_e} = \\frac{\\beta}{1 + \\beta} \\newline \\beta = \\frac{I_c}{I_b} = \\frac{\\alpha}{1 - \\alpha}",
    variables: [
      {
        symbol: "\\alpha",
        meaning: "Common-Base current gain (alpha)",
        unit: "Dimensionless (typically 0.95 - 0.99)",
      },
      {
        symbol: "\\beta",
        meaning: "Common-Emitter current gain (beta / h_FE)",
        unit: "Dimensionless (typically 20 - 500)",
      },
    ],
    assumptions:
      "Active region bias conditions (emitter-base forward biased, collector-base reverse biased).",
    specialCases: [
      {
        condition: "\\alpha = 0.98",
        latex: "\\beta = \\frac{0.98}{1 - 0.98} = 49",
      },
      {
        condition: "\\alpha = 0.99",
        latex: "\\beta = \\frac{0.99}{1 - 0.99} = 99",
      },
    ],
    hasVisualization: true,
    vizType: "transistor_amplifier",
    mcqShortcuts: [
      "$\\alpha$ is always less than 1 (since $I_c < I_e$).",
      "$\\beta$ is always much greater than 1 (since $I_c \\gg I_b$).",
      "As $\\alpha \\to 1$, $\\beta \\to \\infty$.",
      "Relation: $\\beta - \\alpha = \\alpha \\beta$.",
    ],
  },
  {
    id: "transistor_gains",
    chapterId: "p2_ch10",
    topic: "Transistor (ট্রানজিস্টর)",
    nameEn: "CE & CB Amplifier Gains",
    nameBn: "বিবর্ধক গেইন (ভোল্টেজ ও ক্ষমতা লাভ)",
    latex:
      "\\text{Common-Emitter (CE):} \\newline A_v = \\frac{V_{out}}{V_{in}} = \\beta \\frac{R_L}{R_{in}} = g_m R_L \\newline A_p = \\frac{P_{out}}{P_{in}} = A_v \\cdot \\beta = \\beta^2 \\frac{R_L}{R_{in}} \\newline \\text{Common-Base (CB):} \\newline A_v = \\alpha \\frac{R_L}{R_{in}}, \\quad A_p = A_v \\cdot \\alpha = \\alpha^2 \\frac{R_L}{R_{in}}",
    variables: [
      { symbol: "A_v", meaning: "Voltage gain", unit: "Dimensionless" },
      { symbol: "A_p", meaning: "Power gain", unit: "Dimensionless" },
      {
        symbol: "R_L",
        meaning: "Load resistance (collector resistor)",
        unit: "Ω",
      },
      {
        symbol: "R_{in}",
        meaning: "Input resistance (base/emitter resistance)",
        unit: "Ω",
      },
      {
        symbol: "g_m",
        meaning: "Transconductance (ΔIc / ΔVbe)",
        unit: "Ω⁻¹ or Siemens (S)",
      },
    ],
    assumptions:
      "Transistor operates in active region as a small-signal AC amplifier.",
    specialCases: [],
    hasVisualization: true,
    vizType: "transistor_amplifier",
    mcqShortcuts: [
      "In **Common Emitter (CE)** configuration, the output voltage has a **180° phase shift** (reversal) relative to input voltage.",
      "In **Common Base (CB)** and **Common Collector (CC)** configurations, there is **0° phase shift** between input and output.",
      "CE is highly preferred because it provides both high voltage gain AND high current gain, yielding extremely high power gain.",
    ],
  },
  {
    id: "logic_gates",
    chapterId: "p2_ch10",
    topic:
      "Logic Gates & Digital Electronics (লজিক গেট ও ডিজিটাল ইলেকট্রনিক্স)",
    nameEn: "Logic Gates & Boolean Algebra",
    nameBn: "লজিক গেট ও বুলিয়ান অ্যালজেব্রা",
    latex:
      "\\text{AND: } Y = A \\cdot B \\newline \\text{OR: } Y = A + B \\newline \\text{NOT: } Y = \\bar{A} \\newline \\text{NAND: } Y = \\overline{A \\cdot B} \\newline \\text{NOR: } Y = \\overline{A + B} \\newline \\text{XOR: } Y = A \\oplus B = \\bar{A}B + A\\bar{B} \\newline \\text{XNOR: } Y = \\overline{A \\oplus B} = A B + \\bar{A}\\bar{B}",
    variables: [
      { symbol: "A, B", meaning: "Binary inputs (0 or 1)", unit: "N/A" },
      { symbol: "Y", meaning: "Binary output (0 or 1)", unit: "N/A" },
    ],
    assumptions: "Two-state binary system (0 = Low/Off, 1 = High/On).",
    specialCases: [],
    hasVisualization: true,
    vizType: "logic_gates",
    mcqShortcuts: [
      "**NAND** and **NOR** are called **Universal Gates** because any boolean function can be realized using only NAND or only NOR gates.",
      "**XOR** output is `1` only when the inputs are different ($A \\ne B$). It is used as an odd-parity detector and in adder circuits.",
      "**XNOR** output is `1` only when the inputs are identical ($A = B$). It is used as a equality detector.",
      "De Morgan's Theorems: $\\overline{A+B} = \\bar{A} \\cdot \\bar{B}$ and $\\overline{A \\cdot B} = \\bar{A} + \\bar{B}$.",
    ],
  },
];
