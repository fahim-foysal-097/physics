export const p1_ch5_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "water_pump") {
      sketch.depth = 100;
      sketch.pump_rate = 0.2;
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "water_pump":
        sketch.translate(sketch.width / 2, sketch.height / 2 + 80);
        let dpt = sketch.depth || 50;
        sketch.stroke(100);
        sketch.strokeWeight(4);
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(-40, -100);
        sketch.vertex(-40, 0);
        sketch.vertex(40, 0);
        sketch.vertex(40, -100);
        sketch.endShape();
        sketch.noStroke();
        sketch.fill("#38bdf8");
        sketch.rect(-38, -dpt, 76, dpt);
        sketch.stroke("#64748b");
        sketch.strokeWeight(6);
        sketch.line(0, -120, 0, -dpt + 10);
        if (dpt > 0) {
          sketch.noStroke();
          sketch.fill("#38bdf8");
          sketch.circle(20, -115 + (sketch.frameCount % 20), 5);
          sketch.depth -= sketch.pump_rate || 0.2;
        }
        break;
    }
  },
};
