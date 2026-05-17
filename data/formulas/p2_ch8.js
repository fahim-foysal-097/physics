export const formulas_p2_ch8 = [
  {
    id: "galilean_lorentz_transformation",
    chapterId: "p2_ch8",
    topic: "Reference Frames & Transformations (প্রসঙ্গ কাঠামো ও রূপান্তর)",
    nameEn: "Galilean & Lorentz Transformations",
    nameBn: "গ্যালিলীয় ও লরেন্টজ রূপান্তর",
    latex:
      "\\text{Lorentz Transformations (moving along x-axis):} \\newline x' = \\gamma(x - vt), \\quad y' = y, \\quad z' = z \\newline t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right) \\newline \\text{where } \\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}} \\newline \\text{Galilean (for } v \\ll c \\text{):} \\newline x' = x - vt, \\quad t' = t",
    variables: [
      {
        symbol: "x, y, z, t",
        meaning: "Coordinates in stationary frame S",
        unit: "m, s",
      },
      {
        symbol: "x', y', z', t'",
        meaning: "Coordinates in moving frame S'",
        unit: "m, s",
      },
      { symbol: "v", meaning: "Relative velocity of frame S'", unit: "m/s" },
      { symbol: "\\gamma", meaning: "Lorentz factor", unit: "Dimensionless" },
      { symbol: "c", meaning: "Speed of light", unit: "3 × 10⁸ m/s" },
    ],
    assumptions:
      "Frame S' is moving with uniform velocity v along the positive x-axis relative to S.",
    specialCases: [
      {
        condition: "v \\ll c",
        latex:
          "\\gamma \\approx 1 \\implies \\text{Lorentz reduces to Galilean}",
      },
    ],
    mcqShortcuts: [
      "Lorentz transformations are based on the special theory of relativity postulates (laws of physics are invariant, speed of light is constant).",
      "Galilean transformation assumes time is absolute ($t' = t$), which is violated at relativistic speeds.",
      "Inverse Lorentz transformation is found by replacing $v$ with $-v$ and swapping primed/unprimed variables.",
    ],
  },
  {
    id: "time_dilation",
    chapterId: "p2_ch8",
    topic: "Relativity (আপেক্ষিকতা)",
    nameEn: "Time Dilation",
    nameBn: "কাল দীর্ঘায়ন",
    latex: "t = \\frac{t_0}{\\sqrt{1 - \\frac{v^2}{c^2}}} = \\gamma t_0",
    variables: [
      {
        symbol: "t",
        meaning: "Relativistic/Dilated time (observed from stationary frame)",
        unit: "s",
      },
      {
        symbol: "t_0",
        meaning: "Proper time (measured in the moving frame)",
        unit: "s",
      },
      {
        symbol: "v",
        meaning: "Relative velocity of the moving frame",
        unit: "m/s",
      },
      { symbol: "c", meaning: "Speed of light", unit: "m/s" },
    ],
    assumptions:
      "Moving observer travels at constant speed v relative to the stationary observer.",
    specialCases: [
      { condition: "v = 0.6c", latex: "t = 1.25 t_0" },
      { condition: "v = 0.8c", latex: "t = 1.67 t_0" },
      {
        condition: "v = 0.866c",
        latex: "t = 2.0 t_0 \\quad (\\text{Time doubles})",
      },
    ],
    hasVisualization: true,
    vizType: "relativity_dilation",
    mcqShortcuts: [
      "A moving clock runs slower relative to a stationary observer.",
      "Proper time $t_0$ is always the shortest time interval measured between two events.",
      "Lorentz factor $\\gamma = 1.25$ for $v=0.6c$ and $\\gamma = 1.67$ for $v=0.8c$.",
    ],
  },
  {
    id: "length_contraction",
    chapterId: "p2_ch8",
    topic: "Relativity (আপেক্ষিকতা)",
    nameEn: "Length Contraction",
    nameBn: "দৈর্ঘ্য সংকোচন",
    latex: "L = L_0 \\sqrt{1 - \\frac{v^2}{c^2}} = \\frac{L_0}{\\gamma}",
    variables: [
      {
        symbol: "L",
        meaning:
          "Relativistic/Contracted length (observed from stationary frame)",
        unit: "m",
      },
      {
        symbol: "L_0",
        meaning: "Proper length (measured in the object's rest frame)",
        unit: "m",
      },
      {
        symbol: "v",
        meaning: "Relative velocity of the moving object",
        unit: "m/s",
      },
    ],
    assumptions:
      "Contraction occurs only along the direction of relative motion.",
    specialCases: [
      {
        condition: "v = 0.6c",
        latex: "L = 0.8 L_0 \\quad (\\text{20% contracted})",
      },
      {
        condition: "v = 0.8c",
        latex: "L = 0.6 L_0 \\quad (\\text{40% contracted})",
      },
    ],
    hasVisualization: true,
    vizType: "relativity_dilation",
    mcqShortcuts: [
      "Moving objects appear shortened only along their direction of motion.",
      "Perpendicular dimensions (height, width) remain unchanged.",
      "Proper length $L_0$ is always the longest length measured.",
    ],
  },
  {
    id: "mass_variation",
    chapterId: "p2_ch8",
    topic: "Relativity (আপেক্ষিকতা)",
    nameEn: "Mass Variation",
    nameBn: "ভরের আপেক্ষিকতা",
    latex: "m = \\frac{m_0}{\\sqrt{1 - \\frac{v^2}{c^2}}} = \\gamma m_0",
    variables: [
      { symbol: "m", meaning: "Relativistic mass", unit: "kg" },
      {
        symbol: "m_0",
        meaning: "Rest mass (measured when object is at rest)",
        unit: "kg",
      },
    ],
    assumptions: "The object is moving with constant velocity v.",
    specialCases: [
      { condition: "v = 0.6c", latex: "m = 1.25 m_0" },
      { condition: "v = 0.8c", latex: "m = 1.67 m_0" },
    ],
    mcqShortcuts: [
      "Relativistic mass increases with velocity.",
      "As $v \\to c$, $m \\to \\infty$, which means infinite force would be required to accelerate it further. Thus, no material object can reach the speed of light.",
    ],
  },
  {
    id: "relativistic_momentum",
    chapterId: "p2_ch8",
    topic: "Relativity (আপেক্ষিকতা)",
    nameEn: "Relativistic Momentum & Energy Relation",
    nameBn: "আপেক্ষিক ভরবেগ ও শক্তির সম্পর্ক",
    latex:
      "p = m v = \\gamma m_0 v \\newline E^2 = (pc)^2 + (m_0 c^2)^2 \\newline pc = \\sqrt{E^2 - E_0^2}",
    variables: [
      { symbol: "p", meaning: "Relativistic momentum", unit: "kg·m/s" },
      { symbol: "E", meaning: "Total energy", unit: "J or eV" },
      { symbol: "E_0", meaning: "Rest mass energy (m₀c²)", unit: "J or eV" },
    ],
    assumptions:
      "Deals with relativistic particles (like high energy electrons or cosmic rays).",
    specialCases: [
      { condition: "m_0 = 0 \\quad (\\text{e.g., Photons})", latex: "E = pc" },
    ],
    mcqShortcuts: [
      "For a massless particle like a photon, momentum is $p = E/c$.",
      "The term $m_0 c^2$ is the rest-mass energy. For an electron, it is $0.511\\text{ MeV}$.",
    ],
  },
  {
    id: "mass_energy_equivalence",
    chapterId: "p2_ch8",
    topic: "Relativity (আপেক্ষিকতা)",
    nameEn: "Mass-Energy Equivalence",
    nameBn: "ভর-শক্তি সমতুল্যতা",
    latex:
      "E = m c^2 = \\gamma m_0 c^2 \\newline E_0 = m_0 c^2 \\newline K = E - E_0 = (m - m_0)c^2 = (\\gamma - 1)m_0 c^2",
    variables: [
      { symbol: "E", meaning: "Total relativistic energy", unit: "J" },
      { symbol: "E_0", meaning: "Rest mass energy", unit: "J" },
      { symbol: "K", meaning: "Relativistic kinetic energy", unit: "J" },
    ],
    assumptions: "Einstein's mass-energy equivalence principle.",
    specialCases: [
      {
        condition: "v \\ll c",
        latex:
          "K \\approx \\frac{1}{2}m_0 v^2 \\quad (\\text{Classical Kinetic Energy})",
      },
    ],
    mcqShortcuts: [
      "Rest energy of 1 kg mass is $E = 1 \\times (3 \\times 10^8)^2 = 9 \\times 10^{16}\\text{ J}$.",
      "Relativistic Kinetic Energy is NOT $\\frac{1}{2}mv^2$ at high speeds.",
    ],
  },
  {
    id: "photon_properties",
    chapterId: "p2_ch8",
    topic: "Quantum Theory of Light (আলোর কোয়ান্টাম তত্ত্ব)",
    nameEn: "Photon Energy & Momentum",
    nameBn: "ফোটনের শক্তি ও ভরবেগ",
    latex:
      "E = h f = \\frac{h c}{\\lambda} \\newline p = \\frac{E}{c} = \\frac{h}{\\lambda}",
    variables: [
      { symbol: "E", meaning: "Energy of a photon", unit: "J or eV" },
      { symbol: "p", meaning: "Momentum of a photon", unit: "kg·m/s" },
      {
        symbol: "h",
        meaning: "Planck's constant (6.626 × 10⁻³⁴)",
        unit: "J·s",
      },
      { symbol: "f", meaning: "Frequency of light", unit: "Hz" },
      { symbol: "\\lambda", meaning: "Wavelength of light", unit: "m" },
    ],
    assumptions:
      "Light behaves as a stream of localized energy packets called photons.",
    specialCases: [],
    mcqShortcuts: [
      "The rest mass of a photon is zero ($m_0 = 0$).",
      "Energy in eV can be quickly computed as $E \\text{ (eV)} \\approx \\frac{1240}{\\lambda \\text{ (in nm)}}$.",
    ],
  },
  {
    id: "photoelectric_equation",
    chapterId: "p2_ch8",
    topic: "Photoelectric Effect (আলোকতড়িৎ ক্রিয়া)",
    nameEn: "Einstein's Photoelectric Equation",
    nameBn: "আইনস্টাইনের আলোকতড়িৎ সমীকরণ",
    latex:
      "E = \\Phi + K_{max} \\newline h f = h f_0 + K_{max} \\newline K_{max} = h(f - f_0) = hc\\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right)",
    variables: [
      { symbol: "E", meaning: "Incident photon energy", unit: "eV or J" },
      {
        symbol: "\\Phi",
        meaning: "Work function (threshold energy required to eject electron)",
        unit: "eV or J",
      },
      {
        symbol: "K_{max}",
        meaning: "Maximum kinetic energy of ejected photoelectron",
        unit: "eV or J",
      },
      { symbol: "f_0", meaning: "Threshold frequency", unit: "Hz" },
      { symbol: "\\lambda_0", meaning: "Threshold wavelength", unit: "m" },
    ],
    assumptions:
      "One photon ejects exactly one electron (one-to-one interaction).",
    specialCases: [
      {
        condition: "f < f_0",
        latex: "K_{max} < 0 \\implies \\text{No photoelectric emission occurs}",
      },
    ],
    hasVisualization: true,
    vizType: "photoelectric_effect",
    mcqShortcuts: [
      "Work function $\\Phi = h f_0 = hc/\\lambda_0$.",
      "Number of photoelectrons ejected $\\propto$ Intensity of light.",
      "Max kinetic energy ($K_{max}$) depends only on Wavelength/Frequency of light, NOT Intensity.",
      "There is no time lag between photon arrival and electron ejection.",
    ],
  },
  {
    id: "stopping_potential",
    chapterId: "p2_ch8",
    topic: "Photoelectric Effect (আলোকতড়িৎ ক্রিয়া)",
    nameEn: "Stopping Potential",
    nameBn: "নিবৃত্তি বিভব",
    latex:
      "K_{max} = e V_s \\newline e V_s = h f - \\Phi = \\frac{hc}{\\lambda} - \\Phi",
    variables: [
      {
        symbol: "V_s",
        meaning:
          "Stopping potential (retarding voltage that stops all current)",
        unit: "V",
      },
      { symbol: "e", meaning: "Elementary charge (1.6 × 10⁻¹⁹)", unit: "C" },
    ],
    assumptions:
      "Anode is kept at negative potential relative to cathode to stop electrons.",
    specialCases: [],
    hasVisualization: true,
    vizType: "photoelectric_effect",
    mcqShortcuts: [
      "Stopping potential is directly proportional to frequency ($V_s \\propto f$).",
      "Stopping potential is completely independent of the light intensity.",
      "The slope of the $V_s$ vs $f$ graph is equal to $h/e$, which is a universal constant.",
    ],
  },
  {
    id: "xray_production",
    chapterId: "p2_ch8",
    topic: "X-Rays (রঞ্জন রশ্মি)",
    nameEn: "X-Ray Cut-off Wavelength",
    nameBn: "এক্স-রে এর সর্বনিম্ন তরঙ্গদৈর্ঘ্য",
    latex:
      "E_{max} = e V = h f_{max} = \\frac{hc}{\\lambda_{min}} \\newline \\lambda_{min} = \\frac{hc}{eV} \\approx \\frac{12400}{V \\text{ (Volts)}} \\text{ \\AA}",
    variables: [
      {
        symbol: "V",
        meaning: "Accelerating potential difference of the tube",
        unit: "V",
      },
      {
        symbol: "\\lambda_{min}",
        meaning: "Minimum/Cut-off wavelength of emitted X-rays",
        unit: "m",
      },
      {
        symbol: "f_{max}",
        meaning: "Maximum frequency of continuous X-rays",
        unit: "Hz",
      },
    ],
    assumptions:
      "An electron loses its entire kinetic energy in a single collision with the target atom, emitting a single photon.",
    specialCases: [],
    hasVisualization: true,
    vizType: "xray_production",
    mcqShortcuts: [
      "Minimum wavelength is inversely proportional to the accelerating voltage (Duane-Hunt Law): $\\lambda_{min} \\propto 1/V$.",
      "Continuous X-ray spectrum is an example of bremsstrahlung (braking radiation).",
      "Characteristic X-ray lines depend on the target material's atomic number (Moseley's Law).",
    ],
  },
  {
    id: "compton_scattering",
    chapterId: "p2_ch8",
    topic: "Compton Effect (কম্পটন ক্রিয়া)",
    nameEn: "Compton Scattering Shift",
    nameBn: "কম্পটন তরঙ্গদৈর্ঘ্য সরণ",
    latex:
      "\\Delta\\lambda = \\lambda' - \\lambda = \\frac{h}{m_0 c}(1 - \\cos\\theta) \\newline \\lambda_c = \\frac{h}{m_0 c} \\approx 2.426 \\times 10^{-12} \\text{ m} = 0.0242 \\text{ \\AA}",
    variables: [
      {
        symbol: "\\Delta\\lambda",
        meaning: "Compton wavelength shift",
        unit: "m",
      },
      { symbol: "\\lambda", meaning: "Incident photon wavelength", unit: "m" },
      {
        symbol: "\\lambda'",
        meaning: "Scattered photon wavelength",
        unit: "m",
      },
      {
        symbol: "\\theta",
        meaning: "Scattering angle of the photon",
        unit: "Degrees",
      },
      {
        symbol: "m_0",
        meaning: "Rest mass of electron",
        unit: "9.1 × 10⁻³¹ kg",
      },
      {
        symbol: "\\lambda_c",
        meaning: "Compton wavelength of electron",
        unit: "m",
      },
    ],
    assumptions:
      "Elastic collision between a high-energy photon (X-ray/Gamma ray) and a free electron at rest.",
    specialCases: [
      {
        condition: "\\theta = 0^\\circ \\quad (\\text{No scattering})",
        latex: "\\Delta\\lambda = 0",
      },
      {
        condition: "\\theta = 90^\\circ \\quad (\\text{Perpendicular})",
        latex:
          "\\Delta\\lambda = \\lambda_c \\approx 2.426 \\times 10^{-12}\\text{ m}",
      },
      {
        condition: "\\theta = 180^\\circ \\quad (\\text{Backscattering})",
        latex:
          "\\Delta\\lambda = 2\\lambda_c \\approx 4.852 \\times 10^{-12}\\text{ m} \\quad (\\text{Max shift})",
      },
    ],
    mcqShortcuts: [
      "Compton shift depends only on the scattering angle $\\theta$, NOT on the incident wavelength or the target material.",
      "Scattered photon energy $E'$ is always less than incident photon energy $E$ ($E' < E \\implies \\lambda' > \\lambda$).",
    ],
  },
  {
    id: "de_broglie_wavelength",
    chapterId: "p2_ch8",
    topic: "Wave-Particle Duality (তরঙ্গ-কণা দ্বৈততা)",
    nameEn: "De Broglie Wavelength",
    nameBn: "ডি ব্রগলি তরঙ্গদৈর্ঘ্য",
    latex:
      "\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m K}} = \\frac{h}{\\sqrt{2 m e V}}",
    variables: [
      {
        symbol: "\\lambda",
        meaning: "De Broglie wavelength of particle",
        unit: "m",
      },
      { symbol: "p", meaning: "Momentum of the particle", unit: "kg·m/s" },
      { symbol: "K", meaning: "Kinetic energy of the particle", unit: "J" },
      {
        symbol: "V",
        meaning: "Accelerating potential difference (for electrons)",
        unit: "V",
      },
    ],
    assumptions: "Every moving particle is associated with a matter wave.",
    specialCases: [
      {
        condition: "\\text{For an electron (non-relativistic)}",
        latex:
          "\\lambda \\approx \\frac{1.227}{\\sqrt{V}} \\text{ nm} = \\sqrt{\\frac{150}{V}} \\text{ \\AA}",
      },
    ],
    mcqShortcuts: [
      "For massive or classical objects, the de Broglie wavelength is extremely small and undetectable.",
      "De Broglie wavelength is inversely proportional to the square root of accelerating potential (${\\lambda \\propto 1/\\sqrt{V}}$).",
      "If kinetic energy of a particle becomes 4 times, its de Broglie wavelength becomes half.",
    ],
  },
  {
    id: "uncertainty_principle",
    chapterId: "p2_ch8",
    topic: "Heisenberg's Uncertainty Principle (অনিশ্চয়তা নীতি)",
    nameEn: "Heisenberg's Uncertainty Principle",
    nameBn: "হাইজেনবার্গের অনিশ্চয়তা নীতি",
    latex:
      "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} = \\frac{\\hbar}{2} \\newline \\Delta E \\cdot \\Delta t \\ge \\frac{h}{4\\pi} \\newline \\text{where } \\hbar = \\frac{h}{2\\pi}",
    variables: [
      {
        symbol: "\\Delta x",
        meaning: "Uncertainty in position measurement",
        unit: "m",
      },
      {
        symbol: "\\Delta p",
        meaning: "Uncertainty in momentum measurement",
        unit: "kg·m/s",
      },
      {
        symbol: "\\Delta E",
        meaning: "Uncertainty in energy of the state",
        unit: "J",
      },
      {
        symbol: "\\Delta t",
        meaning: "Uncertainty in measurement time / lifetime",
        unit: "s",
      },
    ],
    assumptions:
      "Fundamental limit on measuring complementary variables simultaneously due to wave-particle duality.",
    specialCases: [],
    mcqShortcuts: [
      "It is physically impossible to measure both the position and momentum of a subatomic particle with 100% accuracy simultaneously.",
      "If the position of a particle is measured with absolute accuracy ($\\Delta x = 0$), the uncertainty in momentum becomes infinite ($\\Delta p = \\infty$).",
    ],
  },
];
