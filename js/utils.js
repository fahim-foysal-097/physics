// Helper Utilities
export const utils = {
  /**
   * Renders LaTeX string to HTML string using KaTeX
   */
  renderMath: (latexString, displayMode = false) => {
    try {
      return katex.renderToString(latexString, {
        throwOnError: false,
        displayMode: displayMode,
      });
    } catch (e) {
      console.error("KaTeX error:", e);
      return latexString;
    }
  },

  /**
   * Group an array of formula objects by a specific key (e.g., topic)
   */
  groupBy: (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue,
      );
      return result;
    }, {});
  },

  /**
   * Helper to load external script/image if needed
   */
  loadResource: () => {},
};
