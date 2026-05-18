export const vizManager = {
  currentP5Instance: null,
  instances: {},
  loadedModules: {},

  render: async (vizType, containerId, isLab = false, chapterId = null) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (container.clientWidth === 0) {
      setTimeout(
        () => vizManager.render(vizType, containerId, isLab, chapterId),
        100,
      );
      return;
    }

    // Clean up existing instances
    container.innerHTML = "";
    if (vizManager.instances[containerId]) {
      vizManager.instances[containerId].remove();
      delete vizManager.instances[containerId];
    }
    if (vizManager.currentP5Instance && containerId === "modalVisualization") {
      vizManager.currentP5Instance.remove();
      vizManager.currentP5Instance = null;
    }

    if (!chapterId) {
      console.error("chapterId is required for rendering visualizations.");
      return;
    }

    // Dynamic Import of Chapter Simulation Module
    let module;
    try {
      const moduleName = `${chapterId}_sims`;

      // Use a promise-based cache to avoid concurrent duplicate imports
      if (!vizManager.loadedModules[chapterId]) {
        vizManager.loadedModules[chapterId] = import(`./sims/${chapterId}.js`);
      }

      const moduleObj = await vizManager.loadedModules[chapterId];
      module = moduleObj[moduleName];
    } catch (e) {
      console.warn(`No simulation module found for chapter: ${chapterId}`, e);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const sketchFn = (sketch) => {
      sketch.vizType = vizType;

      sketch.setup = () => {
        sketch.createCanvas(width, height).parent(containerId);
        sketch.angleMode(sketch.RADIANS);

        if (module && typeof module.setup === "function") {
          module.setup(sketch, vizType);
        }
      };

      sketch.draw = () => {
        sketch.background("#f8fafc");
        if (module && typeof module.draw === "function") {
          module.draw(sketch, vizType);
        }
      };

      sketch.windowResized = () => {
        const currentContainer = document.getElementById(containerId);
        if (currentContainer) {
          const newWidth = currentContainer.clientWidth;
          const newHeight = currentContainer.clientHeight || 380;
          sketch.resizeCanvas(newWidth, newHeight);
        }
      };
    };

    const instance = new p5(sketchFn);
    if (isLab) {
      vizManager.instances[containerId] = instance;
    } else {
      vizManager.currentP5Instance = instance;
      vizManager.instances[containerId] = instance;
    }
  },

  stopAllAudio: () => {
    if (
      vizManager.currentP5Instance &&
      typeof vizManager.currentP5Instance.stopSound === "function"
    ) {
      vizManager.currentP5Instance.stopSound();
    }
    Object.values(vizManager.instances).forEach((inst) => {
      if (inst && typeof inst.stopSound === "function") {
        inst.stopSound();
      }
    });
  },

  clearAllInstances: () => {
    vizManager.stopAllAudio();
    if (vizManager.currentP5Instance) {
      vizManager.currentP5Instance.remove();
      vizManager.currentP5Instance = null;
    }
    Object.keys(vizManager.instances).forEach((id) => {
      vizManager.instances[id].remove();
      delete vizManager.instances[id];
    });
  },
};
