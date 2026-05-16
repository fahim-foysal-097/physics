export const p1_ch10_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "brownian_motion") {
      sketch.bigX = 200;
      sketch.bigY = 200;
      sketch.bigVX = 0;
      sketch.bigVY = 0;
      sketch.trace = [];
      sketch.gasSpeed = 25;
      sketch.particles = [];
      for (let i = 0; i < 120; i++) {
        sketch.particles.push({
          x: sketch.random(sketch.width),
          y: sketch.random(sketch.height),
          vx: sketch.random(-1, 1),
          vy: sketch.random(-1, 1),
        });
      }
    }
    if (vizType === "degrees_of_freedom") {
      sketch.molType = 0;
      sketch.rot = 0;
      sketch.pos = { x: 0, y: 0, z: 0 };
    }
  },

  draw: (sketch, vizType) => {
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "brownian_motion":
        sketch.background("#f8fafc");
        let speedMult = (sketch.gasSpeed || 100) / 10;

        sketch.noFill();
        sketch.stroke(239, 68, 68, 120);
        sketch.strokeWeight(2);
        sketch.beginShape();
        for (let p of sketch.trace) sketch.vertex(p.x, p.y);
        sketch.endShape();

        sketch.noStroke();
        sketch.fill(239, 68, 68, 50);
        sketch.circle(sketch.bigX, sketch.bigY, 38);
        sketch.fill("#ef4444");
        sketch.circle(sketch.bigX, sketch.bigY, 30);

        sketch.fill("#3b82f6");
        for (let p of sketch.particles) {
          p.x += p.vx * speedMult;
          p.y += p.vy * speedMult;
          if (p.x < 0 || p.x > sketch.width) p.vx *= -1;
          if (p.y < 0 || p.y > sketch.height) p.vy *= -1;

          let d = sketch.dist(p.x, p.y, sketch.bigX, sketch.bigY);
          if (d < 15 + 3) {
            sketch.bigVX += p.vx * 0.6 * speedMult;
            sketch.bigVY += p.vy * 0.6 * speedMult;
            p.vx *= -1;
            p.vy *= -1;
          }
          sketch.circle(p.x, p.y, 6);
        }

        sketch.bigX += sketch.bigVX;
        sketch.bigY += sketch.bigVY;
        sketch.bigVX *= 0.94;
        sketch.bigVY *= 0.94;

        if (sketch.frameCount % 4 === 0) {
          sketch.trace.push({ x: sketch.bigX, y: sketch.bigY });
          if (sketch.trace.length > 120) sketch.trace.shift();
        }

        sketch.bigX = sketch.constrain(sketch.bigX, 20, sketch.width - 20);
        sketch.bigY = sketch.constrain(sketch.bigY, 20, sketch.height - 20);
        break;

      case "degrees_of_freedom":
        sketch.background("#f8fafc");
        sketch.translate(sketch.width / 2, sketch.height / 2 - 20);

        sketch.strokeWeight(1.5);
        sketch.stroke("#818cf8");
        sketch.line(-120, 0, 120, 0);
        sketch.fill("#4f46e5");
        sketch.noStroke();
        sketch.text("X (Translation)", 125, 5);

        sketch.stroke("#34d399");
        sketch.line(0, -120, 0, 120);
        sketch.fill("#059669");
        sketch.noStroke();
        sketch.text("Y (Translation)", 5, -125);

        sketch.stroke("#fbbf24");
        sketch.line(-80, 80, 80, -80);
        sketch.fill("#d97706");
        sketch.noStroke();
        sketch.text("Z (Translation)", 85, -85);

        let type = sketch.molType || 0;
        sketch.rot += 0.04;

        sketch.push();
        let tx = sketch.sin(sketch.frameCount * 0.08) * 15;
        let ty = sketch.cos(sketch.frameCount * 0.07) * 10;
        sketch.translate(tx, ty);

        if (type === 0) {
          sketch.noStroke();
          sketch.fill(239, 68, 68, 50);
          sketch.circle(0, 0, 40);
          sketch.fill("#ef4444");
          sketch.circle(0, 0, 30);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Monoatomic (e.g. He, Ne): f = 3", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 0 | Vibration: 0", 0, 18);
        } else if (type === 1) {
          sketch.rotate(sketch.rot);
          sketch.stroke("#94a3b8");
          sketch.strokeWeight(6);
          sketch.line(-35, 0, 35, 0);
          sketch.noStroke();
          sketch.fill("#ef4444");
          sketch.circle(-35, 0, 24);
          sketch.fill("#ef4444");
          sketch.circle(35, 0, 24);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Diatomic (e.g. O₂, N₂): f = 5", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 2 | Vibration: 0", 0, 18);
        } else if (type === 2) {
          sketch.rotate(sketch.rot);
          sketch.stroke("#94a3b8");
          sketch.strokeWeight(6);
          sketch.line(-55, 0, 55, 0);
          sketch.noStroke();
          sketch.fill("#1e293b");
          sketch.circle(0, 0, 28);
          sketch.fill("#ef4444");
          sketch.circle(-55, 0, 22);
          sketch.circle(55, 0, 22);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Linear Triatomic (CO₂): f = 5", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 2 | Vibration: 0", 0, 18);
        } else {
          sketch.rotate(sketch.rot);
          sketch.stroke("#94a3b8");
          sketch.strokeWeight(5);
          sketch.line(0, 0, -35, 35);
          sketch.line(0, 0, 35, 35);
          sketch.noStroke();
          sketch.fill("#3b82f6");
          sketch.circle(0, 0, 28);
          sketch.fill("#ef4444");
          sketch.circle(-35, 35, 18);
          sketch.circle(35, 35, 18);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Bent Triatomic (H₂O): f = 6", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 3 | Vibration: 0", 0, 18);
        }
        sketch.pop();
        break;
    }
  },
};
