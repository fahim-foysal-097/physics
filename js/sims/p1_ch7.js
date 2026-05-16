export const p1_ch7_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "poissons_ratio") {
      sketch.ratio = 0.3;
      sketch.t = 0;
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "poissons_ratio":
        let mid = sketch.width / 2;
        let str = sketch.sin(sketch.frameCount * 0.05) * 40;
        // Left
        sketch.push();
        sketch.translate(mid / 2, sketch.height / 2);
        sketch.fill("#10b981");
        sketch.rect(
          -(40 - str * 0.3) / 2,
          -(100 + str) / 2,
          40 - str * 0.3,
          100 + str,
        );
        sketch.fill(0);
        sketch.noStroke();
        sketch.text("σ = 0.3 (Positive)", -40, 80);
        sketch.pop();
        // Right
        sketch.push();
        sketch.translate(mid + mid / 2, sketch.height / 2);
        sketch.fill("#f59e0b");
        sketch.rect(
          -(40 + str * 0.3) / 2,
          -(100 + str) / 2,
          40 + str * 0.3,
          100 + str,
        );
        sketch.fill(0);
        sketch.noStroke();
        sketch.text("σ = -0.3 (Negative)", -40, 80);
        sketch.pop();
        break;
    }
  },
};
