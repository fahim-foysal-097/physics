export const formulas_p2_ch7 = [
  {
    id: "interference_conditions",
    chapterId: "p2_ch7",
    topic: "Interference of Light (আলোর ব্যতিচার)",
    nameEn: "Phase Difference & Path Difference",
    nameBn: "দশা পার্থক্য ও পথ পার্থক্য",
    latex:
      "\\delta = \\frac{2\\pi}{\\lambda} \\cdot \\Delta x \\newline \\text{Constructive Interference (Bright):} \\newline \\Delta x = n\\lambda, \\quad \\delta = 2n\\pi \\quad (n = 0, 1, 2, \\dots) \\newline \\text{Destructive Interference (Dark):} \\newline \\Delta x = (2n-1)\\frac{\\lambda}{2}, \\quad \\delta = (2n-1)\\pi \\quad (n = 1, 2, \\dots)",
    variables: [
      {
        symbol: "\\delta",
        meaning: "Phase difference between the two waves",
        unit: "Radians",
      },
      {
        symbol: "\\Delta x",
        meaning: "Path difference between the two waves",
        unit: "m",
      },
      {
        symbol: "\\lambda",
        meaning: "Wavelength of the light source",
        unit: "m",
      },
      { symbol: "n", meaning: "Order of interference", unit: "Dimensionless" },
    ],
    assumptions:
      "Coherent light sources of identical frequency and constant phase difference.",
    specialCases: [
      {
        condition: "Phase Difference \\quad \\delta = 0, 2\\pi, 4\\pi \\dots",
        latex: "\\text{Constructive - Waves reinforce, maximum brightness}",
      },
      {
        condition:
          "Phase Difference \\quad \\delta = \\pi, 3\\pi, 5\\pi \\dots",
        latex: "\\text{Destructive - Waves cancel, complete darkness}",
      },
    ],
    hasVisualization: true,
    vizType: "youngs_double_slit_sim",
    mcqShortcuts: [
      "Path difference $\\Delta x$ is an integer multiple of wavelength ($n\\lambda$) for bright spots, and an odd multiple of half-wavelength ($(2n-1)\\frac{\\lambda}{2}$) for dark spots.",
      "Phase difference is an even multiple of $\\pi$ for bright spots, and an odd multiple of $\\pi$ for dark spots.",
      "If two coherent waves have a phase difference of $180^\circ$ ($\\pi$), they undergo destructive interference.",
    ],
  },
  {
    id: "youngs_double_slit",
    chapterId: "p2_ch7",
    topic: "Interference of Light (আলোর ব্যতিচার)",
    nameEn: "Young's Double Slit Interference",
    nameBn: "ইয়ং-এর দ্বি-চির পরীক্ষা",
    latex:
      "x_n = \\frac{n\\lambda D}{d} \\quad (\\text{Bright Fringes}) \\newline x_n = (2n-1)\\frac{\\lambda D}{2d} \\quad (\\text{Dark Fringes}) \\newline \\beta = \\frac{\\lambda D}{d} \\quad (\\text{Fringe Width})",
    variables: [
      {
        symbol: "x_n",
        meaning: "Distance of the n-th fringe from the central maximum",
        unit: "m",
      },
      {
        symbol: "\\lambda",
        meaning: "Wavelength of the monochromatic light",
        unit: "m",
      },
      {
        symbol: "d",
        meaning: "Separation between the two coherent slits",
        unit: "m",
      },
      {
        symbol: "D",
        meaning: "Distance from the slits to the screen",
        unit: "m",
      },
      {
        symbol: "\\beta",
        meaning:
          "Fringe width (distance between two consecutive bright or dark fringes)",
        unit: "m",
      },
    ],
    assumptions:
      "Small angle approximation ($\\sin\\theta \\approx \\tan\\theta \\approx x/D$, which is valid since $d \\ll D$).",
    specialCases: [
      {
        condition:
          "Fringe spacing (distance from bright to adjacent dark fringe)",
        latex: "\\beta' = \\frac{\\beta}{2} = \\frac{\\lambda D}{2d}",
      },
    ],
    hasVisualization: true,
    vizType: "youngs_double_slit_sim",
    mcqShortcuts: [
      "Fringe width is directly proportional to wavelength and screen distance, and inversely proportional to slit width: $\\beta \\propto \\lambda, \\beta \\propto D, \\beta \\propto \\frac{1}{d}$.",
      "If the slit separation $d$ is halved and the screen distance $D$ is doubled, the fringe width becomes 4 times ($2 \\times 2 = 4$).",
      "If the whole YDSE apparatus is immersed in water ($\\mu_w = 4/3$), the fringe width decreases to $\\beta_{water} = \\frac{\\beta_{air}}{\\mu_w} = 0.75 \\beta_{air}$ because wavelength decreases in water.",
    ],
  },
  {
    id: "single_slit_diffraction",
    chapterId: "p2_ch7",
    topic: "Diffraction of Light (আলোর অপবর্তন)",
    nameEn: "Single Slit Diffraction",
    nameBn: "একক চিরের অপবর্তন",
    latex:
      "a \\sin\\theta = n\\lambda \\quad (\\text{Condition for Minima / Dark bands}) \\newline a \\sin\\theta = (2n+1)\\frac{\\lambda}{2} \\quad (\\text{Condition for Maxima / Bright bands}) \\newline w_c = \\frac{2\\lambda D}{a} \\quad (\\text{Central Maximum Width})",
    variables: [
      { symbol: "a", meaning: "Width of the single slit", unit: "m" },
      { symbol: "\\theta", meaning: "Angle of diffraction", unit: "Degrees" },
      {
        symbol: "\\lambda",
        meaning: "Wavelength of incident light",
        unit: "m",
      },
      {
        symbol: "n",
        meaning: "Order of diffraction minimum or maximum (1, 2, 3...)",
        unit: "Dimensionless",
      },
      {
        symbol: "w_c",
        meaning: "Linear width of the central bright peak on screen",
        unit: "m",
      },
      {
        symbol: "D",
        meaning: "Distance from the slit to the screen",
        unit: "m",
      },
    ],
    assumptions:
      "Fraunhofer diffraction, parallel light rays (wavefront is plane when hitting the slit).",
    specialCases: [
      {
        condition: "Highly pronounced diffraction (a \\approx \\lambda)",
        latex:
          "\\sin\\theta \\approx 1 \\implies \\text{Light spreads almost } 90^\\circ",
      },
      {
        condition: "Ray optics approximation (a \\gg \\lambda)",
        latex:
          "\\sin\\theta \\approx 0 \\implies \\text{Diffraction is negligible, straight propagation}",
      },
    ],
    hasVisualization: true,
    vizType: "single_slit_diffraction_sim",
    mcqShortcuts: [
      "Crucial Board Warning: The formula for MINIMA in single slit diffraction ($a \\sin\\theta = n\\lambda$) has the same form as the formula for BRIGHT fringes in double slit interference. Do not get confused!",
      "The width of the central maximum in single slit diffraction is exactly twice the width of any secondary maximum: $w_c = 2 \\beta$.",
      "As the slit width $a$ is made narrower (decreases), the diffraction pattern spreads out wider on the screen ($w_c$ increases) but becomes less intense.",
    ],
  },
  {
    id: "huygens_principle",
    chapterId: "p2_ch7",
    topic: "Diffraction of Light (আলোর অপবর্তন)",
    nameEn: "Huygens' Principle & Wavefronts",
    nameBn: "হাইগেনসের নীতি ও তরঙ্গমুখ",
    latex: "v = c/\\mu \\newline x = v t",
    variables: [
      {
        symbol: "v",
        meaning: "Velocity of wavefront propagation in medium",
        unit: "m/s",
      },
      { symbol: "c", meaning: "Speed of light in vacuum", unit: "3 × 10⁸ m/s" },
      {
        symbol: "t",
        meaning: "Time elapsed for wavelets to expand",
        unit: "s",
      },
    ],
    assumptions:
      "Every point on a wavefront acts as a source of secondary spherical wavelets.",
    specialCases: [],
    hasVisualization: true,
    vizType: "wavefront_huygens",
    mcqShortcuts: [
      "A wavefront is the locus of all points in a medium vibrating in the same phase.",
      "The rays of light are always perpendicular to the wavefront ($90^\circ$ angle).",
      "For a point source of light, wavefronts are spherical. For a line source, wavefronts are cylindrical. For light coming from infinity, wavefronts are plane wavefronts.",
    ],
  },
  {
    id: "diffraction_grating",
    chapterId: "p2_ch7",
    topic: "Diffraction of Light (আলোর অপবর্তন)",
    nameEn: "Diffraction Grating",
    nameBn: "অপবর্তন গ্রেটিং",
    latex: "d \\sin\\theta = n\\lambda \\newline d = \\frac{1}{N} = a + b",
    variables: [
      {
        symbol: "d",
        meaning: "Grating element (distance between two consecutive slits)",
        unit: "m",
      },
      {
        symbol: "N",
        meaning: "Number of rulings/lines per unit length of the grating",
        unit: "Lines/meter or Lines/cm",
      },
      {
        symbol: "\\theta",
        meaning: "Angle of diffraction for principal maximum",
        unit: "Degrees",
      },
      {
        symbol: "n",
        meaning: "Order of principal maximum (0, 1, 2...)",
        unit: "Dimensionless",
      },
      { symbol: "a", meaning: "Width of clear transparent slit", unit: "m" },
      { symbol: "b", meaning: "Width of opaque ruled line", unit: "m" },
    ],
    assumptions:
      "Fraunhofer diffraction by multiple identical, parallel slits in contact.",
    specialCases: [
      {
        condition: "Maximum Order of Spectrum (\\sin\\theta \\le 1)",
        latex:
          "n_{max} \\le \\frac{d}{\\lambda} \\quad (\\text{Must be rounded down to nearest integer})",
      },
    ],
    hasVisualization: true,
    vizType: "diffraction_grating_sim",
    mcqShortcuts: [
      "If grating rulings are given as $6000\\text{ lines/cm}$, the grating element $d$ is $\\frac{1}{6000}\\text{ cm} = 1.67 \\times 10^{-4}\\text{ cm} = 1.67 \\times 10^{-6}\\text{ m}$. Convert to meters carefully!",
      "If white light is used in a grating, the central maximum ($n=0$) is white. The higher order maxima show a continuous spectrum with violet having the minimum deviation (closest to center) and red having the maximum deviation (furthest).",
    ],
  },
  {
    id: "brewsters_law",
    chapterId: "p2_ch7",
    topic: "Polarization of Light (আলোর সমবর্তন)",
    nameEn: "Brewster's Law & Refraction Polarization",
    nameBn: "ব্রুস্টারের সমবর্তন সূত্র ও প্রতিসরণ",
    latex: "\\mu = \\tan i_p \\newline i_p + r_p = 90^\\circ",
    variables: [
      {
        symbol: "\\mu",
        meaning: "Refractive index of the reflecting medium",
        unit: "Dimensionless",
      },
      {
        symbol: "i_p",
        meaning: "Polarizing angle (Brewster's angle)",
        unit: "Degrees",
      },
      {
        symbol: "r_p",
        meaning: "Refraction angle at the polarizing state",
        unit: "Degrees",
      },
    ],
    assumptions:
      "Unpolarized light hits a transparent dielectric medium boundary.",
    specialCases: [
      {
        condition: "Incident angle i = i_p",
        latex:
          "\\text{Reflected ray and refracted ray are exactly perpendicular (90}^\\circ\\text{)}",
      },
    ],
    hasVisualization: true,
    vizType: "polarization_malus_sim",
    mcqShortcuts: [
      "At Brewster's angle, the reflected light is 100% linearly polarized parallel to the boundary. The refracted light is only partially polarized.",
      "Brewster's angle for glass ($\\mu=1.5$) is $56.3^\circ$ and for water ($\\mu=1.33$) is $53.1^\circ$. Highly repeated board questions!",
      "Polarization is the only wave phenomenon that can be exhibited by transverse waves (like electromagnetic waves) but NOT longitudinal waves (like sound waves).",
    ],
  },
  {
    id: "em_wave_poynting",
    chapterId: "p2_ch7",
    topic: "Electromagnetic Wave (তড়িৎচৌম্বক তরঙ্গ)",
    nameEn: "EM Wave Poynting Vector & Intensity",
    nameBn: "পয়েন্টিং ভেক্টর ও আলোর তীব্রতা",
    latex:
      "\\vec{S} = \\frac{1}{\\mu_0} (\\vec{E} \\times \\vec{B}) \\newline I = \\langle S \\rangle = \\frac{1}{2} c \\epsilon_0 E_0^2 = \\frac{E_0 B_0}{2\\mu_0} \\newline c = \\frac{E_0}{B_0} = \\frac{1}{\\sqrt{\\mu_0 \\epsilon_0}}",
    variables: [
      {
        symbol: "\\vec{S}",
        meaning: "Poynting vector (energy flow per unit area per unit time)",
        unit: "W/m²",
      },
      {
        symbol: "I",
        meaning: "Average intensity of electromagnetic wave",
        unit: "W/m²",
      },
      {
        symbol: "\\vec{E}, \\vec{B}",
        meaning: "Electric and Magnetic field vectors",
        unit: "V/m, T",
      },
      {
        symbol: "E_0, B_0",
        meaning: "Amplitudes of electric and magnetic fields",
        unit: "V/m, T",
      },
      {
        symbol: "\\epsilon_0",
        meaning: "Permittivity of free space (8.854 × 10⁻¹²)",
        unit: "C²/N·m²",
      },
      {
        symbol: "\\mu_0",
        meaning: "Permeability of free space (4π × 10⁻⁷)",
        unit: "T·m/A",
      },
      { symbol: "c", meaning: "Speed of light in vacuum", unit: "m/s" },
    ],
    assumptions: "Plane harmonic electromagnetic wave in vacuum.",
    specialCases: [],
    hasVisualization: true,
    vizType: "em_wave_poynting",
    mcqShortcuts: [
      "The Poynting vector $\\vec{S}$ points in the direction of energy propagation of the EM wave, which is the same as the direction of propagation of the wave ($\\vec{E} \\times \\vec{B}$).",
      "In an EM wave, the electric field energy density and magnetic field energy density are exactly equal, although they vibrate in perpendicular planes.",
      "The ratio of electric field amplitude to magnetic field amplitude is always equal to the speed of light: $\\frac{E_0}{B_0} = c$.",
    ],
  },
  {
    id: "malus_law",
    chapterId: "p2_ch7",
    topic: "Polarization of Light (আলোর সমবর্তন)",
    nameEn: "Malus's Law of Polarization",
    nameBn: "মালুসের সমবর্তন সূত্র",
    latex: "I = I_0 \\cos^2 \\theta",
    variables: [
      {
        symbol: "I",
        meaning: "Intensity of transmitted light leaving the analyzer",
        unit: "W/m²",
      },
      {
        symbol: "I_0",
        meaning: "Intensity of polarized light entering the analyzer",
        unit: "W/m²",
      },
      {
        symbol: "\\theta",
        meaning:
          "Angle between the transmission axes of the polarizer and analyzer",
        unit: "Degrees",
      },
    ],
    assumptions:
      "Light incident on the analyzer is already completely linearly polarized.",
    specialCases: [
      {
        condition:
          "Parallel Polarizers (\\theta = 0^\\circ \\text{ or } 180^\\circ)",
        latex: "I = I_0 \\quad (\\text{Maximum transmission})",
      },
      {
        condition:
          "Crossed Polarizers (\\theta = 90^\\circ \\text{ or } 270^\\circ)",
        latex: "I = 0 \\quad (\\text{Complete extinction / No light})",
      },
    ],
    hasVisualization: true,
    vizType: "polarization_malus_sim",
    mcqShortcuts: [
      "If unpolarized light of intensity $I_{in}$ is incident on a polarizer-analyzer pair, the intensity after the polarizer is $I_0 = I_{in}/2$. Then, passing through the analyzer, it becomes $I = \\frac{I_{in}}{2} \\cos^2 \\theta$. Highly repeated math MCQ!",
      "If the angle $\\theta$ is $45^\circ$, the transmitted intensity is $I = I_0 / 2$ (50% of polarized light is transmitted).",
      "If $\\theta$ is $60^\circ$, transmitted intensity is $I = I_0 \\cos^2 60^\circ = I_0 / 4$ (25% of polarized light).",
    ],
  },
];
