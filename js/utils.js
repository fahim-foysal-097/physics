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
   * Parses text containing inline math enclosed in $...$, bold **...**, and code `...`
   */
  renderMathInText: (text) => {
    if (!text) return "";
    
    // Split the text by single dollar signs to separate math blocks from plain text
    const parts = text.split("$");
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Plain text block: escape HTML characters to prevent rendering bugs
        let escaped = parts[i]
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
          
        // Convert markdown bold: **text** -> <strong>text</strong>
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
        // Convert inline code: `code` -> <code>code</code>
        escaped = escaped.replace(/`(.*?)`/g, "<code>$1</code>");
        
        parts[i] = escaped;
      } else {
        // Math block: render using KaTeX
        try {
          if (typeof katex === "undefined") {
            parts[i] = parts[i];
          } else {
            parts[i] = katex.renderToString(parts[i], {
              throwOnError: false,
              displayMode: false,
            });
          }
        } catch (e) {
          console.error("KaTeX error in inline math:", e);
          // Fallback to original text if KaTeX fails
          parts[i] = "$" + parts[i] + "$";
        }
      }
    }
    
    return parts.join("");
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
