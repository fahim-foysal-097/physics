export const p1_ch6_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "orbit_simulation") {
      sketch.t = 0;
      sketch.orbitR = 100;
      sketch.orbitV = 0.03;
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "orbit_simulation":
        sketch.translate(sketch.width / 2, sketch.height / 2);
        let r = sketch.orbitR || 100;
        sketch.fill("#3b82f6");
        sketch.noStroke();
        sketch.circle(0, 0, 40);
        let ox = r * sketch.cos(sketch.t);
        let oy = r * sketch.sin(sketch.t);
        sketch.fill("#ef4444");
        sketch.circle(ox, oy, 10);
        sketch.noFill();
        sketch.stroke(200);
        sketch.circle(0, 0, r * 2);
        sketch.t += sketch.orbitV || 0.03;
        break;
    }
  },
};
