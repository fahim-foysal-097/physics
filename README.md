# HSC Physics Revision Website

A comprehensive, interactive, and beautifully designed web application for HSC Physics revision. This platform provides students with an easy-to-use interface to browse formulas, understand variables, and interact with physics simulations for both Paper 1 and Paper 2.

## 🚀 Features

- **21 Chapters Covered**: Complete coverage of HSC Physics 1st and 2nd Paper.
- **Interactive Lab**: p5.js based simulations to visualize complex physics concepts (e.g., Brownian Motion, Beats, Projectiles).
- **Fuzzy Search**: Quickly find formulas in both English and Bengali using Fuse.js.
- **Math Precision**: High-quality LaTeX rendering using KaTeX.
- **Modern UI**: Clean, responsive design built with Bootstrap 5 and custom CSS.
- **No Build Step**: Hosted directly as static files for maximum performance and portability.

## 🛠️ Tech Stack

- **Framework**: Bootstrap 5
- **Mathematics**: KaTeX
- **Search**: Fuse.js
- **Animations**: GSAP
- **Simulations**: p5.js & Chart.js

---

## 📖 How to Expand Content

### 1. Adding/Modifying Formulas

Formulas are modular. Each chapter has its own file in `data/formulas/pX_chY.js`.

**Formula Schema:**

```javascript
{
  id: "formula_id",
  chapterId: "p1_ch2",      // Must match chapter metadata
  topic: "Topic Name",      // Used for filtering
  nameEn: "English Name",
  nameBn: "Bengali Name",
  latex: "\\vec{F} = m\\vec{a}",
  variables: [
    { symbol: "F", meaning: "Force", unit: "N" }
  ],
  assumptions: "Ideal conditions...",
  specialCases: [
    { condition: "\\theta = 90^\circ", latex: "F = 0" }
  ],
  hasVisualization: true,   // Set true for p5.js integration
  vizType: "my_sketch"      // Trigger for js/visualizations.js
}
```

### 2. Creating New Simulations (The Lab)

The site features a unified "Interactive Lab" view. To add a new simulation:

1. **Write the Sketch**: Add your logic to one of the files in `js/sims/` (e.g., `mechanics.js`).
2. **Register in `visualizations.js`**: Update the `vizManager.render` method to include your new sketch type.
3. **Configure Controls**: In `js/render.js`, add an entry to `vizConfig`. This automatically generates UI sliders/buttons for your simulation in the Lab view.
   ```javascript
   my_sketch: [
     { id: "velocity", label: "Speed", min: 0, max: 100, val: 50 },
     { id: "reset", label: "Restart", type: "button" },
   ];
   ```
4. **Link to Data**: Set `vizType: "my_sketch"` in the formula data file.

### 3. Adding Static Diagrams

If a simulation isn't needed, you can use the `imageUrl` property in the formula data. The UI will automatically render a "Diagram" tab in the modal.

---

## 🏗️ Architecture & Performance

- **Dynamic Loading**: Formulas are lazy-loaded via ES Modules only when a chapter is selected, keeping the initial payload light.
- **Search Indexing**: On startup, the app asynchronously crawls all formula files to build a search index without blocking the UI.
- **Audio Management**: Simulations using the Web Audio API are automatically suspended when the modal closes or pages change to prevent "ghost audio".

## 📄 License

Developed for HSC Students in Bangladesh. All rights reserved.
