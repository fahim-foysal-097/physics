import { chapters } from "../data/chapters.js";
import { utils } from "./utils.js";
import { renderManager } from "./render.js";
import { searchManager } from "./search.js";
import { vizManager } from "./visualizations.js";

// Application State
const state = {
  currentChapter: null,
  currentFormulas: [],
  allFormulasCache: [], // Used for global search
  currentView: "formulas", // 'formulas' or 'lab'
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Render Sidebar Chapters
  renderManager.renderChapters(chapters);

  // 2. Pre-load formulas for search cache
  try {
    const modules = await Promise.all(
      chapters.map((ch) => import(`../data/formulas/${ch.id}.js`)),
    );

    state.allFormulasCache = modules.flatMap(
      (mod, i) => mod[`formulas_${chapters[i].id}`],
    );

    searchManager.init(state.allFormulasCache);
  } catch (e) {
    console.warn("Could not load initial formula cache.", e);
  }

  // 3. Set up Event Listeners
  document.addEventListener("loadChapter", async (e) => {
    vizManager.stopAllAudio();
    const chapter = e.detail;
    state.currentChapter = chapter;

    if (state.currentView === "lab") {
      renderManager.renderLabPage(state.allFormulasCache, chapter.id);
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById("mobileSidebar"),
      );
      if (bsOffcanvas) bsOffcanvas.hide();
      return;
    }

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

      const bsOffcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById("mobileSidebar"),
      );
      if (bsOffcanvas) bsOffcanvas.hide();
    } catch (error) {
      console.error(`Failed to load formulas for chapter ${chapter.id}`, error);
    }
  });

  document.addEventListener("openFormulaModal", (e) => {
    renderManager.openFormulaModal(e.detail);
  });

  // 4. Mobile Sidebar Handling
  const mobileSidebarBody = document.querySelector(
    "#mobileSidebar .offcanvas-body",
  );
  mobileSidebarBody.innerHTML = document.getElementById("sidebar").innerHTML;

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
          // Both desktop and mobile buttons with the same index will get 'active'
          // This works because both lists are identical in structure
          const allItems = document.querySelectorAll(
            ".chapter-list .list-group-item",
          );
          const desktopItems = document.querySelectorAll(
            "#sidebar .chapter-list .list-group-item",
          );
          const mobileItems = mobileSidebarBody.querySelectorAll(
            ".chapter-list .list-group-item",
          );

          desktopItems[index].classList.add("active");
          mobileItems[index].classList.add("active");
        }
      });
    });

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
      vizManager.stopAllAudio();
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
      vizManager.stopAllAudio();
      state.currentView = "lab";
      formulasView.classList.add("d-none");
      labView.classList.remove("d-none");

      if (state.currentChapter) {
        renderManager.renderLabPage(
          state.allFormulasCache,
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
    });

  // 7. Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.getElementById("searchInput").focus();
    }
  });
});
