export const p2_ch8_sims = {
  setup: (sketch, vizType) => {
    sketch.textFont("Inter, system-ui, sans-serif");

    if (vizType === "relativity_dilation") {
      sketch.beta = 0.6; // v/c
      sketch.spaceshipTime = 0;
      sketch.earthTime = 0;
      sketch.stars = [];
      for (let i = 0; i < 40; i++) {
        sketch.stars.push({
          x: sketch.random(0, 400),
          y: sketch.random(20, 220),
          size: sketch.random(1.2, 3.5),
          speed: sketch.random(0.4, 2.2),
        });
      }
      sketch.reset = () => {
        sketch.spaceshipTime = 0;
        sketch.earthTime = 0;
      };
    }

    if (vizType === "photoelectric_effect") {
      sketch.wavelength = 380; // nm
      sketch.intensity = 50; // %
      sketch.workFunction = 2.3; // eV
      sketch.voltage = 0.0; // V

      sketch.photons = [];
      sketch.electrons = [];
      sketch.emitTimer = 0;
    }

    if (vizType === "xray_production") {
      sketch.tubeVoltage = 30; // kV
      sketch.filamentCurrent = 3.0;
      sketch.electrons = [];
      sketch.xrayPhotons = [];
      sketch.waveTimer = 0;
    }
  },

  draw: (sketch, vizType) => {
    sketch.background("#ffffff"); // Light background

    const primaryColor = "#4f46e5"; // Legible Indigo
    const accentColor = "#0891b2"; // Rich Cyan
    const textColor = "#0f172a"; // Dark slate text
    const mutedTextColor = "#64748b"; // Clean gray text

    // Helper: Map wavelength to RGB color for light beams
    const wavelengthToColor = (lambda) => {
      let r, g, b;
      if (lambda >= 380 && lambda < 440) {
        r = sketch.map(lambda, 380, 440, 80, 0);
        g = 0;
        b = 255;
      } else if (lambda >= 440 && lambda < 490) {
        r = 0;
        g = sketch.map(lambda, 440, 490, 0, 230);
        b = 255;
      } else if (lambda >= 490 && lambda < 510) {
        r = 0;
        g = 255;
        b = sketch.map(lambda, 490, 510, 255, 0);
      } else if (lambda >= 510 && lambda < 580) {
        r = sketch.map(lambda, 510, 580, 0, 230);
        g = 230;
        b = 0;
      } else if (lambda >= 580 && lambda < 645) {
        r = 255;
        g = sketch.map(lambda, 580, 645, 230, 0);
        b = 0;
      } else if (lambda >= 645 && lambda <= 750) {
        r = 255;
        g = 0;
        b = 0;
      } else {
        r = lambda < 380 ? 150 : 120;
        g = lambda < 380 ? 30 : 15;
        b = lambda < 380 ? 220 : 15;
      }
      return sketch.color(r, g, b);
    };

    if (vizType === "relativity_dilation") {
      let speedFactor = sketch.beta || 0.6;
      let gamma = 1 / sketch.sqrt(1 - speedFactor * speedFactor);

      // 1. Draw Space Sky Container (soft light-blue gradients instead of deep space)
      sketch.noStroke();
      sketch.fill("#f1f5f9");
      sketch.rect(10, 15, sketch.width - 20, 140, 12);

      // Draw floating space dust/sparks
      for (let s of sketch.stars) {
        s.x -= s.speed * speedFactor * 8;
        if (s.x < 10) {
          s.x = sketch.width - 20;
          s.y = sketch.random(25, 135);
        }
        sketch.fill("#cbd5e1");
        sketch.circle(s.x, s.y, s.size);
      }

      // 2. Update Clocks
      let dt = 1 / 60;
      sketch.earthTime += dt;
      sketch.spaceshipTime += dt / gamma;

      // 3. Draw Length-Contracted Spaceship
      sketch.push();
      let shipCX = (sketch.width - 150) / 2 + 10;
      if (sketch.width < 450) shipCX = (sketch.width - 120) / 2 + 5;

      sketch.translate(shipCX, 85);

      let propLen = 170;
      let propHeight = 48;
      let contractedLen = propLen / gamma;

      // Thruster Plasma Jet
      let flameCol = sketch.color(249, 115, 22, sketch.random(180, 255));
      sketch.fill(flameCol);
      sketch.drawingContext.shadowBlur = 10;
      sketch.drawingContext.shadowColor = "#f97316";
      sketch.triangle(
        -contractedLen / 2 - 4,
        -propHeight / 5,
        -contractedLen / 2 - 4,
        propHeight / 5,
        -contractedLen / 2 - 12 - sketch.random(8, 24) * speedFactor,
        0,
      );
      sketch.drawingContext.shadowBlur = 0;

      // Spaceship Body (metallic sleek cylinder)
      sketch.fill("#475569");
      sketch.stroke("#334155");
      sketch.strokeWeight(1.5);
      sketch.rect(
        -contractedLen / 2,
        -propHeight / 2,
        contractedLen,
        propHeight,
        8,
      );

      // Rocket nose cone
      sketch.fill("#94a3b8");
      sketch.arc(
        contractedLen / 2 - 4,
        0,
        propHeight * 0.8,
        propHeight,
        -sketch.HALF_PI,
        sketch.HALF_PI,
        sketch.CHORD,
      );

      // Cabin Windows
      sketch.fill("#38bdf8");
      sketch.noStroke();
      let winCount = 3;
      let winSpacing = contractedLen / (winCount + 1);
      for (let i = 1; i <= winCount; i++) {
        sketch.circle(-contractedLen / 2 + i * winSpacing, -3, 6);
      }
      sketch.pop();

      // 4. Floating Digital Glass Clocks in top right
      let clockX = sketch.width - 145;
      let clockY = 15;
      let clockW = 130;

      sketch.fill("#f8fafcdd");
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1.5);
      sketch.rect(clockX, clockY, clockW, 140, 12);

      sketch.noStroke();
      sketch.textAlign(sketch.CENTER);

      // Stationary Clock (Earth)
      sketch.textSize(9);
      sketch.fill(accentColor);
      sketch.textStyle(sketch.BOLD);
      sketch.text("EARTH OBSERVER (t)", clockX + clockW / 2, clockY + 22);
      sketch.textSize(15);
      sketch.fill(textColor);
      sketch.text(
        `${sketch.earthTime.toFixed(2)} s`,
        clockX + clockW / 2,
        clockY + 42,
      );

      // Divider
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1);
      sketch.line(clockX + 10, clockY + 58, clockX + clockW - 10, clockY + 58);
      sketch.noStroke();

      // Moving Clock (Spaceship)
      sketch.textSize(9);
      sketch.fill("#ef4444");
      sketch.textStyle(sketch.BOLD);
      sketch.text("SPACESHIP FRAME (t')", clockX + clockW / 2, clockY + 82);
      sketch.textSize(15);
      sketch.fill(textColor);
      sketch.text(
        `${sketch.spaceshipTime.toFixed(2)} s`,
        clockX + clockW / 2,
        clockY + 102,
      );

      sketch.textStyle(sketch.NORMAL);
      sketch.textSize(8);
      sketch.fill(mutedTextColor);
      sketch.text("Relativistic dilation", clockX + clockW / 2, clockY + 124);

      // 5. Responsive Bottom Metrics Panel
      sketch.fill("#f8fafcdd");
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1.5);
      sketch.rect(10, sketch.height - 95, sketch.width - 20, 85, 12);

      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textAlign(sketch.LEFT);
      sketch.textSize(11);
      sketch.textStyle(sketch.BOLD);
      sketch.text(
        `Velocity v = ${speedFactor.toFixed(2)}c`,
        25,
        sketch.height - 70,
      );
      sketch.textStyle(sketch.NORMAL);
      sketch.fill(mutedTextColor);
      sketch.text(
        `Lorentz Factor γ = ${gamma.toFixed(4)}`,
        25,
        sketch.height - 50,
      );

      let col2X = sketch.width * 0.5 + 10;
      if (sketch.width < 450) col2X = sketch.width * 0.5 - 5;
      sketch.fill(textColor);
      sketch.text(
        `Length L: ${contractedLen.toFixed(1)}m (L₀: 170m)`,
        col2X,
        sketch.height - 70,
      );
      sketch.fill(mutedTextColor);
      sketch.text(
        `Contraction: ${(100 / gamma).toFixed(1)}% of L₀`,
        col2X,
        sketch.height - 50,
      );

      sketch.textSize(9);
      sketch.fill(textColor);
      sketch.text(
        "Speed increases the Lorentz factor, horizontally shrinking the ship & slowing its clock.",
        25,
        sketch.height - 38,
        sketch.width - 50,
        26,
      );
    }

    if (vizType === "photoelectric_effect") {
      let wl = sketch.wavelength || 380;
      let intense = sketch.intensity || 50;
      let phi = sketch.workFunction || 2.3;
      let volt = sketch.voltage || 0.0;

      let photonEnergy = 1240 / wl;
      let kMax = photonEnergy - phi;

      // 1. Dynamic Bounding Box Calculations to prevent Graph Overlap
      let maxDrawW = sketch.width - 165;
      if (sketch.width < 450) maxDrawW = sketch.width - 130;

      let plateY = 40;
      let plateH = 120;
      let catX = maxDrawW * 0.25;
      let anoX = maxDrawW * 0.75;

      // Draw vacuum light container chamber in light theme
      sketch.fill("#f8fafc");
      sketch.stroke("#cbd5e1");
      sketch.strokeWeight(1.5);
      sketch.rect(catX - 25, plateY - 15, anoX - catX + 50, plateH + 30, 10);

      // Draw Cathode (K) and Anode (A) plates
      sketch.stroke("#64748b");
      sketch.strokeWeight(3);
      sketch.fill("#cbd5e1");
      sketch.rect(catX, plateY, 14, plateH, 3);
      sketch.rect(anoX, plateY, 14, plateH, 3);

      // Plate Labels
      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textSize(10);
      sketch.textAlign(sketch.CENTER);
      sketch.textStyle(sketch.BOLD);
      sketch.text("Cathode (K)", catX + 7, plateY - 20);
      sketch.text("Anode (A)", anoX + 7, plateY - 20);
      sketch.textStyle(sketch.NORMAL);

      // Light Beam Ray
      sketch.stroke(wavelengthToColor(wl));
      sketch.strokeWeight(sketch.map(intense, 10, 100, 1.5, 6));
      sketch.line(catX - 25, plateY + plateH / 2, catX, plateY + plateH / 2);
      sketch.noStroke();

      // Particle emissions timers
      sketch.emitTimer++;
      if (
        sketch.emitTimer % sketch.round(sketch.map(intense, 10, 100, 16, 6)) ===
        0
      ) {
        sketch.photons.push({
          x: catX - 25,
          y: sketch.random(plateY + 10, plateY + plateH - 10),
          speed: 4.5,
        });
      }

      let isEjection = photonEnergy >= phi;

      // Draw photons
      sketch.fill(wavelengthToColor(wl));
      for (let i = sketch.photons.length - 1; i >= 0; i--) {
        let p = sketch.photons[i];
        p.x += p.speed;
        sketch.circle(p.x, p.y, 5);

        if (p.x >= catX) {
          sketch.photons.splice(i, 1);
          if (isEjection) {
            let vel = sketch.map(
              sketch.sqrt(kMax),
              0,
              sketch.sqrt(5),
              0.9,
              3.2,
            );
            sketch.electrons.push({
              x: catX + 15,
              y: p.y,
              vx: vel,
              vy: sketch.random(-0.25, 0.25),
            });
          }
        }
      }

      // Draw Electrons (Deep blue circles instead of cyan to increase contrast on white)
      sketch.fill("#2563eb");
      sketch.drawingContext.shadowBlur = 4;
      sketch.drawingContext.shadowColor = "#3b82f6";

      for (let i = sketch.electrons.length - 1; i >= 0; i--) {
        let e = sketch.electrons[i];
        let force = volt * 0.022;
        e.vx += force;
        e.x += e.vx;
        e.y += e.vy;

        sketch.circle(e.x, e.y, 5);

        // Check plate limits
        if (e.x > anoX) {
          sketch.electrons.splice(i, 1);
        } else if (e.x < catX + 10) {
          sketch.electrons.splice(i, 1);
        }
      }
      sketch.drawingContext.shadowBlur = 0;

      // Wires Schematic
      sketch.stroke("#64748b");
      sketch.strokeWeight(2);
      sketch.noFill();

      // Wire from Cathode
      sketch.beginShape();
      sketch.vertex(catX + 7, plateY + plateH);
      sketch.vertex(catX + 7, plateY + plateH + 20);
      sketch.vertex(maxDrawW * 0.35, plateY + plateH + 20);
      sketch.endShape();

      // Wire from Anode
      sketch.beginShape();
      sketch.vertex(anoX + 7, plateY + plateH);
      sketch.vertex(anoX + 7, plateY + plateH + 20);
      sketch.vertex(maxDrawW * 0.65, plateY + plateH + 20);
      sketch.endShape();

      // Battery schematic box in center
      let batW = 55;
      let batH = 20;
      let batX = maxDrawW * 0.5 - batW / 2;
      let batY = plateY + plateH + 10;

      sketch.fill("#f8fafc");
      sketch.stroke(primaryColor);
      sketch.rect(batX, batY, batW, batH, 4);

      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.CENTER);
      sketch.textStyle(sketch.BOLD);
      sketch.text(`${volt.toFixed(1)} V`, batX + batW / 2, batY + 13);
      sketch.textStyle(sketch.NORMAL);

      // 3. Live I-V Graph (aligned to the right edge)
      let graphX = sketch.width - 150;
      let graphY = 30;
      let gw = 135;
      let gh = 120;

      sketch.push();
      sketch.translate(graphX, graphY);

      // Axes
      sketch.stroke("#94a3b8");
      sketch.strokeWeight(1.5);
      sketch.line(0, gh / 2, gw, gh / 2); // V axis
      sketch.line(gw / 2, 10, gw / 2, gh); // I axis

      // Axis labels
      sketch.noStroke();
      sketch.fill(mutedTextColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.LEFT);
      sketch.text("Voltage V", gw - 40, gh / 2 - 4);
      sketch.text("Current I", gw / 2 + 5, 10);
      sketch.text("-V_s", gw / 2 - 42, gh / 2 + 10);

      // Plot curve
      sketch.noFill();
      sketch.stroke(accentColor);
      sketch.strokeWeight(2);
      sketch.beginShape();

      let vs = kMax > 0 ? kMax : 0;
      let saturationCurrent = sketch.map(intense, 10, 100, 8, 42);

      for (let x = 0; x <= gw; x++) {
        let vVal = sketch.map(x, 0, gw, -4.0, 4.0);
        let curr = 0;
        if (isEjection && vVal >= -vs) {
          curr = saturationCurrent * (1 - sketch.exp(-1.4 * (vVal + vs)));
        }
        let yPos = sketch.map(curr, 0, 50, gh / 2, 10);
        sketch.vertex(x, yPos);
      }
      sketch.endShape();

      // Current operating point
      let activeCurrent = 0;
      if (isEjection && volt >= -vs) {
        activeCurrent =
          saturationCurrent * (1 - sketch.exp(-1.4 * (volt + vs)));
      }
      let opX = sketch.map(volt, -4.0, 4.0, 0, gw);
      let opY = sketch.map(activeCurrent, 0, 50, gh / 2, 10);

      sketch.fill("#ef4444");
      sketch.noStroke();
      sketch.circle(opX, opY, 6);
      sketch.pop();

      // 4. Bottom HUD parameters panel
      sketch.fill("#f8fafcdd");
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1.5);
      sketch.rect(10, sketch.height - 95, sketch.width - 20, 85, 12);

      sketch.noStroke();
      sketch.fill(wavelengthToColor(wl));
      sketch.textAlign(sketch.LEFT);
      sketch.textSize(11);
      sketch.textStyle(sketch.BOLD);
      sketch.text(
        `Photon E = ${photonEnergy.toFixed(2)} eV`,
        25,
        sketch.height - 70,
      );
      sketch.textStyle(sketch.NORMAL);
      sketch.fill(phi > photonEnergy ? "#f43f5e" : "#10b981");
      sketch.text(
        `Work Function Φ = ${phi.toFixed(1)} eV`,
        25,
        sketch.height - 50,
      );

      let col2X = sketch.width * 0.5 + 10;
      if (sketch.width < 450) col2X = sketch.width * 0.5 - 5;
      sketch.fill(textColor);
      sketch.text(
        `Max K.E. K_max = ${kMax > 0 ? kMax.toFixed(2) : "0.00"} eV`,
        col2X,
        sketch.height - 70,
      );
      sketch.fill(accentColor);
      sketch.text(
        `Stopping Pot. V_s = ${vs.toFixed(2)} V`,
        col2X,
        sketch.height - 50,
      );

      sketch.fill(textColor);
      sketch.textSize(9);
      sketch.text(
        "If E < Φ, no photoelectrons are ejected. Reverse bias voltage (negative) can decelerate electrons to zero current.",
        25,
        sketch.height - 38,
        sketch.width - 50,
        26,
      );
    }

    if (vizType === "xray_production") {
      let volt = sketch.tubeVoltage || 30; // kV
      let speedVal = sketch.map(volt, 10, 50, 4.5, 12);
      let lambdaMin = 1.24 / volt;

      // 1. Dynamic Vacuum Chamber Bounding calculations
      let maxDrawW = sketch.width - 165;
      if (sketch.width < 450) maxDrawW = sketch.width - 130;

      // Draw Vacuum Chamber outline (realistic soft light gray transparent glass)
      sketch.stroke("#cbd5e1");
      sketch.strokeWeight(2);
      sketch.fill("#f1f5f9");
      sketch.rect(10, 30, maxDrawW - 20, 140, 15);

      // Cathode Filament (left side of chamber)
      sketch.fill("#ea580c"); // bright hot orange filament
      sketch.noStroke();
      sketch.circle(35, 100, 8);
      sketch.stroke("#64748b");
      sketch.strokeWeight(1.5);
      sketch.line(15, 96, 35, 96);
      sketch.line(15, 104, 35, 104);

      // Tungsten Target (Anode) inclined 45deg
      sketch.push();
      sketch.translate(maxDrawW - 35, 100);
      sketch.rotate(sketch.QUARTER_PI);
      sketch.fill("#64748b");
      sketch.stroke("#475569");
      sketch.strokeWeight(1.5);
      sketch.rect(-8, -25, 16, 50, 3);
      sketch.pop();

      // Filament labels inside vacuum
      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textSize(9);
      sketch.textAlign(sketch.LEFT);
      sketch.textStyle(sketch.BOLD);
      sketch.text("Cathode (Filament)", 20, 50);
      sketch.textAlign(sketch.RIGHT);
      sketch.text("Target Anode (W)", maxDrawW - 20, 50);
      sketch.textStyle(sketch.NORMAL);

      // Accelerate electrons
      sketch.waveTimer++;
      if (sketch.waveTimer % 7 === 0) {
        sketch.electrons.push({ x: 40, y: 100 + sketch.random(-5, 5), vx: 1 });
      }

      sketch.fill("#2563eb"); // deep blue electron stream
      sketch.noStroke();
      for (let i = sketch.electrons.length - 1; i >= 0; i--) {
        let e = sketch.electrons[i];
        e.vx += speedVal * 0.085;
        e.x += e.vx;
        sketch.circle(e.x, e.y, 4);

        // Strike Anode
        if (e.x >= maxDrawW - 40) {
          sketch.electrons.splice(i, 1);
          // Emit golden X-ray photons downwards
          sketch.xrayPhotons.push({
            x: maxDrawW - 45,
            y: e.y,
            vx: sketch.random(-2, 0.5),
            vy: sketch.random(2, 4.5),
            waveAmp: sketch.random(5, 11),
          });
        }
      }

      // Render Emitted X-ray photons (deep orange-yellow for contrast)
      sketch.stroke("#ea580c");
      sketch.strokeWeight(1.5);
      sketch.noFill();
      for (let i = sketch.xrayPhotons.length - 1; i >= 0; i--) {
        let xp = sketch.xrayPhotons[i];
        xp.x += xp.vx;
        xp.y += xp.vy;

        sketch.beginShape();
        for (let j = 0; j < 25; j += 2) {
          let wx = xp.x + j * xp.vx * 0.08;
          let wy =
            xp.y +
            j * xp.vy * 0.08 +
            sketch.sin(j * 0.8 + sketch.frameCount * 0.55) * xp.waveAmp * 0.5;
          sketch.vertex(wx, wy);
        }
        sketch.endShape();

        if (xp.y > 180 || xp.x < 0) {
          sketch.xrayPhotons.splice(i, 1);
        }
      }

      // High voltage supply wiring
      sketch.stroke("#94a3b8");
      sketch.strokeWeight(1.5);
      sketch.line(25, 170, 25, 190);
      sketch.line(maxDrawW - 25, 170, maxDrawW - 25, 190);

      sketch.fill("#f8fafc");
      sketch.stroke(primaryColor);
      sketch.rect(maxDrawW * 0.5 - 45, 180, 90, 20, 4);
      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.CENTER);
      sketch.textStyle(sketch.BOLD);
      sketch.text(`Supply: ${volt} kV`, maxDrawW * 0.5, 193);
      sketch.textStyle(sketch.NORMAL);

      // 2. Continuous and Characteristic Spectrum graph (right edge)
      let graphX = sketch.width - 150;
      let graphY = 30;
      let gw = 135;
      let gh = 120;

      sketch.push();
      sketch.translate(graphX, graphY);

      // Axes
      sketch.stroke("#94a3b8");
      sketch.strokeWeight(1.5);
      sketch.line(0, gh, gw, gh); // λ axis
      sketch.line(0, 10, 0, gh); // I axis

      sketch.noStroke();
      sketch.fill(mutedTextColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.LEFT);
      sketch.text("Wavelength λ", gw - 52, gh + 10);
      sketch.text("Intensity I", 5, 8);

      // Minimum Wavelength limit line (Bremsstrahlung boundary)
      let limitX = sketch.map(lambdaMin, 0.015, 0.15, 6, gw - 12);
      sketch.stroke("#ef4444");
      sketch.strokeWeight(1.2);
      sketch.drawingContext.setLineDash([3, 3]);
      sketch.line(limitX, 10, limitX, gh);
      sketch.drawingContext.setLineDash([]);
      sketch.noStroke();
      sketch.fill("#ef4444");
      sketch.textSize(7);
      sketch.textStyle(sketch.BOLD);
      sketch.text("λ_min", limitX - 10, gh - 4);
      sketch.textStyle(sketch.NORMAL);

      // Plot continuous + characteristic spikes curve
      sketch.noFill();
      sketch.stroke("#ea580c"); // deep orange line for contrast on white
      sketch.strokeWeight(2);
      sketch.beginShape();

      for (let x = 0; x <= gw; x++) {
        let xLambda = sketch.map(x, 6, gw - 12, 0.015, 0.15);
        let intens = 0;

        if (xLambda > lambdaMin) {
          // Bremsstrahlung Continuous Spectrum
          intens =
            140000 *
            volt *
            (xLambda - lambdaMin) *
            sketch.exp(-48 * (xLambda - lambdaMin));

          // Tungsten characteristic spikes (K-alpha & K-beta) when volt > 12kV
          if (volt > 12) {
            let dBeta = sketch.abs(xLambda - 0.063);
            if (dBeta < 0.003) {
              intens += (28 - dBeta * 8000) * (volt / 42);
            }
            let dAlpha = sketch.abs(xLambda - 0.071);
            if (dAlpha < 0.003) {
              intens += (48 - dAlpha * 12000) * (volt / 42);
            }
          }
        }
        let yPos = sketch.map(intens, 0, 75, gh, 15);
        sketch.vertex(x, sketch.constrain(yPos, 10, gh));
      }
      sketch.endShape();
      sketch.pop();

      // 3. Bottom HUD Parameters Panel
      sketch.fill("#f8fafcdd");
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1.5);
      sketch.rect(10, sketch.height - 95, sketch.width - 20, 85, 12);

      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textAlign(sketch.LEFT);
      sketch.textSize(11);
      sketch.textStyle(sketch.BOLD);
      sketch.text(
        `Cut-off λ_min = ${lambdaMin.toFixed(4)} nm`,
        25,
        sketch.height - 70,
      );
      sketch.textStyle(sketch.NORMAL);
      sketch.fill(mutedTextColor);
      sketch.text(
        `Max Energy E_max = ${volt.toFixed(1)} keV`,
        25,
        sketch.height - 50,
      );

      let col2X = sketch.width * 0.5 + 10;
      if (sketch.width < 450) col2X = sketch.width * 0.5 - 5;
      sketch.fill(accentColor);
      sketch.text(`Target Metal: Tungsten (W)`, col2X, sketch.height - 70);
      sketch.text(`Spikes: K-α, K-β`, col2X, sketch.height - 50);

      sketch.fill(textColor);
      sketch.textSize(9);
      sketch.text(
        "Accelerating electrons convert kinetic energy into X-ray photons upon impact. Higher voltage shifts λ_min to the left.",
        25,
        sketch.height - 38,
        sketch.width - 50,
        26,
      );
    }
  },
};
