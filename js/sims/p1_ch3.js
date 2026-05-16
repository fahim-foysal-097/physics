export const p1_ch3_sims = {
  getScaledG: (g) => (g * 0.4) / 9.8,

  setup: (sketch, vizType) => {
    if (vizType === "projectile_advanced") {
      sketch.angleMode(sketch.DEGREES);
      sketch.u = 60;
      sketch.angle = 45;
      sketch.h = 0;
      sketch.g = 9.8;
      sketch.isFiring = false;
      sketch.t = 0;
      sketch.path = [];
      sketch.R = 0;
      sketch.fire = () => {
        sketch.isFiring = true;
        sketch.t = 0;
        sketch.path = [];
      };
      sketch.reset = () => {
        sketch.isFiring = false;
        sketch.t = 0;
        sketch.path = [];
      };
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "projectile_advanced":
        sketch.translate(40, sketch.height - 40);
        sketch.stroke(200);
        sketch.line(-40, 0, sketch.width, 0);
        let s = 2.5;
        let g_scaled = p1_ch3_sims.getScaledG(sketch.g || 9.8);

        if (sketch.isFiring) {
          let x = sketch.u * sketch.cos(sketch.angle) * sketch.t;
          let y =
            sketch.h +
            (sketch.u * sketch.sin(sketch.angle) * sketch.t -
              0.5 * g_scaled * 60 * sketch.t * sketch.t);

          if (y >= -2) {
            sketch.path.push({ x: x * s, y: -y * s });
            sketch.t += 0.05;
          } else {
            sketch.isFiring = false;
            sketch.R = x;
          }
        }
        sketch.noFill();
        sketch.stroke("#4f46e5");
        sketch.strokeWeight(2);
        sketch.beginShape();
        for (let p of sketch.path) sketch.vertex(p.x, p.y);
        sketch.endShape();
        if (sketch.path.length > 0) {
          let curr = sketch.path[sketch.path.length - 1];
          sketch.fill("#ef4444");
          sketch.circle(curr.x, curr.y, 8);
        }
        sketch.resetMatrix();
        sketch.fill(0);
        sketch.noStroke();
        sketch.textSize(12);
        sketch.text(`Range (R): ${sketch.R?.toFixed(2) || 0} m`, 20, 30);
        sketch.text(
          `Max Height (H): ${(Math.pow(sketch.u * sketch.sin(sketch.angle), 2) / (2 * (sketch.g || 9.8))).toFixed(2)} m`,
          20,
          50,
        );
        break;
    }
  },
};
