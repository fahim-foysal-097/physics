export const p2_ch5_sims = {
  setup: (sketch, vizType) => {
    const defaults = {
      faradays_induction: {
        N: 3,
        magnetX: 80,
        magnetSpeed: 1.0,
        isDraggingMagnet: false,
        prevMagnetX: 80,
        emf: 0,
        t: 0,
        chargeOffset: 0,
        autoPlay: true,
      },
      lcr_resonance: {
        R: 10,
        L: 120, // milliHenry
        C: 40, // microFarad
        freq: 60, // Hz
        t: 0,
      },
    };

    Object.assign(sketch, defaults[vizType] || {});

    sketch.reset = () => {
      Object.assign(sketch, defaults[vizType] || {});
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
      case "faradays_induction": {
        const N = sketch.N ?? 3;
        const magnetSpeed = sketch.magnetSpeed ?? 1.0;
        const autoPlay = sketch.autoPlay ?? true;

        const coilCenterX = w * 0.32;
        const centerY = h / 2 + 10;
        const coilW = 100;
        const coilH = 80;

        // Magnet Position Logic
        sketch.t += 0.02 * magnetSpeed;
        if (autoPlay && !sketch.isDraggingMagnet) {
          // Automatic harmonic movement
          sketch.magnetX = coilCenterX - 10 + Math.sin(sketch.t) * 130;
        }

        // Dragging Magnet Logic
        if (sketch.mouseIsPressed) {
          if (
            !sketch.isDraggingMagnet &&
            sketch.mouseX > 0 &&
            sketch.mouseX < w * 0.6 &&
            sketch.mouseY > 0 &&
            sketch.mouseY < h
          ) {
            // Check click near magnet
            if (
              sketch.dist(
                sketch.mouseX,
                sketch.mouseY,
                sketch.magnetX,
                centerY,
              ) < 50
            ) {
              sketch.isDraggingMagnet = true;
              sketch.autoPlay = false; // pause autoplay on drag
            }
          }
          if (sketch.isDraggingMagnet) {
            sketch.magnetX = sketch.constrain(sketch.mouseX, 40, w * 0.58);
          }
        } else {
          sketch.isDraggingMagnet = false;
        }

        // Calculate induced EMF: e = -N * d(Phi)/dt
        // Physically accurate finite-length solenoid model (80px width)
        const L = 80; // Solenoid physical length
        const wd = 18; // Solenoid boundary transition width
        const dx1 = sketch.magnetX - coilCenterX + L / 2;
        const dx2 = sketch.magnetX - coilCenterX - L / 2;

        const sig1 = 1 / (1 + Math.exp(-dx1 / wd));
        const sig2 = 1 / (1 + Math.exp(-dx2 / wd));

        const dsig1 = (sig1 * (1 - sig1)) / wd;
        const dsig2 = (sig2 * (1 - sig2)) / wd;

        // Rate of change of flux with respect to position (dPhi/dx)
        const dPhi_dx = dsig1 - dsig2;

        // Exact, lag-free velocity calculation
        let velocity = 0;
        if (sketch.isDraggingMagnet) {
          const rawVelocity = sketch.magnetX - sketch.prevMagnetX;
          // Dead-zone filter to ignore tiny mouse deceleration micro-rebound tremors
          const activeVel = Math.abs(rawVelocity) < 0.6 ? 0 : rawVelocity;
          sketch.dragVelocity = sketch.dragVelocity ?? 0;
          // Smooth out frame-to-frame delta jitter
          sketch.dragVelocity += (activeVel - sketch.dragVelocity) * 0.75;
          velocity = sketch.dragVelocity;
        } else if (autoPlay) {
          // Exact analytical velocity: A * omega * cos(omega * t)
          // Since position is x = coilCenterX - 10 + 130 * sin(t)
          // where t advances by 0.02 * magnetSpeed in each frame.
          velocity = 130 * Math.cos(sketch.t) * 0.02 * magnetSpeed;
          sketch.dragVelocity = 0;
        } else {
          // Stopped: damp velocity to 0 rapidly with no overshoots or sign-flips
          sketch.dragVelocity = sketch.dragVelocity ?? 0;
          sketch.dragVelocity += (0 - sketch.dragVelocity) * 0.8;
          velocity = sketch.dragVelocity;
        }
        sketch.prevMagnetX = sketch.magnetX;

        // EMF = N * velocity * dPhi_dx (with correct physical scaling)
        const rawEmf = N * velocity * dPhi_dx * 350;
        // Zero-lag instant synchronization
        sketch.emf = rawEmf;

        drawTitle("Electromagnetic Induction: ε = -N dΦ/dt");
        drawHUDPill(
          w - 185,
          12,
          "INDUCED EMF",
          `${sketch.emf.toFixed(2)} V`,
          160,
        );

        // --- Left Half: Solenoid and Magnet physical setup ---
        sketch.push();

        // 1. Draw Magnet field lines (faint curves radiating out of N/S poles)
        sketch.push();
        sketch.stroke(0, 100, 255, 20);
        sketch.strokeWeight(1.5);
        sketch.noFill();

        const magW = 90;
        const magH = 30;
        const mx = sketch.magnetX;

        // Draw magnetic field line curves
        for (let i = 1; i <= 4; i++) {
          const bend = i * 25;
          // Loop curves from N-pole (right) to S-pole (left)
          sketch.bezier(
            mx + magW / 2,
            centerY,
            mx + magW / 2 + bend,
            centerY - bend,
            mx - magW / 2 - bend,
            centerY - bend,
            mx - magW / 2,
            centerY,
          );
          sketch.bezier(
            mx + magW / 2,
            centerY,
            mx + magW / 2 + bend,
            centerY + bend,
            mx - magW / 2 - bend,
            centerY + bend,
            mx - magW / 2,
            centerY,
          );
        }
        sketch.pop();

        // 2. Draw Solenoid Coil (Copper loops)
        // Behind the magnet or wrapped beautifully
        sketch.push();
        sketch.noFill();
        sketch.stroke(194, 120, 3, 200); // Copper orange
        sketch.strokeWeight(3.5);

        // Animate charge carriers in coils (glowing electrons moving clockwise/counterclockwise)
        sketch.chargeOffset += sketch.emf * 0.15;

        for (let i = 0; i < N; i++) {
          const loopX = coilCenterX - coilW / 2 + (i + 0.5) * (coilW / N);
          // Back half of coil loop
          sketch.stroke(150, 90, 0, 140);
          sketch.arc(
            loopX,
            centerY,
            24,
            coilH,
            sketch.HALF_PI,
            sketch.THREE_PI / 2,
          );

          // Front half of coil loop
          sketch.stroke(194, 120, 3, 220);
          sketch.arc(
            loopX,
            centerY,
            24,
            coilH,
            sketch.THREE_PI / 2,
            sketch.HALF_PI,
          );

          // Flowing charge indicators inside the coil front arcs
          sketch.push();
          sketch.noStroke();
          sketch.fill(56, 189, 248);
          for (let c = 0; c < 3; c++) {
            const angle =
              (sketch.HALF_PI + (c * sketch.TWO_PI) / 3 + sketch.chargeOffset) %
              sketch.TWO_PI;
            // draw charge carriers if they are in the front half (angle between -pi/2 and pi/2)
            if (angle > -sketch.HALF_PI && angle < sketch.HALF_PI) {
              const cx = loopX + 12 * Math.cos(angle);
              const cy = centerY + (coilH / 2) * Math.sin(angle);
              sketch.circle(cx, cy, 6);
            }
          }
          sketch.pop();
        }

        // Draw iron core inside coil (grey cylinder)
        sketch.fill(100, 116, 139, 60);
        sketch.noStroke();
        sketch.rect(
          coilCenterX - coilW / 2 - 10,
          centerY - 12,
          coilW + 20,
          24,
          4,
        );
        sketch.pop();

        // 3. Draw physical Bar Magnet
        sketch.push();
        sketch.rectMode(sketch.CENTER);
        sketch.noStroke();

        // South Pole (Blue, Left)
        sketch.fill(59, 130, 246);
        sketch.rect(mx - magW / 4, centerY, magW / 2, magH, 4);
        // North Pole (Red, Right)
        sketch.fill(239, 68, 68);
        sketch.rect(mx + magW / 4, centerY, magW / 2, magH, 4);

        // Text labels inside magnet poles
        sketch.fill(255);
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text("S", mx - magW / 4, centerY);
        sketch.text("N", mx + magW / 4, centerY);
        sketch.pop();

        sketch.pop();

        // --- Right Half: Galvanometer and flux meter ---
        const rightStartX = w * 0.52 + 10;
        const rightCenterX = rightStartX + (w - rightStartX) / 2;
        const galvoY = h / 2 + 15;
        const galvoR = 75;

        // Separation line
        sketch.stroke(226, 232, 240);
        sketch.strokeWeight(1.5);
        sketch.line(w * 0.5, 60, w * 0.5, h - 25);

        sketch.push();
        // Galvanometer circle face
        sketch.fill(248, 250, 252, 210);
        sketch.stroke(148, 163, 184);
        sketch.strokeWeight(2.5);
        sketch.circle(rightCenterX, galvoY, galvoR * 2);

        // Draw meter graduation ticks
        sketch.stroke(148, 163, 184);
        sketch.strokeWeight(1);
        sketch.push();
        sketch.translate(rightCenterX, galvoY);
        for (let a = -50; a <= 50; a += 10) {
          const angle = sketch.radians(a - 90);
          const outerX = (galvoR - 4) * Math.cos(angle);
          const outerY = (galvoR - 4) * Math.sin(angle);
          const innerX = (galvoR - 10) * Math.cos(angle);
          const innerY = (galvoR - 10) * Math.sin(angle);
          sketch.line(innerX, innerY, outerX, outerY);
        }
        sketch.pop();

        // Meter labels (G in center, + on right, - on left)
        sketch.noStroke();
        sketch.fill(71, 85, 105);
        sketch.textSize(13);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text("G", rightCenterX, galvoY - galvoR + 25);

        sketch.textSize(9);
        sketch.text("-", rightCenterX - galvoR + 20, galvoY - 15);
        sketch.text("+", rightCenterX + galvoR - 20, galvoY - 15);

        // Needle deflection
        // Map EMF (-10 to 10 V) to angle (-45 to 45 degrees)
        const angleDeg = sketch.constrain(sketch.emf * 4.5, -45, 45);
        const needleAngle = sketch.radians(angleDeg - 90);

        sketch.stroke(220, 38, 38); // Red needle
        sketch.strokeWeight(2.5);
        sketch.line(
          rightCenterX,
          galvoY + 15,
          rightCenterX + (galvoR - 15) * Math.cos(needleAngle),
          galvoY + 15 + (galvoR - 15) * Math.sin(needleAngle),
        );

        // Needle center hub
        sketch.noStroke();
        sketch.fill(30, 41, 59);
        sketch.circle(rightCenterX, galvoY + 15, 10);

        // Digital display on galvanometer face
        sketch.push();
        sketch.rectMode(sketch.CENTER);
        sketch.fill(240, 248, 245, 230); // Soft green LCD background
        sketch.stroke(180, 200, 190);
        sketch.strokeWeight(1.2);
        sketch.rect(rightCenterX, galvoY + 42, 65, 18, 4);

        sketch.noStroke();
        sketch.fill(20, 80, 50); // LCD dark green text
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text(`${sketch.emf.toFixed(2)} V`, rightCenterX, galvoY + 42);
        sketch.pop();

        // Label below Galvanometer
        sketch.fill(100, 116, 139);
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.text("Galvanometer Needle", rightCenterX, galvoY + galvoR + 15);
        sketch.pop();

        break;
      }

      case "lcr_resonance": {
        const R = sketch.R ?? 10;
        const L_mH = sketch.L ?? 120; // in milliHenry
        const C_uF = sketch.C ?? 40; // in microFarad
        const f_AC = sketch.freq ?? 60; // in Hz

        const L = L_mH / 1000; // Henry
        const C = C_uF / 1000000; // Farad
        const omega_AC = 2 * Math.PI * f_AC;

        // Impedance components
        const XL = omega_AC * L;
        const XC = 1 / (omega_AC * C);
        const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));

        // Voltage amplitude V0 = 24V
        const V0 = 24.0;
        const I0 = V0 / Z; // Current amplitude

        // Phase difference: phi = atan((XL-XC)/R)
        const phi = Math.atan((XL - XC) / R);

        // Resonant frequency: f0 = 1 / (2 * pi * sqrt(L*C))
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
        const Z_min = R;
        const I_max = V0 / Z_min;

        drawTitle("AC Resonance & LCR Frequency Curve");
        drawHUDPill(w - 185, 12, "IMPEDANCE (Z)", `${Z.toFixed(1)} Ω`, 160);

        // --- Left Half: Circuit Diagram & Oscilloscope Waveforms ---
        const leftCenterX = w * 0.26;
        const oscY = h - 105;
        const oscH = 75;
        const oscW = w * 0.4;

        // Separation line
        sketch.stroke(226, 232, 240);
        sketch.strokeWeight(1.5);
        sketch.line(w * 0.5, 60, w * 0.5, h - 25);

        // 1. Draw elegant Circuit Schematic
        sketch.push();
        sketch.stroke(71, 85, 105);
        sketch.strokeWeight(2);
        sketch.noFill();

        const cy = 90;
        const cx = leftCenterX;

        // Circuit Loop wire
        sketch.rect(cx - 70, cy, 140, 50, 4);

        // Clear slots for components
        sketch.fill(253, 254, 255);
        sketch.noStroke();
        sketch.rect(cx - 70, cy + 10, 15, 30); // Left branch
        sketch.rect(cx - 30, cy - 10, 60, 20); // Top branch for components
        sketch.rect(cx - 10, cy + 50, 20, 15); // Bottom branch AC Source

        // Draw AC Source symbol (circle with sine wave)
        sketch.stroke(71, 85, 105);
        sketch.strokeWeight(2);
        sketch.fill(255);
        sketch.circle(cx, cy + 50, 16);
        sketch.noFill();
        sketch.bezier(
          cx - 5,
          cy + 50,
          cx - 2,
          cy + 46,
          cx + 2,
          cy + 54,
          cx + 5,
          cy + 50,
        );

        // Draw L, C, R symbols in series on top wire
        // Resistor R (zig-zag)
        sketch.push();
        sketch.translate(cx - 55, cy - 5);
        sketch.stroke(239, 68, 68); // Red for R
        sketch.beginShape();
        sketch.vertex(0, 5);
        sketch.vertex(4, 0);
        sketch.vertex(8, 10);
        sketch.vertex(12, 0);
        sketch.vertex(16, 10);
        sketch.vertex(20, 5);
        sketch.endShape();
        sketch.pop();

        // Inductor L (coils)
        sketch.push();
        sketch.translate(cx - 15, cy - 2);
        sketch.stroke(0, 150, 255); // Blue for L
        sketch.arc(-4, 0, 8, 8, sketch.PI, 0);
        sketch.arc(2, 0, 8, 8, sketch.PI, 0);
        sketch.arc(8, 0, 8, 8, sketch.PI, 0);
        sketch.pop();

        // Capacitor C (parallel plates)
        sketch.push();
        sketch.stroke(16, 185, 129); // Green for C
        sketch.line(cx + 25, cy - 10, cx + 25, cy);
        sketch.line(cx + 30, cy - 10, cx + 30, cy);
        sketch.pop();

        // Label components
        sketch.noStroke();
        sketch.fill(100, 116, 139);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
        sketch.text(`R = ${R}Ω`, cx - 45, cy - 12);
        sketch.text(`L = ${L_mH}mH`, cx - 3, cy - 12);
        sketch.text(`C = ${C_uF}μF`, cx + 38, cy - 12);
        sketch.text("AC Source", cx, cy + 68);
        sketch.pop();

        // 2. Draw Live Oscilloscope Waveforms (Oscilloscope View)
        sketch.push();
        sketch.rectMode(sketch.CENTER);
        sketch.stroke(148, 163, 184, 120);
        sketch.strokeWeight(1.8);
        sketch.fill(30, 41, 59, 240); // Dark scope background
        sketch.rect(leftCenterX, oscY, oscW, oscH, 6);

        // draw scope grid
        sketch.stroke(51, 65, 85, 120);
        sketch.strokeWeight(1);
        for (
          let gx = leftCenterX - oscW / 2 + 20;
          gx < leftCenterX + oscW / 2;
          gx += 25
        ) {
          sketch.line(gx, oscY - oscH / 2 + 2, gx, oscY + oscH / 2 - 2);
        }
        sketch.line(
          leftCenterX - oscW / 2 + 2,
          oscY,
          leftCenterX + oscW / 2 - 2,
          oscY,
        ); // center horizontal axis

        // Plot waveforms
        // Supply Voltage V = V0 * sin(omega * t) -> yellow wave
        // Response Current I = I0 * sin(omega * t - phi) -> blue wave (scaled for visibility)
        sketch.t += 0.05;
        sketch.noFill();

        // Supply Voltage channel (Yellow)
        sketch.stroke(245, 158, 11, 230);
        sketch.strokeWeight(1.8);
        sketch.beginShape();
        for (let ox = 0; ox < oscW - 10; ox++) {
          const ax = leftCenterX - oscW / 2 + 5 + ox;
          // compute local sine angle based on screen position
          const waveAng = sketch.t + ox * 0.05 * (f_AC / 60);
          const v_val = Math.sin(waveAng) * (oscH * 0.35);
          sketch.vertex(ax, oscY - v_val);
        }
        sketch.endShape();

        // Circuit Current channel (Bright Blue)
        sketch.stroke(56, 189, 248, 230);
        sketch.strokeWeight(1.8);
        sketch.beginShape();
        for (let ox = 0; ox < oscW - 10; ox++) {
          const ax = leftCenterX - oscW / 2 + 5 + ox;
          // subtract phase shift phi
          const waveAng = sketch.t + ox * 0.05 * (f_AC / 60) - phi;
          // Scale current amplitude relative to max current
          const i_amp_factor = sketch.map(I0, 0, I_max, 2, oscH * 0.35);
          const i_val = Math.sin(waveAng) * i_amp_factor;
          sketch.vertex(ax, oscY - i_val);
        }
        sketch.endShape();

        // Channel Legend labels
        sketch.noStroke();
        sketch.textSize(8);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        sketch.fill(245, 158, 11);
        sketch.text(
          "Voltage V",
          leftCenterX - oscW / 2 + 10,
          oscY - oscH / 2 + 6,
        );
        sketch.fill(56, 189, 248);
        sketch.text(
          `Current I (${phi >= 0 ? "lagging" : "leading"})`,
          leftCenterX + 10,
          oscY - oscH / 2 + 6,
        );
        sketch.pop();

        // --- Right Half: High-fidelity Cartesian Resonance Curve ---
        const rightStartX = w * 0.52 + 25;
        const graphW = w - rightStartX - 25;
        const gx = rightStartX + 35;
        const gy = 75;
        const gw = graphW - 40;
        const gh = h - gy - 60;

        // axes
        sketch.push();
        sketch.stroke(148, 163, 184);
        sketch.strokeWeight(1.5);
        sketch.line(gx, gy + gh, gx, gy); // Y axis (Current Amplitude I0)
        sketch.line(gx, gy + gh, gx + gw, gy + gh); // X axis (AC Frequency f)

        sketch.noStroke();
        sketch.fill(100, 116, 139);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("AC Frequency f (Hz)", gx + gw / 2, gy + gh + 6);

        sketch.textAlign(sketch.RIGHT, sketch.CENTER);
        sketch.text("I₀ (A)", gx - 8, gy + gh / 2);
        sketch.pop();

        // Plot LCR Frequency response curve
        // Limits: Frequency from 10Hz to 200Hz
        sketch.push();
        sketch.noFill();
        sketch.stroke(37, 99, 235, 155); // Royal Blue
        sketch.strokeWeight(2.5);
        sketch.beginShape();
        for (let fx = 10; fx <= 200; fx += 1.5) {
          const w_ang = 2 * Math.PI * fx;
          const xl_val = w_ang * L;
          const xc_val = 1 / (w_ang * C);
          const z_val = Math.sqrt(
            R * R + (xl_val - xc_val) * (xl_val - xc_val),
          );
          const i0_val = V0 / z_val;

          const px = sketch.map(fx, 10, 200, gx, gx + gw);
          const py = sketch.map(i0_val, 0, I_max, gy + gh, gy);
          sketch.vertex(px, py);
        }
        sketch.endShape();
        sketch.pop();

        // 1. Plot Resonant Frequency dotted vertical line at f0
        const rx0 = sketch.map(f0, 10, 200, gx, gx + gw);
        sketch.push();
        sketch.stroke(220, 38, 38, 120); // Dotted Red for f0
        sketch.strokeWeight(1.2);
        sketch.drawingContext.setLineDash([3, 3]);
        sketch.line(rx0, gy + gh, rx0, gy + 10);
        sketch.drawingContext.setLineDash([]);

        sketch.noStroke();
        sketch.fill(220, 38, 38);
        sketch.textSize(8);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
        sketch.text(`f₀ = ${f0.toFixed(1)}Hz`, rx0, gy + 6);
        sketch.pop();

        // 2. Plot Current dynamic dot marking selected AC Frequency
        const dotX = sketch.map(f_AC, 10, 200, gx, gx + gw);
        const dotY = sketch.map(I0, 0, I_max, gy + gh, gy);

        if (dotX >= gx && dotX <= gx + gw && dotY >= gy && dotY <= gy + gh) {
          sketch.push();
          sketch.noStroke();
          sketch.fill(16, 185, 129, 45); // green aura
          sketch.circle(dotX, dotY, 18);
          sketch.fill(16, 185, 129);
          sketch.circle(dotX, dotY, 7);

          // Coordinate readout label
          sketch.textSize(10);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.LEFT, sketch.BOTTOM);
          sketch.text(` (${f_AC}Hz, ${I0.toFixed(2)}A)`, dotX + 6, dotY - 4);
          sketch.pop();
        }
        break;
      }
    }
  },
};
