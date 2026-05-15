# HSC Physics Revision Website

A comprehensive, interactive, and beautifully designed web application for HSC Physics revision.

## Architecture

This project is built using vanilla HTML5, CSS3, and JavaScript (ES6 Modules) to ensure it is incredibly fast and can be hosted directly on GitHub Pages without any build steps or complex node.js pipelines.

### Tech Stack

- **UI Framework:** Bootstrap 5 (Customized)
- **Math Rendering:** KaTeX (Faster and lighter than MathJax)
- **Animations:** GSAP
- **Search:** Fuse.js (Fuzzy searching with typo tolerance)
- **Visualizations:** p5.js and Chart.js

---

## How to Add New Content

### 1. Adding a New Chapter

To add a new chapter to the sidebar:

1. Open `data/chapters.js`.
2. Add a new object to the array. Ensure you provide a unique `id` (e.g., `p2_ch1`), the paper number, and names in both English and Bengali.

### 2. Adding Formulas

Formulas are stored in their respective chapter files inside `data/formulas/`.

1. Create or open the chapter file (e.g., `p1_ch1.js`).
2. If it's a new file, make sure to export it correctly: `export const formulas_p1_ch1 = [...]`
3. If it's a new file, you must **register** it in `js/app.js` so the search cache can find it initially (Optional, but recommended for global search).
4. Add a formula object to the array.

**Formula Object Structure:**

```javascript
{
    id: "unique_formula_id",
    chapterId: "p1_ch1", // Must match the file and chapters.js id
    topic: "Broad Topic Name (উপ-অধ্যায়)",
    nameEn: "Formula Name in English",
    nameBn: "সূত্রের নাম বাংলায়",
    latex: "\\text{Your LaTeX Equation here } x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    variables: [
        { symbol: "x", meaning: "Unknown variable", unit: "m" }
    ],
    assumptions: "Any conditions under which this is valid.",
    derivation: "\\text{Optional LaTeX derivation steps}",
    specialCases: [
        { condition: "a = 0", latex: "x = -c/b" }
    ],

    // Optional Visuals
    hasVisualization: true,
    vizType: "unique_sketch_name", // This triggers a p5.js sketch
    imageUrl: "https://example.com/diagram.png" // This will render an image tab
}
```

### 3. Adding Pictures and Diagrams

If you don't want to use an interactive simulation, you can just show a static image or diagram.

1. Upload your image to `assets/images/` or host it on an image hosting site.
2. In your formula object, add the `imageUrl` property: `imageUrl: "assets/images/my_diagram.png"`
3. The UI will automatically create a "Diagram" tab in the formula modal.

_(Note: The UI currently falls back to the visualization tab for `imageUrl`. To fully implement static images alongside p5.js, you can easily modify the `openFormulaModal` function in `js/render.js` to render an `<img>` tag if `formula.imageUrl` exists)._

### 4. Adding Interactive Simulations (p5.js)

To add a rich interactive simulation:

1. Open `js/visualizations.js`.
2. Find the `switch(vizType)` statement inside the `render` method.
3. Add a new `case "your_sketch_name":` block.
4. Inside the case, initialize a new p5 instance.

**Example Boilerplate:**

**Example Boilerplate:**

```javascript
          case "my_new_sketch":
            // sketch logic
            break;
```

5. In your formula object in the data file, set `hasVisualization: true` and `vizType: "my_new_sketch"`.
6. To add interactive controls (sliders/buttons) for the Interactive Lab page, update `vizConfig` in `js/render.js`:

```javascript
    my_new_sketch: [
      { id: "myVar", label: "My Variable", min: 0, max: 100, val: 50 },
      { id: "myAction", label: "Do Something", type: "button" }
    ],
```

7. **Audio / Sound:** If your sketch uses the Web Audio API or `p5.sound`, make sure to implement a `sketch.stopSound = async () => { ... }` method on the sketch object. The platform will automatically call this method when the user closes the modal or navigates to a different page to prevent ghost audio from playing.
