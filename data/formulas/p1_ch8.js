export const formulas_p1_ch8 = [
  {
    id: "shm_displacement",
    chapterId: "p1_ch8",
    topic: "Simple Harmonic Motion (সরল ছন্দিত স্পন্দন)",
    nameEn: "Displacement",
    nameBn: "সরণ",
    latex: "x = A\\sin(\\omega t + \\delta)",
    variables: [
      { symbol: "x", meaning: "Displacement from mean position", unit: "m" },
      { symbol: "A", meaning: "Amplitude", unit: "m" },
      { symbol: "\\omega", meaning: "Angular frequency", unit: "rad/s" },
      { symbol: "t", meaning: "Time", unit: "s" },
      { symbol: "\\delta", meaning: "Initial phase angle", unit: "rad" },
    ],
    assumptions: "Motion is purely sinusoidal.",
    specialCases: [],
    hasVisualization: true,
    vizType: "shm_circular",
  },
  {
    id: "shm_velocity",
    chapterId: "p1_ch8",
    topic: "Simple Harmonic Motion (সরল ছন্দিত স্পন্দন)",
    nameEn: "Velocity",
    nameBn: "বেগ",
    latex: "v = \\omega\\sqrt{A^2 - x^2}",
    variables: [{ symbol: "v", meaning: "Velocity", unit: "m/s" }],
    assumptions: "",
    mcqShortcuts: [
      "Max velocity v_max = ωA is at mean position (x=0).",
      "At extreme position (x=A), velocity is zero.",
      "If x = A/2, then v = (√3/2) v_max.",
    ],
    specialCases: [
      {
        condition: "\\text{At mean position } (x = 0)",
        latex: "v_{max} = \\omega A",
      },
      { condition: "\\text{At extreme position } (x = A)", latex: "v = 0" },
    ],
  },
  {
    id: "shm_acceleration",
    chapterId: "p1_ch8",
    topic: "Simple Harmonic Motion (সরল ছন্দিত স্পন্দন)",
    nameEn: "Acceleration",
    nameBn: "ত্বরণ",
    latex: "a = -\\omega^2 x",
    variables: [{ symbol: "a", meaning: "Acceleration", unit: "m/s²" }],
    assumptions:
      "Negative sign indicates acceleration is opposite to displacement.",
    derivation:
      "From Newton's Second Law:\\\\ F = ma \\implies -kx = m \\frac{d^2x}{dt^2} \\\\ \\implies \\frac{d^2x}{dt^2} + \\frac{k}{m}x = 0 \\\\ \\implies \\frac{d^2x}{dt^2} + \\omega^2 x = 0",
    specialCases: [
      {
        condition: "\\text{Magnitude of max acceleration}",
        latex: "a_{max} = \\omega^2 A",
      },
    ],
  },
  {
    id: "shm_energy",
    chapterId: "p1_ch8",
    topic: "Energy in SHM (সরল ছন্দিত স্পন্দনের শক্তি)",
    nameEn: "Total Energy",
    nameBn: "মোট শক্তি",
    latex: "E = \\frac{1}{2}m\\omega^2 A^2",
    variables: [
      { symbol: "E", meaning: "Total mechanical energy", unit: "Joule (J)" },
      { symbol: "m", meaning: "Mass of the particle", unit: "kg" },
    ],
    assumptions: "No damping or resistive forces.",
    mcqShortcuts: [
      "At x = A/√2, Kinetic Energy = Potential Energy = 1/2 Total Energy.",
      "At x = A/2, Potential Energy = 1/4 Total Energy, Kinetic Energy = 3/4 Total Energy.",
      "Frequency of energy oscillation is twice the frequency of SHM.",
    ],
    specialCases: [
      {
        condition: "\\text{Kinetic Energy}",
        latex: "E_k = \\frac{1}{2}m\\omega^2(A^2 - x^2)",
      },
      {
        condition: "\\text{Potential Energy}",
        latex: "E_p = \\frac{1}{2}m\\omega^2 x^2",
      },
    ],
  },
  {
    id: "time_period_pendulum",
    chapterId: "p1_ch8",
    topic: "Pendulum & Springs (দোলক ও স্প্রিং)",
    nameEn: "Time Period",
    nameBn: "দোলনকাল",
    latex: "T = 2\\pi\\sqrt{\\frac{L}{g}} = 2\\pi\\sqrt{\\frac{m}{k}}",
    variables: [
      { symbol: "T", meaning: "Time period", unit: "s" },
      { symbol: "L", meaning: "Effective length of pendulum", unit: "m" },
      { symbol: "g", meaning: "Acceleration due to gravity", unit: "m/s²" },
      { symbol: "m", meaning: "Mass attached to spring", unit: "kg" },
      { symbol: "k", meaning: "Spring constant", unit: "N/m" },
    ],
    assumptions: "For pendulum, angular displacement is very small.",
    specialCases: [
      {
        condition: "\\text{Seconds Pendulum}",
        latex: "T = 2\\text{ s}, L \\approx 0.993\\text{ m}",
      },
    ],
    hasVisualization: true,
    vizType: "simple_pendulum",
  },
  {
    id: "clock_error",
    chapterId: "p1_ch8",
    topic: "Pendulum & Springs (দোলক ও স্প্রিং)",
    nameEn: "Pendulum Clock Error",
    nameBn: "দোলক ঘড়ির ত্রুটি",
    latex: "\\frac{\\Delta T}{T} \\approx \\frac{1}{2}\\alpha \\Delta\\theta",
    variables: [
      { symbol: "\\Delta T", meaning: "Change in time period", unit: "s" },
      {
        symbol: "\\alpha",
        meaning: "Coefficient of linear expansion",
        unit: "K⁻¹",
      },
      {
        symbol: "\\Delta\\theta",
        meaning: "Change in temperature",
        unit: "K or °C",
      },
    ],
    assumptions: "Temperature change causes length change.",
    specialCases: [
      {
        condition: "\\text{Loss/Gain of seconds per day}",
        latex: "n = 86400 \\times \\frac{\\Delta T}{T}",
      },
    ],
  },
];
