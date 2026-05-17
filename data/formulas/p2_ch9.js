export const formulas_p2_ch9 = [
  {
    id: "bohr_angular_momentum",
    chapterId: "p2_ch9",
    topic: "Bohr Model (বোর পরমাণু মডেল)",
    nameEn: "Bohr Angular Momentum Quantization",
    nameBn: "বোর কৌণিক ভরবেগ কোয়ান্টায়ন",
    latex:
      "L = m v r = \\frac{n h}{2\\pi} = n \\hbar \\newline \\text{where } \\hbar = \\frac{h}{2\\pi} \\approx 1.054 \\times 10^{-34} \\text{ J·s}",
    variables: [
      {
        symbol: "L",
        meaning: "Angular momentum of orbiting electron",
        unit: "kg·m²/s or J·s",
      },
      { symbol: "m", meaning: "Mass of electron (9.1 × 10⁻³¹)", unit: "kg" },
      { symbol: "v", meaning: "Linear velocity of electron", unit: "m/s" },
      { symbol: "r", meaning: "Radius of the orbit", unit: "m" },
      {
        symbol: "n",
        meaning: "Principal quantum number (orbit number = 1, 2, 3...)",
        unit: "Dimensionless",
      },
      { symbol: "h", meaning: "Planck's constant", unit: "J·s" },
    ],
    assumptions:
      "Electrons revolve only in certain non-radiating, stable circular orbits.",
    specialCases: [
      {
        condition: "n = 1 \\quad (\\text{Ground state})",
        latex:
          "L_1 = \\frac{h}{2\\pi} \\approx 1.054 \\times 10^{-34} \\text{ J·s}",
      },
      {
        condition: "n = 2",
        latex:
          "L_2 = \\frac{h}{\\pi} \\approx 2.109 \\times 10^{-34} \\text{ J·s}",
      },
    ],
    hasVisualization: true,
    vizType: "bohr_atom",
    mcqShortcuts: [
      "Angular momentum is quantized in integral multiples of $h/2\\pi$. No intermediate values are allowed.",
      "The change in angular momentum when jumping from orbit $n_1$ to $n_2$ is $\\Delta L = (n_2 - n_1)\\frac{h}{2\\pi}$.",
    ],
  },
  {
    id: "bohr_orbit_radius",
    chapterId: "p2_ch9",
    topic: "Bohr Model (বোর পরমাণু মডেল)",
    nameEn: "Bohr Orbit Radius",
    nameBn: "বোর কক্ষপথের ব্যাসার্ধ",
    latex:
      "r_n = \\frac{\\epsilon_0 n^2 h^2}{\\pi m e^2} Z^{-1} = r_1 n^2 \\newline r_1 = 0.529 \\times 10^{-10} \\text{ m} = 0.529 \\text{ \\AA}",
    variables: [
      { symbol: "r_n", meaning: "Radius of the n-th Bohr orbit", unit: "m" },
      {
        symbol: "r_1",
        meaning: "First Bohr radius (radius of H-atom ground state)",
        unit: "m",
      },
      {
        symbol: "\\epsilon_0",
        meaning: "Permittivity of free space",
        unit: "8.854 × 10⁻¹² C²/N·m²",
      },
      { symbol: "e", meaning: "Charge of electron (1.6 × 10⁻¹⁹)", unit: "C" },
      {
        symbol: "Z",
        meaning: "Atomic number (Z = 1 for Hydrogen)",
        unit: "Dimensionless",
      },
    ],
    assumptions:
      "Circular orbit maintained by electrostatic attraction acting as centripetal force.",
    specialCases: [
      { condition: "n = 2", latex: "r_2 = 4 r_1 \\approx 2.116 \\text{ \\AA}" },
      { condition: "n = 3", latex: "r_3 = 9 r_1 \\approx 4.761 \\text{ \\AA}" },
    ],
    hasVisualization: true,
    vizType: "bohr_atom",
    mcqShortcuts: [
      "Radius of Bohr orbits is directly proportional to the square of principal quantum number ($r_n \\propto n^2$).",
      "Ratio of radii: $r_1 : r_2 : r_3 = 1 : 4 : 9$.",
      "Radius is inversely proportional to mass of orbiting particle ($r \\propto 1/m$).",
    ],
  },
  {
    id: "bohr_energy_levels",
    chapterId: "p2_ch9",
    topic: "Bohr Model (বোর পরমাণু মডেল)",
    nameEn: "Bohr Orbit Energy",
    nameBn: "বোর কক্ষপথের শক্তি",
    latex:
      "E_n = -\\frac{m e^4}{8 \\epsilon_0^2 n^2 h^2} Z^2 = -\\frac{13.6}{n^2} Z^2 \\text{ eV} \\newline E_n = E_1 \\frac{Z^2}{n^2} \\quad \\text{where } E_1 = -13.6 \\text{ eV} = -2.176 \\times 10^{-18} \\text{ J}",
    variables: [
      {
        symbol: "E_n",
        meaning: "Total energy of electron in n-th orbit",
        unit: "eV or J",
      },
      { symbol: "E_1", meaning: "Ground state energy of Hydrogen", unit: "eV" },
    ],
    assumptions:
      "Total energy is the sum of electrostatic potential energy (negative) and orbital kinetic energy (positive).",
    specialCases: [
      { condition: "n = 2", latex: "E_2 = -3.4 \\text{ eV}" },
      { condition: "n = 3", latex: "E_3 = -1.51 \\text{ eV}" },
      { condition: "n = 4", latex: "E_4 = -0.85 \\text{ eV}" },
    ],
    hasVisualization: true,
    vizType: "bohr_atom",
    mcqShortcuts: [
      "Total energy is negative, proving the electron is bound to the nucleus.",
      "Relationship: $E_{total} = -K = \\frac{1}{2}U$ (where K is Kinetic Energy and U is Potential Energy).",
      "Potential energy is double the total energy in magnitude, but negative.",
      "Energy differences decrease as orbit number increases ($E_2-E_1 = 10.2\\text{ eV}$ while $E_3-E_2 = 1.89\\text{ eV}$).",
    ],
  },
  {
    id: "rydberg_formula",
    chapterId: "p2_ch9",
    topic: "Bohr Model (বোর পরমাণু মডেল)",
    nameEn: "Rydberg Spectral Formula",
    nameBn: "রিডবার্গ সমীকরণ",
    latex:
      "\\frac{1}{\\lambda} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right) = \\bar{\\nu} \\newline R_H = \\frac{m e^4}{8 \\epsilon_0^2 c h^3} \\approx 1.09678 \\times 10^7 \\text{ m}^{-1}",
    variables: [
      {
        symbol: "\\lambda",
        meaning: "Wavelength of emitted or absorbed photon",
        unit: "m",
      },
      { symbol: "R_H", meaning: "Rydberg constant for Hydrogen", unit: "m⁻¹" },
      {
        symbol: "\\bar{\\nu}",
        meaning: "Wave number (number of waves per unit length)",
        unit: "m⁻¹",
      },
      {
        symbol: "n_1",
        meaning: "Lower/Final orbit index",
        unit: "Dimensionless",
      },
      {
        symbol: "n_2",
        meaning: "Higher/Initial orbit index",
        unit: "Dimensionless",
      },
    ],
    assumptions:
      "A photon is emitted when an electron falls from a higher energy level $n_2$ to a lower level $n_1$.",
    specialCases: [
      {
        condition: "\\text{Lyman Series (Ultraviolet)}",
        latex: "n_1 = 1, \\quad n_2 = 2, 3, 4\\dots",
      },
      {
        condition: "\\text{Balmer Series (Visible Light)}",
        latex:
          "n_1 = 2, \\quad n_2 = 3 (\\text{Red}), 4 (\\text{Cyan}), 5 (\\text{Blue}), 6 (\\text{Violet})",
      },
      {
        condition: "\\text{Paschen Series (Infrared)}",
        latex: "n_1 = 3, \\quad n_2 = 4, 5, 6\\dots",
      },
    ],
    hasVisualization: true,
    vizType: "bohr_atom",
    mcqShortcuts: [
      "⚠️ **IMPORTANT NOTE FOR HSC:** This formula usually appears heavily in **Chemistry 1st Paper (Chapter 2: Qualitative Chemistry)** as well as Physics.",
      "Maximum wavelength (minimum energy) occurs when transition is from adjacent shell ($n_2 = n_1 + 1$).",
      "Minimum wavelength (limiting wave / maximum energy) occurs when transition is from infinity ($n_2 = \\infty$), giving $\\frac{1}{\\lambda_{min}} = \\frac{R_H}{n_1^2} \\implies \\lambda_{min} = \\frac{n_1^2}{R_H}$.",
    ],
  },
  {
    id: "radioactive_decay_law",
    chapterId: "p2_ch9",
    topic: "Radioactivity (তেজস্ক্রিয়তা)",
    nameEn: "Radioactive Decay Law",
    nameBn: "তেজস্ক্রিয় ক্ষয় সূত্র",
    latex:
      "N = N_0 e^{-\\lambda t} \\newline A = -\\frac{dN}{dt} = \\lambda N \\newline A = A_0 e^{-\\lambda t}",
    variables: [
      {
        symbol: "N",
        meaning: "Number of active/undecayed nuclei at time t",
        unit: "Dimensionless",
      },
      {
        symbol: "N_0",
        meaning: "Initial number of active nuclei (at t = 0)",
        unit: "Dimensionless",
      },
      {
        symbol: "\\lambda",
        meaning: "Decay / Disintegration constant",
        unit: "s⁻¹ or day⁻¹ or year⁻¹",
      },
      {
        symbol: "A",
        meaning: "Activity (rate of disintegration)",
        unit: "Becquerel (Bq) or Curie (Ci)",
      },
      { symbol: "t", meaning: "Time elapsed", unit: "s" },
    ],
    assumptions:
      "The rate of decay is directly proportional to the number of active radioactive nuclei present at that instant.",
    specialCases: [
      {
        condition: "t = \\tau \\quad (\\text{Mean life})",
        latex:
          "N = \\frac{N_0}{e} \\approx 0.368 N_0 \\quad (\\text{36.8% remaining})",
      },
    ],
    hasVisualization: true,
    vizType: "radioactive_decay",
    mcqShortcuts: [
      "Activity of a sample decreases exponentially, identical to the number of remaining nuclei.",
      "Fraction of undecayed nuclei remaining after n half-lives: $\\frac{N}{N_0} = \\left(\\frac{1}{2}\\right)^n = \\left(\\frac{1}{2}\\right)^{t/T_{1/2}}$.",
      "Fraction of decayed nuclei after n half-lives: $1 - \\left(\\frac{1}{2}\\right)^n$.",
    ],
  },
  {
    id: "half_life_mean_life",
    chapterId: "p2_ch9",
    topic: "Radioactivity (তেজস্ক্রিয়তা)",
    nameEn: "Half-Life & Mean Life",
    nameBn: "অর্ধায়ু ও গড় আয়ু",
    latex:
      "T_{1/2} = \\frac{\\ln 2}{\\lambda} \\approx \\frac{0.693}{\\lambda} \\newline \\tau = \\frac{1}{\\lambda} \\newline \\tau = \\frac{T_{1/2}}{\\ln 2} \\approx 1.44 T_{1/2}",
    variables: [
      {
        symbol: "T_{1/2}",
        meaning: "Half-life (time required for half of the nuclei to decay)",
        unit: "s or years",
      },
      {
        symbol: "\\tau",
        meaning: "Mean life / Average life of the sample",
        unit: "s or years",
      },
    ],
    assumptions: "Statistical average for a huge number of radioactive atoms.",
    specialCases: [],
    hasVisualization: true,
    vizType: "radioactive_decay",
    mcqShortcuts: [
      "Mean life is longer than half-life by 44% (${\\tau = 1.44 T_{1/2}}$).",
      "Half-life is independent of the initial mass or quantity of the substance.",
      "1 Curie ($1\\text{ Ci}$) = $3.7 \\times 10^{10}\\text{ disintegrations per second (dps)}$.",
      "1 Rutherford ($1\\text{ Rd}$) = $10^6\\text{ dps}$.",
    ],
  },
  {
    id: "mass_defect_binding_energy",
    chapterId: "p2_ch9",
    topic: "Nuclear Physics (নিউক্লিয়ার পদার্থবিজ্ঞান)",
    nameEn: "Mass Defect & Binding Energy",
    nameBn: "ভর ত্রুটি ও বন্ধন শক্তি",
    latex:
      "\\Delta m = \\left[ Z m_p + (A - Z) m_n \\right] - M_{nucleus} \\newline E_B = \\Delta m \\cdot c^2 \\newline \\text{If } \\Delta m \\text{ is in amu:} \\newline E_B = \\Delta m \\times 931.5 \\text{ MeV} \\newline \\text{Note: } 1 \\text{ amu} \\approx 1.66 \\times 10^{-27} \\text{ kg} = 931.5 \\text{ MeV}",
    variables: [
      {
        symbol: "\\Delta m",
        meaning:
          "Mass defect (difference between nucleons mass and nucleus mass)",
        unit: "amu or kg",
      },
      {
        symbol: "Z",
        meaning: "Atomic number (number of protons)",
        unit: "Dimensionless",
      },
      {
        symbol: "A",
        meaning: "Mass number (total nucleons)",
        unit: "Dimensionless",
      },
      {
        symbol: "m_p",
        meaning: "Mass of a free proton (1.007276 amu)",
        unit: "amu",
      },
      {
        symbol: "m_n",
        meaning: "Mass of a free neutron (1.008665 amu)",
        unit: "amu",
      },
      {
        symbol: "M_{nucleus}",
        meaning: "Actual rest mass of the nucleus",
        unit: "amu",
      },
      {
        symbol: "E_B",
        meaning: "Binding Energy (energy released during nucleus formation)",
        unit: "MeV or J",
      },
    ],
    assumptions:
      "Einstein's mass-energy equivalence explains the missing mass in nucleosynthesis.",
    specialCases: [],
    mcqShortcuts: [
      "To convert mass defect in amu directly into energy in Joules: multiply by $1.492 \\times 10^{-10}\\text{ J}$.",
      "Mass of nucleons is always greater than the mass of the nucleus they form.",
    ],
  },
  {
    id: "mean_binding_energy",
    chapterId: "p2_ch9",
    topic: "Nuclear Physics (নিউক্লিয়ার পদার্থবিজ্ঞান)",
    nameEn: "Mean Binding Energy (Binding Energy per Nucleon)",
    nameBn: "গড় বন্ধন শক্তি (নিউক্লিয়ন প্রতি বন্ধন শক্তি)",
    latex:
      "\\bar{E}_B = \\frac{E_B}{A} = \\frac{\\Delta m \\times 931.5}{A} \\text{ MeV}",
    variables: [
      {
        symbol: "\\bar{E}_B",
        meaning: "Mean binding energy / binding energy per nucleon",
        unit: "MeV/nucleon",
      },
      {
        symbol: "A",
        meaning: "Mass number (number of nucleons in the nucleus)",
        unit: "Dimensionless",
      },
    ],
    assumptions: "Measure of nuclear stability.",
    specialCases: [
      {
        condition: "\\text{Iron (}^{56}\\text{Fe})",
        latex:
          "\\bar{E}_B \\approx 8.8 \\text{ MeV/nucleon} \\quad (\\text{Extremely stable})",
      },
      {
        condition: "\\text{Helium (}^{4}\\text{He})",
        latex:
          "\\bar{E}_B \\approx 7.07 \\text{ MeV/nucleon} \\quad (\\text{Very stable light nucleus})",
      },
      {
        condition: "\\text{Uranium (}^{238}\\text{U})",
        latex:
          "\\bar{E}_B \\approx 7.6 \\text{ MeV/nucleon} \\quad (\\text{Heavy, prone to fission})",
      },
    ],
    mcqShortcuts: [
      "Nuclear stability is determined solely by the **Binding Energy per Nucleon** ($\\bar{E}_B$), NOT total binding energy ($E_B$).",
      "Nuclei with $A$ between 50 and 80 have the highest binding energy per nucleon, making them the most stable in nature.",
      "Very light nuclei ($A < 20$) undergo nuclear fusion, whereas very heavy nuclei ($A > 120$) undergo nuclear fission to increase their stability.",
    ],
  },
];
