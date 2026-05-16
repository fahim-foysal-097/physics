export const p1_ch4_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "banking_road") {
      sketch.angleMode(sketch.DEGREES);
      sketch.theta = 15;
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "banking_road":
        sketch.translate(sketch.width / 2, sketch.height / 2 + 50);
        let theta = sketch.theta || 15;
        sketch.rotate(-theta);
        sketch.stroke(100);
        sketch.strokeWeight(4);
        sketch.line(-100, 0, 100, 0);
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.rect(-20, -30, 40, 30, 5);

        // Forces
        sketch.strokeWeight(2);
        // Normal force
        p1_ch4_sims.drawArrow(sketch, 0, -15, 0, -80, "#10b981");
        sketch.fill(0);
        sketch.noStroke();
        sketch.text("N", 5, -85);
        // Gravity
        sketch.push();
        sketch.rotate(theta);
        p1_ch4_sims.drawArrow(sketch, 0, -15, 0, 60, "#3b82f6");
        sketch.fill(0);
        sketch.noStroke();
        sketch.text("mg", 5, 75);
        sketch.pop();
        break;
    }
  },

  drawArrow: (sketch, x1, y1, x2, y2, colorStr) => {
    sketch.stroke(colorStr);
    sketch.strokeWeight(2);
    sketch.fill(colorStr);
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);
    sketch.line(x1, y1, x2, y2);
    sketch.push();
    sketch.translate(x2, y2);
    let a = sketch.atan2(y1 - y2, x1 - x2);
    sketch.rotate(a);
    sketch.triangle(0, 0, 10, 4, 10, -4);
    sketch.pop();
  },
};
