export const p2_ch3_sims = {
  setup: (sketch, vizType) => {
    const defaults = {
      wire_resistance: { rho: 2.0, l: 120, A: 40, t: 0 },
      drift_velocity: { I: 3.0, n: 8.0, A: 4.0, t: 0, electrons: [] },
      ohm_law: { V: 12, R: 6, t: 0, electronOffset: 0 },
    };

    // Apply defaults
    Object.assign(sketch, defaults[vizType] || {});

    // Specific initializations
    if (vizType === "drift_velocity") {
      sketch.electrons = [];
      for (let i = 0; i < 30; i++) {
        sketch.electrons.push({
          x: sketch.random(50, sketch.width - 50),
          y: sketch.random(sketch.height / 2 - 30, sketch.height / 2 + 30),
          vx: sketch.random(-2.0, 2.0),
          vy: sketch.random(-2.0, 2.0),
          trail: [],
        });
      }
      sketch.electrons[0].isHighlighted = true;
    }

    sketch.reset = () => {
      Object.assign(sketch, defaults[vizType] || {});
      if (vizType === "drift_velocity") {
        sketch.electrons = [];
        for (let i = 0; i < 30; i++) {
          sketch.electrons.push({
            x: sketch.random(50, sketch.width - 50),
            y: sketch.random(sketch.height / 2 - 30, sketch.height / 2 + 30),
            vx: sketch.random(-2.0, 2.0),
            vy: sketch.random(-2.0, 2.0),
            trail: [],
          });
        }
        sketch.electrons[0].isHighlighted = true;
      }
    };
  },

  draw: (sketch, vizType) => {
    const w = sketch.width;
    const h = sketch.height;

    // grid and soft background
    sketch.background(253, 254, 255);
    sketch.stroke(235, 243, 250);
    sketch.strokeWeight(1);
    for (let x = 0; x < w; x += 40) sketch.line(x, 0, x, h);
    for (let y = 0; y < h; y += 40) sketch.line(0, y, w, y);

    // Sleek HUDPill rendering helper (for neat parameter output)
    const drawHUDPill = (x, y, label, valStr, pillWidth = 140) => {
      sketch.push();
      sketch.rectMode(sketch.CORNER);
      // Soft semi-transparent white backdrop
      sketch.fill(255, 255, 255, 220);
      sketch.stroke(226, 232, 240);
      sketch.strokeWeight(1);
      sketch.rect(x, y, pillWidth, 36, 18);

      // Label text
      sketch.noStroke();
      sketch.fill(100, 116, 139);
      sketch.textSize(9);
      sketch.textStyle(sketch.BOLD);
      sketch.textAlign(sketch.LEFT, sketch.CENTER);
      sketch.text(label, x + 15, y + 18);

      // Value text
      sketch.fill(37, 99, 235);
      sketch.textSize(12);
      sketch.textStyle(sketch.BOLD);
      sketch.textAlign(sketch.RIGHT, sketch.CENTER);
      sketch.text(valStr, x + pillWidth - 15, y + 18);
      sketch.pop();
    };

    // Draw glowing vectors
    const drawVector = (x, y, vx, vy, colorStr, label = "") => {
      sketch.push();
      sketch.stroke(colorStr);
      sketch.fill(colorStr);
      sketch.strokeWeight(2);
      sketch.line(x, y, x + vx, y + vy);

      const angle = Math.atan2(vy, vx);
      const len = Math.hypot(vx, vy);
      const head = Math.max(5, Math.min(8, len * 0.2));

      sketch.translate(x + vx, y + vy);
      sketch.rotate(angle);
      sketch.triangle(0, head / 2, 0, -head / 2, head, 0);

      if (label) {
        sketch.rotate(-angle);
        sketch.noStroke();
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
        sketch.text(label, 0, -6);
      }
      sketch.pop();
    };

    // Top-left Title
    const drawTitle = (titleText) => {
      sketch.push();
      sketch.noStroke();
      sketch.fill(30, 41, 59);
      sketch.textSize(14);
      sketch.textStyle(sketch.BOLD);
      sketch.textAlign(sketch.LEFT, sketch.CENTER);
      sketch.text(titleText, 24, 30);
      sketch.pop();
    };

    switch (vizType) {
      case "wire_resistance": {
        const rho = sketch.rho ?? 2.0;
        const l = sketch.l ?? 120;
        const A = sketch.A ?? 40;
        const R = (rho * l) / A;

        drawTitle("Wire Resistance: R = ρ l / A");
        drawHUDPill(w - 175, 12, "RESISTANCE", `${R.toFixed(2)} Ω`, 150);

        const wireW = sketch.map(l, 20, 240, w * 0.4, w - 120);
        const startX = w / 2 - wireW / 2;
        const endX = w / 2 + wireW / 2;
        const centerY = h / 2 + 10;

        // Map Area slider to physical cylinder diameter nicely (keep it spacious!)
        const wireH = sketch.map(A, 4, 120, 20, 80);

        // 1. Draw Terminals & connection wires
        sketch.push();
        sketch.stroke(148, 163, 184, 150);
        sketch.strokeWeight(5);
        // Fixed terminal endpoints at 35px on left and w-35px on right
        sketch.line(35, centerY, startX, centerY);
        sketch.line(endX, centerY, w - 35, centerY);

        sketch.fill(239, 68, 68); // Positive terminal (Left)
        sketch.noStroke();
        sketch.circle(35, centerY, 10);
        sketch.fill(59, 130, 246); // Negative terminal (Right)
        sketch.circle(w - 35, centerY, 10);

        sketch.fill(255);
        sketch.textSize(8);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text("+", 35, centerY);
        sketch.text("-", w - 35, centerY);
        sketch.pop();

        // 2. Draw Wire cylinder body with metallic gradients & dynamic heating glow
        sketch.push();
        sketch.rectMode(sketch.CORNERS);
        sketch.noStroke();

        // Base metallic color
        sketch.fill(226, 232, 240);
        sketch.rect(startX, centerY - wireH / 2, endX, centerY + wireH / 2, 4);

        // Dynamic Heating glow overlay (stronger for high resistance dissipation)
        const glowOpacity = sketch.map(
          sketch.constrain(R, 0, 15),
          0,
          15,
          0,
          180,
        );
        sketch.fill(239, 68, 68, glowOpacity);
        sketch.rect(startX, centerY - wireH / 2, endX, centerY + wireH / 2, 4);

        // Wire border
        sketch.stroke(100, 116, 139);
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.rect(startX, centerY - wireH / 2, endX, centerY + wireH / 2, 4);
        sketch.pop();

        // 3. Grid of lattice ions (Orange vibrating spheres)
        // Spacing scales with Area height and columns scale with Length
        const colCount = Math.max(3, Math.min(12, Math.floor(l / 20)));
        const rows = Math.max(1, Math.min(4, Math.floor(wireH / 20)));
        const ionSize = 8 + rho * 1.3;
        const vibAmp = rho * 0.45;

        sketch.t += 0.08;
        sketch.push();
        sketch.noStroke();
        sketch.fill(249, 115, 22, 190); // Copper-orange

        for (let c = 0; c < colCount; c++) {
          const x = startX + ((c + 0.5) * (endX - startX)) / colCount;
          for (let r = 0; r < rows; r++) {
            const y = centerY - wireH / 2 + ((r + 0.5) * wireH) / rows;

            const ox = Math.sin(sketch.t * 3 + c + r) * vibAmp;
            const oy = Math.cos(sketch.t * 3 + c + r) * vibAmp;

            sketch.fill(249, 115, 22, 200);
            sketch.circle(x + ox, y + oy, ionSize);
            sketch.fill(255, 237, 213, 230); // Core highlight
            sketch.circle(
              x + ox - ionSize * 0.15,
              y + oy - ionSize * 0.15,
              ionSize * 0.4,
            );
          }
        }
        sketch.pop();

        // 4. Flowing Electrons (Glowing blue spheres moving right-to-left)
        const flowSpeed = sketch.map(1 / Math.max(0.1, R), 0, 10, 0.4, 4.0);
        sketch.push();
        sketch.noStroke();

        for (let i = 0; i < 20; i++) {
          const hHash = (i * 97) % 1000;
          const px =
            startX +
            ((hHash + sketch.frameCount * flowSpeed) % (endX - startX));
          const offsetWave = (wireH / 2 - 6) * Math.sin(i * 1.7);
          const py = centerY + offsetWave;

          sketch.fill(56, 189, 248, 50); // Glow aura
          sketch.circle(px, py, 12);
          sketch.fill(14, 165, 233, 210); // Main core
          sketch.circle(px, py, 5.5);

          // Render minor collision flash rings dynamically near grid columns
          if (rho > 2.0 && Math.floor(px) % 45 === 0) {
            sketch.stroke(239, 68, 68, 140);
            sketch.strokeWeight(1);
            sketch.noFill();
            sketch.circle(px, py, 12 + (sketch.frameCount % 6));
            sketch.noStroke();
          }
        }
        sketch.pop();
        break;
      }

      case "drift_velocity": {
        const I = sketch.I ?? 3.0;
        const n = sketch.n ?? 8.0;
        const A = sketch.A ?? 4.0;
        const vd = I / (n * A);

        drawTitle("Drift Velocity: I = n A e vd");
        // Print as drift speed readout scaled nicely to fit pill
        drawHUDPill(
          w - 205,
          12,
          "DRIFT VELOCITY",
          `${vd.toFixed(4)} mm/s`,
          180,
        );

        const startX = 45;
        const endX = w - 45;
        const centerY = h / 2 + 10;
        const condH = 95;

        // Draw conductor boundaries
        sketch.push();
        sketch.stroke(71, 85, 105);
        sketch.strokeWeight(2.5);
        sketch.fill(248, 250, 252, 190);
        sketch.rect(startX, centerY - condH / 2, endX - startX, condH, 8);
        sketch.pop();

        // Sleek field vector labels
        sketch.push();
        drawVector(
          startX + 10,
          centerY - condH / 2 - 15,
          60,
          0,
          "#0ea5e9",
          "E Field",
        );
        drawVector(
          startX + 100,
          centerY - condH / 2 - 15,
          60,
          0,
          "#10b981",
          "Current I",
        );
        drawVector(
          endX - 10,
          centerY - condH / 2 - 15,
          -60,
          0,
          "#f59e0b",
          "Force on e⁻",
        );
        sketch.pop();

        // Physics updates for chaotic scattering
        const driftPush = vd * 1.5;
        sketch.push();

        sketch.electrons.forEach((e) => {
          // Chaotic bounce updates
          e.x += e.vx;
          e.y += e.vy;

          // Apply microscopic leftward drift bias
          e.x -= driftPush;

          // Wrap wire boundaries seamlessly
          const topL = centerY - condH / 2 + 4;
          const botL = centerY + condH / 2 - 4;

          if (e.x < startX) {
            e.x = endX - 4;
            e.trail = [];
          }
          if (e.x > endX) {
            e.x = startX + 4;
            e.trail = [];
          }
          if (e.y < topL || e.y > botL) {
            e.vy *= -1;
            e.y = sketch.constrain(e.y, topL, botL);
          }

          // Random thermal scattering frequency
          if (sketch.random(0, 1) < 0.04) {
            const speed = sketch.random(1.2, 2.3);
            const ang = sketch.random(0, sketch.TWO_PI);
            e.vx = speed * Math.cos(ang);
            e.vy = speed * Math.sin(ang);
          }

          if (e.isHighlighted) {
            // High fidelity trail
            e.trail.push({ x: e.x, y: e.y });
            if (e.trail.length > 90) e.trail.shift();

            sketch.noFill();
            sketch.stroke(245, 158, 11, 220); // Amber path
            sketch.strokeWeight(1.8);
            sketch.beginShape();
            e.trail.forEach((pt) => sketch.vertex(pt.x, pt.y));
            sketch.endShape();

            sketch.noStroke();
            sketch.fill(245, 158, 11, 40);
            sketch.circle(e.x, e.y, 20);
            sketch.fill(245, 158, 11);
            sketch.circle(e.x, e.y, 9);
            sketch.fill(255);
            sketch.circle(e.x, e.y, 2.5);
          } else {
            sketch.noStroke();
            sketch.fill(37, 99, 235, 160);
            sketch.circle(e.x, e.y, 6);
          }
        });
        sketch.pop();
        break;
      }

      case "ohm_law": {
        const V = sketch.V ?? 12;
        const R = sketch.R ?? 6;
        const I = V / R;

        drawTitle("Ohm's Law: I = V / R");
        drawHUDPill(w - 175, 12, "CURRENT (I)", `${I.toFixed(2)} A`, 150);

        // SPATIAL LAYOUT:
        // Divide the canvas neatly into Left Half (Microscope) & Right Half (Coordinate Graph)
        const leftCenterX = w * 0.26;
        const rightStartX = w * 0.52 + 25;
        const graphW = w - rightStartX - 25;

        // Draw clean separation line in the middle
        sketch.stroke(226, 232, 240);
        sketch.strokeWeight(1.5);
        sketch.line(w * 0.5, 60, w * 0.5, h - 25);

        // --- Left Half: Resistor Microscopic Zoom View ---
        sketch.push();
        const zoomY = h / 2 + 10;
        const zoomR = Math.min(100, h * 0.35); // responsive radius

        // Draw Microscope Callout backdrop
        sketch.fill(248, 250, 252, 210);
        sketch.stroke(148, 163, 184);
        sketch.strokeWeight(2.5);
        sketch.circle(leftCenterX, zoomY, zoomR * 2);

        // Atoms density blocks (Obstacles scale with R)
        sketch.noStroke();
        const obstacleCount = Math.round(R * 0.9);
        sketch.fill(239, 68, 68, 170); // Static obstacles
        for (let i = 0; i < obstacleCount; i++) {
          const id = (i * 47) % 360;
          const rad = (i * 29) % (zoomR - 12);
          const px = leftCenterX + rad * Math.cos(id);
          const py = zoomY + rad * Math.sin(id);
          sketch.circle(px, py, 7.5);
        }

        // Floating electrons inside calling circle (Speed scales with current I)
        const flowVel = sketch.map(I, 0, 30, 0.4, 3.8);
        sketch.fill(14, 165, 233, 200);
        for (let i = 0; i < 8; i++) {
          const px =
            leftCenterX -
            zoomR +
            ((i * 25 + sketch.frameCount * flowVel) % (zoomR * 2));
          // keep them bounded vertically inside the circle elegantly
          const distFromCenter = Math.abs(px - leftCenterX);
          const verticalBound =
            Math.sqrt(
              Math.max(0, zoomR * zoomR - distFromCenter * distFromCenter),
            ) - 8;
          const py = zoomY + Math.sin(i * 1.5) * verticalBound * 0.7;

          if (px > leftCenterX - zoomR + 4 && px < leftCenterX + zoomR - 4) {
            sketch.circle(px, py, 5);
          }
        }

        // Label details underneath Microscope bubble (Sleek text, no overlaps!)
        sketch.fill(100, 116, 139);
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("Resistor Atoms & Flow", leftCenterX, zoomY + zoomR + 8);
        sketch.pop();

        // --- Right Half: High-fidelity Cartesian V-I Graph ---
        const gx = rightStartX + 35;
        const gy = 75;
        const gw = graphW - 40;
        const gh = h - gy - 60;

        // Draw Coordinate Grid & Axes
        sketch.push();
        sketch.stroke(148, 163, 184);
        sketch.strokeWeight(1.5);
        sketch.line(gx, gy + gh, gx, gy); // Y axis (Current I)
        sketch.line(gx, gy + gh, gx + gw, gy + gh); // X axis (Voltage V)

        // Sleek labels
        sketch.noStroke();
        sketch.fill(100, 116, 139);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("Voltage V (V)", gx + gw / 2, gy + gh + 6);

        sketch.textAlign(sketch.RIGHT, sketch.CENTER);
        sketch.text("I (A)", gx - 8, gy + gh / 2);
        sketch.pop();

        // Plot V-I Line (Slope = 1/R)
        // Limits: Max voltage = 30V, Max current = 30A (when R=1)
        const maxV = 30.0;
        const maxI = 30.0;

        sketch.push();
        sketch.stroke(37, 99, 235, 140);
        sketch.strokeWeight(2.5);

        const lineEndX = gx + gw;
        const lineEndI = maxV / R;
        const lineEndY = sketch.map(lineEndI, 0, maxI, gy + gh, gy);

        sketch.line(gx, gy + gh, lineEndX, lineEndY);
        sketch.pop();

        // Coordinate Dot marking current values
        const dotX = sketch.map(V, 0, maxV, gx, gx + gw);
        const dotY = sketch.map(I, 0, maxI, gy + gh, gy);

        sketch.push();
        sketch.noStroke();
        sketch.fill(16, 185, 129, 45); // Green coordinate aura
        sketch.circle(dotX, dotY, 18);
        sketch.fill(16, 185, 129);
        sketch.circle(dotX, dotY, 7);
        sketch.fill(255);
        sketch.circle(dotX - 1, dotY - 1, 2);

        // Clean coordinate reading (placed perfectly above the dot!)
        sketch.fill(16, 185, 129);
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.LEFT, sketch.BOTTOM);
        sketch.text(`(${V.toFixed(1)}V, ${I.toFixed(2)}A)`, dotX + 8, dotY - 4);

        // Slope annotation text
        sketch.fill(100, 116, 139);
        sketch.textSize(9);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        sketch.text(`Slope (1/R) = ${(1 / R).toFixed(2)}`, gx + 15, gy + 10);
        sketch.pop();
        break;
      }

      default: {
        drawTitle("Interactive Lab Module");
      }
    }
  },
};
