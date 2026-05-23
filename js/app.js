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
  // 1. Render Sidebar Chapters
  renderManager.renderChapters(chapters);

  // 2. Render initial welcome dashboard
  const dashboardView = document.getElementById("dashboardView");
  const formulasView = document.getElementById("formulasView");
  const labView = document.getElementById("labView");

  const showDashboard = () => {
    vizManager.clearAllInstances();
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

    // Toggle viewport visibility
    dashboardView.classList.remove("d-none");
    formulasView.classList.add("d-none");
    labView.classList.add("d-none");

    // Render stats and dashboard components
    renderManager.renderDashboard(chapters);
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
    vizManager.clearAllInstances();
    const chapter = e.detail;
    state.currentChapter = chapter;

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

    // Toggle viewport visibility
    dashboardView.classList.add("d-none");

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
      state.currentFormulas = module[moduleName];

      if (state.currentView === "lab") {
        formulasView.classList.add("d-none");
        labView.classList.remove("d-none");
        renderManager.renderLabPage(state.currentFormulas, chapter.id);
      } else {
        formulasView.classList.remove("d-none");
        labView.classList.add("d-none");
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

  // 4. Saved Formulas Button Click
  const savedFormulasBtn = document.getElementById("savedFormulasBtn");
  savedFormulasBtn.addEventListener("click", () => {
    vizManager.clearAllInstances();
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

    // Toggle viewport visibility
    dashboardView.classList.add("d-none");
    formulasView.classList.remove("d-none");
    labView.classList.add("d-none");

    // Hide topic filters since saved formulas can belong to multiple chapters/topics
    document.getElementById("topicFilters").innerHTML = "";

    try {
      const saved = JSON.parse(localStorage.getItem("saved_formulas") || "[]");
      state.currentFormulas = saved;
      renderManager.renderFormulasGrid(saved);
    } catch (e) {
      state.currentFormulas = [];
      renderManager.renderFormulasGrid([]);
    }
  });

  // Listen to bookmarks list changes to update stats counter dynamically if dashboard is active
  document.addEventListener("bookmarksChanged", (e) => {
    const saved = e.detail;
    const statCounter = document.getElementById("dashboardSavedCount");
    if (statCounter) statCounter.textContent = saved.length;
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

  // 5. Mobile Sidebar Handling
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
  sidebarHtml = sidebarHtml.replace(
    /id="savedFormulasBtn"/g,
    'id="mobileSavedFormulasBtn"',
  );
  sidebarHtml = sidebarHtml.replace(
    /id="savedCountBadge"/g,
    'id="mobileSavedCountBadge"',
  );

  mobileSidebarBody.innerHTML = sidebarHtml;

  // Re-bind Saved Formulas click on mobile
  const mobileSavedBtn = mobileSidebarBody.querySelector(
    "#mobileSavedFormulasBtn",
  );
  if (mobileSavedBtn) {
    mobileSavedBtn.addEventListener("click", () => {
      savedFormulasBtn.click();
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById("mobileSidebar"),
      );
      if (bsOffcanvas) bsOffcanvas.hide();
    });
  }

  // Re-bind click event listeners to list-group items in mobile sidebar
  mobileSidebarBody
    .querySelectorAll(".chapter-list .list-group-item")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const chapterId = btn.getAttribute("data-chapter-id");
        const targetCh = chapters.find((c) => c.id === chapterId);
        if (targetCh) {
          document.dispatchEvent(
            new CustomEvent("loadChapter", { detail: targetCh }),
          );
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
      vizManager.clearAllInstances();
      state.currentView = "formulas";

      if (state.currentChapter) {
        if (state.currentChapter.id === "saved") {
          savedFormulasBtn.click();
        } else {
          document.dispatchEvent(
            new CustomEvent("loadChapter", { detail: state.currentChapter }),
          );
        }
      } else {
        showDashboard();
      }
    }
  });

  btnLab.addEventListener("change", () => {
    if (btnLab.checked) {
      vizManager.clearAllInstances();
      state.currentView = "lab";

      dashboardView.classList.add("d-none");
      formulasView.classList.add("d-none");
      labView.classList.remove("d-none");

      if (state.currentChapter && state.currentChapter.id !== "saved") {
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

  // 7. Modal events
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
