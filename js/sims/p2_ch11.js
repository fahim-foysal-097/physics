export const p2_ch11_sims = {
  setup: (sketch, vizType) => {
    const defaults = {
      hubbles_law: {
        H0: 70, // km/s/Mpc
        galaxies: [],
        scale: 1.0,
        t: 0,
      },
      black_hole_gravity: {
        M: 4.0, // Black hole mass
        c: 12.0, // Speed of light (scaled down)
        starX: 0,
        starY: 0,
        starVX: 0,
        starVY: 0,
        starTrail: [],
        isCaptured: false,
        captureTimer: 0,
      },
    };

    Object.assign(sketch, defaults[vizType] || {});

    // Chapter-specific initialization
    if (vizType === "hubbles_law") {
      // Generate a set of galaxies scattered around the center
      const tempGalaxies = [];
      const count = 18;
      // Define a stable set of random polar offsets from the home galaxy
      for (let i = 0; i < count; i++) {
        const angle = (i * sketch.TWO_PI) / 8 + sketch.random(-0.15, 0.15) + (i * 0.1);
        const baseR = sketch.random(25, 90);
        tempGalaxies.push({
          angle: angle,
          baseR: baseR,
          color: [sketch.random(100, 255), sketch.random(100, 255), 255],
          size: sketch.random(6, 12),
        });
      }
      sketch.galaxies = tempGalaxies;
    } else if (vizType === "black_hole_gravity") {
      sketch.resetStar = () => {
        const leftCenterX = sketch.width * 0.28;
        const centerY = sketch.height / 2 + 10;
        
        // Initial state of the orbiting star
        sketch.starX = leftCenterX;
        sketch.starY = centerY - 75; // Start above the black hole
        sketch.starVX = 2.4; // Tangential velocity
        sketch.starVY = 0;
        sketch.starTrail = [];
        sketch.isCaptured = false;
        sketch.captureTimer = 0;
      };
      sketch.resetStar();
    }

    sketch.reset = () => {
      Object.assign(sketch, defaults[vizType] || {});
      if (vizType === "hubbles_law") {
        // regenerate
        const tempGalaxies = [];
        for (let i = 0; i < 18; i++) {
          const angle = (i * sketch.TWO_PI) / 8 + sketch.random(-0.15, 0.15) + (i * 0.1);
          const baseR = sketch.random(25, 90);
          tempGalaxies.push({
            angle: angle,
            baseR: baseR,
            color: [sketch.random(100, 255), sketch.random(100, 255), 255],
            size: sketch.random(6, 12),
          });
        }
        sketch.galaxies = tempGalaxies;
      } else if (vizType === "black_hole_gravity") {
        sketch.resetStar();
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
      case "hubbles_law": {
        const H0 = sketch.H0 ?? 70;

        // Animate scale (expansion factor)
        sketch.t += 0.005;
        // loop scale from 1.0 to 1.7
        sketch.scale = 1.0 + (sketch.t % 0.7);

        const leftCenterX = w * 0.28;
        const centerY = h / 2 + 10;
        const scaleVal = sketch.scale;

        drawTitle("Cosmic Expansion: Hubble's Law v = H₀ d");
        drawHUDPill(w - 185, 12, "SCALE FACTOR", `${scaleVal.toFixed(2)}x`, 160);

        // Draw separation boundary line
        sketch.stroke(226, 232, 240);
        sketch.strokeWeight(1.5);
        sketch.line(w * 0.50, 60, w * 0.50, h - 25);

        // --- Left Half: Expandable Grid ---
        sketch.push();
        
        // Draw concentric expansion guidelines
        sketch.stroke(203, 213, 225, 60);
        sketch.strokeWeight(1);
        sketch.noFill();
        sketch.circle(leftCenterX, centerY, 80 * scaleVal);
        sketch.circle(leftCenterX, centerY, 150 * scaleVal);

        // 1. Draw individual galaxies expanding radially
        sketch.galaxies.forEach((g) => {
          const currentR = g.baseR * scaleVal;
          const gx = leftCenterX + currentR * Math.cos(g.angle);
          const gy = centerY + currentR * Math.sin(g.angle);

          // Recession velocity is proportional to distance and H0: v = H0 * d
          // Let's model d in Mpc (scaled) and v in km/s (scaled)
          const d_mpc = currentR / 50; // Proper distance
          const v_kms = H0 * d_mpc;

          // Draw velocity vector arrow pointing outwards
          const arrowLen = v_kms * 0.2;
          const arrowX = gx + arrowLen * Math.cos(g.angle);
          const arrowY = gy + arrowLen * Math.sin(g.angle);

          sketch.stroke(16, 185, 129, 180); // Green velocity vector
          sketch.strokeWeight(1.5);
          sketch.line(gx, gy, arrowX, arrowY);
          
          sketch.push();
          sketch.translate(arrowX, arrowY);
          sketch.rotate(g.angle);
          sketch.fill(16, 185, 129, 180);
          sketch.noStroke();
          sketch.triangle(0, 2.5, 0, -2.5, 4, 0);
          sketch.pop();

          // Draw Galaxy (spiral-like ellipse or star cluster)
          sketch.fill(g.color[0], g.color[1], g.color[2]);
          sketch.noStroke();
          sketch.ellipse(gx, gy, g.size, g.size * 0.6);
          sketch.fill(255, 255, 255, 200);
          sketch.circle(gx, gy, g.size * 0.35); // bright nucleus
        });

        // 2. Draw Home Galaxy Milky Way in center
        sketch.stroke(251, 191, 36);
        sketch.strokeWeight(1.5);
        sketch.fill(245, 158, 11);
        sketch.circle(leftCenterX, centerY, 16);
        sketch.fill(255);
        sketch.noStroke();
        sketch.circle(leftCenterX, centerY, 6);

        sketch.fill(245, 158, 11);
        sketch.textSize(8);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("Milky Way (Home)", leftCenterX, centerY + 12);
        
        sketch.pop();

        // --- Right Half: v vs d Cartesian Plot ---
        const rightStartX = w * 0.52 + 25;
        const graphW = w - rightStartX - 25;
        const gx = rightStartX + 35;
        const gy = 75;
        const gw = graphW - 40;
        const gh = h - gy - 60;

        // Draw axes
        sketch.push();
        sketch.stroke(148, 163, 184);
        sketch.strokeWeight(1.5);
        sketch.line(gx, gy + gh, gx, gy); // Y axis (Velocity)
        sketch.line(gx, gy + gh, gx + gw, gy + gh); // X axis (Distance)

        sketch.noStroke();
        sketch.fill(100, 116, 139);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("Distance d (Mpc)", gx + gw / 2, gy + gh + 6);
        
        sketch.textAlign(sketch.RIGHT, sketch.CENTER);
        sketch.text("v (km/s)", gx - 8, gy + gh / 2);
        sketch.pop();

        // Plot Hubble's linear law relation line: v = H0 * d
        sketch.push();
        sketch.stroke(14, 165, 233, 130);
        sketch.strokeWeight(2);
        const maxD = (150 * 1.7) / 50; // max distance on graph
        const maxV = H0 * maxD;
        
        const lineEndX = sketch.map(maxD, 0, 4, gx, gx + gw);
        const lineEndY = sketch.map(maxV, 0, 350, gy + gh, gy);
        
        sketch.line(gx, gy + gh, lineEndX, lineEndY);
        sketch.pop();

        // Plot dots for each galaxy on the Cartesian graph dynamically
        sketch.push();
        sketch.galaxies.forEach((g) => {
          const currentR = g.baseR * scaleVal;
          const d_mpc = currentR / 50;
          const v_kms = H0 * d_mpc;

          const dotX = sketch.map(d_mpc, 0, 4, gx, gx + gw);
          const dotY = sketch.map(v_kms, 0, 350, gy + gh, gy);

          if (dotX >= gx && dotX <= gx + gw && dotY >= gy && dotY <= gy + gh) {
            sketch.fill(g.color[0], g.color[1], g.color[2]);
            sketch.noStroke();
            sketch.circle(dotX, dotY, 6);
          }
        });
        
        // Display H0 slope text on right side
        sketch.fill(14, 165, 233);
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        sketch.text(`Slope = H₀ = ${H0} km/s/Mpc`, gx + 15, gy + 15);
        sketch.pop();

        break;
      }

      case "black_hole_gravity": {
        const M = sketch.M ?? 4.0;
        const c = sketch.c ?? 12.0;

        const leftCenterX = w * 0.28;
        const centerY = h / 2 + 10;
        const leftBoxW = w * 0.50 - 40;

        // Schwarzschild Radius: Rs = 2GM/c^2
        // G = 15.0 for scale
        const G = 15.0;
        const Rs_val = (2 * G * M) / (c * c);
        const Rs_px = Rs_val * 16; // scaled for pixels

        drawTitle("Orbit Trajectory near Schwarzschild Radius Rs");
        drawHUDPill(w - 185, 12, "EVENT HORIZON (Rs)", `${Rs_val.toFixed(2)} m`, 160);

        // Separation line
        sketch.stroke(226, 232, 240);
        sketch.strokeWeight(1.5);
        sketch.line(w * 0.50, 60, w * 0.50, h - 25);

        // --- Left Half: Orbit Simulation ---
        sketch.push();
        sketch.rectMode(sketch.CENTER);
        sketch.stroke(148, 163, 184, 100);
        sketch.strokeWeight(2);
        sketch.fill(15, 23, 42, 250); // Dark space background for black hole
        sketch.rect(leftCenterX, centerY, leftBoxW, h - 90, 8);
        sketch.pop();

        // Gravitational physics update
        if (!sketch.isCaptured) {
          const dx = sketch.starX - leftCenterX;
          const dy = sketch.starY - centerY;
          const r_dist = sketch.dist(sketch.starX, sketch.starY, leftCenterX, centerY);
          const r_val = r_dist / 16; // convert back to formula units

          if (r_dist < Rs_px) {
            // Crossed Event Horizon! Capture!
            sketch.isCaptured = true;
            sketch.captureTimer = 30; // 30 frames animation
          } else {
            // General Relativistic Gravity field acceleration (Newton + Schwarzschild Correction)
            // a = -GM / r^2 * (1 + 3L^2 / (r^2 c^2))
            // To simplify and ensure stability:
            const forceMag = (G * M) / (r_val * r_val);
            
            // Relativistic correction term (adds orbital precession!)
            // L is angular momentum. Let's model it as a subtle scaling
            const L2 = 18.0;
            const correction = 1.0 + (3 * L2) / (r_val * r_val * c * c);
            const totalAccel = forceMag * correction;

            // Acceleration vectors
            const ax = -totalAccel * (dx / r_dist) * 0.08;
            const ay = -totalAccel * (dy / r_dist) * 0.08;

            sketch.starVX += ax;
            sketch.starVY += ay;

            sketch.starX += sketch.starVX;
            sketch.starY += sketch.starVY;

            // Trail
            sketch.starTrail.push({ x: sketch.starX, y: sketch.starY });
            if (sketch.starTrail.length > 120) sketch.starTrail.shift();
          }
        } else {
          // Spiralling in capture animation
          sketch.captureTimer--;
          const dx = sketch.starX - leftCenterX;
          const dy = sketch.starY - centerY;
          
          sketch.starX -= dx * 0.15;
          sketch.starY -= dy * 0.15;

          if (sketch.captureTimer <= 0) {
            sketch.resetStar();
          }
        }

        // Draw accretion disk (glowing orange gaseous aura around Event Horizon)
        sketch.push();
        sketch.noStroke();
        // Pulsating outer disk
        const pulse = 10 + 5 * Math.sin(sketch.frameCount * 0.05);
        sketch.fill(249, 115, 22, 40); // vibrant orange
        sketch.circle(leftCenterX, centerY, Rs_px * 2.5 + pulse);
        
        sketch.fill(249, 115, 22, 110);
        sketch.circle(leftCenterX, centerY, Rs_px * 1.8);
        sketch.pop();

        // Draw Schwarzschild Event Horizon boundary (dashed circle)
        sketch.push();
        sketch.noFill();
        sketch.stroke(239, 68, 68, 180); // Red dashed
        sketch.strokeWeight(1.8);
        sketch.drawingContext.setLineDash([4, 4]);
        sketch.circle(leftCenterX, centerY, Rs_px * 2);
        sketch.drawingContext.setLineDash([]);
        sketch.pop();

        // Draw Black Hole singularity core (pure black)
        sketch.fill(0);
        sketch.stroke(0);
        sketch.circle(leftCenterX, centerY, Rs_px * 1.6);

        // Draw Star Orbit Trail
        sketch.push();
        sketch.noFill();
        sketch.stroke(14, 165, 233, 160); // Glowing cyan trail
        sketch.strokeWeight(1.8);
        sketch.beginShape();
        sketch.starTrail.forEach(pt => sketch.vertex(pt.x, pt.y));
        sketch.endShape();
        sketch.pop();

        // Draw Star
        if (!sketch.isCaptured || sketch.captureTimer > 0) {
          sketch.push();
          sketch.noStroke();
          sketch.fill(253, 224, 71, 70); // yellow glow
          sketch.circle(sketch.starX, sketch.starY, 14);
          sketch.fill(255, 255, 255);
          sketch.circle(sketch.starX, sketch.starY, 6);
          sketch.pop();
        }

        // Draw velocity vector arrow at star position
        if (!sketch.isCaptured) {
          sketch.push();
          const velScale = 10;
          const vx_px = sketch.starVX * velScale;
          const vy_px = sketch.starVY * velScale;
          
          sketch.stroke(16, 185, 129);
          sketch.strokeWeight(1.8);
          sketch.fill(16, 185, 129);
          sketch.line(sketch.starX, sketch.starY, sketch.starX + vx_px, sketch.starY + vy_px);
          
          // arrow head
          const ang = Math.atan2(vy_px, vx_px);
          sketch.translate(sketch.starX + vx_px, sketch.starY + vy_px);
          sketch.rotate(ang);
          sketch.triangle(0, 3, 0, -3, 6, 0);
          sketch.pop();
        }

        // Add Capture alert overlay if captured
        if (sketch.isCaptured) {
          sketch.push();
          sketch.fill(239, 68, 68);
          sketch.noStroke();
          sketch.textSize(12);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.CENTER, sketch.CENTER);
          sketch.text("GRAVITATIONAL COLLAPSE!", leftCenterX, centerY - Rs_px - 22);
          sketch.pop();
        }

        // --- Right Half: Info panel ---
        const rightStartX = w * 0.52 + 15;
        const rx = rightStartX + 20;
        const ry = 75;

        // Current distance and speed metrics
        const dx = sketch.starX - leftCenterX;
        const dy = sketch.starY - centerY;
        const r_dist = sketch.dist(sketch.starX, sketch.starY, leftCenterX, centerY);
        const r_val = r_dist / 16;
        const star_speed = sketch.dist(0, 0, sketch.starVX, sketch.starVY) * 1.5;

        sketch.push();
        sketch.noStroke();
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        
        sketch.fill(30, 41, 59);
        sketch.textSize(13);
        sketch.textStyle(sketch.BOLD);
        sketch.text("Relativistic Metrics", rx, ry);

        // Parameters table
        sketch.textSize(11);
        sketch.textStyle(sketch.NORMAL);
        sketch.fill(71, 85, 105);

        const textLines = [
          { label: "Black Hole Mass (M):", val: `${M.toFixed(1)} Solar Masses`, col: "#7c3aed" },
          { label: "Speed of Light (c):", val: `${c.toFixed(1)} * 10^7 m/s`, col: "#ef4444" },
          { label: "Schwarzschild Radius (Rs):", val: `${Rs_val.toFixed(2)} meters`, col: "#2563eb" },
          { label: "Current Orbit Radius (r):", val: `${r_val.toFixed(2)} meters`, col: "#0ea5e9" },
          { label: "Orbital Speed (v):", val: `${star_speed.toFixed(2)} * 10^4 m/s`, col: "#10b981" },
        ];

        let lineY = ry + 30;
        textLines.forEach((item) => {
          sketch.fill(100, 116, 139);
          sketch.text(item.label, rx, lineY);
          
          sketch.fill(item.col);
          sketch.textStyle(sketch.BOLD);
          sketch.text(item.val, rx + 185, lineY);
          sketch.textStyle(sketch.NORMAL);
          
          lineY += 24;
        });

        // Add some helper texts
        sketch.fill(100, 116, 139);
        sketch.textSize(10);
        sketch.textStyle(sketch.ITALIC);
        sketch.text("* Observe how increasing Mass (M) directly inflates\n  the Event Horizon radius Rs.", rx, lineY + 10);
        sketch.text("* Decreasing speed of light (c) also inflates Rs.", rx, lineY + 38);
        sketch.text("* Watch the orbit precess (shift axis) when very\n  close to Rs due to general relativity correction!", rx, lineY + 54);
        sketch.pop();

        break;
      }
    }
  },
};
