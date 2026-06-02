import { utils } from "./utils.js";
import { vizManager } from "./visualizations.js";
import { vizConfig, simTitles } from "./viz_config.js";

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
    const mobilePaper1List = document.getElementById("mobileChaptersPaper1");
    const mobilePaper2List = document.getElementById("mobileChaptersPaper2");

    if (paper1List) paper1List.innerHTML = "";
    if (paper2List) paper2List.innerHTML = "";
    if (mobilePaper1List) mobilePaper1List.innerHTML = "";
    if (mobilePaper2List) mobilePaper2List.innerHTML = "";

    chapters.forEach((chapter) => {
      // Helper function to create chapter button
      const createButton = () => {
        const item = document.createElement("button");
        item.className =
          "list-group-item list-group-item-action d-flex flex-column py-3";
        item.setAttribute("data-chapter-id", chapter.id);
        const chNumber = chapter.id.split("_")[1].replace("ch", "");
        item.innerHTML = `
                  <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="badge bg-primary-light text-primary rounded-pill small">CH ${chNumber}</span>
                  </div>
                  <span class="fw-bold">${chapter.nameEn}</span>
                  <span class="text-muted small">${chapter.nameBn}</span>
              `;

        item.addEventListener("click", () => {
          // Dispatch event for app.js to handle
          document.dispatchEvent(
            new CustomEvent("loadChapter", { detail: chapter }),
          );
        });
        return item;
      };

      const desktopBtn = createButton();
      const mobileBtn = createButton();

      if (chapter.paper === 1) {
        if (paper1List) paper1List.appendChild(desktopBtn);
        if (mobilePaper1List) mobilePaper1List.appendChild(mobileBtn);
      } else {
        if (paper2List) paper2List.appendChild(desktopBtn);
        if (mobilePaper2List) mobilePaper2List.appendChild(mobileBtn);
      }
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
      btn.className = `topic-btn text-nowrap rounded-pill px-3 ${topic === "all" ? "active" : ""}`;
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

    // GSAP stagger entrance animation for topic buttons
    gsap.fromTo(
      "#topicFilters .topic-btn",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.04,
        ease: "back.out(1.5)",
      },
    );
  },

  /**
   * Check if a formula is saved in Bookmarks
   */
  isSaved: (formulaId) => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_formulas") || "[]");
      return saved.some((f) => f.id === formulaId);
    } catch (e) {
      return false;
    }
  },

  /**
   * Toggle saved status of a formula
   */
  toggleSaved: (formula, btnElement, badgeElement = null) => {
    try {
      let saved = JSON.parse(localStorage.getItem("saved_formulas") || "[]");
      const exists = saved.some((f) => f.id === formula.id);

      if (exists) {
        saved = saved.filter((f) => f.id !== formula.id);
        if (btnElement) btnElement.classList.remove("active");
      } else {
        saved.push(formula);
        if (btnElement) btnElement.classList.add("active");
      }

      localStorage.setItem("saved_formulas", JSON.stringify(saved));

      // Update badge counts dynamically
      const countBadge = document.getElementById("savedCountBadge");
      if (countBadge) countBadge.textContent = saved.length;

      // Update mobile badge if present
      const mobileCountBadge = document.getElementById("mobileSavedCountBadge");
      if (mobileCountBadge) mobileCountBadge.textContent = saved.length;

      // If we are currently inside the Bookmarks view/tab, trigger re-render
      const formulasView = document.getElementById("formulasView");
      const currentTitle = document.getElementById("currentChapterTitle");
      if (
        currentTitle &&
        currentTitle.querySelector(".en-title").textContent === "Saved Formulas"
      ) {
        renderManager.renderFormulasGrid(saved);
      }

      // Dispatch event to notify state changes
      document.dispatchEvent(
        new CustomEvent("bookmarksChanged", { detail: saved }),
      );
    } catch (e) {
      console.error("Failed to toggle bookmark", e);
    }
  },

  /**
   * Renders the grid of formula cards
   */
  renderFormulasGrid: (formulas) => {
    const grid = document.getElementById("formulasGrid");
    grid.innerHTML = "";

    if (formulas.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mb-3 opacity-50"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <p class="fs-5">No saved formulas found. Start starring equations to save them here!</p>
        </div>
      `;
      return;
    }

    formulas.forEach((formula, index) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-xl-4 formula-card-wrapper";

      const isSaved = renderManager.isSaved(formula.id);

      col.innerHTML = `
                <div class="formula-card h-100 p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge bg-light text-primary-accent rounded-pill px-2 py-1 small">${formula.topic}</span>
                        <div class="d-flex align-items-center gap-2">
                            ${formula.hasVisualization ? '<span class="badge bg-success-subtle text-success rounded-pill px-2 py-1 small">Interactive</span>' : ""}
                            <button class="bookmark-btn ${isSaved ? "active" : ""}" data-id="${formula.id}" title="Save Formula">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="formula-card-clickable flex-grow-1 d-flex flex-column">
                        <h5 class="formula-name mb-1">${formula.nameEn}</h5>
                        <p class="bn-title text-muted small mb-3">${formula.nameBn}</p>
                        <div class="formula-preview text-center py-3 bg-light rounded-3 overflow-hidden">
                            ${utils.renderMath(formula.latex)}
                        </div>
                    </div>
                </div>
            `;

      // Set up click listeners
      const card = col.querySelector(".formula-card");
      const bookmarkBtn = col.querySelector(".bookmark-btn");
      const clickableArea = col.querySelector(".formula-card-clickable");

      bookmarkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderManager.toggleSaved(formula, bookmarkBtn);
        const svg = bookmarkBtn.querySelector("svg");
        if (bookmarkBtn.classList.contains("active")) {
          svg.setAttribute("fill", "currentColor");
        } else {
          svg.setAttribute("fill", "none");
        }
      });

      clickableArea.addEventListener("click", () => {
        document.dispatchEvent(
          new CustomEvent("openFormulaModal", { detail: formula }),
        );
      });

      grid.appendChild(col);
    });

    // GSAP stagger entrance animation for formula cards
    gsap.fromTo(
      "#formulasGrid .formula-card-wrapper",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power2.out" },
    );
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

    // Setup modal bookmark star state
    const modalBookmarkBtn = document.getElementById("modalBookmarkBtn");
    const isSaved = renderManager.isSaved(formula.id);
    if (isSaved) {
      modalBookmarkBtn.classList.add("active");
      modalBookmarkBtn
        .querySelector("svg")
        .setAttribute("fill", "currentColor");
    } else {
      modalBookmarkBtn.classList.remove("active");
      modalBookmarkBtn.querySelector("svg").setAttribute("fill", "none");
    }

    // Re-bind modal bookmark button click
    const newBookmarkBtn = modalBookmarkBtn.cloneNode(true);
    modalBookmarkBtn.parentNode.replaceChild(newBookmarkBtn, modalBookmarkBtn);
    newBookmarkBtn.addEventListener("click", () => {
      renderManager.toggleSaved(formula, newBookmarkBtn);
      const svg = newBookmarkBtn.querySelector("svg");
      if (newBookmarkBtn.classList.contains("active")) {
        svg.setAttribute("fill", "currentColor");
      } else {
        svg.setAttribute("fill", "none");
      }

      // Synchronize in formulas grid
      const gridBtn = document.querySelector(
        `.formula-card .bookmark-btn[data-id="${formula.id}"]`,
      );
      if (gridBtn) {
        if (newBookmarkBtn.classList.contains("active")) {
          gridBtn.classList.add("active");
          gridBtn.querySelector("svg").setAttribute("fill", "currentColor");
        } else {
          gridBtn.classList.remove("active");
          gridBtn.querySelector("svg").setAttribute("fill", "none");
        }
      }
    });

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
      document.getElementById("modalAssumptions").innerHTML =
        utils.renderMathInText(formula.assumptions);
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
                    ${formula.mcqShortcuts.map((s) => `<li class="mb-2">${utils.renderMathInText(s)}</li>`).join("")}
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
  vizConfig,

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

    labFormulas.forEach((formula, i) => {
      const col = document.createElement("div");
      col.className = "col-12 col-xl-6 lab-card-wrapper mb-4";

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

    // GSAP stagger entrance animation for lab cards
    gsap.fromTo(
      "#labGrid .lab-card-wrapper",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
    );
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

  /**
   * Renders the dynamic revision dashboard
   */
  renderDashboard: (chaptersList) => {
    const dashboard = document.getElementById("dashboardView");
    if (!dashboard) return;

    // Get current saved formulas count from localStorage
    let savedCount = 0;
    try {
      savedCount = JSON.parse(
        localStorage.getItem("saved_formulas") || "[]",
      ).length;
    } catch (e) {}

    // Calculate total chapters
    const totalChapters = chaptersList.length;

    // Predefined list of popular iconic physics formulas for Formula of the Day
    const iconicFormulas = [
      {
        id: "p1_ch3_projectile",
        chapterId: "p1_ch3",
        topic: "Projectile Motion",
        nameEn: "Maximum height of projectile",
        nameBn: "প্রক্ষেপকের সর্বাধিক উচ্চতা",
        latex: "H = \\frac{u^2 \\sin^2\\theta_0}{2g}",
        variables: [
          {
            symbol: "H",
            meaning: "Maximum vertical height reached",
            unit: "m",
          },
          {
            symbol: "u",
            meaning: "Initial velocity of projection",
            unit: "m/s",
          },
          {
            symbol: "\\theta_0",
            meaning: "Angle of projection with horizontal",
            unit: "rad",
          },
          {
            symbol: "g",
            meaning: "Acceleration due to gravity (9.8)",
            unit: "m/s^2",
          },
        ],
        assumptions: "Ideal projectile motion with no air resistance.",
        mcqShortcuts: [
          "For maximum height, projection angle must be 90 degrees.",
          "H is proportional to square of initial velocity (u^2).",
        ],
        specialCases: [
          {
            condition: "\\theta_0 = 90^\\circ",
            latex: "H_{max} = \\frac{u^2}{2g}",
          },
        ],
        hasVisualization: true,
        vizType: "projectile_advanced",
      },
      {
        id: "p2_ch4_biot_savart",
        chapterId: "p2_ch4",
        topic: "Biot-Savart Law",
        nameEn: "Biot-Savart law",
        nameBn: "বায়ো-সাভার সূত্র",
        latex: "dB = \\frac{\\mu_0}{4\\pi} \\frac{I\\,dl\\sin\\theta}{r^2}",
        variables: [
          {
            symbol: "dB",
            meaning: "Magnetic field element strength",
            unit: "T",
          },
          {
            symbol: "\\mu_0",
            meaning: "Permeability of free space",
            unit: "T m/A",
          },
          { symbol: "I", meaning: "Current flowing in conductor", unit: "A" },
          {
            symbol: "dl",
            meaning: "Infinitesimal length of conductor",
            unit: "m",
          },
          {
            symbol: "\\theta",
            meaning: "Angle between dl and displacement vector r",
            unit: "rad",
          },
          {
            symbol: "r",
            meaning: "Distance from current element to point",
            unit: "m",
          },
        ],
        assumptions: "Steady current flowing in a thin conductor in vacuum.",
        mcqShortcuts: [
          "Permeability of vacuum \\mu_0 = 4\\pi \\times 10^{-7} T m/A.",
          "Field is zero along the line of current element.",
        ],
        specialCases: [
          {
            condition: "\\theta = 90^\\circ",
            latex: "dB_{max} = \\frac{\\mu_0 I dl}{4\\pi r^2}",
          },
        ],
        hasVisualization: false,
      },
      {
        id: "p1_ch8_pendulum",
        chapterId: "p1_ch8",
        topic: "Simple Pendulum",
        nameEn: "Time period of pendulum",
        nameBn: "সরল দোলকের দোলনকাল",
        latex: "T = 2\\pi \\sqrt{\\frac{L}{g}}",
        variables: [
          { symbol: "T", meaning: "Time period of oscillation", unit: "s" },
          {
            symbol: "L",
            meaning: "Effective length of pendulum (l + r)",
            unit: "m",
          },
          {
            symbol: "g",
            meaning: "Acceleration due to gravity",
            unit: "m/s^2",
          },
        ],
        assumptions:
          "Angular displacement is very small (less than 4 degrees), friction-free pivot.",
        mcqShortcuts: [
          "T is directly proportional to square root of L.",
          "Time period of second's pendulum is exactly 2 seconds (L is approx 99.3 cm on Earth).",
        ],
        specialCases: [
          {
            condition: "L \\to \\infty \\text{ (Earth Radius R)}",
            latex: "T = 2\\pi \\sqrt{\\frac{R}{g}} \\approx 84.6 \\text{ min}",
          },
        ],
        hasVisualization: true,
        vizType: "simple_pendulum",
      },
      {
        id: "p2_ch1_carnot",
        chapterId: "p2_ch1",
        topic: "Carnot Engine",
        nameEn: "Carnot engine efficiency",
        nameBn: "কার্নো ইঞ্জিনের কর্মদক্ষতা",
        latex: "\\eta = 1 - \\frac{T_2}{T_1}",
        variables: [
          {
            symbol: "\\eta",
            meaning: "Thermal efficiency (fractional)",
            unit: "",
          },
          {
            symbol: "T_1",
            meaning: "Absolute temperature of source",
            unit: "K",
          },
          { symbol: "T_2", meaning: "Absolute temperature of sink", unit: "K" },
        ],
        assumptions:
          "Reversible thermodynamic Carnot cycle with no heat losses.",
        mcqShortcuts: [
          "Efficiency can only be 100% (\\eta = 1) if Sink temperature T2 is absolute zero (0 K), which is practically impossible.",
          "Always convert temperatures to Kelvin (K) first!",
        ],
        specialCases: [
          {
            condition: "T_2 = T_1",
            latex: "\\eta = 0 \\text{ (No work done)}",
          },
        ],
        hasVisualization: true,
        vizType: "carnot_cycle",
      },
    ];

    // Select formula of the day based on current calendar date
    const dateIndex = new Date().getDate() % iconicFormulas.length;
    const fod = iconicFormulas[dateIndex];

    // Read Recently Visited Chapters from localStorage
    let recentChapters = [];
    try {
      recentChapters = JSON.parse(
        localStorage.getItem("recent_chapters") || "[]",
      );
    } catch (e) {
      recentChapters = [];
    }

    // Fallback default chapters if there are no recents yet
    const defaults = [
      {
        id: "p1_ch2",
        nameEn: "Chapter 2: Vector",
        nameBn: "অধ্যায় ২: ভেক্টর",
        paper: 1,
      },
      {
        id: "p1_ch6",
        nameEn: "Chapter 6: Gravitation & Gravity",
        nameBn: "অধ্যায় ৬: মহাকর্ষ ও অভিকর্ষ",
        paper: 1,
      },
      {
        id: "p2_ch1",
        nameEn: "Chapter 1: Thermodynamics",
        nameBn: "অধ্যায় ১: তাপগতিবিদ্যা",
        paper: 2,
      },
      {
        id: "p2_ch10",
        nameEn: "Chapter 10: Semiconductor & Electronics",
        nameBn: "অধ্যায় ১০: সেমিকন্ডাক্টর ও ইলেকট্রনিক্স",
        paper: 2,
      },
    ];

    const displayChapters =
      recentChapters.length > 0 ? recentChapters.slice(0, 4) : defaults;
    const isHistory = recentChapters.length > 0;

    let quickLinksHtml = "";
    displayChapters.forEach((ch, idx) => {
      const displayId = ch.id.split("_")[1].replace("ch", "");
      quickLinksHtml += `
        <button class="quick-link-item list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 rounded-3" id="quickLinkCh-${ch.id}">
            <div class="d-flex flex-column align-items-start">
                <span class="fw-medium text-dark text-start" style="font-size: 0.9rem;">${ch.nameEn.split(":")[1] || ch.nameEn}</span>
                <span class="text-muted bn-title x-small text-start">${ch.nameBn}</span>
            </div>
            <span class="badge bg-light text-primary rounded-pill px-2">P${ch.paper} CH ${displayId}</span>
        </button>
      `;
    });

    dashboard.innerHTML = `
        <!-- Welcome Jumbotron -->
        <div class="welcome-banner text-center text-md-start mb-4">
            <div class="row align-items-center">
                <div class="col-md-8 mb-3 mb-md-0">
                    <h2 class="fw-bold mb-2">Welcome to HSC Physics Revision!</h2>
                    <p class="lead text-muted mb-0">Explore interactive visualizations, revise essential physics equations, and master concepts for Paper 1 and Paper 2 with ease.</p>
                </div>
                <div class="col-md-4 text-center">
                    <div class="brand-badge p-3 bg-white rounded-3 shadow-sm border d-inline-block">
                        <img src="./assets/icon.png" alt="Logo" width="64" height="64" class="mb-2">
                        <h6 class="m-0 fw-bold text-primary">Interactive Physics Lab</h6>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Statistics Counters -->
        <div class="row g-4 mb-4">
            <div class="col-12 col-md-4">
                <div class="dashboard-stat-card shadow-sm">
                    <div class="dashboard-stat-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h4 class="fw-bold m-0"><span class="stat-number" data-target="${totalChapters}">0</span></h4>
                        <small class="text-muted">Total Revision Chapters</small>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4">
                <div class="dashboard-stat-card shadow-sm">
                    <div class="dashboard-stat-icon" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h4 class="fw-bold m-0"><span class="stat-number" data-target="35" data-suffix="+">0</span></h4>
                        <small class="text-muted">Interactive Physics Lab Sims</small>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-4">
                <div class="dashboard-stat-card shadow-sm" id="dashboardSavedCardBtn" style="cursor: pointer;">
                    <div class="dashboard-stat-icon" style="background-color: rgba(234, 179, 8, 0.1); color: #eab308;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <div>
                        <h4 class="fw-bold m-0" id="dashboardSavedCount"><span class="stat-number" data-target="${savedCount}">0</span></h4>
                        <small class="text-muted">Saved Formulas Bookmarked</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <!-- Formula of the Day -->
            <div class="col-12 col-lg-7">
                <div class="formula-of-day-card p-4 border h-100 d-flex flex-column shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-warning text-dark px-3 py-2 rounded-pill small fw-bold">FORMULA OF THE DAY</span>
                        <small class="text-muted">${fod.topic}</small>
                    </div>
                    <h4 class="fw-bold text-primary mb-1">${fod.nameEn}</h4>
                    <p class="bn-title text-muted mb-3">${fod.nameBn}</p>
                    
                    <div class="formula-hero text-center py-4 my-3 bg-light rounded-3 overflow-x-auto overflow-y-hidden border">
                        <div class="fs-3 px-3">${utils.renderMath(fod.latex)}</div>
                    </div>
 
                    <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                        <span class="text-muted small">Chapter: ${fod.chapterId.toUpperCase().replace("_", " ")}</span>
                        <button class="btn btn-primary rounded-pill px-4" id="openFodBtn">Learn & Visualize</button>
                    </div>
                </div>
            </div>

            <!-- Quick Access Menu -->
            <div class="col-12 col-lg-5">
                <div class="card border p-4 h-100 shadow-sm bg-white rounded-3">
                    <h5 class="fw-bold mb-3 border-bottom pb-2">${isHistory ? "Recently Visited Chapters" : "Featured Chapters"}</h5>
                    <div class="d-flex flex-column gap-2">
                        ${quickLinksHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Bind event listeners for the dashboard buttons
    document.getElementById("openFodBtn").addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("openFormulaModal", { detail: fod }),
      );
    });

    document
      .getElementById("dashboardSavedCardBtn")
      .addEventListener("click", () => {
        const savedBtn = document.getElementById("savedFormulasBtn");
        if (savedBtn) savedBtn.click();
      });

    // Helper to simulate sidebar clicks for dynamic navigation links
    const triggerSidebarClick = (chapterId, paper) => {
      // Switch paper tab first (Desktop)
      const tabId = paper === 1 ? "paper1-tab" : "paper2-tab";
      const paperTab = document.getElementById(tabId);
      if (paperTab) paperTab.click();

      // Switch mobile paper tab too (Mobile)
      const mobileTabId = paper === 1 ? "mobilePaper1-tab" : "mobilePaper2-tab";
      const mobilePaperTab = document.getElementById(mobileTabId);
      if (mobilePaperTab) mobilePaperTab.click();

      setTimeout(() => {
        const btn = document.querySelector(
          `.chapter-list button[data-chapter-id="${chapterId}"]`,
        );
        if (btn) {
          btn.click();
        }
      }, 150);
    };

    // Bind click listeners for recent chapters
    displayChapters.forEach((ch) => {
      const linkBtn = document.getElementById(`quickLinkCh-${ch.id}`);
      if (linkBtn) {
        linkBtn.addEventListener("click", () =>
          triggerSidebarClick(ch.id, ch.paper),
        );
      }
    });

    // --- GSAP ANIMATIONS FOR DASHBOARD ---
    // 1. Roll-up statistics counters
    document.querySelectorAll(".stat-number").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-target"));
      const suffix = el.getAttribute("data-suffix") || "";
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.floor(obj.val) + suffix;
        },
      });
    });

    // 2. Stagger elements
    gsap.fromTo(
      ".welcome-banner",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );

    gsap.fromTo(
      ".dashboard-stat-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" },
    );

    gsap.fromTo(
      ".formula-of-day-card",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
    );

    gsap.fromTo(
      ".quick-link-item",
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
    );
  },
};
