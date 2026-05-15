import { mechanicsSims } from "./sims/mechanics.js";
import { wavesSims } from "./sims/waves.js";
import { miscSims } from "./sims/misc.js";

export const vizManager = {
  currentP5Instance: null,
  instances: {},

  render: (vizType, containerId, isLab = false) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (container.clientWidth === 0) {
      setTimeout(() => vizManager.render(vizType, containerId, isLab), 100);
      return;
    }

    container.innerHTML = "";
    if (vizManager.instances[containerId]) {
      vizManager.instances[containerId].remove();
      delete vizManager.instances[containerId];
    }
    if (vizManager.currentP5Instance && containerId === "modalVisualization") {
      vizManager.currentP5Instance.remove();
      vizManager.currentP5Instance = null;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const sketchFn = (sketch) => {
      sketch.vizType = vizType;

      sketch.setup = () => {
        sketch.createCanvas(width, height).parent(containerId);
        sketch.angleMode(sketch.RADIANS);

        // Delegate setup to modules
        mechanicsSims.setup(sketch, vizType);
        wavesSims.setup(sketch, vizType);
        miscSims.setup(sketch, vizType);
      };

      sketch.draw = () => {
        sketch.background("#f8fafc");

        // Delegate draw to modules
        mechanicsSims.draw(sketch, vizType);
        wavesSims.draw(sketch, vizType);
        miscSims.draw(sketch, vizType);
      };
    };

    const instance = new p5(sketchFn);
    if (isLab) vizManager.instances[containerId] = instance;
    else vizManager.currentP5Instance = instance;
  },

  // Proxy for modules to use
  drawArrow: (sketch, x1, y1, x2, y2, colorStr) => {
    mechanicsSims.drawArrow(sketch, x1, y1, x2, y2, colorStr);
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
};
