export const p1_ch2_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "vector_addition" || vizType === "vector_area") {
      sketch.angleMode(sketch.DEGREES);
      sketch.pMag = 100;
      sketch.qMag = 80;
      sketch.angle = 60;
    }
  },

  draw: (sketch, vizType) => {
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "vector_addition":
        sketch.translate(sketch.width / 4, sketch.height / 2 + 50);
        let qA = sketch.angle || 60;
        let Px = sketch.pMag || 100;
        let Qx = (sketch.qMag || 80) * sketch.cos(qA);
        let Qy = -(sketch.qMag || 80) * sketch.sin(qA);
        p1_ch2_sims.drawArrow(sketch, 0, 0, Px, 0, "#0ea5e9");
        p1_ch2_sims.drawArrow(sketch, 0, 0, Qx, Qy, "#f59e0b");
        p1_ch2_sims.drawArrow(sketch, 0, 0, Px + Qx, Qy, "#4f46e5");
        break;

      case "vector_area":
        sketch.translate(sketch.width / 2 - 50, sketch.height / 2 + 50);
        let aMag = sketch.vecA_mag || 100;
        let bMag = sketch.vecB_mag || 80;
        let ang = sketch.angle || 60;
        let bX = bMag * sketch.cos(ang);
        let bY = -bMag * sketch.sin(ang);

        sketch.fill("#bae6fd");
        sketch.stroke("#38bdf8");
        sketch.beginShape();
        sketch.vertex(0, 0);
        sketch.vertex(aMag, 0);
        sketch.vertex(aMag + bX, bY);
        sketch.vertex(bX, bY);
        sketch.endShape(sketch.CLOSE);

        p1_ch2_sims.drawArrow(sketch, 0, 0, aMag, 0, "#0ea5e9");
        p1_ch2_sims.drawArrow(sketch, 0, 0, bX, bY, "#f59e0b");

        sketch.fill(0);
        sketch.noStroke();
        sketch.text(
          `Area = |A x B| = ${(aMag * bMag * sketch.sin(ang)).toFixed(0)}`,
          10,
          30,
        );
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
