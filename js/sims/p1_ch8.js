export const p1_ch8_sims = {
  getScaledG: (g) => (g * 0.4) / 9.8,

  setup: (sketch, vizType) => {
    if (vizType === "shm_circular") {
      sketch.radius = 70;
      sketch.speed = 0.03;
      sketch.angle = 0;
      sketch.history = [];
    }
    if (vizType === "simple_pendulum") {
      sketch.pendAngle = sketch.PI / 4;
      sketch.pendVel = 0;
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "shm_circular":
        let cx = sketch.width / 5;
        let cy = sketch.height / 2;
        sketch.noFill();
        sketch.stroke(200);
        sketch.circle(cx, cy, sketch.radius * 2);
        let px = cx + sketch.radius * sketch.cos(sketch.angle);
        let py = cy + sketch.radius * sketch.sin(sketch.angle);
        sketch.line(cx, cy, px, py);

        // The Spring
        let springX = sketch.width / 2.5;
        sketch.stroke(100);
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(springX, 20);
        for (let i = 0; i < 30; i++) {
          let sy = sketch.lerp(20, py, i / 30);
          let sx = springX + sketch.sin(i * 1.5) * 15;
          sketch.vertex(sx, sy);
        }
        sketch.vertex(springX, py);
        sketch.endShape();
        sketch.fill("#10b981");
        sketch.rect(springX - 20, py, 40, 15, 4);

        // Projection & Graph
        sketch.stroke("#4f46e5");
        sketch.line(px, py, sketch.width / 2, py);
        sketch.fill("#4f46e5");
        sketch.circle(sketch.width / 2, py, 15);
        sketch.history.unshift(py);
        if (sketch.history.length > 200) sketch.history.pop();
        sketch.noFill();
        sketch.beginShape();
        for (let i = 0; i < sketch.history.length; i++)
          sketch.vertex(sketch.width / 2 + i, sketch.history[i]);
        sketch.endShape();
        sketch.angle -= sketch.speed;
        break;

      case "simple_pendulum":
        sketch.translate(sketch.width / 2, 20);
        let L = sketch.len || 150;
        let g_val = sketch.gravity || 9.8;
        let damp = sketch.damping || 1.0;

        let physG = p1_ch8_sims.getScaledG(g_val) * 10;
        let acc = -(physG / L) * sketch.sin(sketch.pendAngle);
        sketch.pendVel += acc;
        sketch.pendVel *= damp;
        sketch.pendAngle += sketch.pendVel;

        let pex = L * sketch.sin(sketch.pendAngle);
        let pey = L * sketch.cos(sketch.pendAngle);

        sketch.stroke(100);
        sketch.strokeWeight(4);
        sketch.line(-50, 0, 50, 0);
        sketch.strokeWeight(2);
        sketch.line(0, 0, pex, pey);
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.circle(pex, pey, 20);

        sketch.resetMatrix();
        sketch.fill(0);
        sketch.textSize(12);
        let T = 2 * Math.PI * Math.sqrt(L / (g_val * 100));
        sketch.text(`Approx. Period (T): ${T.toFixed(2)}s`, 20, 30);
        break;
    }
  },
};
