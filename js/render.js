import { utils } from "./utils.js";
import { vizManager } from "./visualizations.js";

export const renderManager = {
  /**
   * Render the list of chapters into the sidebar
   */
  renderChapters: (chapters) => {
    const p1Container = document.getElementById("chaptersPaper1");
    const p2Container = document.getElementById("chaptersPaper2");

    p1Container.innerHTML = "";
    p2Container.innerHTML = "";

    chapters.forEach((chapter) => {
      const btn = document.createElement("button");
      btn.className = "list-group-item list-group-item-action py-3";
      btn.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">${chapter.nameEn}</div>
                        <small class="bn-text text-muted">${chapter.nameBn}</small>
                    </div>
                </div>
            `;

      btn.addEventListener("click", () => {
        // Update active state
        document
          .querySelectorAll(".chapter-list .list-group-item")
          .forEach((el) => el.classList.remove("active"));
        btn.classList.add("active");

        // Trigger event to load formulas
        document.dispatchEvent(
          new CustomEvent("loadChapter", { detail: chapter }),
        );
      });

      if (chapter.paper === 1) {
        p1Container.appendChild(btn);
      } else {
        p2Container.appendChild(btn);
      }
    });
  },

  /**
   * Render topics filters based on loaded formulas
   */
  renderTopics: (formulas, onTopicSelect) => {
    const container = document.getElementById("topicFilters");
    container.innerHTML = "";

    if (formulas.length === 0) return;

    const allTopics = [...new Set(formulas.map((f) => f.topic))];

    // "All" button
    const allBtn = document.createElement("button");
    allBtn.className = "btn topic-btn active fade-in";
    allBtn.textContent = "All Topics";
    allBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".topic-btn")
        .forEach((b) => b.classList.remove("active"));
      allBtn.classList.add("active");
      onTopicSelect("all");
    });
    container.appendChild(allBtn);

    // Topic buttons
    allTopics.forEach((topic, i) => {
      const btn = document.createElement("button");
      btn.className = "btn topic-btn fade-in";
      btn.style.animationDelay = `${(i + 1) * 0.05}s`;

      // Clean up topic text (remove bangla for the chip if it's too long, or keep it)
      btn.textContent = topic.split(" (")[0];
      btn.title = topic;

      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".topic-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        onTopicSelect(topic);
      });
      container.appendChild(btn);
    });
  },

  /**
   * Render the grid of formulas
   */
  renderFormulasGrid: (formulas) => {
    const grid = document.getElementById("formulasGrid");
    grid.innerHTML = "";

    if (formulas.length === 0) {
      grid.innerHTML = `
                <div class="col-12 text-center text-muted py-5 fade-in">
                    <p class="fs-5">No formulas found for this selection.</p>
                </div>
            `;
      return;
    }

    formulas.forEach((formula, i) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-xxl-4 slide-up formula-card-wrapper";
      col.style.animationDelay = `${i * 0.05}s`;

      col.innerHTML = `
                <div class="formula-card h-100">
                    <div class="formula-card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0 fs-6 text-primary">${formula.nameEn}</h5>
                            <span class="badge-custom">${formula.topic.split(" (")[0]}</span>
                        </div>
                        <div class="bn-text text-muted small mb-3">${formula.nameBn}</div>
                        
                        <div class="latex-preview w-100 overflow-x-auto overflow-y-hidden pb-2" style="white-space: nowrap;">
                            ${utils.renderMath(formula.latex, true)}
                        </div>
                    </div>
                </div>
            `;

      col.querySelector(".formula-card").addEventListener("click", () => {
        document.dispatchEvent(
          new CustomEvent("openFormulaModal", { detail: formula }),
        );
      });

      grid.appendChild(col);
    });
  },

  /**
   * Open and populate the formula details modal
   */
  openFormulaModal: (formula) => {
    document.getElementById("modalFormulaNameEn").textContent = formula.nameEn;
    document.getElementById("modalFormulaNameBn").textContent = formula.nameBn;

    // Render main equation
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

    // Visualization Prep
    const vizTab = document.getElementById("visuals-tab");
    const controlsContainer = document.getElementById("modalVizControls");
    controlsContainer.innerHTML = "";
    controlsContainer.classList.add("d-none");

    if (formula.hasVisualization && formula.vizType) {
      vizTab.parentElement.classList.remove("d-none");
      vizTab.textContent = "Visualization";

      // Setup Controls if metadata exists
      if (renderManager.vizConfig[formula.vizType]) {
        controlsContainer.classList.remove("d-none");
        renderManager.setupVizControls(
          formula.vizType,
          renderManager.vizConfig[formula.vizType],
        );
      }

      // Use a fresh listener each time, but remove existing ones to prevent accumulation
      const oldTab = vizTab.cloneNode(true);
      vizTab.parentNode.replaceChild(oldTab, vizTab);
      const newVizTab = document.getElementById("visuals-tab");

      newVizTab.addEventListener("shown.bs.tab", function onTabShown() {
        vizManager.render(formula.vizType, "modalVisualization");
        newVizTab.removeEventListener("shown.bs.tab", onTabShown);
      });
    } else if (formula.imageUrl) {
      vizTab.parentElement.classList.remove("d-none");
      vizTab.textContent = "Diagram";
      document.getElementById("modalVisualization").innerHTML = `
                <div class="text-center p-3">
                    <img src="${formula.imageUrl}" class="img-fluid rounded shadow-sm" alt="Diagram">
                </div>
            `;
    } else {
      vizTab.parentElement.classList.add("d-none");
      document.getElementById("modalVisualization").innerHTML = "";
    }

    // Reset tabs to first one
    const bootstrapTab = new bootstrap.Tab(
      document.getElementById("details-tab"),
    );
    bootstrapTab.show();

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("formulaModal"));
    modal.show();
  },

  /**
   * Configuration for interactive visualization controls
   */
  vizConfig: {
    projectile_advanced: [
      { id: "u", label: "Velocity", min: 10, max: 100, val: 60 },
      { id: "angle", label: "Angle", min: 10, max: 85, val: 45 },
      { id: "h", label: "Height", min: 0, max: 100, val: 0 },
      { id: "fire", label: "Fire Projectile", type: "button" },
    ],
    simple_pendulum: [
      { id: "len", label: "Length (L)", min: 50, max: 250, val: 150 },
      {
        id: "gravity",
        label: "Gravity (g)",
        min: 0.1,
        max: 2,
        val: 0.4,
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
        label: "Type (0:Trans, 1:Long)",
        min: 0,
        max: 1,
        val: 0,
        step: 1,
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
    shm_circular: [
      { id: "radius", label: "Radius (A)", min: 50, max: 100, val: 70 },
      {
        id: "speed",
        label: "Angular Speed",
        min: 0.01,
        max: 0.1,
        val: 0.03,
        step: 0.01,
      },
    ],
    vector_area: [
      { id: "vecA_mag", label: "Vector A Mag", min: 50, max: 150, val: 100 },
      { id: "vecB_mag", label: "Vector B Mag", min: 50, max: 150, val: 80 },
      { id: "angle", label: "Angle", min: 0, max: 180, val: 60 },
    ],
    poissons_ratio: [
      {
        id: "ratio",
        label: "Ratio (σ)",
        min: -0.5,
        max: 0.5,
        val: 0.3,
        step: 0.1,
      },
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
        min: 0.05,
        max: 0.3,
        val: 0.1,
        step: 0.01,
      },
      {
        id: "k_wave",
        label: "Wave Number (k)",
        min: 0.01,
        max: 0.1,
        val: 0.02,
        step: 0.01,
      },
      { id: "amp", label: "Amplitude (A)", min: 10, max: 80, val: 40 },
    ],
    standing_wave_pipes: [
      {
        id: "pipeType",
        label: "Type (0:Open, 1:Closed)",
        min: 0,
        max: 1,
        val: 0,
        step: 1,
      },
      { id: "harmonic", label: "Harmonic", min: 1, max: 5, val: 1, step: 1 },
    ],
    beats: [
      { id: "f1", label: "Frequency 1 (Hz)", min: 200, max: 1000, val: 440 },
      { id: "f2", label: "Frequency 2 (Hz)", min: 200, max: 1000, val: 444 },
      { id: "toggleSound", label: "Toggle Sound", type: "button" },
    ],
  },

  setupVizControls: (vizType, config) => {
    const container = document.getElementById("modalVizControls");
    const row = document.createElement("div");
    row.className = "row g-3";

    config.forEach((ctrl) => {
      const col = document.createElement("div");
      col.className = "col-md-6";

      if (ctrl.type === "button") {
        col.innerHTML = `
                  <button class="btn btn-outline-primary btn-sm w-100 mt-4" id="ctrl-${ctrl.id}">${ctrl.label}</button>
              `;
        col.querySelector("button").addEventListener("click", () => {
          if (
            vizManager.currentP5Instance &&
            typeof vizManager.currentP5Instance[ctrl.id] === "function"
          ) {
            vizManager.currentP5Instance[ctrl.id]();
          }
        });
      } else {
        col.innerHTML = `
                  <label class="form-label small fw-bold mb-1">${ctrl.label}: <span id="val-${ctrl.id}">${ctrl.val}</span></label>
                  <input type="range" class="form-range" id="ctrl-${ctrl.id}" 
                         min="${ctrl.min}" max="${ctrl.max}" step="${ctrl.step || 1}" value="${ctrl.val}">
              `;

        const input = col.querySelector("input");
        input.addEventListener("input", (e) => {
          const val = parseFloat(e.target.value);
          document.getElementById(`val-${ctrl.id}`).textContent = val;

          // Update the p5 instance directly
          if (vizManager.currentP5Instance) {
            vizManager.currentP5Instance[ctrl.id] = val;
            // Special reset for projectile
            if (
              vizType === "projectile_motion" ||
              vizType === "projectile_advanced"
            ) {
              vizManager.currentP5Instance.reset();
            }
          }
        });
      }
      row.appendChild(col);
    });

    container.appendChild(row);
  },

  /**
   * Render interactive simulations into the Lab view, optionally filtered by chapter
   */
  renderLabPage: (allFormulas, filterChapterId = null) => {
    const grid = document.getElementById("labGrid");
    grid.innerHTML = "";

    let labFormulas = allFormulas.filter(
      (f) => f.hasVisualization && f.vizType,
    );

    if (filterChapterId) {
      labFormulas = labFormulas.filter((f) => f.chapterId === filterChapterId);
    }

    if (labFormulas.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center py-5 text-muted">No simulations found for this selection.</div>`;
      return;
    }

    labFormulas.forEach((formula, i) => {
      const col = document.createElement("div");
      col.className = "col-12 col-xl-6 slide-up mb-4";
      col.style.animationDelay = `${i * 0.1}s`;

      const cardId = `lab-viz-${formula.id}-${i}`; // More unique ID
      const controlsId = `lab-ctrl-${formula.id}-${i}`;

      col.innerHTML = `
                <div class="formula-card h-100 p-0 overflow-hidden shadow-sm">
                    <div class="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="m-0 fs-6">${formula.nameEn}</h5>
                            <small class="text-muted">${formula.topic}</small>
                        </div>
                        <span class="badge bg-primary-light text-primary rounded-pill px-3">Lab</span>
                    </div>
                    <div class="p-3 bg-white border-bottom ${renderManager.vizConfig[formula.vizType] ? "" : "d-none"}" id="${controlsId}">
                        <!-- Controls will be injected here -->
                    </div>
                    <div class="bg-light d-flex justify-content-center align-items-center" id="${cardId}" style="height: 380px; min-height: 380px;">
                        <div class="spinner-border text-primary opacity-25" role="status"></div>
                    </div>
                </div>
            `;

      grid.appendChild(col);

      // Setup Controls for this specific card
      if (renderManager.vizConfig[formula.vizType]) {
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
          vizManager.render(formula.vizType, cardId, true);
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
