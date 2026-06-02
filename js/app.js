import { chapters } from "../data/chapters.js";
import { utils } from "./utils.js";
import { renderManager } from "./render.js";
import { vizManager } from "./visualizations.js";

// Application State
const state = {
  currentChapter: null,
  currentFormulas: [],
  currentView: "formulas", // 'formulas' or 'lab'
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  // Track active async load promise to prevent race conditions
  let activeLoadPromiseId = null;

  // View Transition Helper using GSAP
  const transitionToView = (targetViewName) => {
    vizManager.clearAllInstances();

    const views = {
      dashboard: document.getElementById("dashboardView"),
      formulas: document.getElementById("formulasView"),
      lab: document.getElementById("labView"),
    };

    // Kill any active transitions to prevent glitches on rapid clicks
    gsap.killTweensOf([views.dashboard, views.formulas, views.lab]);

    let activeView = null;
    Object.keys(views).forEach((key) => {
      if (views[key] && !views[key].classList.contains("d-none")) {
        activeView = views[key];
      }
    });

    const targetView = views[targetViewName];
    if (!targetView) return;

    if (activeView === targetView) {
      // Just re-run entrance animation on current view
      gsap.fromTo(
        targetView,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          clearProps: "all",
        },
      );
      return;
    }

    state.currentView = targetViewName;

    // Sync buttons
    const btnFormulas = document.getElementById("viewFormulas");
    const btnLab = document.getElementById("viewLab");
    if (btnFormulas) btnFormulas.checked = targetViewName === "formulas";
    if (btnLab) btnLab.checked = targetViewName === "lab";

    const tl = gsap.timeline();

    if (activeView) {
      tl.to(activeView, {
        opacity: 0,
        y: -15,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          activeView.classList.add("d-none");
        },
      });
    }

    tl.call(() => {
      targetView.classList.remove("d-none");
    });

    tl.fromTo(
      targetView,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      },
    );
  };

  // 1. Render Sidebar Chapters
  renderManager.renderChapters(chapters);

  // 2. Render initial welcome dashboard
  const dashboardView = document.getElementById("dashboardView");
  const formulasView = document.getElementById("formulasView");
  const labView = document.getElementById("labView");

  const showDashboard = () => {
    state.currentChapter = null;
    state.currentFormulas = [];

    // Clear active states in chapter list
    document
      .querySelectorAll(".chapter-list .list-group-item")
      .forEach((el) => el.classList.remove("active"));

    // Update titles
    const titleEl = document.getElementById("currentChapterTitle");
    if (titleEl) {
      titleEl.querySelector(".en-title").textContent = "Revision Dashboard";
      titleEl.querySelector(".bn-title").textContent = "রিভিশন ড্যাশবোর্ড";
    }

    // Render stats and dashboard components
    renderManager.renderDashboard(chapters);
    transitionToView("dashboard");
  };

  // Render initial dashboard home
  showDashboard();

  // Update initial bookmark badge counters
  try {
    const saved = JSON.parse(localStorage.getItem("saved_formulas") || "[]");
    const countBadge = document.getElementById("savedCountBadge");
    if (countBadge) countBadge.textContent = saved.length;
  } catch (e) {}

  // 3. Set up Event Listeners
  document.addEventListener("loadChapter", async (e) => {
    const chapter = e.detail;
    state.currentChapter = chapter;

    // Track this load process via a unique symbol to prevent async race conditions
    const currentPromiseId = Symbol("loadPromise");
    activeLoadPromiseId = currentPromiseId;

    // Synchronize active states in both desktop and mobile sidebars
    document
      .querySelectorAll(".chapter-list .list-group-item")
      .forEach((el) => {
        if (el.getAttribute("data-chapter-id") === chapter.id) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });

    // Update Title
    const titleEl = document.getElementById("currentChapterTitle");
    if (titleEl) {
      const enTitle = titleEl.querySelector(".en-title");
      const bnTitle = titleEl.querySelector(".bn-title");
      if (enTitle) enTitle.textContent = chapter.nameEn;
      if (bnTitle) bnTitle.textContent = chapter.nameBn;
    }

    // Log this chapter to Recently Visited Chapters history
    try {
      if (chapter && chapter.id !== "saved") {
        let recents = JSON.parse(
          localStorage.getItem("recent_chapters") || "[]",
        );
        // Remove duplicate if it exists and push to the front
        recents = recents.filter((c) => c.id !== chapter.id);
        recents.unshift(chapter);
        // Keep max 4 recent chapters
        if (recents.length > 4) recents.pop();
        localStorage.setItem("recent_chapters", JSON.stringify(recents));
      }
    } catch (err) {
      console.warn("Failed to save recent chapter:", err);
    }

    try {
      const moduleName = `formulas_${chapter.id}`;
      const module = await import(`../data/formulas/${chapter.id}.js`);
      
      // Discard older promise resolution if a newer chapter has been selected in the meantime
      if (activeLoadPromiseId !== currentPromiseId) {
        return;
      }

      state.currentFormulas = module[moduleName];

      if (state.currentView === "lab") {
        renderManager.renderLabPage(state.currentFormulas, chapter.id);
        transitionToView("lab");
      } else {
        renderManager.renderTopics(state.currentFormulas, (selectedTopic) => {
          if (selectedTopic === "all") {
            renderManager.renderFormulasGrid(state.currentFormulas);
          } else {
            const filtered = state.currentFormulas.filter(
              (f) => f.topic === selectedTopic,
            );
            renderManager.renderFormulasGrid(filtered);
          }
        });
        renderManager.renderFormulasGrid(state.currentFormulas);
        transitionToView("formulas");
      }
    } catch (error) {
      if (activeLoadPromiseId === currentPromiseId) {
        console.error(`Failed to load formulas for chapter ${chapter.id}`, error);
      }
    }

    const bsOffcanvas = bootstrap.Offcanvas.getInstance(
      document.getElementById("mobileSidebar"),
    );
    if (bsOffcanvas) bsOffcanvas.hide();
  });

  document.addEventListener("openFormulaModal", (e) => {
    renderManager.openFormulaModal(e.detail);
  });

  // 4. Saved Formulas Button Click
  const savedFormulasBtn = document.getElementById("savedFormulasBtn");
  savedFormulasBtn.addEventListener("click", () => {
    state.currentChapter = {
      id: "saved",
      nameEn: "Saved Formulas",
      nameBn: "সংরক্ষিত সূত্রসমূহ",
    };

    // Clear active states in chapters list
    document
      .querySelectorAll(".chapter-list .list-group-item")
      .forEach((el) => el.classList.remove("active"));

    const titleEl = document.getElementById("currentChapterTitle");
    if (titleEl) {
      titleEl.querySelector(".en-title").textContent = "Saved Formulas";
      titleEl.querySelector(".bn-title").textContent = "সংরক্ষিত সূত্রসমূহ";
    }

    // Hide topic filters since saved formulas can belong to multiple chapters/topics
    document.getElementById("topicFilters").innerHTML = "";

    try {
      const saved = JSON.parse(localStorage.getItem("saved_formulas") || "[]");
      state.currentFormulas = saved;
      renderManager.renderFormulasGrid(saved);
      transitionToView("formulas");
    } catch (e) {
      state.currentFormulas = [];
      renderManager.renderFormulasGrid([]);
      transitionToView("formulas");
    }
  });

  // Listen to bookmarks list changes to update stats counter dynamically if dashboard is active
  document.addEventListener("bookmarksChanged", (e) => {
    const saved = e.detail;
    const statCounter = document.getElementById("dashboardSavedCount");
    if (statCounter) {
      statCounter.textContent = saved.length;
      // Micro-animation for bookmark bump
      gsap.fromTo(
        statCounter,
        { scale: 1.3 },
        { scale: 1, duration: 0.3, ease: "back.out(2)" },
      );
    }
  });

  // Home / Logo Nav Clicks
  document.getElementById("brandLogoHome").addEventListener("click", (e) => {
    e.preventDefault();
    showDashboard();
  });

  document.getElementById("navHomeBtn").addEventListener("click", (e) => {
    e.preventDefault();
    showDashboard();
  });

  // 5. Mobile Saved Formulas Button Binding
  const mobileSavedFormulasBtn = document.getElementById(
    "mobileSavedFormulasBtn",
  );
  if (mobileSavedFormulasBtn) {
    mobileSavedFormulasBtn.addEventListener("click", () => {
      savedFormulasBtn.click();
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById("mobileSidebar"),
      );
      if (bsOffcanvas) bsOffcanvas.hide();
    });
  }

  // 6. View Switching
  const btnFormulas = document.getElementById("viewFormulas");
  const btnLab = document.getElementById("viewLab");

  // Sync initial view state
  if (btnLab && btnLab.checked) {
    state.currentView = "lab";
  } else {
    state.currentView = "formulas";
  }

  btnFormulas.addEventListener("change", () => {
    if (btnFormulas.checked) {
      if (state.currentChapter) {
        if (state.currentChapter.id === "saved") {
          const saved = JSON.parse(
            localStorage.getItem("saved_formulas") || "[]",
          );
          state.currentFormulas = saved;
          renderManager.renderFormulasGrid(saved);
          transitionToView("formulas");
        } else {
          renderManager.renderTopics(state.currentFormulas, (selectedTopic) => {
            if (selectedTopic === "all") {
              renderManager.renderFormulasGrid(state.currentFormulas);
            } else {
              const filtered = state.currentFormulas.filter(
                (f) => f.topic === selectedTopic,
              );
              renderManager.renderFormulasGrid(filtered);
            }
          });
          renderManager.renderFormulasGrid(state.currentFormulas);
          transitionToView("formulas");
        }
      } else {
        showDashboard();
      }
    }
  });

  btnLab.addEventListener("change", () => {
    if (btnLab.checked) {
      if (state.currentChapter && state.currentChapter.id !== "saved") {
        renderManager.renderLabPage(
          state.currentFormulas,
          state.currentChapter.id,
        );
        transitionToView("lab");
      } else {
        const grid = document.getElementById("labGrid");
        grid.innerHTML = `
            <div class="col-12 text-center py-5 mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted mb-3 opacity-50"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <h4 class="text-muted">Interactive Physics Lab</h4>
                <p class="text-muted mb-0">Please select a chapter from the sidebar to view its interactive simulations.</p>
            </div>
        `;
        transitionToView("lab");
      }
    }
  });

  // 7. Modal events
  const modalEl = document.getElementById("formulaModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", () => {
      const modalContent = modalEl.querySelector(".modal-content");

      // Elastic scale up the content box
      gsap.fromTo(
        modalContent,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" },
      );

      // Stagger animate header, hero, variables table, notes
      setTimeout(() => {
        gsap.fromTo(
          modalEl.querySelectorAll(
            ".modal-header, .formula-hero, .custom-tabs, #formulaDetailTabsContent",
          ),
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      }, 50);
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
      vizManager.stopAllAudio();
      if (vizManager.currentP5Instance) {
        vizManager.currentP5Instance.remove();
        vizManager.currentP5Instance = null;
      }
      if (vizManager.instances["modalVisualization"]) {
        vizManager.instances["modalVisualization"].remove();
        delete vizManager.instances["modalVisualization"];
      }

      // Reset styles for next opening
      const modalContent = modalEl.querySelector(".modal-content");
      gsap.set(modalContent, { scale: 1, opacity: 1 });
      gsap.set(
        modalEl.querySelectorAll(
          ".modal-header, .formula-hero, .custom-tabs, #formulaDetailTabsContent",
        ),
        { opacity: 1, y: 0 },
      );
    });
  }

  // 8. Stagger chapters list when paper tabs are switched
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
    tab.addEventListener("shown.bs.tab", () => {
      const activePane = document.querySelector(".tab-pane.active.show");
      if (activePane) {
        gsap.fromTo(
          activePane.querySelectorAll(".list-group-item"),
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            duration: 0.25,
            stagger: 0.015,
            ease: "power2.out",
          },
        );
      }
    });
  });
});
