export const p1_ch7_sims = {
  setup: (sketch, vizType) => {
    sketch.angleMode(sketch.DEGREES);

    // Poisson parameters
    sketch.ratio = 0.35;

    // Young parameters (Fully automated Tensile Testing machine!)
    sketch.material = 0; // 0=Steel, 1=Copper, 2=Glass
    sketch.loadWeight = 0;
    sketch.wireY = 80;
    sketch.wireBroken = false;
    sketch.history = []; // [{x, y}]
    sketch.tensileRunning = false;

    sketch.startTensile = () => {
      sketch.loadWeight = 0;
      sketch.wireBroken = false;
      sketch.history = [];
      sketch.tensileRunning = true;
    };

    sketch.resetWire = () => {
      sketch.loadWeight = 0;
      sketch.wireBroken = false;
      sketch.history = [];
      sketch.tensileRunning = false;
    };

    // Capillary parameters
    sketch.radius = 1.0;
    sketch.tension = 0.072;
    sketch.theta = 0;

    // Stokes parameters
    sketch.viscosity = 0.8;
    sketch.density = 7800; // Steel
    sketch.sphereRadius = 3;
    sketch.sphereY = 60;
    sketch.sphereV = 0;
    sketch.sphereA = 0;
    sketch.stokesRunning = false;
    sketch.stokesHistory = [];

    sketch.dropSphere = () => {
      sketch.sphereY = 60;
      sketch.sphereV = 0;
      sketch.sphereA = 0;
      sketch.stokesRunning = true;
      sketch.stokesHistory = [];
    };

    sketch.resetStokes = () => {
      sketch.sphereY = 60;
      sketch.sphereV = 0;
      sketch.sphereA = 0;
      sketch.stokesRunning = false;
      sketch.stokesHistory = [];
    };
  },

  draw: (sketch, vizType) => {
    sketch.background("#f8fafc");
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "poissons_ratio": {
        let str = sketch.sin(sketch.frameCount * 2.0) * 20; // smooth oscillatory strain

        p1_ch7_sims.drawGrid(sketch);

        sketch.push();
        sketch.translate(sketch.width / 2, sketch.height / 2 - 10);

        let origW = 80;
        let origH = 160;
        let deltaH = str;
        let deltaW = -deltaH * sketch.ratio;

        // Draw upper and lower steel grips
        sketch.fill("#475569");
        sketch.stroke("#1e293b");
        sketch.strokeWeight(1.5);
        sketch.rect(-origW / 2 - 10, -origH / 2 - 15, origW + 20, 15, 2); // Top grip
        sketch.rect(-origW / 2 - 10, origH / 2 + deltaH, origW + 20, 15, 2); // Bottom grip

        // Determine color based on ratio
        let isNegative = sketch.ratio < 0;
        let fillColor = isNegative
          ? "rgba(245, 158, 11, 0.25)"
          : "rgba(16, 185, 129, 0.25)";
        let strokeColor = isNegative ? "#d97706" : "#059669";
        let gridColor = isNegative
          ? "rgba(217, 119, 6, 0.4)"
          : "rgba(5, 150, 105, 0.4)";
        let latArrowColor = isNegative ? "#10b981" : "#0ea5e9";

        // Draw active specimen
        sketch.fill(fillColor);
        sketch.stroke(strokeColor);
        sketch.strokeWeight(2.5);
        sketch.rect(
          -(origW + deltaW) / 2,
          -origH / 2,
          origW + deltaW,
          origH / 2 + (origH / 2 + deltaH),
          4,
        );

        // Draw dynamic interior lattice grid!
        sketch.stroke(gridColor);
        sketch.strokeWeight(1.0);
        let columns = 4;
        let rows = 6;
        let curW = origW + deltaW;
        let curH = origH + deltaH;

        // Vertical grid lines deforming
        for (let col = 1; col < columns; col++) {
          let gx = -curW / 2 + (curW / columns) * col;
          sketch.line(gx, -origH / 2, gx, origH / 2 + deltaH);
        }
        // Horizontal grid lines deforming
        for (let row = 1; row < rows; row++) {
          let gy = -origH / 2 + (curH / rows) * row;
          sketch.line(-curW / 2, gy, curW / 2, gy);
        }

        // Strain vector force arrows
        if (deltaH > 2) {
          p1_ch7_sims.drawArrow(
            sketch,
            0,
            origH / 2 + deltaH,
            0,
            origH / 2 + deltaH + 22,
            "#ef4444",
            2.5,
          ); // Tension

          if (Math.abs(deltaW) > 0.5) {
            let sign = isNegative ? 1 : -1;
            p1_ch7_sims.drawArrow(
              sketch,
              curW / 2,
              0,
              curW / 2 + 15 * sign,
              0,
              latArrowColor,
              2,
            ); // Lateral
            p1_ch7_sims.drawArrow(
              sketch,
              -curW / 2,
              0,
              -curW / 2 - 15 * sign,
              0,
              latArrowColor,
              2,
            );
          }
        }

        sketch.fill("#1e293b");
        sketch.noStroke();
        sketch.textSize(12);
        sketch.textStyle(sketch.BOLD);
        let matType =
          sketch.ratio < 0
            ? "Auxetic Material"
            : sketch.ratio > 0
              ? "Normal Material"
              : "Incompressible";
        if (sketch.ratio === 0) matType = "Zero Lateral Strain";
        sketch.textAlign(sketch.CENTER);
        sketch.text(
          `Ratio σ = ${sketch.ratio.toFixed(2)} (${matType})`,
          0,
          -origH / 2 - 30,
        );
        sketch.pop();

        p1_ch7_sims.drawPills(sketch, "Poisson's Ratio Dynamic Deformation", [
          `σ = - ε_lateral / ε_longitudinal`,
          `ε_long = ${((origH + deltaH - origH) / origH).toFixed(3)}`,
          `ε_lat: ${((origW + deltaW - origW) / origW).toFixed(3)}`,
        ]);
        break;
      }

      case "stress_strain_curve": {
        let mat = sketch.material !== undefined ? sketch.material : 0;

        let matName = "Steel";
        let Y_modulus = 200e9;
        let plasticThreshold = 100; // load in kg
        let fractureThreshold = 170; // snaps here

        if (mat === 1) {
          matName = "Copper";
          Y_modulus = 110e9;
          plasticThreshold = 65;
          fractureThreshold = 135;
        } else if (mat === 2) {
          matName = "Glass";
          Y_modulus = 70e9;
          plasticThreshold = 35;
          fractureThreshold = 40; // brittle snap
        }

        // Automated tensile tester updates!
        if (sketch.tensileRunning && !sketch.wireBroken) {
          sketch.loadWeight += 0.8;

          if (sketch.loadWeight >= fractureThreshold) {
            sketch.wireBroken = true;
            sketch.loadWeight = fractureThreshold;
            sketch.tensileRunning = false;
          }
        }

        let load = sketch.loadWeight;
        let sx = 65;
        let sy = 75;
        let origL = 110;

        // Mathematical helper for precise strain given a load and material index
        let getMaterialStrain = (m, l) => {
          let Y = m === 0 ? 200e9 : m === 1 ? 110e9 : 70e9;
          let plasticTh = m === 0 ? 100 : m === 1 ? 65 : 35;
          let A = Math.PI * 0.001 * 0.001; // 1mm radius wire
          let st = (l * 9.8) / A;
          let e_el = st / Y;
          if (m === 0 && l > plasticTh) {
            return e_el + Math.pow((l - plasticTh) / 70, 2) * 0.01;
          } else if (m === 1 && l > plasticTh) {
            return e_el + Math.pow((l - plasticTh) / 70, 1.5) * 0.011;
          }
          return e_el;
        };

        // Physics strain stress calculation
        let stress = (load * 9.8) / (Math.PI * 0.001 * 0.001); // Pa
        let strain = getMaterialStrain(mat, load);

        // Visual stretch of wire (scaled linearly to look excellent on screen)
        let stretch = strain * 2200;

        // Draw Ceiling support
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(4);
        sketch.line(sx - 20, sy, sx + 20, sy);

        // Draw stretched wire
        sketch.strokeWeight(2.2);
        let wireColor =
          mat === 0 ? "#94a3b8" : mat === 1 ? "#f59e0b" : "#e2e8f0";

        if (sketch.wireBroken) {
          sketch.stroke("#ef4444");
          // Broken wire necking ends
          sketch.line(sx, sy, sx, sy + origL / 2 - 8);
          sketch.line(sx, sy + origL / 2 + 15, sx, sy + origL + stretch);

          // Draw fallen weight platform
          sketch.fill("#475569");
          sketch.stroke("#334155");
          sketch.strokeWeight(1.5);
          sketch.rect(sx - 12, sketch.height - 52, 24, 16, 2);
          sketch.fill(255);
          sketch.noStroke();
          sketch.textSize(9);
          sketch.text(`${load.toFixed(0)}kg`, sx - 9, sketch.height - 40);
        } else {
          sketch.stroke(wireColor);
          if (load > plasticThreshold) {
            sketch.strokeWeight(1.4); // Plastic wire necking (thinner)
          }
          sketch.line(sx, sy, sx, sy + origL + stretch);

          // Draw platform hanger
          sketch.stroke("#334155");
          sketch.strokeWeight(2);
          let hookY = sy + origL + stretch;
          sketch.line(sx, hookY, sx, hookY + 8);
          sketch.noStroke();
          sketch.fill("#475569");
          sketch.rect(sx - 12, hookY + 8, 24, 16, 2);
          sketch.fill(255);
          sketch.textSize(8);
          sketch.text(`${load.toFixed(0)} kg`, sx - 10, hookY + 19);
        }

        // 🔬 Circular "Molecular Lens" Atomic Inset Bubble!
        let lensX = 175;
        let lensY = 120;
        let lensR = 40;

        sketch.push();
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(2.5);
        sketch.fill("#0f172a"); // dark viewport
        sketch.circle(lensX, lensY, lensR * 2);

        // Draw atoms grid linked by spring bonds
        let cols = 5;
        let rows = 5;
        let atomSpacing = 11;
        let atomStretch = 1.0 + strain * 15.0; // stretch factor
        let slipFactor = 0;

        if (load > plasticThreshold && !sketch.wireBroken) {
          slipFactor = (load - plasticThreshold) * 0.12; // visual slip plane
        }

        sketch.stroke("rgba(129, 140, 248, 0.4)"); // indigo atomic bonds
        sketch.strokeWeight(1);

        if (!sketch.wireBroken) {
          // Draw atomic spring bonds
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              let ax = lensX - 22 + c * atomSpacing + (r >= 2 ? slipFactor : 0);
              let ay = lensY - 22 + r * atomSpacing * atomStretch;

              if (c < cols - 1) sketch.line(ax, ay, ax + atomSpacing, ay); // horizontal
              if (r < rows - 1)
                sketch.line(
                  ax,
                  ay,
                  ax + (r >= 2 ? slipFactor : 0),
                  ay + atomSpacing * atomStretch,
                ); // vertical
            }
          }

          // Draw atomic nucleuses (spheres)
          sketch.noStroke();
          sketch.fill("#818cf8");
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              let ax = lensX - 22 + c * atomSpacing + (r >= 2 ? slipFactor : 0);
              let ay = lensY - 22 + r * atomSpacing * atomStretch;
              sketch.circle(ax, ay, 4);
            }
          }
        } else {
          // Snapped atoms flying apart!
          sketch.noStroke();
          sketch.fill("#ef4444");
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              let dirY = r < 2.5 ? -8 : 8;
              let ax = lensX - 22 + c * atomSpacing + sketch.random(-2, 2);
              let ay =
                lensY - 22 + r * atomSpacing + dirY + sketch.random(-2, 2);
              sketch.circle(ax, ay, 3.5);
            }
          }
          sketch.fill("#ef4444");
          sketch.textSize(8);
          sketch.text("BONDS SNAPPED", lensX - 32, lensY + 4);
        }
        sketch.pop();

        // 📈 Stress-Strain Real-time Graph Plot
        let gx = sketch.width - 195;
        let gy = 205;
        let gw = 160;
        let gh = 115;

        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1);
        sketch.fill(255);
        sketch.rect(gx - 15, gy - gh - 15, gw + 30, gh + 28, 6);

        // Draw axes
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1);
        sketch.line(gx, gy, gx + gw, gy); // Strain X
        sketch.line(gx, gy, gx, gy - gh); // Stress Y

        sketch.noStroke();
        sketch.fill("#475569");
        sketch.textSize(8);
        sketch.text("Strain (ε)", gx + gw - 35, gy + 10);
        sketch.text("Stress (σ)", gx - 10, gy - gh - 5);

        // Map Stress-Strain to exact graph coordinate box
        let mapX = (strVal) => gx + (strVal / 0.015) * gw; // Strain bound [0, 0.015]
        let mapY = (loadVal) => gy - (loadVal / 200) * gh; // Load bound [0, 200 kg]

        // Pre-draw faint material-specific dotted reference curves
        sketch.push();
        sketch.drawingContext.setLineDash([2, 3]);

        // Steel Reference (faint gray)
        sketch.stroke("rgba(148, 163, 184, 0.35)");
        sketch.strokeWeight(1.2);
        sketch.noFill();
        sketch.beginShape();
        for (let l = 0; l <= 170; l += 5) {
          sketch.vertex(mapX(getMaterialStrain(0, l)), mapY(l));
        }
        sketch.endShape();
        sketch.noStroke();
        sketch.fill("rgba(148, 163, 184, 0.6)");
        sketch.text(
          "Steel",
          mapX(getMaterialStrain(0, 170)) + 3,
          mapY(170) + 3,
        );

        // Copper Reference (faint orange)
        sketch.stroke("rgba(245, 158, 11, 0.3)");
        sketch.strokeWeight(1.2);
        sketch.noFill();
        sketch.beginShape();
        for (let l = 0; l <= 135; l += 5) {
          sketch.vertex(mapX(getMaterialStrain(1, l)), mapY(l));
        }
        sketch.endShape();
        sketch.noStroke();
        sketch.fill("rgba(245, 158, 11, 0.5)");
        sketch.text(
          "Copper",
          mapX(getMaterialStrain(1, 135)) + 3,
          mapY(135) + 3,
        );

        // Glass Reference (faint light blue/gray)
        sketch.stroke("rgba(148, 163, 184, 0.25)");
        sketch.strokeWeight(1.2);
        sketch.noFill();
        sketch.beginShape();
        for (let l = 0; l <= 40; l += 5) {
          sketch.vertex(mapX(getMaterialStrain(2, l)), mapY(l));
        }
        sketch.endShape();
        sketch.noStroke();
        sketch.fill("rgba(148, 163, 184, 0.4)");
        sketch.text("Glass", mapX(getMaterialStrain(2, 40)) + 3, mapY(40) + 3);

        sketch.pop();

        // Record tensile points in history
        if (!sketch.wireBroken && load > 0) {
          if (!sketch.history.some((h) => h.load === load)) {
            sketch.history.push({ strain: strain, load: load });
          }
        }

        // Draw active traced Stress-Strain curve
        sketch.stroke("#ef4444"); // Bold Red trace
        sketch.strokeWeight(2.5);
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(gx, gy);
        for (let pt of sketch.history) {
          sketch.vertex(mapX(pt.strain), mapY(pt.load));
        }
        sketch.endShape();

        // Draw cross markers if broken
        if (sketch.wireBroken && sketch.history.length > 0) {
          let last = sketch.history[sketch.history.length - 1];
          let lx = mapX(last.strain);
          let ly = mapY(last.load);
          sketch.stroke("#ef4444");
          sketch.strokeWeight(2.0);
          sketch.line(lx - 4, ly - 4, lx + 4, ly + 4);
          sketch.line(lx + 4, ly - 4, lx - 4, ly + 4);
        }

        p1_ch7_sims.drawPills(
          sketch,
          `Automated Wire Tensile Tester (${matName})`,
          [
            `Load: ${load.toFixed(0)} kg`,
            `Elastic Y: ${(Y_modulus / 1e9).toFixed(0)} GPa`,
            `Ext ΔL: ${(stretch / 10).toFixed(3)} mm`,
            `Stress σ: ${(stress / 1e6).toFixed(1)} MPa`,
            sketch.wireBroken
              ? "SNAP! Snapped"
              : load > plasticThreshold
                ? "Plastic Region"
                : "Elastic Region",
          ],
        );
        break;
      }

      case "capillary_rise_lab": {
        let r = sketch.radius !== undefined ? sketch.radius : 1.0;
        let T = sketch.tension !== undefined ? sketch.tension : 0.072;
        let theta = sketch.theta !== undefined ? sketch.theta : 0;

        let g = 9.8;
        let rho = 1000;

        let r_m = r * 0.001;
        let h_calc = (2 * T * sketch.cos(theta)) / (rho * g * r_m);
        let h_px = h_calc * 400;

        let liquidLevelY = sketch.height - 80;

        // Draw beaker and liquid
        sketch.noStroke();
        sketch.fill("rgba(14, 165, 233, 0.25)");
        sketch.rect(40, liquidLevelY, sketch.width - 80, 70);

        sketch.stroke("#475569");
        sketch.strokeWeight(3);
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(40, liquidLevelY - 40);
        sketch.vertex(40, sketch.height - 10);
        sketch.vertex(sketch.width - 40, sketch.height - 10);
        sketch.vertex(sketch.width - 40, liquidLevelY - 40);
        sketch.endShape();

        // Draw Capillary glass tube
        let tx = sketch.width / 2;
        let tw = r * 22;

        sketch.fill("rgba(255, 255, 255, 0.1)");
        sketch.stroke("rgba(71, 85, 105, 0.4)");
        sketch.strokeWeight(1.5);
        sketch.rect(tx - tw / 2, liquidLevelY - 140, tw, 200);

        sketch.noStroke();
        sketch.fill("rgba(14, 165, 233, 0.5)");

        let columnTopY = liquidLevelY - h_px;
        sketch.rect(tx - tw / 2 + 1, columnTopY, tw - 1.5, h_px);

        sketch.stroke("rgba(14, 165, 233, 0.9)");
        sketch.strokeWeight(2);
        sketch.noFill();

        if (theta < 90) {
          sketch.arc(tx, columnTopY, tw - 2, 8, 0, 180);
        } else {
          sketch.arc(tx, columnTopY, tw - 2, 8, 180, 360);
        }

        p1_ch7_sims.drawPills(sketch, "Capillary Meniscus (Jurin's Law)", [
          `r: ${r.toFixed(1)} mm`,
          `Tension: ${T.toFixed(3)} N/m`,
          `Contact θ: ${theta}°`,
          `Rise h: ${(h_calc * 1000).toFixed(1)} mm`,
        ]);
        break;
      }

      case "terminal_velocity_stokes": {
        let r = sketch.sphereRadius !== undefined ? sketch.sphereRadius : 3.0;
        let eta = sketch.viscosity !== undefined ? sketch.viscosity : 0.8;
        let rho_s = sketch.density !== undefined ? sketch.density : 7800;

        let rho_f = 1260;
        let g = 9.8;

        let cx = sketch.width / 2;
        let cylinderW = 100;

        // Draw container
        sketch.noStroke();
        sketch.fill("rgba(245, 158, 11, 0.1)");
        sketch.rect(cx - cylinderW / 2, 40, cylinderW, sketch.height - 80);

        sketch.stroke("#475569");
        sketch.strokeWeight(3);
        sketch.noFill();
        sketch.rect(cx - cylinderW / 2, 40, cylinderW, sketch.height - 80, 4);

        let drag = 0;
        let buoyancy = 0;
        let gravityForce = 0;

        if (sketch.stokesRunning) {
          let r_m = r * 0.001;
          let vol = (4 / 3) * Math.PI * Math.pow(r_m, 3);
          let mass = vol * rho_s;

          gravityForce = mass * g;
          buoyancy = vol * rho_f * g;
          drag = 6 * Math.PI * eta * r_m * (sketch.sphereV * 0.02);

          let netF = gravityForce - buoyancy - drag;
          sketch.sphereA = netF / mass;

          let dt = 0.15;
          sketch.sphereV += sketch.sphereA * dt;
          sketch.sphereY += sketch.sphereV * dt * 8;

          if (sketch.sphereY > sketch.height - 55) {
            sketch.sphereY = sketch.height - 55;
            sketch.stokesRunning = false;
          }
        }

        // Draw Sphere
        sketch.fill("#64748b");
        sketch.stroke("#475569");
        sketch.strokeWeight(1.5);
        let s_diam = r * 3;
        sketch.circle(cx, sketch.sphereY, s_diam);

        // Draw Force Vectors
        if (sketch.stokesRunning) {
          let vScale = 3e4;
          p1_ch7_sims.drawArrow(
            sketch,
            cx,
            sketch.sphereY,
            cx,
            sketch.sphereY + gravityForce * vScale,
            "#ef4444",
            2,
          );
          p1_ch7_sims.drawArrow(
            sketch,
            cx,
            sketch.sphereY,
            cx,
            sketch.sphereY - buoyancy * vScale,
            "#0ea5e9",
            2,
          );
          p1_ch7_sims.drawArrow(
            sketch,
            cx,
            sketch.sphereY,
            cx,
            sketch.sphereY - (buoyancy + drag) * vScale,
            "#f59e0b",
            2.0,
          );

          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.textSize(9);
          sketch.text("F_g", cx + 8, sketch.sphereY + gravityForce * vScale);
          sketch.fill("#0ea5e9");
          sketch.text("F_b", cx + 8, sketch.sphereY - buoyancy * vScale);
          sketch.fill("#f59e0b");
          sketch.text(
            "F_drag",
            cx - 38,
            sketch.sphereY - (buoyancy + drag) * vScale + 5,
          );
        }

        let r_m = r * 0.001;
        let v_term = ((2 / 9) * (r_m * r_m * g * (rho_s - rho_f))) / eta;

        p1_ch7_sims.drawPills(sketch, "Stokes' Terminal Velocity Column", [
          `r: ${r.toFixed(1)} mm`,
          `η: ${eta.toFixed(2)} Pa·s`,
          `ρ_s: ${rho_s} kg/m³`,
          `v_term: ${v_term.toFixed(3)} m/s`,
          `v_curr: ${(sketch.sphereV * 0.02).toFixed(3)} m/s`,
        ]);
        break;
      }
    }
  },

  drawGrid: (sketch) => {
    sketch.stroke("#e2e8f0");
    sketch.strokeWeight(1);
    for (let x = 0; x < sketch.width; x += 40) {
      sketch.line(x, 0, x, sketch.height);
    }
    for (let y = 0; y < sketch.height; y += 40) {
      sketch.line(0, y, sketch.width, y);
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
