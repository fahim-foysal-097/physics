import { chapters } from "../data/chapters.js";
import { utils } from "./utils.js";
import { renderManager } from "./render.js";
import { vizManager } from "./visualizations.js";

// ── Dark Mode ────────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

// Application State
const state = {
  currentChapter: null,
  currentFormulas: [],
  currentView: "formulas", // 'formulas' or 'lab'
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Render Sidebar Chapters
  renderManager.renderChapters(chapters);

  // 1b. Dark Mode Toggle
  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // 2. Set up Event Listeners
  document.addEventListener("loadChapter", async (e) => {
    vizManager.clearAllInstances();
    const chapter = e.detail;
    state.currentChapter = chapter;

    // Update Title
    const titleEl = document.getElementById("currentChapterTitle");
    if (titleEl) {
      const enTitle = titleEl.querySelector(".en-title");
      const bnTitle = titleEl.querySelector(".bn-title");
      if (enTitle) enTitle.textContent = chapter.nameEn;
      if (bnTitle) bnTitle.textContent = chapter.nameBn;
    }

    try {
      const moduleName = `formulas_${chapter.id}`;
      const module = await import(`../data/formulas/${chapter.id}.js`);
      state.currentFormulas = module[moduleName];

      if (state.currentView === "lab") {
        renderManager.renderLabPage(state.currentFormulas, chapter.id);
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
      }
    } catch (error) {
      console.error(`Failed to load formulas for chapter ${chapter.id}`, error);
    }

    const bsOffcanvas = bootstrap.Offcanvas.getInstance(
      document.getElementById("mobileSidebar"),
    );
    if (bsOffcanvas) bsOffcanvas.hide();
  });

  document.addEventListener("openFormulaModal", (e) => {
    renderManager.openFormulaModal(e.detail);
  });

  // 4. Mobile Sidebar Handling
  const mobileSidebarBody = document.querySelector(
    "#mobileSidebar .offcanvas-body",
  );
  let sidebarHtml = document.getElementById("sidebar").innerHTML;

  // Replace IDs to prevent duplication on mobile and make Bootstrap tabs work
  sidebarHtml = sidebarHtml.replace(/id="paperTabs"/g, 'id="mobilePaperTabs"');
  sidebarHtml = sidebarHtml.replace(
    /id="paper1-tab"/g,
    'id="mobilePaper1-tab"',
  );
  sidebarHtml = sidebarHtml.replace(
    /id="paper2-tab"/g,
    'id="mobilePaper2-tab"',
  );
  sidebarHtml = sidebarHtml.replace(/id="paper1"/g, 'id="mobilePaper1"');
  sidebarHtml = sidebarHtml.replace(/id="paper2"/g, 'id="mobilePaper2"');
  sidebarHtml = sidebarHtml.replace(
    /data-bs-target="#paper1"/g,
    'data-bs-target="#mobilePaper1"',
  );
  sidebarHtml = sidebarHtml.replace(
    /data-bs-target="#paper2"/g,
    'data-bs-target="#mobilePaper2"',
  );
  sidebarHtml = sidebarHtml.replace(
    /id="chaptersPaper1"/g,
    'id="mobileChaptersPaper1"',
  );
  sidebarHtml = sidebarHtml.replace(
    /id="chaptersPaper2"/g,
    'id="mobileChaptersPaper2"',
  );

  mobileSidebarBody.innerHTML = sidebarHtml;

  // Re-bind click event listeners to list-group items in mobile sidebar
  mobileSidebarBody
    .querySelectorAll(".chapter-list .list-group-item")
    .forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const text = btn.querySelector(".fw-bold").textContent;
        const targetCh = chapters.find((c) => c.nameEn === text);
        if (targetCh) {
          document.dispatchEvent(
            new CustomEvent("loadChapter", { detail: targetCh }),
          );
          // Sync active state in both sidebars
          document
            .querySelectorAll(".chapter-list .list-group-item")
            .forEach((el) => el.classList.remove("active"));

          const desktopItems = document.querySelectorAll(
            "#sidebar .chapter-list .list-group-item",
          );
          const mobileItems = mobileSidebarBody.querySelectorAll(
            ".chapter-list .list-group-item",
          );

          if (desktopItems[index]) desktopItems[index].classList.add("active");
          if (mobileItems[index]) mobileItems[index].classList.add("active");
        }
      });
    });

  // Re-initialize Bootstrap tabs for the mobile sidebar since the IDs are renamed
  const mobileTabEl1 = document.getElementById("mobilePaper1-tab");
  const mobileTabEl2 = document.getElementById("mobilePaper2-tab");
  if (mobileTabEl1 && mobileTabEl2) {
    mobileTabEl1.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = new bootstrap.Tab(mobileTabEl1);
      tab.show();
    });
    mobileTabEl2.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = new bootstrap.Tab(mobileTabEl2);
      tab.show();
    });
  }

  // 5. View Switching
  const formulasView = document.getElementById("formulasView");
  const labView = document.getElementById("labView");
  const btnFormulas = document.getElementById("viewFormulas");
  const btnLab = document.getElementById("viewLab");

  // Sync initial view state
  if (btnLab && btnLab.checked) {
    state.currentView = "lab";
    formulasView.classList.add("d-none");
    labView.classList.remove("d-none");
  } else {
    state.currentView = "formulas";
    formulasView.classList.remove("d-none");
    labView.classList.add("d-none");
  }

  btnFormulas.addEventListener("change", () => {
    if (btnFormulas.checked) {
      vizManager.clearAllInstances();
      state.currentView = "formulas";
      formulasView.classList.remove("d-none");
      labView.classList.add("d-none");
      if (state.currentChapter) {
        document.dispatchEvent(
          new CustomEvent("loadChapter", { detail: state.currentChapter }),
        );
      }
    }
  });

  btnLab.addEventListener("change", () => {
    if (btnLab.checked) {
      vizManager.clearAllInstances();
      state.currentView = "lab";
      formulasView.classList.add("d-none");
      labView.classList.remove("d-none");

      if (state.currentChapter) {
        renderManager.renderLabPage(
          state.currentFormulas,
          state.currentChapter.id,
        );
      } else {
        const grid = document.getElementById("labGrid");
        grid.innerHTML = `
            <div class="col-12 text-center py-5 mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted mb-3 opacity-50"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <h4 class="text-muted">Interactive Physics Lab</h4>
                <p class="text-muted mb-0">Please select a chapter from the sidebar to view its interactive simulations.</p>
            </div>
        `;
      }
    }
  });

  // 6. Modal events
  document
    .getElementById("formulaModal")
    .addEventListener("hidden.bs.modal", () => {
      vizManager.stopAllAudio();
      if (vizManager.currentP5Instance) {
        vizManager.currentP5Instance.remove();
        vizManager.currentP5Instance = null;
      }
      if (vizManager.instances["modalVisualization"]) {
        vizManager.instances["modalVisualization"].remove();
        delete vizManager.instances["modalVisualization"];
      }
    });
});
