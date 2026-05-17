export const p2_ch9_sims = {
  setup: (sketch, vizType) => {
    sketch.textFont("Inter, system-ui, sans-serif");

    if (vizType === "bohr_atom") {
      sketch.currentN = 2; // Start in ground or n=2
      sketch.n_level = 2; // Target orbit
      sketch.electronAngle = 0;
      sketch.isTransitioning = false;
      sketch.transitionProgress = 0;
      sketch.transitionSourceN = 2;
      sketch.photons = [];
      sketch.electronTrail = []; // Keep past coordinates for trailing glow

      // Starfield background (soft cosmic sparks for light theme)
      sketch.stars = [];
      for (let i = 0; i < 25; i++) {
        sketch.stars.push({
          x: sketch.random(10, 320),
          y: sketch.random(10, 370),
          alpha: sketch.random(100, 220),
          speed: sketch.random(0.02, 0.05),
        });
      }

      sketch.triggerJump = () => {
        let target = sketch.n_level || 2;
        if (target === sketch.currentN || sketch.isTransitioning) return;

        sketch.isTransitioning = true;
        sketch.transitionProgress = 0;
        sketch.transitionSourceN = sketch.currentN;

        let rBase = 26;
        let rMax = (sketch.width - 170) / 2 - 12;
        if (sketch.width < 450) rMax = (sketch.width - 130) / 2 - 12;
        let rScale = (rMax - rBase) / 24;

        let srcR = rBase + rScale * (sketch.currentN * sketch.currentN - 1);
        let targetR = rBase + rScale * (target * target - 1);

        // Create photon
        if (target < sketch.currentN) {
          // Emission: photon flies out
          sketch.photons.push({
            x: 0,
            y: 0,
            angle: sketch.electronAngle,
            emitted: true,
            n1: target,
            n2: sketch.currentN,
            waveAmp: sketch.random(6, 12),
          });
        } else {
          // Absorption: photon flies in
          sketch.photons.push({
            x: -220,
            y: 0,
            angle: sketch.electronAngle,
            emitted: false,
            n1: sketch.currentN,
            n2: target,
            waveAmp: sketch.random(6, 12),
          });
        }
      };
    }

    if (vizType === "radioactive_decay") {
      sketch.halfLife = 3.0; // s
      sketch.decayConstant = 0.693 / 3.0;
      sketch.isPlaying = true;
      sketch.elapsedTime = 0;
      sketch.history = []; // live N(t) points

      // 10x10 Grid of nuclei
      sketch.nuclei = [];
      for (let i = 0; i < 100; i++) {
        sketch.nuclei.push({
          gridX: i % 10,
          gridY: sketch.floor(i / 10),
          active: true,
          burstTimer: 0,
        });
      }

      sketch.reset = () => {
        sketch.elapsedTime = 0;
        sketch.history = [];
        for (let n of sketch.nuclei) {
          n.active = true;
          n.burstTimer = 0;
        }
        sketch.isPlaying = true;
      };
    }
  },

  draw: (sketch, vizType) => {
    sketch.background("#ffffff"); // Light background

    const textColor = "#0f172a"; // Dark slate text
    const mutedTextColor = "#64748b"; // Clean gray text
    const accentColor = "#0891b2"; // Rich Cyan

    // Helper: spectral color for Hydrogen transition
    const getTransitionColor = (n1, n2) => {
      let lower = sketch.min(n1, n2);
      let upper = sketch.max(n1, n2);

      if (lower === 1) {
        // Lyman Series - UV (Deep Purple/Pink)
        return sketch.color(168, 85, 247);
      } else if (lower === 2) {
        // Balmer Series - Visible Spectrum
        if (upper === 3) return sketch.color(220, 38, 38); // H-alpha (Red, 656.3nm)
        if (upper === 4) return sketch.color(13, 148, 136); // H-beta (Teal/Cyan, 486.1nm)
        if (upper === 5) return sketch.color(37, 99, 235); // H-gamma (Blue, 434.0nm)
        return sketch.color(124, 58, 237); // H-delta (Violet, 410.2nm)
      } else {
        // Paschen Series - IR (Crimson/Dark Red)
        return sketch.color(153, 27, 27);
      }
    };

    if (vizType === "bohr_atom") {
      // 1. Draw Space Background sparks in light theme
      sketch.noStroke();
      for (let s of sketch.stars) {
        s.alpha += sketch.sin(sketch.frameCount * s.speed) * 8;
        s.alpha = sketch.constrain(s.alpha, 50, 220);
        sketch.fill(148, 163, 184, s.alpha); // Slate-grey cosmic particles
        sketch.circle(s.x, s.y, 1.5);
      }

      // Draw subtle orbital grid patterns
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1);
      sketch.line(0, sketch.height / 2, sketch.width, sketch.height / 2);
      sketch.line(
        (sketch.width - 150) / 2,
        0,
        (sketch.width - 150) / 2,
        sketch.height,
      );

      // 2. Responsive Geometry Setup
      let maxDrawW = sketch.width - 160;
      if (sketch.width < 450) {
        maxDrawW = sketch.width - 120;
      }
      let cx = maxDrawW / 2 + 10;
      let cy = sketch.height / 2;

      let rBase = 26;
      let rMax = maxDrawW / 2 - 12;
      if (rMax > cy - 25) rMax = cy - 25;
      let rScale = (rMax - rBase) / 24;

      // Current orbit level
      let showN = sketch.isTransitioning
        ? sketch.lerp(
            sketch.transitionSourceN,
            sketch.currentN,
            sketch.transitionProgress,
          )
        : sketch.currentN;

      let radiusA = 0.529 * showN * showN;
      let energyEv = -13.6 / (showN * showN);
      let angularMomentum = showN * 1.054;

      // 3. Draw Orbit Rings
      for (let n = 1; n <= 5; n++) {
        let r = rBase + rScale * (n * n - 1);
        sketch.noFill();
        if (sketch.n_level === n) {
          sketch.stroke("#ea580c"); // glowing amber/gold for active target
          sketch.strokeWeight(1.8);
          sketch.stroke("#ea580c33");
          sketch.circle(cx, cy, r * 2 + 3);
          sketch.circle(cx, cy, r * 2 - 3);
          sketch.stroke("#ea580c");
          sketch.strokeWeight(1.8);
        } else {
          sketch.stroke("#cbd5e1"); // soft gray for inactive
          sketch.strokeWeight(1);
        }
        sketch.circle(cx, cy, r * 2);

        // Orbit Labels
        sketch.noStroke();
        sketch.fill(mutedTextColor);
        sketch.textSize(9);
        sketch.textAlign(sketch.LEFT);
        sketch.textStyle(sketch.BOLD);
        sketch.text(`n=${n}`, cx + r + 3, cy - 3);
        sketch.textStyle(sketch.NORMAL);
      }

      // 4. Draw Nucleus (Overlapping 3D Glowing Protons & Neutrons Cluster)
      sketch.push();
      sketch.translate(cx, cy);
      sketch.drawingContext.shadowBlur = 10;
      sketch.drawingContext.shadowColor = "#ef444455";
      sketch.noStroke();

      let cluster = [
        { dx: -3, dy: -3, col: "#ef4444" }, // proton (red)
        { dx: 3, dy: -2, col: "#ea580c" }, // neutron (orange)
        { dx: -1, dy: 4, col: "#ef4444" },
        { dx: 2, dy: 3, col: "#ea580c" },
        { dx: 0, dy: 0, col: "#ef4444" },
      ];

      for (let p of cluster) {
        sketch.fill(p.col);
        sketch.circle(p.dx, p.dy, 8);
        sketch.fill(255, 255, 255, 140);
        sketch.circle(p.dx - 2, p.dy - 2, 2.5);
      }
      sketch.drawingContext.shadowBlur = 0;
      sketch.pop();

      // 5. Orbit Speed Calculations and Transitions
      let orbitalSpeed = 0.09 / (showN * showN);
      if (!sketch.isTransitioning) {
        sketch.electronAngle += orbitalSpeed;
      } else {
        sketch.transitionProgress += 0.015;
        sketch.electronAngle += orbitalSpeed;

        if (sketch.transitionProgress >= 1) {
          sketch.isTransitioning = false;
          sketch.currentN = sketch.n_level;
        }
      }

      // 6. Electron Render with glowing particle trail (deep blue in light theme)
      let currentR = rBase + rScale * (showN * showN - 1);
      let ex = cx + currentR * sketch.cos(sketch.electronAngle);
      let ey = cy + currentR * sketch.sin(sketch.electronAngle);

      sketch.electronTrail.push({ x: ex, y: ey });
      if (sketch.electronTrail.length > 12) {
        sketch.electronTrail.shift();
      }

      // Render electron trail
      for (let i = 0; i < sketch.electronTrail.length; i++) {
        let pt = sketch.electronTrail[i];
        let alpha = sketch.map(i, 0, sketch.electronTrail.length, 10, 150);
        let size = sketch.map(i, 0, sketch.electronTrail.length, 3, 8);
        sketch.fill(37, 99, 235, alpha); // Legible blue trail
        sketch.noStroke();
        sketch.circle(pt.x, pt.y, size);
      }

      // Electron core
      sketch.drawingContext.shadowBlur = 8;
      sketch.drawingContext.shadowColor = "#3b82f6";
      sketch.fill("#2563eb");
      sketch.circle(ex, ey, 9);
      sketch.fill("#ffffff");
      sketch.circle(ex, ey, 3);
      sketch.drawingContext.shadowBlur = 0;

      // 7. Draw emitted or absorbed Photons
      for (let i = sketch.photons.length - 1; i >= 0; i--) {
        let ph = sketch.photons[i];
        let pColor = getTransitionColor(ph.n1, ph.n2);

        sketch.stroke(pColor);
        sketch.strokeWeight(1.8);
        sketch.noFill();

        if (ph.emitted) {
          let startR = rBase + rScale * (ph.n2 * ph.n2 - 1);
          let dist = startR + ph.x;

          sketch.beginShape();
          for (let s = 0; s < 30; s++) {
            let sDist = dist + s * 1.8;
            let sAngle =
              ph.angle +
              sketch.sin(s * 0.7 - sketch.frameCount * 0.4) *
                (ph.waveAmp / sDist);
            let wx = cx + sDist * sketch.cos(sAngle);
            let wy = cy + sDist * sketch.sin(sAngle);
            sketch.vertex(wx, wy);
          }
          sketch.endShape();

          ph.x += 3.5;
          if (ph.x > 320) sketch.photons.splice(i, 1);
        } else {
          let targetR = rBase + rScale * (ph.n2 * ph.n2 - 1);
          let dist = targetR - ph.x;

          sketch.beginShape();
          for (let s = 0; s < 30; s++) {
            let sDist = dist + s * 1.8;
            let sAngle =
              ph.angle +
              sketch.sin(s * 0.7 - sketch.frameCount * 0.4) *
                (ph.waveAmp / sDist);
            let wx = cx + sDist * sketch.cos(sAngle);
            let wy = cy + sDist * sketch.sin(sAngle);
            sketch.vertex(wx, wy);
          }
          sketch.endShape();

          ph.x -= 3.5;
          if (ph.x <= 0) sketch.photons.splice(i, 1);
        }
      }

      // 8. Frosted glassmorphic HUD Panel (light theme)
      let hudX = sketch.width - 145;
      let hudY = 15;
      let hudW = 130;
      let hudH = 180;

      sketch.fill("#f8fafcdd");
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1.5);
      sketch.rect(hudX, hudY, hudW, hudH, 12);

      sketch.noStroke();
      sketch.textAlign(sketch.CENTER);
      sketch.fill(textColor);
      sketch.textSize(11);
      sketch.textStyle(sketch.BOLD);
      sketch.text("Atom State HUD", hudX + hudW / 2, hudY + 20);
      sketch.textStyle(sketch.NORMAL);

      sketch.textSize(9);
      sketch.fill(mutedTextColor);
      sketch.text("Orbit Radius (r_n)", hudX + hudW / 2, hudY + 42);
      sketch.fill(accentColor);
      sketch.textSize(12);
      sketch.textStyle(sketch.BOLD);
      sketch.text(`${radiusA.toFixed(3)} Å`, hudX + hudW / 2, hudY + 55);

      sketch.textSize(9);
      sketch.fill(mutedTextColor);
      sketch.textStyle(sketch.NORMAL);
      sketch.text("Energy Level (E_n)", hudX + hudW / 2, hudY + 77);
      sketch.fill("#ef4444");
      sketch.textSize(12);
      sketch.textStyle(sketch.BOLD);
      sketch.text(`${energyEv.toFixed(2)} eV`, hudX + hudW / 2, hudY + 90);

      sketch.textSize(9);
      sketch.fill(mutedTextColor);
      sketch.textStyle(sketch.NORMAL);
      sketch.text("Angular Momentum", hudX + hudW / 2, hudY + 112);
      sketch.fill("#ea580c");
      sketch.textSize(11);
      sketch.textStyle(sketch.BOLD);
      sketch.text(
        `${angularMomentum.toFixed(3)} ℏ`,
        hudX + hudW / 2,
        hudY + 125,
      );
      sketch.textStyle(sketch.NORMAL);

      // Shell indicator
      sketch.fill("#2563eb");
      sketch.textSize(10);
      sketch.text(
        `Shell: n = ${showN.toFixed(2)}`,
        hudX + hudW / 2,
        hudY + 152,
      );
      if (sketch.isTransitioning) {
        sketch.fill("#ea580c");
        sketch.textSize(8);
        sketch.text("Leap in progress...", hudX + hudW / 2, hudY + 167);
      } else {
        sketch.fill(mutedTextColor);
        sketch.textSize(8);
        sketch.text("Stable State", hudX + hudW / 2, hudY + 167);
      }

      // Bottom instructions
      sketch.textAlign(sketch.LEFT);
      sketch.textSize(10);
      sketch.fill(textColor);
      sketch.text(
        " Adjust target orbit, click Perform Transition to animate leaps.",
        15,
        sketch.height - 18,
      );
    }

    if (vizType === "radioactive_decay") {
      let halflifeVal = sketch.halfLife || 3.0;
      let lambda = 0.693 / halflifeVal;
      let dt = 1 / 60;

      // Dynamic Grid Geometry
      let maxGridW = sketch.width - 180;
      if (sketch.width < 450) maxGridW = sketch.width - 140;

      let gridSpacing = sketch.constrain(maxGridW / 11, 12, 18);
      let gridStartX = 20;
      let gridStartY = 35;

      // 1. Grid Rendering
      let activeCount = 0;
      for (let n of sketch.nuclei) {
        let nx = gridStartX + n.gridX * gridSpacing;
        let ny = gridStartY + n.gridY * gridSpacing;

        if (n.active) {
          activeCount++;
          if (sketch.isPlaying) {
            if (sketch.random(0, 1) < lambda * dt) {
              n.active = false;
              n.burstTimer = 15;
            }
          }

          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.circle(nx, ny, 8);
        } else {
          // Decayed inactive state (soft slate dot in light theme)
          sketch.fill("#e2e8f0");
          sketch.stroke("#cbd5e1");
          sketch.strokeWeight(1);
          sketch.circle(nx, ny, 6);

          // Energy release burst ring
          if (n.burstTimer > 0) {
            sketch.noFill();
            sketch.stroke(
              sketch.color(
                234,
                88,
                12,
                sketch.map(n.burstTimer, 0, 15, 0, 255),
              ),
            );
            sketch.strokeWeight(1.5);
            sketch.circle(nx, ny, (16 - n.burstTimer) * 1.8);
            n.burstTimer--;
          }
        }
      }

      if (sketch.isPlaying) {
        sketch.elapsedTime += dt;
        if (sketch.frameCount % 5 === 0) {
          sketch.history.push({ t: sketch.elapsedTime, n: activeCount });
        }
      }

      // 2. Draw live Decay graph
      let graphX = sketch.width - 150;
      let graphY = 30;
      let gw = 135;
      let gh = 135;

      sketch.push();
      sketch.translate(graphX, graphY);

      // Axes
      sketch.stroke("#94a3b8");
      sketch.strokeWeight(1.5);
      sketch.line(0, gh, gw, gh); // t-axis
      sketch.line(0, 0, 0, gh); // N-axis

      sketch.noStroke();
      sketch.fill(mutedTextColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.LEFT);
      sketch.text("Time t (s)", gw - 42, gh + 10);
      sketch.text("Active N", 5, 8);

      // Plot Theoretical Curve (dashed red)
      sketch.noFill();
      sketch.stroke("#ef444499");
      sketch.strokeWeight(1);
      sketch.drawingContext.setLineDash([3, 3]);
      sketch.beginShape();
      for (let x = 0; x <= gw; x++) {
        let graphT = sketch.map(x, 0, gw, 0, 15);
        let nTheo = 100 * sketch.exp(-lambda * graphT);
        let yPos = sketch.map(nTheo, 0, 100, gh, 15);
        sketch.vertex(x, yPos);
      }
      sketch.endShape();
      sketch.drawingContext.setLineDash([]);

      // Plot Live History Curve with area shading
      if (sketch.history.length > 0) {
        sketch.fill("#0ea5e91a"); // soft cyan-blue shading
        sketch.noStroke();
        sketch.beginShape();
        sketch.vertex(0, gh);
        for (let pt of sketch.history) {
          let x = sketch.map(pt.t, 0, 15, 0, gw);
          let y = sketch.map(pt.n, 0, 100, gh, 15);
          if (x <= gw) sketch.vertex(x, y);
        }
        let lastPt = sketch.history[sketch.history.length - 1];
        let lastX = sketch.map(lastPt.t, 0, 15, 0, gw);
        sketch.vertex(sketch.min(lastX, gw), gh);
        sketch.endShape(sketch.CLOSE);

        // Core line
        sketch.noFill();
        sketch.stroke(accentColor);
        sketch.strokeWeight(2.2);
        sketch.beginShape();
        for (let pt of sketch.history) {
          let x = sketch.map(pt.t, 0, 15, 0, gw);
          let y = sketch.map(pt.n, 0, 100, gh, 15);
          if (x <= gw) sketch.vertex(x, y);
        }
        sketch.endShape();
      }

      // Live operating point tracker
      let curX = sketch.map(sketch.elapsedTime, 0, 15, 0, gw);
      let curY = sketch.map(activeCount, 0, 100, gh, 15);
      if (curX <= gw) {
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.circle(curX, curY, 6);
      }

      sketch.pop();

      if (activeCount === 0 || sketch.elapsedTime > 15) {
        sketch.isPlaying = false;
      }

      // 3. Compact Glass UI HUD at bottom (light theme)
      sketch.fill("#f8fafcdd");
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1.5);
      sketch.rect(10, sketch.height - 95, sketch.width - 20, 85, 12);

      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textSize(11);
      sketch.textAlign(sketch.LEFT);
      sketch.textStyle(sketch.BOLD);
      sketch.text(
        `Half-Life T₁/₂ = ${halflifeVal.toFixed(1)} s`,
        25,
        sketch.height - 72,
      );
      sketch.textStyle(sketch.NORMAL);
      sketch.fill(mutedTextColor);
      sketch.text(
        `Decay Const λ = ${lambda.toFixed(3)} s⁻¹`,
        25,
        sketch.height - 54,
      );
      sketch.text(
        `Activity A = λN = ${(lambda * activeCount).toFixed(2)} Bq`,
        25,
        sketch.height - 36,
      );

      // Counters on right panel
      let textColX = sketch.width - 150;
      if (sketch.width < 450) textColX = sketch.width - 120;
      sketch.textAlign(sketch.LEFT);
      sketch.fill(accentColor);
      sketch.textStyle(sketch.BOLD);
      sketch.text(
        `Active N(t): ${activeCount} / 100`,
        textColX - 25,
        sketch.height - 72,
      );
      sketch.fill("#ef4444");
      sketch.text(
        `Decayed: ${100 - activeCount}`,
        textColX - 25,
        sketch.height - 54,
      );
      sketch.fill(textColor);
      sketch.text(
        `Time t: ${sketch.elapsedTime.toFixed(1)} s`,
        textColX - 25,
        sketch.height - 36,
      );
      sketch.textStyle(sketch.NORMAL);
    }
  },
};
