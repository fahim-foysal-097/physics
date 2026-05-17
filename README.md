# HSC Physics Revision Website

A comprehensive, interactive, and beautifully designed web application for HSC Physics revision. This platform provides students with an easy-to-use interface to browse formulas, understand variables, and interact with physics simulations for both Paper 1 and Paper 2.

## 🛠️ Tech Stack

- **Framework**: Bootstrap 5
- **Mathematics**: KaTeX
- **Animations**: GSAP
- **Simulations**: p5.js & Chart.js

---

## 📖 How to Expand Content

### 1. Adding/Modifying Formulas

Formulas are modular. Each chapter has its own file in `data/formulas/pX_chY.js`.

**Formula Schema:**

```javascript
export const formulas_p1_ch = [
  {
    id: "formula_id",
    chapterId: "p1_ch2", // Must match chapter metadata
    topic: "Topic Name", // Used for filtering
    nameEn: "English Name",
    nameBn: "Bengali Name",
    latex: "\\vec{F} = m\\vec{a}",
    variables: [{ symbol: "F", meaning: "Force", unit: "N" }],
    assumptions: "Ideal conditions...",
    specialCases: [{ condition: "\\theta = 90^\circ", latex: "F = 0" }],
    hasVisualization: true, // Set true for p5.js integration
    vizType: "my_sketch", // Trigger for chapter simulation module
  },
];
```

### 2. Creating New Simulations (Sandboxed)

Simulations are organized by chapter for better isolation. To add a new simulation:

1. **Modify Chapter Simulation File**: Open/Create `js/sims/pX_chY.js`.
2. **Add Logic to Module**: Add your sketch logic to the exported `pX_chY_sims` object.
   ```javascript
   export const p1_ch2_sims = {
     setup: (sketch, vizType) => {
       /* initialization */
     },
     draw: (sketch, vizType) => {
       /* p5 draw loop */
     },
   };
   ```
3. **Configure Controls**: In `js/render.js`, add an entry to `vizConfig`. This automatically generates UI sliders/buttons for your simulation.
   ```javascript
   my_sketch: [
     { id: "velocity", label: "Speed", min: 0, max: 100, val: 50 },
     { id: "reset", label: "Restart", type: "button" },
   ];
   ```
4. **Link to Data**: Set `vizType: "my_sketch"` in the formula data file (`data/formulas/pX_chY.js`).

### 3. Adding Static Diagrams

If a simulation isn't needed, you can use the `imageUrl` property in the formula data. The UI will automatically render a "Diagram" tab in the modal.

---

## 🏗️ Architecture & Performance

- **Dynamic Loading**: Formulas and Simulation modules are lazy-loaded via ES Modules only when a chapter is selected, keeping the initial payload light.
- **Isolation**: Each chapter's simulations are contained in their own module, preventing state conflicts between different physics concepts.
- **Audio Management**: Simulations using the Web Audio API are automatically suspended when the modal closes or pages change to prevent "ghost audio".

## 📄 License

Developed for HSC Students in Bangladesh. All rights reserved.
