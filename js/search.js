export const searchManager = {
  fuse: null,

  init: (allFormulas) => {
    const options = {
      includeScore: true,
      threshold: 0.4,
      keys: ["nameEn", "nameBn", "topic", "chapterId", "variables.meaning"],
    };

    // Ensure fuse is loaded
    if (window.Fuse) {
      searchManager.fuse = new Fuse(allFormulas, options);
      searchManager.setupListeners();
    } else {
      console.error("Fuse.js not loaded.");
    }
  },

  setupListeners: () => {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (query.length > 1) {
        const results = searchManager.fuse.search(query);
        searchManager.renderResults(results, searchResults);
      } else {
        searchResults.classList.add("d-none");
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchResults.classList.add("d-none");
        searchInput.value = "";
        searchInput.blur();
      }
    });

    // Hide results on outside click
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !searchResults.contains(e.target)
      ) {
        searchResults.classList.add("d-none");
      }
    });
  },

  renderResults: (results, container) => {
    container.innerHTML = "";

    if (results.length === 0) {
      container.innerHTML =
        '<div class="p-3 text-muted">No formulas found.</div>';
      container.classList.remove("d-none");
      return;
    }

    // Take top 10 results
    const topResults = results.slice(0, 10);

    topResults.forEach((item) => {
      const formula = item.item;
      const div = document.createElement("div");
      div.className = "search-result-item";
      div.innerHTML = `
                <div class="fw-bold">${formula.nameEn} <span class="text-muted fw-normal ms-2">${formula.nameBn}</span></div>
                <div class="small text-primary">${formula.topic}</div>
            `;

      div.addEventListener("click", () => {
        // Dispatch custom event to open modal
        document.dispatchEvent(
          new CustomEvent("openFormulaModal", { detail: formula }),
        );
        container.classList.add("d-none");
        document.getElementById("searchInput").value = "";
      });

      container.appendChild(div);
    });

    container.classList.remove("d-none");
  },
};
