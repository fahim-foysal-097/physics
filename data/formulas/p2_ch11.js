export const formulas_p2_ch11 = [
  {
    id: "p2_ch11_hubbles_law",
    chapterId: "p2_ch11",
    topic: "Cosmology",
    nameEn: "Hubble's law",
    nameBn: "হাবলের সূত্র",
    latex: "v = H_0 d",
    variables: [
      {
        symbol: "v",
        meaning: "Recession velocity of galaxy",
        unit: "km\\,s^{-1}",
      },
      {
        symbol: "H_0",
        meaning: "Hubble constant",
        unit: "km\\,s^{-1}\\,Mpc^{-1}",
      },
      {
        symbol: "d",
        meaning: "Proper distance to galaxy",
        unit: "Mpc \\text{ (Megaparsecs)}",
      },
    ],
    assumptions:
      "Homogeneous and isotropic expanding universe on large cosmological scales.",
    mcqShortcuts: [
      "Hubble's law shows that the universe is expanding; more distant galaxies recede faster.",
      "Slope of velocity vs distance graph is the Hubble constant H_0.",
      "Cosmic Age estimate (Hubble Time): T \\approx 1 / H_0. (Converting Mpc to km yields ~13.7 billion years).",
      "1 Megaparsec (Mpc) = 3.26 million light-years = 3.086 * 10^22 meters.",
    ],
    specialCases: [
      {
        condition: "Local Group (gravity bound)",
        latex: "v \\approx \\text{variable (Hubble law invalid)}",
      },
    ],
    hasVisualization: true,
    vizType: "hubbles_law",
  },
  {
    id: "p2_ch11_redshift",
    chapterId: "p2_ch11",
    topic: "Cosmology",
    nameEn: "Cosmological redshift",
    nameBn: "লোহিত বিচ্যুতি",
    latex:
      "z = \\frac{\\Delta \\lambda}{\\lambda_0} = \\frac{\\lambda_{obs} - \\lambda_0}{\\lambda_0} \\approx \\frac{v}{c}",
    variables: [
      { symbol: "z", meaning: "Redshift parameter", unit: "" },
      { symbol: "\\Delta \\lambda", meaning: "Wavelength shift", unit: "m" },
      {
        symbol: "\\lambda_0",
        meaning: "Rest wavelength emitted by source",
        unit: "m",
      },
      { symbol: "\\lambda_{obs}", meaning: "Observed wavelength", unit: "m" },
      { symbol: "v", meaning: "Recession velocity", unit: "m\\,s^{-1}" },
      { symbol: "c", meaning: "Speed of light", unit: "m\\,s^{-1}" },
    ],
    assumptions: "Non-relativistic motion (v << c) of cosmological sources.",
    mcqShortcuts: [
      "z > 0 indicates redshift (object moving away, universe expanding).",
      "z < 0 indicates blueshift (object moving towards observer).",
      "Relativistic Redshift (for high speeds near c): 1 + z = \\sqrt{\\frac{1 + v/c}{1 - v/c}}.",
    ],
    specialCases: [
      {
        condition: "Extremely high velocities (v \\to c)",
        latex: "z = \\sqrt{\\frac{c+v}{c-v}} - 1",
      },
    ],
    hasVisualization: false,
  },
  {
    id: "p2_ch11_kepler_third",
    chapterId: "p2_ch11",
    topic: "Celestial Mechanics",
    nameEn: "Kepler's third law",
    nameBn: "কেপলারের ৩য় সূত্র (আবর্তনকাল সূত্র)",
    latex: "T^2 = \\left(\\frac{4\\pi^2}{G M}\\right) r^3",
    variables: [
      { symbol: "T", meaning: "Orbital period of planet/satellite", unit: "s" },
      {
        symbol: "G",
        meaning: "Universal gravitational constant",
        unit: "N\\,m^2\\,kg^{-2}",
      },
      {
        symbol: "M",
        meaning: "Mass of the central stellar body (star/planet)",
        unit: "kg",
      },
      { symbol: "r", meaning: "Semi-major axis / orbit radius", unit: "m" },
    ],
    assumptions:
      "Circular or elliptical orbit of a light planet around a highly massive stationary star.",
    mcqShortcuts: [
      "Period squared is proportional to radius cubed (T^2 \\propto r^3).",
      "Kepler's Second Law: Equal areas in equal times, implying conservation of angular momentum (planets move faster when closer to the star).",
      "The constant of proportionality depends only on the mass of the central attracting body, not the orbiting body.",
    ],
    specialCases: [
      {
        condition: "Earth orbiting Sun",
        latex: "\\frac{T^2}{r^3} = \\text{constant}",
      },
    ],
    hasVisualization: false,
  },
  {
    id: "p2_ch11_schwarzschild_radius",
    chapterId: "p2_ch11",
    topic: "Astrophysics",
    nameEn: "Schwarzschild radius",
    nameBn: "সোয়ার্জশিল্ড ব্যাসার্ধ (ব্ল্যাক হোল)",
    latex: "R_s = \\frac{2 G M}{c^2}",
    variables: [
      {
        symbol: "R_s",
        meaning: "Schwarzschild radius (Event Horizon)",
        unit: "m",
      },
      {
        symbol: "G",
        meaning: "Universal gravitational constant",
        unit: "N\\,m^2\\,kg^{-2}",
      },
      { symbol: "M", meaning: "Mass of the collapsing body", unit: "kg" },
      { symbol: "c", meaning: "Speed of light", unit: "m\\,s^{-1}" },
    ],
    assumptions:
      "Non-rotating, spherically symmetric black hole (Schwarzschild metric).",
    mcqShortcuts: [
      "Any mass compressed within its Schwarzschild radius becomes a black hole.",
      "Schwarzschild radius is directly proportional to its mass (R_s \\propto M).",
      "Event Horizon represents the boundary from which even light cannot escape.",
      "The Schwarzschild radius of our Sun is about 3 km; of Earth, about 9 mm.",
    ],
    specialCases: [
      {
        condition: "Mass of Sun (M = 2 \\times 10^{30} \\text{ kg})",
        latex: "R_s \\approx 3000\\text{ m } (3\\text{ km})",
      },
    ],
    hasVisualization: true,
    vizType: "black_hole_gravity",
  },
  {
    id: "p2_ch11_critical_density",
    chapterId: "p2_ch11",
    topic: "Cosmology",
    nameEn: "Critical density of universe",
    nameBn: "মহাবিশ্বের ক্রান্তি ঘনত্ব",
    latex: "\\rho_c = \\frac{3 H_0^2}{8\\pi G}",
    variables: [
      {
        symbol: "\\rho_c",
        meaning: "Critical mass density",
        unit: "kg\\,m^{-3}",
      },
      {
        symbol: "H_0",
        meaning: "Hubble constant (in SI units: s^{-1})",
        unit: "s^{-1}",
      },
      {
        symbol: "G",
        meaning: "Universal gravitational constant",
        unit: "N\\,m^2\\,kg^{-2}",
      },
    ],
    assumptions: "Flat FLRW universe with zero cosmological constant.",
    mcqShortcuts: [
      "Density Parameter: \\Omega = \\rho / \\rho_c.",
      "If \\Omega = 1: Flat universe (infinite, expansion slows to a stop asymptotically).",
      "If \\Omega > 1: Closed universe (finite, eventually collapses back in a Big Crunch).",
      "If \\Omega < 1: Open universe (infinite, expands forever).",
    ],
    specialCases: [
      {
        condition: "\\Omega = 1\\; (Flat\\; Universe)",
        latex: "\\rho = \\rho_c",
      },
    ],
    hasVisualization: false,
  },
  {
    id: "p2_ch11_luminosity_distance",
    chapterId: "p2_ch11",
    topic: "Astrophysics",
    nameEn: "Luminosity-distance relation",
    nameBn: "উজ্জ্বলতা ও দূরত্বের সম্পর্ক",
    latex: "b = \\frac{L}{4\\pi d^2}",
    variables: [
      {
        symbol: "b",
        meaning: "Apparent brightness (flux received)",
        unit: "W\\,m^{-2}",
      },
      {
        symbol: "L",
        meaning: "Intrinsic luminosity (absolute power emitted)",
        unit: "W",
      },
      { symbol: "d", meaning: "Distance to star", unit: "m" },
    ],
    assumptions: "Light spreads spherically through non-absorbing empty space.",
    mcqShortcuts: [
      "Apparent brightness follows the inverse-square law with distance (b \\propto 1/d^2).",
      "Standard candles (e.g. Cepheid variables or Type Ia Supernovae) are objects of known luminosity L, allowing distances to be calculated using d = \\sqrt{L / (4\\pi b)}.",
    ],
    specialCases: [
      { condition: "Doubled distance (d' = 2d)", latex: "b' = \\frac{b}{4}" },
    ],
    hasVisualization: false,
  },
  {
    id: "p2_ch11_wiens_law",
    chapterId: "p2_ch11",
    topic: "Astrophysics",
    nameEn: "Wien's displacement law",
    nameBn: "ভীনের সরণ সূত্র",
    latex: "\\lambda_{max} T = b_{Wien}",
    variables: [
      {
        symbol: "\\lambda_{max}",
        meaning: "Wavelength of peak radiation intensity",
        unit: "m",
      },
      { symbol: "T", meaning: "Absolute temperature of blackbody", unit: "K" },
      {
        symbol: "b_{Wien}",
        meaning: "Wien's constant (\\approx 2.898 \\times 10^{-3})",
        unit: "m\\,K",
      },
    ],
    assumptions: "Star radiates as an ideal blackbody.",
    mcqShortcuts: [
      "Peak wavelength is inversely proportional to temperature (\\lambda_{max} \\propto 1/T).",
      "Hotter stars emit peak radiation at shorter wavelengths (look blue/violet); cooler stars emit peak radiation at longer wavelengths (look red).",
      "Used to estimate the surface temperature of distant stars.",
    ],
    specialCases: [
      {
        condition: "T \\uparrow",
        latex: "\\lambda_{max} \\downarrow\\; (Shift\\; to\\; blue)",
      },
    ],
    hasVisualization: false,
  },
  {
    id: "p2_ch11_satellite_velocity",
    chapterId: "p2_ch11",
    topic: "Satellite Mechanics",
    nameEn: "Satellite orbital velocity",
    nameBn: "উপগ্রহের কক্ষপথীয় বেগ",
    latex: "v_o = \\sqrt{\\frac{G M}{R + h}} = \\sqrt{g \\frac{R^2}{R + h}}",
    variables: [
      {
        symbol: "v_o",
        meaning: "Orbital velocity of satellite",
        unit: "m\\,s^{-1}",
      },
      {
        symbol: "G",
        meaning: "Universal gravitational constant",
        unit: "N\\,m^2\\,kg^{-2}",
      },
      {
        symbol: "M",
        meaning: "Mass of the Earth (or central planet)",
        unit: "kg",
      },
      {
        symbol: "R",
        meaning: "Radius of the Earth (or central planet)",
        unit: "m",
      },
      {
        symbol: "h",
        meaning: "Height of satellite above planet surface",
        unit: "m",
      },
      {
        symbol: "g",
        meaning: "Acceleration due to gravity at surface",
        unit: "m\\,s^{-2}",
      },
    ],
    assumptions: "Circular satellite orbit around a uniform spherical planet.",
    mcqShortcuts: [
      "Orbital velocity is independent of the mass of the satellite itself.",
      "As altitude h increases, orbital velocity decreases (v_o \\propto 1/\\sqrt{R+h}).",
      "For a satellite orbiting very close to Earth's surface (h \\approx 0), v_o = \\sqrt{g R} \\approx 7.91 \\text{ km/s}.",
    ],
    specialCases: [
      { condition: "Close orbit (h \\approx 0)", latex: "v_o = \\sqrt{g R}" },
    ],
    hasVisualization: false,
  },
  {
    id: "p2_ch11_satellite_escape",
    chapterId: "p2_ch11",
    topic: "Satellite Mechanics",
    nameEn: "Escape velocity",
    nameBn: "মুক্তিবেগ",
    latex: "v_e = \\sqrt{\\frac{2 G M}{R}} = \\sqrt{2 g R}",
    variables: [
      {
        symbol: "v_e",
        meaning: "Escape velocity from surface",
        unit: "m\\,s^{-1}",
      },
      {
        symbol: "G",
        meaning: "Universal gravitational constant",
        unit: "N\\,m^2\\,kg^{-2}",
      },
      { symbol: "M", meaning: "Mass of the planet", unit: "kg" },
      { symbol: "R", meaning: "Radius of the planet", unit: "m" },
      {
        symbol: "g",
        meaning: "Acceleration due to gravity at surface",
        unit: "m\\,s^{-2}",
      },
    ],
    assumptions:
      "Projectile launched from planet surface ignoring air resistance.",
    mcqShortcuts: [
      "Escape velocity is exactly \\sqrt{2} times (141.4%) the near-surface orbital velocity: v_e = \\sqrt{2} v_o.",
      "Escape velocity of Earth is 11.2 km/s; of Moon is 2.38 km/s; of Sun is 617.5 km/s.",
      "Escape velocity is independent of launch angle and mass of projectile.",
    ],
    specialCases: [
      { condition: "Earth surface", latex: "v_e \\approx 11.2\\text{ km/s}" },
    ],
    hasVisualization: false,
  },
  {
    id: "p2_ch11_satellite_period",
    chapterId: "p2_ch11",
    topic: "Satellite Mechanics",
    nameEn: "Satellite orbital period",
    nameBn: "উপগ্রহের আবর্তনকাল",
    latex:
      "T = 2\\pi \\sqrt{\\frac{(R + h)^3}{G M}} = \\frac{2\\pi (R + h)}{v_o}",
    variables: [
      { symbol: "T", meaning: "Orbital period of satellite", unit: "s" },
      { symbol: "R", meaning: "Radius of the Earth/planet", unit: "m" },
      { symbol: "h", meaning: "Height of satellite above surface", unit: "m" },
      {
        symbol: "G",
        meaning: "Universal gravitational constant",
        unit: "N\\,m^2\\,kg^{-2}",
      },
      { symbol: "M", meaning: "Mass of the Earth/planet", unit: "kg" },
      { symbol: "v_o", meaning: "Orbital velocity", unit: "m\\,s^{-1}" },
    ],
    assumptions: "Stable circular orbit in vacuum.",
    mcqShortcuts: [
      "Orbital period squared is proportional to orbital radius cubed (T^2 \\propto r^3), matching Kepler's Third Law.",
      "Geostationary Satellite: (1) Orbital period is exactly 24 hours, (2) Orbits in the equatorial plane from West to East, (3) Appears static relative to Earth. Height above surface h \\approx 36,000 km.",
    ],
    specialCases: [
      {
        condition: "Geostationary orbit (T = 24h)",
        latex: "h \\approx 3.6 \\times 10^7\\text{ m } (36000\\text{ km})",
      },
    ],
    hasVisualization: false,
  },
];
