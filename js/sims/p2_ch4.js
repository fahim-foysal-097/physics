export const p2_ch4_sims = {
  setup: (sketch, vizType) => {
    const defaults = {
      straight_wire_field: { I: 5.0, r: 80, t: 0, isDraggingProbe: false },
      charged_particle_magnetic_field: {
        B: 4.0,
        q: 2.0,
        m: 5.0,
        v: 6.0,
        px: 0,
        py: 0,
        vx: 0,
        vy: 0,
        trail: [],
        t: 0,
      },
    };

    Object.assign(sketch, defaults[vizType] || {});

    if (vizType === "charged_particle_magnetic_field") {
      sketch.resetParticle = () => {
        const B = sketch.B ?? 4.0;
        const q = sketch.q ?? 2.0;
        const m = sketch.m ?? 5.0;
        const v = sketch.v ?? 6.0;

        // If B and q have the same sign, orbit direction is clockwise/counter-clockwise
        // Let's place the center of the orbit such that it fits nicely in the left half
        const leftCenterX = sketch.width * 0.28;
        const centerY = sketch.height / 2 + 10;

        // Radius of circle in pixels: R_px = (m * v) / (|q| * |B|) * scale
        // Let's scale so that a radius of 1 unit in formula is about 15-20 pixels
        const r_calc = (m * v) / (Math.abs(q * B) || 0.1);
        const r_px = Math.min(100, r_calc * 12);

        sketch.px = leftCenterX;
        sketch.py = centerY - r_px;
        sketch.vx = v * 0.8; // Initial velocity horizontal to start circular orbit
        sketch.vy = 0;
        sketch.trail = [];
      };
      sketch.resetParticle();
    }

    sketch.reset = () => {
      Object.assign(sketch, defaults[vizType] || {});
      if (vizType === "charged_particle_magnetic_field") {
        sketch.resetParticle();
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
      sketch.fill(255, 255, 255, 220);
      sketch.stroke(226, 232, 240);
      sketch.strokeWeight(1);
      sketch.rect(x, y, pillWidth, 36, 18);

      sketch.noStroke();
      sketch.fill(100, 116, 139);
      sketch.textSize(9);
      sketch.textStyle(sketch.BOLD);
      sketch.textAlign(sketch.LEFT, sketch.CENTER);
      sketch.text(label, x + 15, y + 18);

      sketch.fill(37, 99, 235);
      sketch.textSize(12);
      sketch.textStyle(sketch.BOLD);
      sketch.textAlign(sketch.RIGHT, sketch.CENTER);
      sketch.text(valStr, x + pillWidth - 15, y + 18);
      sketch.pop();
    };

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
      case "straight_wire_field": {
        const I = sketch.I ?? 5.0;
        let r = sketch.r ?? 80;

        const leftCenterX = w * 0.28;
        const centerY = h / 2 + 10;

        // Mouse interaction: Drag to change distance r directly!
        if (sketch.mouseIsPressed) {
          const dMouse = sketch.dist(
            sketch.mouseX,
            sketch.mouseY,
            leftCenterX,
            centerY,
          );
          // If close to left side, let's assume they are dragging the probe
          if (sketch.mouseX < w * 0.52 && dMouse > 15 && dMouse < 180) {
            r = Math.round(dMouse);
            sketch.r = r;
          }
        }

        // Calculate B-field in Tesla (scaled for display)
        // B = mu0 * I / (2 * pi * r) -> let's scale it to microTesla
        const B_uT = (0.2 * I) / (r / 100);

        drawTitle("Concentric Field Lines: B = μ₀ I / (2π r)");
        drawHUDPill(w - 185, 12, "B FIELD", `${B_uT.toFixed(2)} μT`, 160);

        // --- Left Half: Top-Down view of wire ---
        sketch.push();

        // 1. Draw concentric magnetic field lines (intensity drops as 1/distance)
        sketch.noFill();
        sketch.t += 0.02;

        const circleCount = 5;
        for (let i = 1; i <= circleCount; i++) {
          const radius = i * 32;
          // Field drops as 1/radius
          const opacity = sketch.map(1 / radius, 1 / 160, 1 / 32, 25, 180);
          sketch.stroke(14, 165, 233, opacity);
          sketch.strokeWeight(1.5);
          sketch.circle(leftCenterX, centerY, radius * 2);

          // Animated flow arrows on the circle based on Right-Hand Rule
          // If I > 0: Counter-clockwise. If I < 0: Clockwise.
          if (I !== 0) {
            const dir = I > 0 ? 1 : -1;
            const angleOffset = sketch.t * dir * (1.2 / i) + i * sketch.HALF_PI;

            sketch.push();
            sketch.translate(leftCenterX, centerY);
            sketch.rotate(angleOffset);
            sketch.fill(14, 165, 233, opacity + 40);
            sketch.stroke(14, 165, 233, opacity + 40);
            sketch.strokeWeight(1);
            // Draw arrowhead
            sketch.triangle(radius, -4, radius, 4, radius + 6 * dir, 0);
            sketch.pop();
          }
        }

        // 2. Draw wire cross section in center
        sketch.stroke(30, 41, 59);
        sketch.strokeWeight(3);
        if (I > 0) {
          // Out of page: Dot (.) inside circle
          sketch.fill(248, 250, 252);
          sketch.circle(leftCenterX, centerY, 24);
          sketch.fill(239, 68, 68);
          sketch.noStroke();
          sketch.circle(leftCenterX, centerY, 6);

          sketch.fill(239, 68, 68);
          sketch.textSize(8);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
          sketch.text("I (Out)", leftCenterX, centerY - 15);
        } else if (I < 0) {
          // Into page: Cross (X) inside circle
          sketch.fill(248, 250, 252);
          sketch.circle(leftCenterX, centerY, 24);
          sketch.stroke(59, 130, 246);
          sketch.strokeWeight(2);
          sketch.line(
            leftCenterX - 5,
            centerY - 5,
            leftCenterX + 5,
            centerY + 5,
          );
          sketch.line(
            leftCenterX + 5,
            centerY - 5,
            leftCenterX - 5,
            centerY + 5,
          );

          sketch.fill(59, 130, 246);
          sketch.noStroke();
          sketch.textSize(8);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
          sketch.text("I (In)", leftCenterX, centerY - 15);
        } else {
          // Current is zero
          sketch.fill(226, 232, 240);
          sketch.circle(leftCenterX, centerY, 24);
        }

        // 3. Draw draggable probe
        // Radial vector from wire to probe
        sketch.stroke(100, 116, 139, 120);
        sketch.strokeWeight(1.5);
        sketch.drawingContext.setLineDash([4, 4]);
        sketch.line(leftCenterX, centerY, leftCenterX + r, centerY);
        sketch.drawingContext.setLineDash([]);

        // Probe sensor point
        sketch.noStroke();
        sketch.fill(16, 185, 129, 40);
        sketch.circle(leftCenterX + r, centerY, 16);
        sketch.fill(16, 185, 129);
        sketch.circle(leftCenterX + r, centerY, 6);

        // Draw local B-field vector arrow at probe (perpendicular to radius, pointing up or down)
        // If I > 0: tangent points UP. If I < 0: tangent points DOWN.
        if (I !== 0) {
          const vectorLen = sketch.constrain(B_uT * 5, 15, 60);
          const vy = I > 0 ? -vectorLen : vectorLen;

          sketch.stroke(16, 185, 129);
          sketch.strokeWeight(2);
          sketch.fill(16, 185, 129);
          sketch.line(leftCenterX + r, centerY, leftCenterX + r, centerY + vy);

          // Arrowhead
          const headSize = 6;
          const headY = centerY + vy;
          if (vy < 0) {
            sketch.triangle(
              leftCenterX + r - 3,
              headY + headSize,
              leftCenterX + r + 3,
              headY + headSize,
              leftCenterX + r,
              headY,
            );
          } else {
            sketch.triangle(
              leftCenterX + r - 3,
              headY - headSize,
              leftCenterX + r + 3,
              headY - headSize,
              leftCenterX + r,
              headY,
            );
          }
          sketch.noStroke();
          sketch.textSize(9);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.LEFT, sketch.CENTER);
          sketch.text(" B Vector", leftCenterX + r + 8, centerY + vy / 2);
        }

        // Label distance below the line
        sketch.fill(100, 116, 139);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text(`r = ${r} cm`, leftCenterX + r / 2, centerY + 5);

        sketch.pop();

        // --- Right Half: B vs r graph ---
        const rightStartX = w * 0.52 + 25;
        const graphW = w - rightStartX - 25;
        const gx = rightStartX + 35;
        const gy = 75;
        const gw = graphW - 40;
        const gh = h - gy - 60;

        // separation line
        sketch.stroke(226, 232, 240);
        sketch.strokeWeight(1.5);
        sketch.line(w * 0.5, 60, w * 0.5, h - 25);

        // draw axes
        sketch.push();
        sketch.stroke(148, 163, 184);
        sketch.strokeWeight(1.5);
        sketch.line(gx, gy + gh, gx, gy); // Y axis (B field)
        sketch.line(gx, gy + gh, gx + gw, gy + gh); // X axis (Distance r)

        sketch.noStroke();
        sketch.fill(100, 116, 139);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("Distance r (cm)", gx + gw / 2, gy + gh + 6);

        sketch.textAlign(sketch.RIGHT, sketch.CENTER);
        sketch.text("B (μT)", gx - 8, gy + gh / 2);
        sketch.pop();

        // Plot B-field curve vs r (B = k / r)
        sketch.push();
        sketch.noFill();
        sketch.stroke(14, 165, 233, 150);
        sketch.strokeWeight(2.5);
        sketch.beginShape();
        for (let rx = 20; rx <= 180; rx += 2) {
          const b_val = (0.2 * Math.abs(I)) / (rx / 100);
          const px = sketch.map(rx, 20, 180, gx, gx + gw);
          const py = sketch.map(b_val, 0, 10, gy + gh, gy);
          if (py >= gy && py <= gy + gh) {
            sketch.vertex(px, py);
          }
        }
        sketch.endShape();
        sketch.pop();

        // plot current coordinate dot
        const dotX = sketch.map(r, 20, 180, gx, gx + gw);
        const dotY = sketch.map(B_uT, 0, 10, gy + gh, gy);

        if (dotX >= gx && dotX <= gx + gw && dotY >= gy && dotY <= gy + gh) {
          sketch.push();
          sketch.noStroke();
          sketch.fill(16, 185, 129, 45);
          sketch.circle(dotX, dotY, 18);
          sketch.fill(16, 185, 129);
          sketch.circle(dotX, dotY, 7);

          // Coordinate label
          sketch.textSize(10);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.LEFT, sketch.BOTTOM);
          sketch.text(` (${r}cm, ${B_uT.toFixed(2)}μT)`, dotX + 6, dotY - 4);
          sketch.pop();
        }
        break;
      }

      case "charged_particle_magnetic_field": {
        const B = sketch.B ?? 4.0;
        const q = sketch.q ?? 2.0;
        const m = sketch.m ?? 5.0;
        const v = sketch.v ?? 6.0;

        // Radius: R = mv / (qB)
        const R_val = (m * v) / (Math.abs(q * B) || 0.1);
        const T_val = (2 * Math.PI * m) / (Math.abs(q * B) || 0.1);

        drawTitle("Charged Orbit in B Field: R = m v / (q B)");
        drawHUDPill(w - 185, 12, "RADIUS (R)", `${R_val.toFixed(2)} m`, 160);

        const leftCenterX = w * 0.28;
        const centerY = h / 2 + 10;
        const leftBoxW = w * 0.5 - 40;

        // Draw separation boundary line
        sketch.stroke(226, 232, 240);
        sketch.strokeWeight(1.5);
        sketch.line(w * 0.5, 60, w * 0.5, h - 25);

        // --- Left Half: Particle simulation area ---
        sketch.push();
        sketch.rectMode(sketch.CENTER);
        sketch.stroke(148, 163, 184, 100);
        sketch.strokeWeight(2);
        sketch.fill(248, 250, 252, 120);
        sketch.rect(leftCenterX, centerY, leftBoxW, h - 90, 8);
        sketch.pop();

        // Draw B-field symbols in a grid inside the box
        sketch.push();
        sketch.stroke(148, 163, 184, 80);
        sketch.strokeWeight(1.5);
        sketch.fill(148, 163, 184, 80);

        const cols = 5;
        const rows = 4;
        const startX = leftCenterX - leftBoxW / 2 + 30;
        const startY = centerY - (h - 90) / 2 + 30;
        const stepX = (leftBoxW - 60) / (cols - 1);
        const stepY = (h - 150) / (rows - 1);

        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            const bx = startX + col * stepX;
            const by = startY + row * stepY;
            if (B > 0) {
              // B points OUT of page: Dots
              sketch.circle(bx, by, 3);
              sketch.noFill();
              sketch.circle(bx, by, 12);
              sketch.fill(148, 163, 184, 80);
            } else if (B < 0) {
              // B points INTO page: Crosses
              sketch.line(bx - 4, by - 4, bx + 4, by + 4);
              sketch.line(bx + 4, by - 4, bx - 4, by + 4);
            }
          }
        }
        sketch.pop();

        // State updates for circular trajectory
        // Acceleration: a = (q * v x B) / m
        // For 2D plane: vx, vy, and B is perpendicular.
        // Fx = q * vy * B, Fy = -q * vx * B
        // We'll update coordinates numerically
        if (B !== 0 && q !== 0) {
          // Dynamically scale running velocity magnitude if the slider value changed
          const targetSpeed = v * 0.8;
          const currentSpeed = Math.sqrt(
            sketch.vx * sketch.vx + sketch.vy * sketch.vy,
          );
          if (currentSpeed > 0 && Math.abs(currentSpeed - targetSpeed) > 0.01) {
            sketch.vx = (sketch.vx / currentSpeed) * targetSpeed;
            sketch.vy = (sketch.vy / currentSpeed) * targetSpeed;
          } else if (currentSpeed === 0 && targetSpeed > 0) {
            sketch.vx = targetSpeed;
            sketch.vy = 0;
          }

          const dt = 0.15; // time step
          const fx = q * sketch.vy * (B * 0.05); // scaling factor for B
          const fy = -q * sketch.vx * (B * 0.05);

          sketch.vx += (fx / m) * dt;
          sketch.vy += (fy / m) * dt;

          sketch.px += sketch.vx * dt;
          sketch.py += sketch.vy * dt;
        } else {
          // If B or q became 0, update velocity magnitude to target if it doesn't match
          const targetSpeed = v * 0.8;
          const currentSpeed = Math.sqrt(
            sketch.vx * sketch.vx + sketch.vy * sketch.vy,
          );
          if (currentSpeed > 0 && Math.abs(currentSpeed - targetSpeed) > 0.01) {
            sketch.vx = (sketch.vx / currentSpeed) * targetSpeed;
            sketch.vy = (sketch.vy / currentSpeed) * targetSpeed;
          } else if (currentSpeed === 0 && targetSpeed > 0) {
            sketch.vx = targetSpeed;
            sketch.vy = 0;
          }

          // Moving in straight line
          sketch.px += sketch.vx * 0.15;
          sketch.py += sketch.vy * 0.15;
        }

        // Bounding / Wrap logic inside simulation box
        const minX = leftCenterX - leftBoxW / 2 + 10;
        const maxX = leftCenterX + leftBoxW / 2 - 10;
        const minY = centerY - (h - 90) / 2 + 10;
        const maxY = centerY + (h - 90) / 2 - 10;

        if (
          sketch.px < minX ||
          sketch.px > maxX ||
          sketch.py < minY ||
          sketch.py > maxY
        ) {
          // Reset particle path when it leaves boundaries
          sketch.resetParticle();
        }

        // Trail handling
        sketch.trail.push({ x: sketch.px, y: sketch.py });
        if (sketch.trail.length > 70) sketch.trail.shift();

        // Draw trail
        sketch.push();
        sketch.noFill();
        sketch.stroke(239, 68, 68, 180); // Red glowing trail
        sketch.strokeWeight(2);
        sketch.beginShape();
        sketch.trail.forEach((pt) => sketch.vertex(pt.x, pt.y));
        sketch.endShape();
        sketch.pop();

        // Draw particle
        sketch.push();
        sketch.noStroke();
        sketch.fill(239, 68, 68, 50); // glow
        sketch.circle(sketch.px, sketch.py, 18);
        sketch.fill(239, 68, 68); // core
        sketch.circle(sketch.px, sketch.py, 8);
        sketch.fill(255);
        sketch.circle(sketch.px - 2, sketch.py - 2, 2.5);
        sketch.pop();

        // Draw velocity vector arrow at particle position
        sketch.push();
        const velScale = 3;
        const vx_px = sketch.vx * velScale;
        const vy_px = sketch.vy * velScale;

        sketch.stroke(16, 185, 129);
        sketch.strokeWeight(1.8);
        sketch.fill(16, 185, 129);
        sketch.line(sketch.px, sketch.py, sketch.px + vx_px, sketch.py + vy_px);

        // arrow head
        const ang = Math.atan2(vy_px, vx_px);
        sketch.translate(sketch.px + vx_px, sketch.py + vy_px);
        sketch.rotate(ang);
        sketch.triangle(0, 3, 0, -3, 6, 0);
        sketch.pop();

        // --- Right Half: Readout display panel ---
        const rightStartX = w * 0.52 + 15;
        const rx = rightStartX + 20;
        const ry = 75;

        sketch.push();
        sketch.noStroke();
        sketch.textAlign(sketch.LEFT, sketch.TOP);

        sketch.fill(30, 41, 59);
        sketch.textSize(13);
        sketch.textStyle(sketch.BOLD);
        sketch.text("Orbital Characteristics", rx, ry);

        // Parameters table
        sketch.textSize(11);
        sketch.textStyle(sketch.NORMAL);
        sketch.fill(71, 85, 105);

        const textLines = [
          {
            label: "Mass of Particle (m):",
            val: `${m.toFixed(1)} kg`,
            col: "#475569",
          },
          {
            label: "Charge of Particle (q):",
            val: `${q.toFixed(1)} C`,
            col: q > 0 ? "#ef4444" : "#3b82f6",
          },
          {
            label: "Injection Velocity (v):",
            val: `${v.toFixed(1)} m/s`,
            col: "#10b981",
          },
          {
            label: "Magnetic Field (B):",
            val: `${B.toFixed(1)} T (${B > 0 ? "Outward" : B < 0 ? "Inward" : "None"})`,
            col: "#0ea5e9",
          },
          {
            label: "Calculated Radius (R):",
            val: `${R_val.toFixed(2)} meters`,
            col: "#2563eb",
          },
          {
            label: "Orbital Period (T):",
            val: `${T_val.toFixed(2)} seconds`,
            col: "#7c3aed",
          },
        ];

        let lineY = ry + 30;
        textLines.forEach((item) => {
          sketch.fill(100, 116, 139);
          sketch.text(item.label, rx, lineY);

          sketch.fill(item.col);
          sketch.textStyle(sketch.BOLD);
          sketch.text(item.val, rx + 175, lineY);
          sketch.textStyle(sketch.NORMAL);

          lineY += 24;
        });

        // Add some helper texts
        sketch.fill(100, 116, 139);
        sketch.textSize(10);
        sketch.textStyle(sketch.ITALIC);
        sketch.text(
          "* Observe how increasing Mass (m) or Velocity (v)\n  increases the orbital size (radius R).",
          rx,
          lineY + 10,
        );
        sketch.text(
          "* Increasing B-field strength tightens the orbit.",
          rx,
          lineY + 38,
        );
        sketch.pop();

        break;
      }
    }
  },
};
