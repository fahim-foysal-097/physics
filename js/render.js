import { utils } from "./utils.js";
import { vizManager } from "./visualizations.js";

/**
 * Render Manager
 * Handles all UI injection and data rendering
 */
export const renderManager = {
  /**
   * Renders the list of chapters in the sidebar
   */
  renderChapters: (chapters) => {
    const paper1List = document.getElementById("chaptersPaper1");
    const paper2List = document.getElementById("chaptersPaper2");

    paper1List.innerHTML = "";
    paper2List.innerHTML = "";

    chapters.forEach((chapter) => {
      const item = document.createElement("button");
      item.className =
        "list-group-item list-group-item-action d-flex flex-column py-3";
      item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge bg-primary-light text-primary rounded-pill small">CH ${chapter.id.split("_")[1].replace("ch", "")}</span>
                </div>
                <span class="fw-bold">${chapter.nameEn}</span>
                <span class="text-muted small">${chapter.nameBn}</span>
            `;

      item.addEventListener("click", () => {
        // Handle active state
        document
          .querySelectorAll(".chapter-list .list-group-item")
          .forEach((el) => el.classList.remove("active"));
        item.classList.add("active");

        // Dispatch event for app.js to handle
        document.dispatchEvent(
          new CustomEvent("loadChapter", { detail: chapter }),
        );
      });

      if (chapter.paper === 1) paper1List.appendChild(item);
      else paper2List.appendChild(item);
    });
  },

  /**
   * Renders sub-topic filters for the current chapter
   */
  renderTopics: (formulas, onSelect) => {
    const container = document.getElementById("topicFilters");
    container.innerHTML = "";

    const topics = ["all", ...new Set(formulas.map((f) => f.topic))];

    topics.forEach((topic) => {
      const btn = document.createElement("button");
      btn.className = `btn btn-sm btn-light-accent text-nowrap rounded-pill px-3 ${topic === "all" ? "active" : ""}`;
      btn.textContent = topic === "all" ? "All Topics" : topic;

      btn.addEventListener("click", () => {
        container
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        onSelect(topic);
      });

      container.appendChild(btn);
    });
  },

  /**
   * Renders the grid of formula cards
   */
  renderFormulasGrid: (formulas) => {
    const grid = document.getElementById("formulasGrid");
    grid.innerHTML = "";

    if (formulas.length === 0) {
      grid.innerHTML =
        '<div class="col-12 text-center py-5 text-muted">No formulas found in this section.</div>';
      return;
    }

    formulas.forEach((formula, index) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-xl-4 slide-up";
      col.style.animationDelay = `${index * 0.05}s`;

      col.innerHTML = `
                <div class="formula-card h-100 p-4" onclick="document.dispatchEvent(new CustomEvent('openFormulaModal', {detail: ${JSON.stringify(formula).replace(/"/g, "&quot;")}}))">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge bg-light text-primary-accent rounded-pill px-2 py-1 small">${formula.topic}</span>
                        ${formula.hasVisualization ? '<span class="badge bg-success-subtle text-success rounded-pill px-2 py-1 small">Interactive</span>' : ""}
                    </div>
                    <h5 class="formula-name mb-1">${formula.nameEn}</h5>
                    <p class="bn-title text-muted small mb-3">${formula.nameBn}</p>
                    <div class="formula-preview text-center py-3 bg-light rounded-3 overflow-hidden">
                        ${utils.renderMath(formula.latex)}
                    </div>
                </div>
            `;

      grid.appendChild(col);
    });
  },

  /**
   * Opens the detail modal for a formula
   */
  openFormulaModal: (formula) => {
    // Basic Info
    document.getElementById("modalFormulaNameEn").textContent = formula.nameEn;
    document.getElementById("modalFormulaNameBn").textContent = formula.nameBn;
    document.getElementById("modalFormulaLatex").innerHTML = utils.renderMath(
      formula.latex,
      true,
    );

    // Render variables
    const varTbody = document.getElementById("modalVariables");
    varTbody.innerHTML = "";
    if (formula.variables && formula.variables.length > 0) {
      formula.variables.forEach((v) => {
        varTbody.innerHTML += `
                    <tr>
                        <td class="fw-bold" style="width: 20%">${utils.renderMath(v.symbol)}</td>
                        <td class="text-muted">${v.meaning}</td>
                        <td class="text-end text-primary small" style="width: 20%">${v.unit}</td>
                    </tr>
                `;
      });
    }

    // Render assumptions
    const assumpContainer = document.getElementById(
      "modalAssumptionsContainer",
    );
    if (formula.assumptions) {
      document.getElementById("modalAssumptions").textContent =
        formula.assumptions;
      assumpContainer.classList.remove("d-none");
    } else {
      assumpContainer.classList.add("d-none");
    }

    // Render derivation
    const derivContainer = document.getElementById("modalDerivationContainer");
    if (formula.derivation) {
      document.getElementById("modalDerivation").innerHTML = utils.renderMath(
        formula.derivation,
        true,
      );
      derivContainer.classList.remove("d-none");
    } else {
      derivContainer.classList.add("d-none");
    }

    // Render mcq shortcuts
    const mcqContainer = document.getElementById("modalMcqShortcutsContainer");
    if (formula.mcqShortcuts && formula.mcqShortcuts.length > 0) {
      document.getElementById("modalMcqShortcuts").innerHTML = `
                <ul class="mb-0 ps-3">
                    ${formula.mcqShortcuts.map((s) => `<li class="mb-2">${s}</li>`).join("")}
                </ul>
            `;
      mcqContainer.classList.remove("d-none");
    } else {
      mcqContainer.classList.add("d-none");
    }

    // Render Special Cases
    const specialContainer = document.getElementById("modalSpecialCases");
    specialContainer.innerHTML = "";
    const specialTab = document.getElementById("special-tab");

    if (formula.specialCases && formula.specialCases.length > 0) {
      formula.specialCases.forEach((sc, i) => {
        specialContainer.innerHTML += `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${i}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}">
                                ${utils.renderMath(sc.condition)}
                            </button>
                        </h2>
                        <div id="collapse${i}" class="accordion-collapse collapse" data-bs-parent="#modalSpecialCases">
                            <div class="accordion-body text-center fs-4 py-4">
                                ${utils.renderMath(sc.latex, true)}
                            </div>
                        </div>
                    </div>
                `;
      });
      specialTab.parentElement.classList.remove("d-none");
    } else {
      specialTab.parentElement.classList.add("d-none");
    }

    // Visualization and Diagram Prep
    const vizTab = document.getElementById("visuals-tab");
    const diagramTab = document.getElementById("diagram-tab");
    const controlsContainer = document.getElementById("modalVizControls");
    controlsContainer.innerHTML = "";
    controlsContainer.classList.add("d-none");

    // Handle Visualization Tab
    if (formula.hasVisualization && formula.vizType) {
      vizTab.parentElement.classList.remove("d-none");
      vizTab.textContent = "Visualization";

      // Setup Controls if metadata exists
      if (renderManager.vizConfig[formula.vizType]) {
        controlsContainer.classList.remove("d-none");
        renderManager.setupLabControls(
          formula.vizType,
          renderManager.vizConfig[formula.vizType],
          "modalVizControls",
          "modalVisualization",
        );
      }

      // We clear the container before p5 starts
      document.getElementById("modalVisualization").innerHTML = "";
    } else {
      vizTab.parentElement.classList.add("d-none");
      document.getElementById("modalVisualization").innerHTML = "";
    }

    // Handle Diagram Tab
    if (formula.imageUrl) {
      diagramTab.parentElement.classList.remove("d-none");
      document.getElementById("modalDiagram").innerHTML =
        `<img src="${formula.imageUrl}" class="img-fluid rounded-3" alt="Formula Diagram">`;
    } else {
      diagramTab.parentElement.classList.add("d-none");
      document.getElementById("modalDiagram").innerHTML = "";
    }

    // Reset tabs to first one
    const bootstrapTab = new bootstrap.Tab(
      document.getElementById("details-tab"),
    );
    bootstrapTab.show();

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("formulaModal"));
    modal.show();

    // Trigger visualization when tab is clicked
    vizTab.onclick = () => {
      if (formula.hasVisualization && formula.vizType) {
        vizManager.render(
          formula.vizType,
          "modalVisualization",
          false,
          formula.chapterId,
        );
      }
    };
  },

  /**
   * Configuration for interactive visualization controls
   */
  vizConfig: {
    projectile_advanced: [
      { id: "u", label: "Velocity (u)", min: 10, max: 100, val: 60 },
      { id: "angle", label: "Angle (θ)", min: 10, max: 85, val: 45 },
      { id: "g", label: "Gravity (g)", min: 1, max: 20, val: 9.8, step: 0.1 },
      { id: "h", label: "Height (h)", min: 0, max: 100, val: 0 },
      { id: "fire", label: "Fire Projectile", type: "button" },
    ],
    simple_pendulum: [
      { id: "len", label: "Length (L)", min: 50, max: 250, val: 150 },
      {
        id: "gravity",
        label: "Gravity (g)",
        min: 1.0,
        max: 20.0,
        val: 9.8,
        step: 0.1,
      },
      {
        id: "damping",
        label: "Damping",
        min: 0.9,
        max: 1.0,
        val: 1.0,
        step: 0.001,
      },
    ],
    wave_propagation: [
      {
        id: "type",
        label: "Wave Type",
        type: "radio",
        options: [
          { label: "Transverse", val: 0 },
          { label: "Longitudinal", val: 1 },
        ],
        val: 0,
      },
      {
        id: "freq",
        label: "Frequency",
        min: 0.01,
        max: 0.2,
        val: 0.05,
        step: 0.01,
      },
    ],
    wave_interference: [
      {
        id: "interferenceType",
        label: "Interference Type",
        type: "radio",
        options: [
          { label: "Constructive", val: 0 },
          { label: "Destructive", val: 1 },
        ],
        val: 0,
      },
      { id: "amp", label: "Amplitude", min: 10, max: 60, val: 40 },
    ],
    em_wave: [
      {
        id: "freq",
        label: "Frequency",
        min: 0.01,
        max: 0.1,
        val: 0.04,
        step: 0.01,
      },
    ],
    sound_wave: [
      {
        id: "freq",
        label: "Frequency",
        min: 0.01,
        max: 0.1,
        val: 0.05,
        step: 0.01,
      },
      { id: "amp", label: "Amplitude", min: 5, max: 30, val: 15 },
    ],
    banking_road: [
      { id: "theta", label: "Angle (θ)", min: 0, max: 45, val: 15 },
    ],
    water_pump: [
      {
        id: "pump_rate",
        label: "Pump Rate",
        min: 0.1,
        max: 2.0,
        val: 0.5,
        step: 0.1,
      },
    ],
    orbit_simulation: [
      { id: "orbitR", label: "Orbit Radius", min: 50, max: 150, val: 80 },
      {
        id: "orbitV",
        label: "Velocity",
        min: 0.01,
        max: 0.1,
        val: 0.05,
        step: 0.01,
      },
    ],
    progressive_wave: [
      {
        id: "omega",
        label: "Angular Freq (ω)",
        min: 0.01,
        max: 0.2,
        val: 0.05,
        step: 0.01,
      },
      {
        id: "k_wave",
        label: "Wave Number (k)",
        min: 0.01,
        max: 0.1,
        val: 0.05,
        step: 0.01,
      },
      { id: "amp", label: "Amplitude (A)", min: 10, max: 80, val: 40 },
    ],
    standing_wave: [
      {
        id: "omega",
        label: "Angular Freq (ω)",
        min: 0.1,
        max: 1.0,
        val: 0.4,
        step: 0.05,
      },
      {
        id: "k_wave",
        label: "Wave Number (k)",
        min: 0.01,
        max: 0.1,
        val: 0.03,
        step: 0.01,
      },
      { id: "amp", label: "Amplitude (A)", min: 10, max: 80, val: 40 },
    ],
    standing_wave_pipes: [
      {
        id: "pipeType",
        label: "Pipe Type",
        type: "radio",
        options: [
          { label: "Open", val: 0 },
          { label: "Closed", val: 1 },
        ],
        val: 0,
      },
      { id: "harmonic", label: "Harmonic", min: 1, max: 5, val: 1, step: 1 },
    ],
    beats: [
      { id: "f1", label: "Freq 1 (Hz)", min: 430, max: 450, val: 440, step: 1 },
      { id: "f2", label: "Freq 2 (Hz)", min: 430, max: 450, val: 444, step: 1 },
      { id: "toggleSound", label: "Toggle Sound", type: "button" },
    ],
    vector_addition: [
      { id: "pMag", label: "Vector P", min: 50, max: 150, val: 100 },
      { id: "qMag", label: "Vector Q", min: 50, max: 150, val: 80 },
      { id: "angle", label: "Angle (θ)", min: 0, max: 180, val: 60 },
    ],
    vector_area: [
      { id: "vecA_mag", label: "Vector A", min: 50, max: 150, val: 100 },
      { id: "vecB_mag", label: "Vector B", min: 50, max: 150, val: 80 },
      { id: "angle", label: "Angle (θ)", min: 10, max: 170, val: 60 },
    ],
    poissons_ratio: [
      {
        id: "ratio",
        label: "Poisson Ratio",
        min: -0.5,
        max: 0.5,
        val: 0.3,
        step: 0.1,
      },
    ],
    brownian_motion: [
      {
        id: "gasSpeed",
        label: "Gas Speed (Temperature)",
        min: 10,
        max: 250,
        val: 100,
        step: 1,
      },
    ],
    degrees_of_freedom: [
      {
        id: "molType",
        label: "Molecule Type",
        type: "radio",
        options: [
          { label: "Monoatomic", val: 0 },
          { label: "Diatomic", val: 1 },
          { label: "CO2", val: 2 },
          { label: "Triatomic", val: 3 },
        ],
        val: 0,
      },
    ],
    carnot_cycle: [
      { id: "TH", label: "Source Temp (T1)", min: 400, max: 1000, val: 500 },
      { id: "TC", label: "Sink Temp (T2)", min: 200, max: 400, val: 300 },
      {
        id: "speed",
        label: "Anim Speed",
        min: 0.005,
        max: 0.05,
        val: 0.01,
        step: 0.005,
      },
      { id: "toggleRun", label: "Play / Pause", type: "button" },
    ],
    heating_curve: [],
    process_comparison: [
      {
        id: "gamma",
        label: "Gamma (γ)",
        min: 1.1,
        max: 1.7,
        val: 1.4,
        step: 0.01,
      },
    ],
    pv_diagram: [],
    coulombs_law: [
      {
        id: "q1",
        label: "Charge 1 (μC)",
        min: -10,
        max: 10,
        val: 5,
        step: 0.1,
      },
      {
        id: "q2",
        label: "Charge 2 (μC)",
        min: -10,
        max: 10,
        val: -5,
        step: 0.1,
      },
      { id: "r", label: "Distance", min: 50, max: 200, val: 120, step: 1 },
      { id: "reset", label: "Reset", type: "button" },
    ],

    electric_field: [
      {
        id: "q1",
        label: "Charge 1 (μC)",
        min: -10,
        max: 10,
        val: 5,
        step: 0.1,
      },
      {
        id: "q2",
        label: "Charge 2 (μC)",
        min: -10,
        max: 10,
        val: -5,
        step: 0.1,
      },
      {
        id: "resolution",
        label: "Vector Grid Size",
        min: 10,
        max: 40,
        val: 25,
        step: 1,
      },
      { id: "probeX", label: "Probe X", min: -120, max: 120, val: 0, step: 1 },
      { id: "probeY", label: "Probe Y", min: -90, max: 90, val: 0, step: 1 },
      { id: "reset", label: "Reset", type: "button" },
    ],

    sphere_field_graph: [
      { id: "Q", label: "Total Charge", min: 1, max: 20, val: 10, step: 1 },
      { id: "R", label: "Sphere Radius", min: 20, max: 100, val: 40, step: 1 },
      {
        id: "probeR",
        label: "Probe Distance",
        min: 0,
        max: 250,
        val: 80,
        step: 1,
      },
      { id: "reset", label: "Reset", type: "button" },
    ],

    dipole_torque: [
      { id: "E", label: "Electric Field", min: 1, max: 10, val: 5, step: 0.1 },
      {
        id: "theta",
        label: "Dipole Angle (θ)",
        min: 0,
        max: 180,
        val: 45,
        step: 1,
      },
      {
        id: "fieldAngle",
        label: "Field Angle (φ)",
        min: -180,
        max: 180,
        val: 0,
        step: 1,
      },
      { id: "toggleRun", label: "Play / Pause", type: "button" },
      { id: "reset", label: "Reset", type: "button" },
    ],

    capacitor: [
      { id: "A", label: "Plate Area", min: 50, max: 200, val: 100, step: 1 },
      { id: "d", label: "Distance", min: 40, max: 400, val: 40, step: 1 },
      { id: "K", label: "Dielectric (K)", min: 1, max: 10, val: 1, step: 0.1 },
      { id: "V", label: "Voltage (V)", min: 1, max: 30, val: 10, step: 0.5 },
      { id: "reset", label: "Reset", type: "button" },
    ],

    wire_resistance: [
      {
        id: "rho",
        label: "Resistivity (ρ)",
        min: 0.1,
        max: 10,
        val: 2,
        step: 0.1,
      },
      { id: "l", label: "Length (l)", min: 20, max: 240, val: 120, step: 1 },
      { id: "A", label: "Area (A)", min: 4, max: 120, val: 40, step: 1 },
    ],

    drift_velocity: [
      { id: "I", label: "Current (I)", min: 0.1, max: 10, val: 3, step: 0.1 },
      {
        id: "n",
        label: "Carrier density (n)",
        min: 1,
        max: 20,
        val: 8,
        step: 0.5,
      },
      { id: "A", label: "Area (A)", min: 1, max: 12, val: 4, step: 0.1 },
    ],

    ohm_law: [
      { id: "V", label: "Voltage (V)", min: 1, max: 30, val: 12, step: 0.5 },
      { id: "R", label: "Resistance (R)", min: 1, max: 20, val: 6, step: 0.5 },
    ],
    straight_wire_field: [
      {
        id: "I",
        label: "Current (I)",
        min: -10.0,
        max: 10.0,
        val: 5.0,
        step: 0.5,
      },
      { id: "r", label: "Distance (r)", min: 20, max: 180, val: 80, step: 1 },
      { id: "reset", label: "Reset Wire View", type: "button" },
    ],
    charged_particle_magnetic_field: [
      {
        id: "B",
        label: "B Field Strength",
        min: -10.0,
        max: 10.0,
        val: 4.0,
        step: 0.5,
      },
      {
        id: "q",
        label: "Charge (q)",
        min: -5.0,
        max: 5.0,
        val: 2.0,
        step: 0.2,
      },
      { id: "m", label: "Mass (m)", min: 1.0, max: 10.0, val: 5.0, step: 0.2 },
      {
        id: "v",
        label: "Velocity (v)",
        min: 1.0,
        max: 15.0,
        val: 6.0,
        step: 0.5,
      },
      { id: "resetParticle", label: "Re-Inject Particle", type: "button" },
      { id: "reset", label: "Reset All", type: "button" },
    ],
    faradays_induction: [
      { id: "N", label: "Coil Turns (N)", min: 1, max: 5, val: 3, step: 1 },
      {
        id: "magnetSpeed",
        label: "Magnet Osc Speed",
        min: 0.0,
        max: 3.0,
        val: 1.0,
        step: 0.1,
      },
      {
        id: "autoPlay",
        label: "Auto Oscillate Magnet",
        type: "radio",
        options: [
          { label: "On", val: 1 },
          { label: "Off", val: 0 },
        ],
        val: 1,
      },
      { id: "reset", label: "Reset Field", type: "button" },
    ],
    lcr_resonance: [
      { id: "R", label: "Resistance (R)", min: 2, max: 30, val: 10, step: 0.5 },
      {
        id: "L",
        label: "Inductance L (mH)",
        min: 20,
        max: 300,
        val: 120,
        step: 5,
      },
      {
        id: "C",
        label: "Capacitance C (μF)",
        min: 5,
        max: 100,
        val: 40,
        step: 1,
      },
      {
        id: "freq",
        label: "AC Freq f (Hz)",
        min: 10,
        max: 200,
        val: 60,
        step: 2,
      },
      { id: "reset", label: "Reset LCR", type: "button" },
    ],
    hubbles_law: [
      {
        id: "H0",
        label: "Hubble Const H₀",
        min: 40,
        max: 100,
        val: 70,
        step: 1,
      },
      { id: "reset", label: "Reset Galaxies", type: "button" },
    ],
    black_hole_gravity: [
      {
        id: "M",
        label: "BH Mass (M)",
        min: 1.0,
        max: 8.0,
        val: 4.0,
        step: 0.2,
      },
      {
        id: "c",
        label: "Light Speed (c)",
        min: 8.0,
        max: 20.0,
        val: 12.0,
        step: 0.2,
      },
      { id: "resetStar", label: "Re-Orbit Star", type: "button" },
      { id: "reset", label: "Reset Space Time", type: "button" },
    ],
    relativity_dilation: [
      {
        id: "beta",
        label: "Velocity v/c",
        min: 0.1,
        max: 0.99,
        val: 0.6,
        step: 0.01,
      },
      { id: "reset", label: "Reset Clock", type: "button" },
    ],
    photoelectric_effect: [
      {
        id: "wavelength",
        label: "Wavelength λ (nm)",
        min: 200,
        max: 750,
        val: 380,
        step: 5,
      },
      {
        id: "intensity",
        label: "Light Intensity (%)",
        min: 10,
        max: 100,
        val: 50,
        step: 5,
      },
      {
        id: "workFunction",
        label: "Work Function Φ (eV)",
        min: 1.5,
        max: 5.0,
        val: 2.3,
        step: 0.1,
      },
      {
        id: "voltage",
        label: "Anode Voltage V (V)",
        min: -4.0,
        max: 4.0,
        val: 0.0,
        step: 0.1,
      },
    ],
    xray_production: [
      {
        id: "tubeVoltage",
        label: "Tube Voltage V (kV)",
        min: 10,
        max: 50,
        val: 30,
        step: 1,
      },
    ],
    bohr_atom: [
      {
        id: "n_level",
        label: "Target Orbit n",
        min: 1,
        max: 5,
        val: 2,
        step: 1,
      },
      { id: "triggerJump", label: "Perform Transition", type: "button" },
    ],
    radioactive_decay: [
      {
        id: "halfLife",
        label: "Half-Life T₁/₂ (sec)",
        min: 1.0,
        max: 8.0,
        val: 3.0,
        step: 0.2,
      },
      { id: "reset", label: "Reset Grid & Decay", type: "button" },
    ],
    pn_junction: [
      {
        id: "bias",
        label: "DC Bias V (V)",
        min: -4.0,
        max: 2.0,
        val: 0.8,
        step: 0.1,
      },
      {
        id: "circuitMode",
        label: "View Mode",
        type: "radio",
        options: [
          { label: "Carrier Junction", val: 0 },
          { label: "AC Rectifier", val: 1 },
        ],
        val: 0,
      },
    ],
    transistor_amplifier: [
      {
        id: "ib",
        label: "Base Current I_b (μA)",
        min: 5,
        max: 60,
        val: 20,
        step: 1,
      },
      {
        id: "beta",
        label: "Current Gain β",
        min: 50,
        max: 250,
        val: 120,
        step: 5,
      },
      {
        id: "rl",
        label: "Load Resistor R_L (kΩ)",
        min: 1.0,
        max: 8.0,
        val: 4.0,
        step: 0.2,
      },
    ],
    logic_gates: [],
  },

  /**
   * Render interactive simulations into the Lab view, optionally filtered by chapter
   */
  renderLabPage: (currentChapterFormulas, filterChapterId = null) => {
    const grid = document.getElementById("labGrid");
    grid.innerHTML = "";

    let labFormulas = currentChapterFormulas.filter(
      (f) => f.hasVisualization && f.vizType,
    );

    if (filterChapterId) {
      labFormulas = labFormulas.filter((f) => f.chapterId === filterChapterId);
    }

    // Deduplicate by vizType so each unique simulation only appears once
    const seenVizTypes = new Set();
    labFormulas = labFormulas.filter((f) => {
      if (seenVizTypes.has(f.vizType)) return false;
      seenVizTypes.add(f.vizType);
      return true;
    });

    if (labFormulas.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center py-5 text-muted">No simulations found for this selection.</div>`;
      return;
    }

    const simTitles = {
      // Chapter 8
      relativity_dilation: {
        en: "Relativity: Time Dilation & Length Contraction",
        topic: "Modern Physics (আধুনিক পদার্থবিজ্ঞান)",
      },
      photoelectric_effect: {
        en: "Photoelectric Effect Experiment",
        topic: "Modern Physics (আধুনিক পদার্থবিজ্ঞান)",
      },
      xray_production: {
        en: "X-Ray Production & Spectrum",
        topic: "Modern Physics (আধুনিক পদার্থবিজ্ঞান)",
      },
      // Chapter 9
      bohr_atom: {
        en: "Bohr Hydrogen Atom & Spectral Lines",
        topic: "Atoms & Nucleus (পরমাণু ও নিউক্লিয়াস)",
      },
      radioactive_decay: {
        en: "Radioactive Decay Simulation",
        topic: "Atoms & Nucleus (পরমাণু ও নিউক্লিয়াস)",
      },
      // Chapter 10
      pn_junction: {
        en: "P-N Junction & AC Rectifier",
        topic: "Semiconductors (সেমিকন্ডাক্টর)",
      },
      transistor_amplifier: {
        en: "Transistor Common Emitter Amplifier",
        topic: "Semiconductors (সেমিকন্ডাক্টর)",
      },
      logic_gates: {
        en: "Interactive Logic Gates Sandbox",
        topic: "Digital Electronics (ডিজিটাল ইলেকট্রনিক্স)",
      },
    };

    labFormulas.forEach((formula, i) => {
      const col = document.createElement("div");
      col.className = "col-12 col-xl-6 slide-up mb-4";
      col.style.animationDelay = `${i * 0.1}s`;

      const cardId = `lab-viz-${formula.id}-${i}`; // More unique ID
      const controlsId = `lab-ctrl-${formula.id}-${i}`;

      const customTitle = simTitles[formula.vizType];
      const cardTitle = customTitle ? customTitle.en : formula.nameEn;
      const cardTopic = customTitle ? customTitle.topic : formula.topic;

      col.innerHTML = `
                <div class="formula-card h-100 p-0 overflow-hidden shadow-sm">
                    <div class="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="m-0 fs-6">${cardTitle}</h5>
                            <small class="text-muted">${cardTopic}</small>
                        </div>
                        <span class="badge bg-primary-light text-primary rounded-pill px-3">Lab</span>
                    </div>
                    <div class="p-3 bg-white border-bottom ${renderManager.vizConfig[formula.vizType] && renderManager.vizConfig[formula.vizType].length > 0 ? "" : "d-none"}" id="${controlsId}">
                        <!-- Controls will be injected here -->
                    </div>
                    <div class="bg-light d-flex justify-content-center align-items-center" id="${cardId}" style="height: 380px; min-height: 380px;">
                        <div class="spinner-border text-primary opacity-25" role="status"></div>
                    </div>
                </div>
            `;

      grid.appendChild(col);

      // Setup Controls for this specific card
      if (
        renderManager.vizConfig[formula.vizType] &&
        renderManager.vizConfig[formula.vizType].length > 0
      ) {
        renderManager.setupLabControls(
          formula.vizType,
          renderManager.vizConfig[formula.vizType],
          controlsId,
          cardId,
        );
      }

      // Initialize p5 instance
      setTimeout(
        () => {
          vizManager.render(formula.vizType, cardId, true, formula.chapterId);
        },
        i * 50 + 100,
      );
    });
  },

  setupLabControls: (
    vizType,
    config,
    controlsContainerId,
    canvasContainerId,
  ) => {
    const container = document.getElementById(controlsContainerId);
    const row = document.createElement("div");
    row.className = "row g-2";

    config.forEach((ctrl) => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4";

      if (ctrl.type === "button") {
        col.className = "col-sm-6 col-md-4 d-flex align-items-end";
        col.innerHTML = `
                  <button class="btn btn-outline-primary btn-sm w-100 mb-1" id="ctrl-${controlsContainerId}-${ctrl.id}">${ctrl.label}</button>
              `;
        col.querySelector("button").addEventListener("click", () => {
          const instance = vizManager.instances[canvasContainerId];
          if (instance && typeof instance[ctrl.id] === "function") {
            instance[ctrl.id]();
          }
        });
      } else if (ctrl.type === "radio") {
        let optionsHtml = ctrl.options
          .map(
            (opt, i) => `
          <input type="radio" class="btn-check" name="radio-${controlsContainerId}-${ctrl.id}" id="radio-${controlsContainerId}-${ctrl.id}-${i}" 
                 value="${opt.val}" ${opt.val === ctrl.val ? "checked" : ""}>
          <label class="btn btn-outline-primary btn-sm flex-fill x-small px-1" for="radio-${controlsContainerId}-${ctrl.id}-${i}">${opt.label}</label>
        `,
          )
          .join("");

        col.innerHTML = `
          <label class="form-label x-small fw-bold mb-1 d-block">${ctrl.label}</label>
          <div class="btn-group w-100 d-flex" role="group">
            ${optionsHtml}
          </div>
        `;

        col.querySelectorAll("input").forEach((input) => {
          input.addEventListener("change", (e) => {
            const val = parseInt(e.target.value);
            const instance = vizManager.instances[canvasContainerId];
            if (instance) {
              instance[ctrl.id] = val;
            }
          });
        });
      } else {
        col.innerHTML = `
                  <label class="form-label x-small fw-bold mb-0">${ctrl.label}: <span id="val-${controlsContainerId}-${ctrl.id}">${ctrl.val}</span></label>
                  <input type="range" class="form-range form-range-sm" id="ctrl-${controlsContainerId}-${ctrl.id}" 
                         min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step || 1}" value="${ctrl.val}">
              `;

        const input = col.querySelector("input");
        input.addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          document.getElementById(
            `val-${controlsContainerId}-${ctrl.id}`,
          ).textContent = val;

          // Find the p5 instance associated with this container
          const instance = vizManager.instances[canvasContainerId];
          if (instance) {
            instance[ctrl.id] = val;
            if (
              vizType === "projectile_motion" ||
              vizType === "projectile_advanced"
            ) {
              instance.reset();
            }
          }
        });
      }
      row.appendChild(col);
    });

    container.appendChild(row);
  },
};
