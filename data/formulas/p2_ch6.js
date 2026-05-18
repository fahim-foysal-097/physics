export const formulas_p2_ch6 = [
  {
    id: "snells_law",
    chapterId: "p2_ch6",
    topic: "Refraction of Light (আলোর প্রতিসরণ)",
    nameEn: "Snell's Law & Refractive Index",
    nameBn: "সনেলের সূত্র ও প্রতিসরণাঙ্ক",
    latex:
      "_1\\mu_2 = \\frac{\\sin i}{\\sin r} = \\frac{v_1}{v_2} = \\frac{\\lambda_1}{\\lambda_2} = \\frac{\\mu_2}{\\mu_1}",
    variables: [
      {
        symbol: "i",
        meaning: "Angle of incidence in medium 1",
        unit: "Degrees",
      },
      {
        symbol: "r",
        meaning: "Angle of refraction in medium 2",
        unit: "Degrees",
      },
      {
        symbol: "_1\\mu_2",
        meaning: "Refractive index of medium 2 relative to medium 1",
        unit: "Dimensionless",
      },
      {
        symbol: "\\mu_1, \\mu_2",
        meaning: "Absolute refractive indices of medium 1 and 2",
        unit: "Dimensionless",
      },
      {
        symbol: "v_1, v_2",
        meaning: "Velocity of light in medium 1 and 2",
        unit: "m/s",
      },
      {
        symbol: "\\lambda_1, \\lambda_2",
        meaning: "Wavelength of light in medium 1 and 2",
        unit: "m",
      },
    ],
    assumptions:
      "Light passing through a flat boundary between two isotropic, uniform mediums.",
    specialCases: [
      {
        condition: "Normal Incidence (i = 0^\\circ)",
        latex: "r = 0^\\circ \\implies \\text{No bending of light}",
      },
    ],
    hasVisualization: true,
    vizType: "critical_angle_tir",
    mcqShortcuts: [
      "Absolute refractive index of vacuum/air is taken as 1. For any other medium, $\\mu > 1$.",
      "Relative refractive index $_a\\mu_b$ and $_b\\mu_a$ are reciprocals: $_a\\mu_b \\times _b\\mu_a = 1$.",
      "Refractive index depends on temperature: $\\mu$ decreases as temperature rises because density decreases.",
      "Refractive index is inversely proportional to wavelength: $\\mu \\propto \\frac{1}{\\lambda}$ (Cauchy's relation). Hence, $\\mu_v > \\mu_r$ (violet is bent more than red).",
    ],
  },
  {
    id: "critical_angle",
    chapterId: "p2_ch6",
    topic: "Refraction of Light (আলোর প্রতিসরণ)",
    nameEn: "Critical Angle & Total Internal Reflection",
    nameBn: "সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন",
    latex:
      "\\sin \\theta_c = \\frac{\\mu_2}{\\mu_1} = _1\\mu_2 \\quad (\\text{where } \\mu_1 > \\mu_2)",
    variables: [
      {
        symbol: "\\theta_c",
        meaning: "Critical angle of the denser medium",
        unit: "Degrees",
      },
      {
        symbol: "\\mu_1",
        meaning: "Refractive index of the denser medium",
        unit: "Dimensionless",
      },
      {
        symbol: "\\mu_2",
        meaning: "Refractive index of the rarer medium",
        unit: "Dimensionless",
      },
    ],
    assumptions:
      "Light travels from an optically denser medium to an optically rarer medium.",
    specialCases: [
      {
        condition: "Incident Angle \\quad i < \\theta_c",
        latex: "\\text{Ordinary refraction and weak reflection}",
      },
      {
        condition: "Incident Angle \\quad i = \\theta_c",
        latex:
          "r = 90^\\circ \\quad (\\text{Refracted ray grazes the boundary})",
      },
      {
        condition: "Incident Angle \\quad i > \\theta_c",
        latex:
          "\\text{Total Internal Reflection occurs (100% of light is reflected)}",
      },
    ],
    hasVisualization: true,
    vizType: "critical_angle_tir",
    mcqShortcuts: [
      "For a glass-air interface ($\\mu = 1.5$), critical angle $\\theta_c \\approx 41.8^\\circ$.",
      "For a water-air interface ($\\mu = 1.33$), critical angle $\\theta_c \\approx 48.6^\\circ$.",
      "Critical angle is directly proportional to wavelength: $\\sin\\theta_c \\propto \\lambda$. Thus, $\\theta_c(\\text{red}) > \\theta_c(\\text{violet})$. Red light has the largest critical angle.",
      "Total Internal Reflection is the underlying mechanism behind optical fibers, mirages, and the sparkling of diamonds.",
    ],
  },
  {
    id: "prism_deviation",
    chapterId: "p2_ch6",
    topic: "Prism (প্রিজম)",
    nameEn: "Prism Equation & Minimum Deviation",
    nameBn: "প্রিজমে প্রতিসরণ ও ন্যূনতম বিচ্যুতি",
    latex:
      "A = r_1 + r_2 \\newline D = i_1 + i_2 - A \\newline \\mu = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\right)}",
    variables: [
      { symbol: "A", meaning: "Angle of prism", unit: "Degrees" },
      { symbol: "D", meaning: "Angle of deviation", unit: "Degrees" },
      { symbol: "D_m", meaning: "Angle of minimum deviation", unit: "Degrees" },
      {
        symbol: "i_1, i_2",
        meaning: "Angles of incidence and emergence",
        unit: "Degrees",
      },
      {
        symbol: "r_1, r_2",
        meaning: "Angles of refraction inside prism",
        unit: "Degrees",
      },
      {
        symbol: "\\mu",
        meaning: "Refractive index of prism material",
        unit: "Dimensionless",
      },
    ],
    assumptions: "Light passing through a triangular refracting prism.",
    specialCases: [
      {
        condition: "Minimum Deviation (D = D_m)",
        latex: "i_1 = i_2, \\quad r_1 = r_2 = \\frac{A}{2}",
      },
      {
        condition: "Thin Prism (A < 6^\\circ)",
        latex:
          "D \\approx (\\mu - 1)A \\quad (\\text{Deviation is constant for small } i_1)",
      },
    ],
    hasVisualization: true,
    vizType: "prism_ray_tracer",
    mcqShortcuts: [
      "At minimum deviation, the refracted ray inside the prism runs perfectly parallel to the base of the prism.",
      "If a prism of refractive index $\\mu_g$ is immersed in a liquid of refractive index $\\mu_l$, the minimum deviation angle decreases.",
      "Dispersion of light: White light splits into 7 colors because the deviation angle is larger for shorter wavelengths: $D_v > D_r$ since $\\mu_v > \\mu_r$.",
    ],
  },
  {
    id: "light_dispersion",
    chapterId: "p2_ch6",
    topic: "Prism (প্রিজম)",
    nameEn: "Angular Dispersion & Dispersive Power",
    nameBn: "কৌণিক বিচ্ছুরণ ও বিচ্ছুরণ ক্ষমতা",
    latex:
      "\\theta = D_v - D_r = (\\mu_v - \\mu_r)A \\newline \\omega = \\frac{\\theta}{D_y} = \\frac{\\mu_v - \\mu_r}{\\mu_y - 1}",
    variables: [
      {
        symbol: "\\theta",
        meaning: "Angular dispersion between violet and red rays",
        unit: "Radians/Degrees",
      },
      {
        symbol: "\\omega",
        meaning: "Dispersive power of the prism material",
        unit: "Dimensionless",
      },
      {
        symbol: "D_v, D_r, D_y",
        meaning: "Deviations for violet, red, and mean yellow light",
        unit: "Degrees",
      },
      {
        symbol: "\\mu_v, \\mu_r, \\mu_y",
        meaning: "Refractive indices for violet, red, and mean yellow",
        unit: "Dimensionless",
      },
      { symbol: "A", meaning: "Angle of thin prism", unit: "Degrees" },
    ],
    assumptions: "Applicable to thin prisms with small refracting angles.",
    specialCases: [],
    hasVisualization: true,
    vizType: "prism_ray_tracer",
    mcqShortcuts: [
      "Dispersive power $\\omega$ depends solely on the material of the prism, not on its refracting angle $A$.",
      "Crown glass has smaller dispersive power than Flint glass ($\\omega_{crown} < \\omega_{flint}$).",
      "Mean refractive index $\\mu_y$ can be approximated as the average: $\\mu_y = \\frac{\\mu_v + \\mu_r}{2}$.",
    ],
  },
  {
    id: "lens_makers_formula",
    chapterId: "p2_ch6",
    topic: "Thin Lenses (সরু লেন্স)",
    nameEn: "Lens Maker's Formula & Combinations",
    nameBn: "লেন্স প্রস্তুতকারকের সমীকরণ ও সংযোগ",
    latex:
      "\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\right) \\newline P = \\frac{1}{f \\text{ (m)}} \\newline \\frac{1}{f_{eq}} = \\frac{1}{f_1} + \\frac{1}{f_2} \\implies P_{eq} = P_1 + P_2",
    variables: [
      { symbol: "f", meaning: "Focal length of the lens", unit: "m" },
      {
        symbol: "\\mu",
        meaning: "Refractive index of lens relative to surrounding medium",
        unit: "Dimensionless",
      },
      {
        symbol: "R_1, R_2",
        meaning: "Radii of curvature of first and second refracting surfaces",
        unit: "m",
      },
      { symbol: "P", meaning: "Power of the lens", unit: "Dioptre (D)" },
      {
        symbol: "f_{eq}",
        meaning: "Equivalent focal length of thin lenses in contact",
        unit: "m",
      },
    ],
    assumptions: "Thin lenses in contact, paraxial approximation.",
    specialCases: [
      {
        condition: "Equi-convex Lens (R_1 = R, R_2 = -R)",
        latex: "\\frac{1}{f} = \\frac{2(\\mu - 1)}{R}",
      },
      {
        condition: "Plano-convex Lens (R_1 = R, R_2 = \\infty)",
        latex: "\\frac{1}{f} = \\frac{\\mu - 1}{R}",
      },
      {
        condition: "Immersed in same medium (\\mu_{lens} = \\mu_{medium})",
        latex:
          "f = \\infty, \\quad P = 0 \\quad (\\text{Lens becomes invisible})",
      },
    ],
    hasVisualization: true,
    vizType: "thin_lens_ray_tracer",
    mcqShortcuts: [
      "Sign convention: $R$ is positive if the center of curvature is on the right side, negative if on the left side.",
      "If a glass lens ($\\mu_g = 1.5$) is placed in water ($\\mu_w = 1.33$), its focal length increases by approximately 4 times: $f_{water} \\approx 4 f_{air}$, and its power reduces to 1/4th.",
      "If a lens is cut vertically into two symmetric halves along its diameter, the focal length of each half becomes $2f$, and power becomes $P/2$.",
    ],
  },
  {
    id: "thin_lens_equation",
    chapterId: "p2_ch6",
    topic: "Thin Lenses (সরু লেন্স)",
    nameEn: "Thin Lens Equation & Magnification",
    nameBn: "সরু লেন্সের সমীকরণ ও বিবর্ধন",
    latex:
      "\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v} \\newline m = -\\frac{v}{u}",
    variables: [
      {
        symbol: "u",
        meaning: "Object distance (always positive for real objects)",
        unit: "m",
      },
      {
        symbol: "v",
        meaning: "Image distance (positive for real, negative for virtual)",
        unit: "m",
      },
      {
        symbol: "f",
        meaning: "Focal length (positive for Convex, negative for Concave)",
        unit: "m",
      },
      { symbol: "m", meaning: "Linear magnification", unit: "Dimensionless" },
    ],
    assumptions: "Real-is-Positive sign convention.",
    specialCases: [
      {
        condition: "Object at focus (u = f)",
        latex: "v = \\infty \\implies \\text{Image formed at infinity}",
      },
      {
        condition: "Object at 2f (u = 2f)",
        latex:
          "v = 2f, \\quad m = -1 \\quad (\\text{Real, inverted, same size})",
      },
      {
        condition: "Object inside focus (u < f)",
        latex:
          "v < 0, \\quad m > 1 \\quad (\\text{Virtual, erect, magnified image})",
      },
    ],
    hasVisualization: true,
    vizType: "thin_lens_ray_tracer",
    mcqShortcuts: [
      "Concave lenses ALWAYS produce a virtual, erect, and diminished image ($|m| < 1$, $v < 0$) for any real object position.",
      "A convex lens can produce both real (inverted) and virtual (erect) images. A virtual, magnified image is produced only when the object is closer than one focal length ($u < f$).",
      "Focal length is minimum for violet light and maximum for red light: $f_v < f_r$. Therefore, a lens has slightly different focal lengths for different colors (chromatic aberration).",
    ],
  },
  {
    id: "microscopes",
    chapterId: "p2_ch6",
    topic: "Optical Instruments (আলোক যন্ত্র)",
    nameEn: "Simple & Compound Microscopes",
    nameBn: "সরল ও যৌগিক অণুবীক্ষণ যন্ত্র",
    latex:
      "\\text{Simple Microscope (Near Point): } m = 1 + \\frac{D}{f} \\newline \\text{Simple Microscope (Infinity): } m = \\frac{D}{f} \\newline \\text{Compound Microscope (Near Point): } M = -\\frac{v_o}{u_o}\\left(1 + \\frac{D}{f_e}\\right), \\quad L = v_o + u_e \\newline \\text{Compound Microscope (Infinity): } M = -\\frac{v_o}{u_o}\\left(\\frac{D}{f_e}\\right), \\quad L = v_o + f_e",
    variables: [
      { symbol: "m, M", meaning: "Magnifying power", unit: "Dimensionless" },
      {
        symbol: "f",
        meaning: "Focal length of simple microscope lens",
        unit: "m",
      },
      {
        symbol: "f_o, f_e",
        meaning: "Focal lengths of objective and eyepiece lenses",
        unit: "m",
      },
      {
        symbol: "u_o, v_o",
        meaning: "Object and image distances for the objective lens",
        unit: "m",
      },
      {
        symbol: "u_e",
        meaning: "Object distance for the eyepiece lens",
        unit: "m",
      },
      {
        symbol: "D",
        meaning: "Least distance of distinct vision (usually 25 cm or 0.25 m)",
        unit: "m",
      },
      {
        symbol: "L",
        meaning:
          "Length of the microscope tube (distance between objective and eyepiece)",
        unit: "m",
      },
    ],
    assumptions:
      "Objective has short focal length, eyepiece has larger focal length, paraxial approximation.",
    specialCases: [],
    mcqShortcuts: [
      "In a compound microscope, the intermediate image formed by the objective is real, inverted, and magnified. The final image formed by the eyepiece is virtual, inverted (with respect to original object), and highly magnified.",
      "To increase magnification of a compound microscope, both objective and eyepiece should have very short focal lengths ($f_o$ and $f_e$).",
      "Near point focusing represents maximum strain on the eye (image at $D = 25\\text{ cm}$), whereas infinity focusing represents fully relaxed eye (image at $\\infty$).",
    ],
  },
  {
    id: "telescope_formulas",
    chapterId: "p2_ch6",
    topic: "Optical Instruments (আলোক যন্ত্র)",
    nameEn: "Astronomical Telescope",
    nameBn: "নভোবীক্ষণ যন্ত্র",
    latex:
      "\\text{Normal Adjustment (Infinity): } m = -\\frac{f_o}{f_e}, \\quad L = f_o + f_e \\newline \\text{Near Point Adjustment: } m = -\\frac{f_o}{f_e}\\left(1 + \\frac{f_e}{D}\\right), \\quad L = f_o + u_e \\quad \\text{where } u_e = \\frac{f_e D}{f_e + D}",
    variables: [
      { symbol: "m", meaning: "Magnifying power", unit: "Dimensionless" },
      {
        symbol: "f_o",
        meaning: "Focal length of objective lens (large)",
        unit: "m",
      },
      {
        symbol: "f_e",
        meaning: "Focal length of eyepiece lens (small)",
        unit: "m",
      },
      { symbol: "L", meaning: "Length of the telescope tube", unit: "m" },
      { symbol: "D", meaning: "Least distance of distinct vision", unit: "m" },
    ],
    assumptions: "Object is at infinity, parallel rays strike objective lens.",
    specialCases: [],
    mcqShortcuts: [
      "In normal adjustment, the length of the telescope tube is exactly equal to the sum of the focal lengths of the objective and eyepiece ($L = f_o + f_e$). This is a highly repeated board MCQ!",
      "For high magnification and high resolving power in a telescope, the objective should have a large focal length ($f_o$) and a large aperture (diameter), while the eyepiece should have a short focal length ($f_e$).",
      "The final image in an astronomical telescope is virtual, inverted, and magnified.",
    ],
  },
];
