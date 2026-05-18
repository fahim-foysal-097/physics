export const p1_ch4_sims = {
  setup: (sketch, vizType) => {
    sketch.angleMode(sketch.DEGREES);

    // Banking Road parameters
    sketch.theta = 15;
    sketch.carSpeed = 40;

    // Pulley parameters
    sketch.m1 = 5.0;
    sketch.m2 = 3.0;
    sketch.y1 = 120; // vertical position of left mass
    sketch.y2 = 120; // vertical position of right mass
    sketch.vel1 = 0;
    sketch.vel2 = 0;
    sketch.accel = 0;
    sketch.tension = 0;
    sketch.pulleyRunning = false;

    sketch.startPulley = () => {
      sketch.y1 = 120;
      sketch.y2 = 120;
      sketch.vel1 = 0;
      sketch.vel2 = 0;
      sketch.pulleyRunning = true;
    };
    sketch.resetPulley = () => {
      sketch.y1 = 120;
      sketch.y2 = 120;
      sketch.vel1 = 0;
      sketch.vel2 = 0;
      sketch.pulleyRunning = false;
    };

    // Collision parameters
    sketch.m1_col = 4.0;
    sketch.m2_col = 2.0;
    sketch.u1_col = 5.0;
    sketch.u2_col = -3.0;
    sketch.x1 = 120;
    sketch.x2 = 320;
    sketch.v1 = 0;
    sketch.v2 = 0;
    sketch.e_coeff = 1.0; // Restitution
    sketch.collided = false;
    sketch.collisionRunning = false;
    sketch.initialKE = 0;
    sketch.currentKE = 0;

    sketch.startCollision = () => {
      sketch.x1 = 100;
      sketch.x2 = 320;
      sketch.v1 = sketch.u1_col || 5.0;
      sketch.v2 = sketch.u2_col || -3.0;
      sketch.collided = false;
      sketch.collisionRunning = true;
      sketch.initialKE =
        0.5 * sketch.m1_col * sketch.v1 * sketch.v1 +
        0.5 * sketch.m2_col * sketch.v2 * sketch.v2;
    };

    sketch.resetCollision = () => {
      sketch.x1 = 100;
      sketch.x2 = 320;
      sketch.v1 = sketch.u1_col || 5.0;
      sketch.v2 = sketch.u2_col || -3.0;
      sketch.collided = false;
      sketch.collisionRunning = false;
      sketch.initialKE =
        0.5 * sketch.m1_col * sketch.v1 * sketch.v1 +
        0.5 * sketch.m2_col * sketch.v2 * sketch.v2;
    };
  },

  draw: (sketch, vizType) => {
    sketch.background("#f8fafc");
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "banking_road": {
        // Draw elegant wedge road
        sketch.push();
        sketch.translate(sketch.width / 2 - 50, sketch.height / 2 + 30);

        let theta = sketch.theta !== undefined ? sketch.theta : 15;
        let vVal = sketch.carSpeed !== undefined ? sketch.carSpeed : 20;
        let g = 9.8;
        let radius = 60; // radius of curvature (meters)

        // Draw Wedge base
        sketch.fill("#e2e8f0");
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(2);
        sketch.beginShape();
        sketch.vertex(-120, 0);
        sketch.vertex(120, 0);
        sketch.vertex(120, -240 * sketch.tan(theta));
        sketch.endShape(sketch.CLOSE);

        // Draw Car as a block on inclined surface
        sketch.push();
        sketch.rotate(-theta);

        // Road surface line
        sketch.stroke("#475569");
        sketch.strokeWeight(4);
        sketch.line(-120, 0, 120, 0);

        // Calculations
        let L_fg = 65; // gravity visual vector length
        let L_fc = (L_fg * (vVal * vVal)) / (g * radius);

        let rad = sketch.radians(theta);
        let cosT = Math.cos(rad);
        let sinT = Math.sin(rad);

        // N = mg cosθ + (mv²/r) sinθ
        let L_N = L_fg * cosT + L_fc * sinT;
        // f = (mv²/r) cosθ - mg sinθ
        let L_f = L_fc * cosT - L_fg * sinT;

        let mu = 0.45; // static friction coefficient
        let maxFriction = mu * L_N;
        let isSkidding = Math.abs(L_f) > maxFriction;

        // Draw skidding smoke particles
        if (isSkidding && sketch.frameCount % 2 === 0) {
          sketch.fill("rgba(148, 163, 184, 0.6)");
          sketch.noStroke();
          sketch.circle(
            -35 - sketch.random(10),
            -5 - sketch.random(8),
            sketch.random(6, 12),
          );
          sketch.circle(
            35 + sketch.random(10),
            -5 - sketch.random(8),
            sketch.random(6, 12),
          );
        }

        // Draw Car Body
        if (isSkidding) {
          sketch.fill("#f87171"); // Red alert body
          sketch.stroke("#dc2626");
        } else {
          sketch.fill("#0ea5e9"); // Standard blue body
          sketch.stroke("#0284c7");
        }
        sketch.strokeWeight(1.5);
        sketch.rect(-25, -20, 50, 20, 4);

        // Wheels
        sketch.fill("#1e293b");
        sketch.noStroke();
        sketch.circle(-15, -2, 6);
        sketch.circle(15, -2, 6);

        // Forces vectors (drawn from center of block)
        let cx = 0;
        let cy = -10;

        // 1. Normal Force (perpendicular to road)
        p1_ch4_sims.drawArrow(sketch, cx, cy, cx, cy - L_N, "#10b981", 2.5); // F_N (Emerald)
        sketch.fill("#10b981");
        sketch.noStroke();
        sketch.textSize(10);
        sketch.text("F_N", cx + 5, cy - L_N + 12);

        // 2. Friction Force (along road)
        if (Math.abs(L_f) > 1.5) {
          p1_ch4_sims.drawArrow(sketch, cx, cy, cx - L_f, cy, "#f59e0b", 2.0); // F_f (Amber)
          sketch.fill("#f59e0b");
          sketch.text(
            L_f > 0 ? "F_f (inward)" : "F_f (outward)",
            cx - L_f + (L_f > 0 ? -45 : 10),
            cy - 4,
          );
        }

        // 3. Gravity Force (vertically down)
        sketch.push();
        sketch.rotate(theta); // rotate back to draw vertical gravity
        p1_ch4_sims.drawArrow(sketch, cx, cy, cx, cy + L_fg, "#ef4444", 2.5); // F_g = mg (Red)
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.text("F_g = mg", cx + 8, cy + L_fg - 5);
        sketch.pop();

        // 4. Centripetal Resultant (horizontal)
        sketch.push();
        sketch.rotate(theta);
        p1_ch4_sims.drawArrow(sketch, cx, cy, cx - L_fc, cy, "#4f46e5", 2.5); // F_c (Indigo)
        sketch.fill("#4f46e5");
        sketch.noStroke();
        sketch.text("F_centripetal", cx - L_fc - 65, cy - 4);
        sketch.pop();

        sketch.pop();
        sketch.pop();

        // Skid alert banner
        if (isSkidding) {
          sketch.fill("rgba(239, 68, 68, 0.9)");
          sketch.noStroke();
          sketch.rect(sketch.width / 2 - 120, 50, 240, 24, 6);
          sketch.fill(255);
          sketch.textSize(10);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.CENTER, sketch.CENTER);
          sketch.text("VEHICLE SKIDDING: TIRE SLIP!", sketch.width / 2, 62);
          sketch.textStyle(sketch.NORMAL);
          sketch.textAlign(sketch.LEFT);
        }

        // Calculations
        let safeV = sketch.sqrt(radius * g * sketch.tan(theta));
        p1_ch4_sims.drawPills(sketch, "Road Banking Force Dynamics", [
          `θ: ${theta.toFixed(1)}°`,
          `Speed v: ${vVal.toFixed(1)} m/s`,
          `Optimal Design Speed v₀: ${safeV.toFixed(1)} m/s`,
          isSkidding ? "STATUS: SKIDDING! ❌" : "STATUS: STABLE TRACTION ✅",
        ]);
        break;
      }

      case "pulley_system": {
        let curM1 = sketch.m1 !== undefined ? sketch.m1 : 5.0;
        let curM2 = sketch.m2 !== undefined ? sketch.m2 : 3.0;
        let g = 9.8;

        // Pulley center position
        let px = sketch.width / 2;
        let py = 50;
        let r = 25; // Pulley radius

        // Physics solver
        let a = ((curM1 - curM2) / (curM1 + curM2)) * g;
        let T = ((2 * curM1 * curM2) / (curM1 + curM2)) * g;

        if (sketch.pulleyRunning) {
          let dt = 0.15;
          sketch.vel1 += a * dt;
          sketch.vel2 -= a * dt;

          sketch.y1 += sketch.vel1 * dt * 4;
          sketch.y2 += sketch.vel2 * dt * 4;

          // Limit limits
          if (
            sketch.y1 > 220 ||
            sketch.y2 > 220 ||
            sketch.y1 < 70 ||
            sketch.y2 < 70
          ) {
            sketch.pulleyRunning = false;
            sketch.vel1 = 0;
            sketch.vel2 = 0;
          }
        }

        // Draw Ceiling support
        sketch.fill("#475569");
        sketch.noStroke();
        sketch.rect(px - 40, 10, 80, 8);
        sketch.stroke("#475569");
        sketch.strokeWeight(3);
        sketch.line(px, 18, px, py);

        // Draw Strings hanging from Pulley
        sketch.stroke("#64748b");
        sketch.strokeWeight(2);
        sketch.line(px - r, py, px - r, sketch.y1);
        sketch.line(px + r, py, px + r, sketch.y2);

        // Draw Pulley Wheel
        sketch.fill("#cbd5e1");
        sketch.stroke("#475569");
        sketch.strokeWeight(4);
        sketch.circle(px, py, r * 2);
        sketch.fill("#475569");
        sketch.circle(px, py, 6);

        // Draw left mass block (m1)
        sketch.fill("#0ea5e9");
        sketch.stroke("#0284c7");
        sketch.strokeWeight(1.5);
        let w1 = 20 + curM1 * 2;
        sketch.rect(px - r - w1 / 2, sketch.y1, w1, w1, 4);
        // Force vector on m1
        p1_ch4_sims.drawArrow(
          sketch,
          px - r,
          sketch.y1 + w1 / 2,
          px - r,
          sketch.y1 + w1 / 2 - T * 1.5,
          "#10b981",
          2,
        );
        p1_ch4_sims.drawArrow(
          sketch,
          px - r,
          sketch.y1 + w1 / 2,
          px - r,
          sketch.y1 + w1 / 2 + curM1 * g * 0.8,
          "#ef4444",
          2,
        );

        // Draw right mass block (m2)
        sketch.fill("#f59e0b");
        sketch.stroke("#d97706");
        sketch.strokeWeight(1.5);
        let w2 = 20 + curM2 * 2;
        sketch.rect(px + r - w2 / 2, sketch.y2, w2, w2, 4);
        // Force vector on m2
        p1_ch4_sims.drawArrow(
          sketch,
          px + r,
          sketch.y2 + w2 / 2,
          px + r,
          sketch.y2 + w2 / 2 - T * 1.5,
          "#10b981",
          2,
        );
        p1_ch4_sims.drawArrow(
          sketch,
          px + r,
          sketch.y2 + w2 / 2,
          px + r,
          sketch.y2 + w2 / 2 + curM2 * g * 0.8,
          "#ef4444",
          2,
        );

        // Labels
        sketch.fill("#1e293b");
        sketch.noStroke();
        sketch.textSize(10);
        sketch.textAlign(sketch.CENTER);
        sketch.text(`m1: ${curM1.toFixed(1)}kg`, px - r, sketch.y1 + w1 + 14);
        sketch.text(`m2: ${curM2.toFixed(1)}kg`, px + r, sketch.y2 + w2 + 14);
        sketch.textAlign(sketch.LEFT);

        p1_ch4_sims.drawPills(sketch, "Atwood Machine Physics", [
          `m1: ${curM1.toFixed(1)}kg`,
          `m2: ${curM2.toFixed(1)}kg`,
          `a: ${Math.abs(a).toFixed(2)} m/s²`,
          `Tension T: ${T.toFixed(1)} N`,
          `a = (m1 - m2)g / (m1 + m2)`,
        ]);
        break;
      }

      case "collision_lab": {
        let curM1 = sketch.m1_col !== undefined ? sketch.m1_col : 4.0;
        let curM2 = sketch.m2_col !== undefined ? sketch.m2_col : 2.0;
        let curE = sketch.e_coeff !== undefined ? sketch.e_coeff : 1.0;

        let roadY = 110;
        // Draw track
        sketch.noStroke();
        sketch.fill("#e2e8f0");
        sketch.rect(0, roadY + 20, sketch.width, 10);

        // Physics loop
        if (sketch.collisionRunning) {
          let dt = 0.25;
          sketch.x1 += sketch.v1 * dt;
          sketch.x2 += sketch.v2 * dt;

          sketch.currentKE =
            0.5 * curM1 * sketch.v1 * sketch.v1 +
            0.5 * curM2 * sketch.v2 * sketch.v2;

          // Check for collision
          let w1 = 15 + curM1 * 4;
          let w2 = 15 + curM2 * 4;

          if (!sketch.collided && sketch.x1 + w1 / 2 >= sketch.x2 - w2 / 2) {
            sketch.collided = true;
            let u1 = sketch.v1;
            let u2 = sketch.v2;

            sketch.v1 =
              (curM1 * u1 + curM2 * u2 - curM2 * curE * (u1 - u2)) /
              (curM1 + curM2);
            sketch.v2 =
              (curM1 * u1 + curM2 * u2 + curM1 * curE * (u1 - u2)) /
              (curM1 + curM2);
          }

          if (sketch.x1 < -50 || sketch.x2 > sketch.width + 50) {
            sketch.collisionRunning = false;
          }
        }

        // Draw blocks
        let w1 = 15 + curM1 * 4;
        sketch.fill("#0ea5e9");
        sketch.stroke("#0284c7");
        sketch.strokeWeight(2);
        sketch.rect(sketch.x1 - w1 / 2, roadY - w1 + 20, w1, w1, 3);
        sketch.fill(255);
        sketch.noStroke();
        sketch.textSize(9);
        sketch.text(`m1`, sketch.x1 - 5, roadY - w1 / 2 + 20);

        let w2 = 15 + curM2 * 4;
        sketch.fill("#f59e0b");
        sketch.stroke("#d97706");
        sketch.strokeWeight(2);
        sketch.rect(sketch.x2 - w2 / 2, roadY - w2 + 20, w2, w2, 3);
        sketch.fill(255);
        sketch.noStroke();
        sketch.text(`m2`, sketch.x2 - 5, roadY - w2 / 2 + 20);

        // Velocity vectors on blocks
        if (sketch.collisionRunning) {
          p1_ch4_sims.drawArrow(
            sketch,
            sketch.x1,
            roadY - w1 - 10,
            sketch.x1 + sketch.v1 * 6,
            roadY - w1 - 10,
            "#0ea5e9",
            2,
          );
          p1_ch4_sims.drawArrow(
            sketch,
            sketch.x2,
            roadY - w2 - 10,
            sketch.x2 + sketch.v2 * 6,
            roadY - w2 - 10,
            "#f59e0b",
            2,
          );
        }

        // Kinetic Energy Bar Chart in lower half
        let chartX = 30;
        let chartY = 260;
        let maxBarW = 180;

        let curKE_m1 = 0.5 * curM1 * sketch.v1 * sketch.v1;
        let curKE_m2 = 0.5 * curM2 * sketch.v2 * sketch.v2;
        let activeTotalKE = curKE_m1 + curKE_m2;
        let lostKE = Math.max(0, sketch.initialKE - activeTotalKE);

        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1.5);
        sketch.fill(255);
        sketch.rect(chartX, chartY - 45, sketch.width - 60, 52, 6);

        sketch.noStroke();
        sketch.fill("#1e293b");
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.text(
          "Kinetic Energy Conservation (J)",
          chartX + 15,
          chartY - 33,
        );
        sketch.textStyle(sketch.NORMAL);

        let scaleKE = maxBarW / Math.max(1, sketch.initialKE);

        // Initial KE bar
        sketch.fill("#94a3b8");
        sketch.rect(
          chartX + 110,
          chartY - 25,
          sketch.initialKE * scaleKE,
          8,
          2,
        );

        // Current Total KE bar (stacked)
        let b1_w = curKE_m1 * scaleKE;
        let b2_w = curKE_m2 * scaleKE;
        sketch.fill("#0ea5e9");
        sketch.rect(chartX + 110, chartY - 12, b1_w, 8, 2);
        sketch.fill("#f59e0b");
        sketch.rect(chartX + 110 + b1_w, chartY - 12, b2_w, 8, 2);
        sketch.fill("#ef4444");
        sketch.rect(
          chartX + 110 + b1_w + b2_w,
          chartY - 12,
          lostKE * scaleKE,
          8,
          2,
        );

        sketch.fill("#1e293b");
        sketch.text(
          `Initial E_k: ${sketch.initialKE.toFixed(1)} J`,
          chartX + 15,
          chartY - 19,
        );
        sketch.text(
          `Current E_k: ${activeTotalKE.toFixed(1)} J`,
          chartX + 15,
          chartY - 6,
        );

        p1_ch4_sims.drawPills(sketch, "1D Collision Momentum Sandbox", [
          `m1: ${curM1.toFixed(1)}kg | m2: ${curM2.toFixed(1)}kg`,
          `restitution e: ${curE.toFixed(2)}`,
          `v1: ${sketch.v1.toFixed(2)}m/s | v2: ${sketch.v2.toFixed(2)}m/s`,
        ]);
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
