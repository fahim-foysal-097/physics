/**
 * Mechanics Simulations Module
 * Includes: Projectile, Pendulum, Banking, Orbit, Water Pump, SHM
 */
export const mechanicsSims = {
  // Scaling helper: Maps textbook gravity (9.8) to visual gravity (~0.4)
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
    if (vizType === "shm_circular") {
      sketch.radius = 70;
      sketch.speed = 0.03;
      sketch.angle = 0;
      sketch.history = [];
    }
    if (vizType === "water_pump") {
      sketch.depth = 100;
      sketch.pump_rate = 0.2;
    }
    if (vizType === "orbit_simulation") {
      sketch.t = 0;
      sketch.orbitR = 100;
      sketch.orbitV = 0.03;
    }
    if (vizType === "simple_pendulum") {
      sketch.pendAngle = sketch.PI / 4;
      sketch.pendVel = 0;
    }
    if (vizType === "banking_road") {
      sketch.angleMode(sketch.DEGREES);
      sketch.theta = 15;
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "projectile_advanced":
        sketch.translate(40, sketch.height - 40);
        sketch.stroke(200);
        sketch.line(-40, 0, sketch.width, 0);
        let s = 2.5;
        let g_scaled = mechanicsSims.getScaledG(sketch.g || 9.8);

        if (sketch.isFiring) {
          let x = sketch.u * sketch.cos(sketch.angle) * sketch.t;
          let y =
            sketch.h +
            (sketch.u * sketch.sin(sketch.angle) * sketch.t -
              0.5 * g_scaled * 60 * sketch.t * sketch.t);
          // Note: 60 factor added to make g=9.8 feel realistic at 0.15t step

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

        // Acceleration = -(g/L) * sin(theta)
        let physG = mechanicsSims.getScaledG(g_val) * 10;
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

        // Show Period T
        sketch.resetMatrix();
        sketch.fill(0);
        sketch.textSize(12);
        let T = 2 * Math.PI * Math.sqrt(L / (g_val * 100)); // Rough T in seconds
        sketch.text(`Approx. Period (T): ${T.toFixed(2)}s`, 20, 30);
        break;

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
        mechanicsSims.drawArrow(sketch, 0, -15, 0, -80, "#10b981");
        sketch.fill(0);
        sketch.noStroke();
        sketch.text("N", 5, -85);
        // Gravity
        sketch.push();
        sketch.rotate(theta);
        mechanicsSims.drawArrow(sketch, 0, -15, 0, 60, "#3b82f6");
        sketch.fill(0);
        sketch.noStroke();
        sketch.text("mg", 5, 75);
        sketch.pop();
        break;

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
