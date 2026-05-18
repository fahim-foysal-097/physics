export const p1_ch8_sims = {
  getScaledG: (g) => (g * 0.4) / 9.8,

  setup: (sketch, vizType) => {
    sketch.angleMode(sketch.DEGREES);

    // SHM Circular Projection parameters
    sketch.radius = 70;
    sketch.speed = 1.8; // degrees per frame
    sketch.shmAngle = 0;
    sketch.history = [];

    // Pendulum parameters
    sketch.pendAngle = 45; // angle in degrees
    sketch.pendVel = 0;
    sketch.len = 150;
    sketch.gravity = 9.8;
    sketch.damping = 1.0;

    // SHM Energy Graphs parameters
    sketch.amp = 60;
    sketch.k = 0.4;
    sketch.shmEnergyTime = 0;
    sketch.mass = 2.0;

    // Spring Combinations parameters
    sketch.k1 = 20;
    sketch.k2 = 20;
    sketch.mass_comb = 2.0;
    sketch.dispSeries = 50;
    sketch.dispParallel = 50;
    sketch.velSeries = 0;
    sketch.velParallel = 0;
    sketch.springsRunning = false;

    sketch.releaseSprings = () => {
      sketch.dispSeries = 50;
      sketch.dispParallel = 50;
      sketch.velSeries = 0;
      sketch.velParallel = 0;
      sketch.springsRunning = true;
    };

    sketch.resetSprings = () => {
      sketch.dispSeries = 50;
      sketch.dispParallel = 50;
      sketch.velSeries = 0;
      sketch.velParallel = 0;
      sketch.springsRunning = false;
    };
  },

  draw: (sketch, vizType) => {
    sketch.background("#f8fafc");
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "shm_circular": {
        let cx = sketch.width / 5 + 10;
        let cy = sketch.height / 2 + 10;
        let r = sketch.radius !== undefined ? sketch.radius : 70;
        let sp = sketch.speed !== undefined ? sketch.speed : 1.8;

        // Draw Reference Circle
        sketch.noFill();
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1.5);
        sketch.circle(cx, cy, r * 2);

        // Reference point coordinates
        let px = cx + r * sketch.cos(sketch.shmAngle);
        let py = cy - r * sketch.sin(sketch.shmAngle);

        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1.5);
        sketch.line(cx, cy, px, py);
        sketch.fill("#cbd5e1");
        sketch.circle(px, py, 6);

        // The Spring mass
        let springX = sketch.width / 2.5 + 10;
        sketch.stroke("#64748b");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(springX, 30);
        let numCoils = 24;
        for (let i = 0; i <= numCoils; i++) {
          let sy = sketch.lerp(30, py, i / numCoils);
          let sx =
            springX + (i > 0 && i < numCoils ? (i % 2 === 0 ? -12 : 12) : 0);
          sketch.vertex(sx, sy);
        }
        sketch.endShape();

        // Stretched block
        sketch.fill("#10b981");
        sketch.stroke("#059669");
        sketch.strokeWeight(1.5);
        sketch.rect(springX - 16, py, 32, 14, 3);

        // Projection & Wave plot
        let waveStartX = sketch.width / 2 + 10;
        sketch.stroke("rgba(79, 70, 229, 0.4)");
        sketch.strokeWeight(1.5);
        sketch.drawingContext.setLineDash([4, 4]);
        sketch.line(px, py, waveStartX, py);
        sketch.drawingContext.setLineDash([]);

        // Projection dot
        sketch.fill("#4f46e5");
        sketch.noStroke();
        sketch.circle(waveStartX, py, 10);

        sketch.history.unshift(py);
        if (sketch.history.length > 180) sketch.history.pop();

        // Wave path
        sketch.stroke("#4f46e5");
        sketch.strokeWeight(2.5);
        sketch.noFill();
        sketch.beginShape();
        for (let i = 0; i < sketch.history.length; i++) {
          sketch.vertex(waveStartX + i * 1.2, sketch.history[i]);
        }
        sketch.endShape();

        sketch.shmAngle -= sp;

        p1_ch8_sims.drawPills(sketch, "SHM Reference Circle Projection", [
          `A: ${r.toFixed(0)} units`,
          `ω: ${(sp * 0.1).toFixed(3)} rad/s`,
          `Displacement y = A sin(ωt)`,
        ]);
        break;
      }

      case "simple_pendulum": {
        sketch.push();
        sketch.translate(sketch.width / 2, 20);
        let L = sketch.len !== undefined ? sketch.len : 150;
        let g_val = sketch.gravity !== undefined ? sketch.gravity : 9.8;
        let damp = sketch.damping !== undefined ? sketch.damping : 1.0;

        let physG = p1_ch8_sims.getScaledG(g_val) * 12.0;

        // Equation of motion: d2θ/dt2 = - (g/L) sin(θ)
        let acc = -(physG / L) * sketch.sin(sketch.pendAngle);
        sketch.pendVel += acc;
        sketch.pendVel *= damp;
        sketch.pendAngle += sketch.pendVel;

        let pex = L * sketch.sin(sketch.pendAngle);
        let pey = L * sketch.cos(sketch.pendAngle);

        // Draw Ceiling support
        sketch.stroke("#475569");
        sketch.strokeWeight(4);
        sketch.line(-40, 0, 40, 0);

        // Draw metal rod string
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(2);
        sketch.line(0, 0, pex, pey);

        // Draw angle sector arc
        sketch.stroke("rgba(79, 70, 229, 0.4)");
        sketch.strokeWeight(1.5);
        sketch.noFill();
        sketch.arc(0, 0, 50, 50, 90, 90 + sketch.pendAngle);

        // Draw Bob with gradient sheen
        sketch.fill("#f59e0b");
        sketch.stroke("#d97706");
        sketch.strokeWeight(2.0);
        sketch.circle(pex, pey, 22);

        // --- FIXED PENDULUM VELOCITY DIRECTION ---
        // Tangent vector is perpendicular to the string (pex, pey).
        // For bob at coordinates (L sinθ, L cosθ), tangent points along (cosθ, -sinθ).
        if (Math.abs(sketch.pendVel) > 0.03) {
          let vScale = 130;
          let vx = sketch.pendVel * sketch.cos(sketch.pendAngle) * vScale;
          let vy = -sketch.pendVel * sketch.sin(sketch.pendAngle) * vScale;

          p1_ch8_sims.drawArrow(
            sketch,
            pex,
            pey,
            pex + vx,
            pey + vy,
            "#ef4444",
            2,
          );
          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.textSize(9);
          sketch.text("v_tangent", pex + vx + 5, pey + vy);
        }

        sketch.pop();

        let T = 2 * Math.PI * sketch.sqrt(L / (g_val * 85)); // Period
        p1_ch8_sims.drawPills(sketch, "Simple Pendulum Gravity Oscillator", [
          `L: ${(L / 100).toFixed(2)} m`,
          `g: ${g_val.toFixed(1)} m/s²`,
          `T = 2π√(L/g) = ${T.toFixed(2)} s`,
          `θ: ${sketch.pendAngle.toFixed(1)}°`,
        ]);
        break;
      }

      case "shm_energy_graphs_sim": {
        let ampVal = sketch.amp !== undefined ? sketch.amp : 60;
        let kVal = sketch.k !== undefined ? sketch.k : 0.4;
        let mVal = sketch.mass !== undefined ? sketch.mass : 2.0;

        let omega = sketch.sqrt(kVal / mVal) * 5.0;
        sketch.shmEnergyTime += 1.0;

        let displacement = ampVal * sketch.cos(omega * sketch.shmEnergyTime);

        // Spring position
        let sx = 40;
        let sy = 80;
        let blockX = sx + 100 + displacement;

        // Draw Spring
        sketch.stroke("#475569");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(sx, sy);
        let numCoils = 16;
        let springW = blockX - sx - 12;
        for (let i = 0; i <= numCoils; i++) {
          let cx = sx + (springW / numCoils) * i;
          let cy = sy + (i > 0 && i < numCoils ? (i % 2 === 0 ? -10 : 10) : 0);
          sketch.vertex(cx, cy);
        }
        sketch.endShape();

        // Mass Block
        sketch.fill("#0ea5e9");
        sketch.stroke("#0284c7");
        sketch.strokeWeight(1.5);
        sketch.rect(blockX - 12, sy - 12, 24, 24, 4);

        // Draw real-time Energy graphs on right
        let gx = sketch.width - 190;
        let gy = 230;
        let gw = 150;
        let gh = 100;

        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1.5);
        sketch.fill(255);
        sketch.rect(gx - 10, gy - gh - 15, gw + 20, gh + 30, 6);

        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1);
        sketch.line(gx, gy, gx + gw, gy);
        sketch.line(gx + gw / 2, gy, gx + gw / 2, gy - gh);

        sketch.noStroke();
        sketch.fill(0);
        sketch.textSize(9);
        sketch.text("-A", gx + 10, gy + 12);
        sketch.text("+A", gx + gw - 25, gy + 12);
        sketch.text("Energy (J)", gx + gw / 2 - 25, gy - gh - 4);

        // Plot parabolas
        let totalE = 0.5 * kVal * ampVal * ampVal;

        sketch.noFill();
        sketch.strokeWeight(1.5);

        // E_p parabola
        sketch.stroke("#ef4444");
        sketch.beginShape();
        for (let dx = -gw / 2; dx <= gw / 2; dx += 2) {
          let scaledX = (dx / (gw / 2)) * ampVal;
          let ep = 0.5 * kVal * scaledX * scaledX;
          let py = gy - (ep / totalE) * gh;
          sketch.vertex(gx + gw / 2 + dx, py);
        }
        sketch.endShape();

        // E_k parabola
        sketch.stroke("#10b981");
        sketch.beginShape();
        for (let dx = -gw / 2; dx <= gw / 2; dx += 2) {
          let scaledX = (dx / (gw / 2)) * ampVal;
          let ek = 0.5 * kVal * (ampVal * ampVal - scaledX * scaledX);
          let py = gy - (ek / totalE) * gh;
          sketch.vertex(gx + gw / 2 + dx, py);
        }
        sketch.endShape();

        // Total Energy line
        sketch.stroke("#818cf8");
        sketch.line(gx, gy - gh, gx + gw, gy - gh);

        // Trace active dots
        let activeGraphX = (displacement / ampVal) * (gw / 2);
        let curPE = 0.5 * kVal * displacement * displacement;
        let curKE = totalE - curPE;

        sketch.noStroke();
        sketch.fill("#ef4444");
        sketch.circle(
          gx + gw / 2 + activeGraphX,
          gy - (curPE / totalE) * gh,
          6,
        );
        sketch.fill("#10b981");
        sketch.circle(
          gx + gw / 2 + activeGraphX,
          gy - (curKE / totalE) * gh,
          6,
        );

        // Label displacement line
        sketch.stroke("rgba(0, 0, 0, 0.12)");
        sketch.strokeWeight(1);
        sketch.line(
          gx + gw / 2 + activeGraphX,
          gy,
          gx + gw / 2 + activeGraphX,
          gy - gh,
        );

        p1_ch8_sims.drawPills(sketch, "SHM Kinetic vs Potential Energy", [
          `A: ${ampVal.toFixed(0)}`,
          `k: ${kVal.toFixed(2)} N/m`,
          `x: ${displacement.toFixed(1)}`,
          `E_tot = ½kA² = ${totalE.toFixed(1)} J`,
          `PE: ${curPE.toFixed(1)} J (Red) | KE: ${curKE.toFixed(1)} J (Green)`,
        ]);
        break;
      }

      case "spring_combinations_sim": {
        let curK1 = sketch.k1 !== undefined ? sketch.k1 : 20;
        let curK2 = sketch.k2 !== undefined ? sketch.k2 : 20;
        let mass = sketch.mass_comb !== undefined ? sketch.mass_comb : 2.0;

        let k_series = (curK1 * curK2) / (curK1 + curK2);
        let k_parallel = curK1 + curK2;

        if (sketch.springsRunning) {
          let dt = 0.2;

          let accS = -(k_series / mass) * sketch.dispSeries * 0.05;
          sketch.velSeries += accS * dt;
          sketch.dispSeries += sketch.velSeries * dt * 8;

          let accP = -(k_parallel / mass) * sketch.dispParallel * 0.05;
          sketch.velParallel += accP * dt;
          sketch.dispParallel += sketch.velParallel * dt * 8;
        }

        // Draw track base
        sketch.noStroke();
        sketch.fill("#cbd5e1");
        sketch.rect(0, 100, sketch.width, 6);
        sketch.rect(0, 210, sketch.width, 6);

        let startX = 40;

        // Series combination
        let blockSeriesX = startX + 160 + sketch.dispSeries;
        let midPtX = startX + (blockSeriesX - startX) / 2;

        sketch.stroke("#475569");
        sketch.strokeWeight(1.8);
        sketch.noFill();

        // spring 1
        sketch.beginShape();
        sketch.vertex(startX, 65);
        for (let i = 0; i <= 10; i++) {
          let cx = sketch.lerp(startX, midPtX, i / 10);
          let cy = 65 + (i > 0 && i < 10 ? (i % 2 === 0 ? -8 : 8) : 0);
          sketch.vertex(cx, cy);
        }
        sketch.endShape();

        sketch.fill("#cbd5e1");
        sketch.circle(midPtX, 65, 6);

        // spring 2
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(midPtX, 65);
        for (let i = 0; i <= 10; i++) {
          let cx = sketch.lerp(midPtX, blockSeriesX, i / 10);
          let cy = 65 + (i > 0 && i < 10 ? (i % 2 === 0 ? -8 : 8) : 0);
          sketch.vertex(cx, cy);
        }
        sketch.endShape();

        sketch.fill("#0ea5e9");
        sketch.stroke("#0284c7");
        sketch.strokeWeight(1.5);
        sketch.rect(blockSeriesX - 12, 53, 24, 24, 4);

        // Parallel combination
        let blockParallelX = startX + 160 + sketch.dispParallel;

        sketch.stroke("#475569");
        sketch.strokeWeight(1.8);
        sketch.noFill();

        sketch.beginShape();
        sketch.vertex(startX, 160);
        for (let i = 0; i <= 14; i++) {
          let cx = sketch.lerp(startX, blockParallelX, i / 14);
          let cy = 160 + (i > 0 && i < 14 ? (i % 2 === 0 ? -6 : 6) : 0);
          sketch.vertex(cx, cy);
        }
        sketch.endShape();

        sketch.beginShape();
        sketch.vertex(startX, 185);
        for (let i = 0; i <= 14; i++) {
          let cx = sketch.lerp(startX, blockParallelX, i / 14);
          let cy = 185 + (i > 0 && i < 14 ? (i % 2 === 0 ? -6 : 6) : 0);
          sketch.vertex(cx, cy);
        }
        sketch.endShape();

        sketch.fill("#f59e0b");
        sketch.stroke("#d97706");
        sketch.strokeWeight(1.5);
        sketch.rect(blockParallelX - 12, 160, 24, 24, 4);

        sketch.fill("#1e293b");
        sketch.noStroke();
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.text("Series Spring Combination", startX, 48);
        sketch.text("Parallel Spring Combination", startX, 148);
        sketch.textStyle(sketch.NORMAL);

        let T_series = 2 * Math.PI * sketch.sqrt(mass / k_series) * 0.1;
        let T_parallel = 2 * Math.PI * sketch.sqrt(mass / k_parallel) * 0.1;

        p1_ch8_sims.drawPills(
          sketch,
          "Series vs Parallel Stiffness comparison",
          [
            `k1: ${curK1.toFixed(0)} | k2: ${curK2.toFixed(0)} N/m`,
            `Ks: ${k_series.toFixed(1)} N/m | Kp: ${k_parallel.toFixed(1)} N/m`,
            `Ts = ${T_series.toFixed(2)}s | Tp = ${T_parallel.toFixed(2)}s`,
          ],
        );
        break;
      }
    }
  },

  drawArrow: (sketch, x1, y1, x2, y2, colorStr, strokeWt = 2) => {
    sketch.stroke(colorStr);
    sketch.strokeWeight(strokeWt);
    sketch.fill(colorStr);
    sketch.line(x1, y1, x2, y2);
    sketch.push();
    sketch.translate(x2, y2);
    let a = sketch.atan2(y1 - y2, x1 - x2);
    sketch.rotate(a);
    sketch.triangle(0, 0, 7, 2.5, 7, -2.5);
    sketch.pop();
  },

  drawPills: (sketch, title, metrics) => {
    sketch.push();
    sketch.resetMatrix();
    sketch.textSize(10);

    // Title
    let tw = sketch.textWidth(title);
    sketch.fill("rgba(30, 41, 59, 0.85)");
    sketch.noStroke();
    sketch.rect(15, 12, tw + 20, 22, 11);

    sketch.fill("#ffffff");
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textStyle(sketch.BOLD);
    sketch.text(title, 15 + (tw + 20) / 2, 12 + 11);
    sketch.textStyle(sketch.NORMAL);

    // Metrics
    if (metrics && metrics.length > 0) {
      let metricsStr = metrics.join("   |   ");
      let mw = sketch.textWidth(metricsStr);
      let barW = mw + 30;

      sketch.fill("rgba(255, 255, 255, 0.95)");
      sketch.stroke("#cbd5e1");
      sketch.strokeWeight(1.5);
      sketch.rect(15, sketch.height - 34, barW, 22, 11);

      sketch.noStroke();
      sketch.fill("#334155");
      sketch.textAlign(sketch.LEFT, sketch.CENTER);
      sketch.text(metricsStr, 30, sketch.height - 34 + 11);
    }
    sketch.pop();
  },
};
