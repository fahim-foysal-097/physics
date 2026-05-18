export const p1_ch3_sims = {
  getScaledG: (g) => (g * 0.4) / 9.8,

  setup: (sketch, vizType) => {
    sketch.angleMode(sketch.DEGREES);

    // Projectile Parameters
    sketch.u = 60;
    sketch.angle = 45;
    sketch.h = 0;
    sketch.g = 9.8;
    sketch.isFiring = false;
    sketch.t = 0;
    sketch.path = [];
    sketch.R = 0;

    sketch.fire = () => {
      sketch.isFiring = true;
      sketch.t = 0;
      sketch.path = [];
      sketch.R = 0;
    };
    sketch.reset = () => {
      sketch.isFiring = false;
      sketch.t = 0;
      sketch.path = [];
      sketch.R = 0;
    };

    // Motion Graphs Parameters
    sketch.u_motion = 10;
    sketch.a_motion = 2;
    sketch.animating = false;
    sketch.timeVal = 0;
    sketch.history = [];

    sketch.startAnim = () => {
      sketch.animating = true;
      sketch.timeVal = 0;
      sketch.history = [];
    };
    sketch.resetAnim = () => {
      sketch.animating = false;
      sketch.timeVal = 0;
      sketch.history = [];
    };
  },

  draw: (sketch, vizType) => {
    sketch.background("#f8fafc");
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "projectile_advanced": {
        let uVal = sketch.u !== undefined ? sketch.u : 60;
        let angVal = sketch.angle !== undefined ? sketch.angle : 45;
        let gVal = sketch.g !== undefined ? sketch.g : 9.8;
        let hVal = sketch.h !== undefined ? sketch.h : 0;

        // Pre-calculate kinematics
        let maxH = hVal + Math.pow(uVal * sketch.sin(angVal), 2) / (2 * gVal);
        let totalTime =
          (uVal * sketch.sin(angVal) +
            sketch.sqrt(
              Math.pow(uVal * sketch.sin(angVal), 2) + 2 * gVal * hVal,
            )) /
          gVal;
        let calculatedRange = uVal * sketch.cos(angVal) * totalTime;

        // Base zoom scaling
        let maxRangeAtGround = (uVal * uVal) / gVal;
        let scaleFactor = (sketch.width - 80) / Math.max(250, maxRangeAtGround);
        scaleFactor = sketch.constrain(scaleFactor, 1.5, 4.2);

        // Auto-shrink scale factor if the calculated range exceeds screen bounds!
        let maxAllowedRange = (sketch.width - 80) / scaleFactor;
        if (calculatedRange > maxAllowedRange) {
          scaleFactor = (sketch.width - 80) / calculatedRange;
        }
        scaleFactor = sketch.constrain(scaleFactor, 0.4, 4.2); // Allow shrinking down to 0.4

        // Grid background in lower half
        sketch.push();
        sketch.translate(45, sketch.height - 50);

        // Grid lines
        sketch.stroke("#e2e8f0");
        sketch.strokeWeight(1);
        for (let gx = 0; gx < sketch.width; gx += 40) {
          sketch.line(gx, -sketch.height, gx, 20);
        }
        for (let gy = 0; gy > -sketch.height; gy -= 40) {
          sketch.line(-45, gy, sketch.width, gy);
        }

        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(2);
        sketch.line(-45, 0, sketch.width, 0); // Ground
        sketch.line(0, -sketch.height, 0, 20); // Y axis

        // Draw Y-axis tick marks (Vertical Ruler every 20m)
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1.0);
        sketch.fill("#64748b");
        sketch.textSize(8);
        sketch.textAlign(sketch.RIGHT, sketch.CENTER);

        let maxTickY = maxH > 150 ? maxH + 40 : 150;
        let stepY = maxH > 300 ? 100 : maxH > 150 ? 50 : 20;
        for (let tickY = 0; tickY <= maxTickY; tickY += stepY) {
          let yPos = -tickY * scaleFactor;
          if (yPos > -sketch.height + 20) {
            sketch.line(-4, yPos, 0, yPos);
            sketch.text(`${tickY}m`, -8, yPos);
          }
        }

        // Draw X-axis tick marks (Horizontal Ruler with dynamic steps)
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        let stepX =
          calculatedRange > 400 ? 100 : calculatedRange > 180 ? 50 : 20;
        for (let tickX = stepX; tickX <= calculatedRange + 40; tickX += stepX) {
          let xPos = tickX * scaleFactor;
          if (xPos < sketch.width - 50) {
            sketch.line(xPos, 0, xPos, 4);
            sketch.text(`${tickX}m`, xPos, 8);
          }
        }
        sketch.textAlign(sketch.LEFT);

        // Physics update loop
        if (sketch.isFiring) {
          let x = uVal * sketch.cos(angVal) * sketch.t;
          let y =
            hVal +
            (uVal * sketch.sin(angVal) * sketch.t -
              0.5 * gVal * sketch.t * sketch.t);

          if (y >= 0) {
            sketch.path.push({ x: x, y: y });
            sketch.t += 0.08;
          } else {
            sketch.isFiring = false;
            sketch.R = x;
          }
        }

        // Draw projectile trajectory path
        sketch.stroke("#4f46e5");
        sketch.strokeWeight(2.5);
        sketch.noFill();
        sketch.beginShape();
        for (let p of sketch.path) {
          sketch.vertex(p.x * scaleFactor, -p.y * scaleFactor);
        }
        sketch.endShape();

        // Draw launcher platform (tower height scales linearly with no zoom distortion!)
        sketch.fill("#475569");
        sketch.noStroke();
        sketch.rect(-8, -hVal * scaleFactor, 16, hVal * scaleFactor);
        sketch.fill("#1e293b");
        sketch.circle(0, -hVal * scaleFactor, 12);

        // Draw active projectile and its velocity components
        if (sketch.path.length > 0) {
          let curr = sketch.path[sketch.path.length - 1];
          let cx = curr.x * scaleFactor;
          let cy = -curr.y * scaleFactor;

          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.circle(cx, cy, 10);

          if (sketch.isFiring) {
            let vx = uVal * sketch.cos(angVal);
            let vy = uVal * sketch.sin(angVal) - gVal * sketch.t;

            // Draw component arrows scaled to match current size
            p1_ch3_sims.drawArrow(
              sketch,
              cx,
              cy,
              cx + vx * scaleFactor * 0.4,
              cy,
              "#0ea5e9",
              2,
            );
            p1_ch3_sims.drawArrow(
              sketch,
              cx,
              cy,
              cx,
              cy - vy * scaleFactor * 0.4,
              "#f59e0b",
              2,
            );

            sketch.fill("#0ea5e9");
            sketch.textSize(9);
            sketch.text(`v_x`, cx + vx * scaleFactor * 0.4 + 4, cy + 3);
            sketch.fill("#f59e0b");
            sketch.text(`v_y`, cx - 14, cy - vy * scaleFactor * 0.4 - 4);
          }
        }

        sketch.pop();

        p1_ch3_sims.drawPills(sketch, "Projectile Kinematics Lab", [
          `u: ${uVal.toFixed(0)}m/s`,
          `θ: ${angVal.toFixed(0)}°`,
          `h: ${hVal.toFixed(0)}m`,
          `R: ${calculatedRange.toFixed(1)}m`,
          `H_max: ${maxH.toFixed(1)}m`,
          `Flight Time: ${totalTime.toFixed(2)}s`,
        ]);
        break;
      }

      case "motion_graphs": {
        let curU = sketch.u_motion !== undefined ? sketch.u_motion : 10;
        let curA = sketch.a_motion !== undefined ? sketch.a_motion : 2;

        let roadY = 60;
        sketch.noStroke();
        sketch.fill("#cbd5e1");
        sketch.rect(0, roadY, sketch.width, 24);
        sketch.stroke(255);
        sketch.strokeWeight(1.5);
        sketch.drawingContext.setLineDash([10, 8]);
        sketch.line(0, roadY + 12, sketch.width, roadY + 12);
        sketch.drawingContext.setLineDash([]);

        if (sketch.animating) {
          sketch.timeVal += 0.05;
          let disp =
            curU * sketch.timeVal +
            0.5 * curA * sketch.timeVal * sketch.timeVal;
          let vel = curU + curA * sketch.timeVal;
          let acc = curA;

          let carX = 40 + disp * 1.5;

          if (carX >= sketch.width - 40 || sketch.timeVal >= 10) {
            sketch.animating = false;
          } else {
            sketch.history.push({ t: sketch.timeVal, x: disp, v: vel, a: acc });
          }
        }

        let activeDisp =
          curU * sketch.timeVal + 0.5 * curA * sketch.timeVal * sketch.timeVal;
        let drawX = 40 + activeDisp * 1.5;
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.rect(drawX - 14, roadY + 1, 28, 14, 3);
        sketch.fill(0);
        sketch.circle(drawX - 7, roadY + 16, 5);
        sketch.circle(drawX + 7, roadY + 16, 5);

        // Three Synchronized Graphs
        let graphW = (sketch.width - 80) / 3;
        let graphH = 90;
        let graphY = 175;
        let gx = 30;

        // 1st Graph: x-t (Position vs Time)
        sketch.push();
        sketch.translate(gx, graphY);
        p1_ch3_sims.drawGraphOutline(
          sketch,
          graphW,
          graphH,
          "Displacement (x) vs Time",
          "#0ea5e9",
        );
        sketch.stroke("#0ea5e9");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.beginShape();
        for (let pt of sketch.history) {
          let px = (pt.t / 10) * (graphW - 20);
          let py = -(pt.x / 200) * (graphH - 20);
          sketch.vertex(px + 10, py - 10);
        }
        sketch.endShape();
        sketch.pop();

        // 2nd Graph: v-t (Velocity vs Time)
        sketch.push();
        sketch.translate(gx + graphW + 20, graphY);
        p1_ch3_sims.drawGraphOutline(
          sketch,
          graphW,
          graphH,
          "Velocity (v) vs Time",
          "#f59e0b",
        );
        sketch.stroke("#f59e0b");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.beginShape();
        for (let pt of sketch.history) {
          let px = (pt.t / 10) * (graphW - 20);
          let py = -(pt.v / 40) * (graphH - 20);
          sketch.vertex(px + 10, py - 10);
        }
        sketch.endShape();
        sketch.pop();

        // 3rd Graph: a-t (Acceleration vs Time)
        sketch.push();
        sketch.translate(gx + 2 * graphW + 40, graphY);
        p1_ch3_sims.drawGraphOutline(
          sketch,
          graphW,
          graphH,
          "Acceleration (a) vs Time",
          "#10b981",
        );
        sketch.stroke("#10b981");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.beginShape();
        for (let pt of sketch.history) {
          let px = (pt.t / 10) * (graphW - 20);
          let py = -(pt.a / 12) * (graphH - 20);
          sketch.vertex(px + 10, py - 10);
        }
        sketch.endShape();
        sketch.pop();

        p1_ch3_sims.drawPills(sketch, "Uniformly Accelerated Motion Lab", [
          `a: ${curA.toFixed(1)} m/s²`,
          `u: ${curU.toFixed(1)} m/s`,
          `Time: ${sketch.timeVal.toFixed(1)} s`,
          `s = ${activeDisp.toFixed(1)} m`,
          `v = ${(curU + curA * sketch.timeVal).toFixed(1)} m/s`,
        ]);
        break;
      }
    }
  },

  drawGraphOutline: (sketch, w, h, titleStr, colorStr) => {
    sketch.stroke("#cbd5e1");
    sketch.strokeWeight(1.5);
    sketch.fill(255);
    sketch.rect(0, -h, w, h, 6);

    // Axes
    sketch.stroke("#94a3b8");
    sketch.strokeWeight(1);
    sketch.line(10, -10, w - 10, -10);
    sketch.line(10, -10, 10, -h + 10);

    sketch.noStroke();
    sketch.fill(colorStr);
    sketch.textSize(9);
    sketch.textStyle(sketch.BOLD);
    sketch.text(titleStr, 8, -h + 12);
    sketch.textStyle(sketch.NORMAL);
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
    sketch.triangle(0, 0, 8, 3.0, 8, -3.0);
    sketch.pop();
  },

  drawPills: (sketch, title, metrics) => {
    sketch.push();
    sketch.resetMatrix();
    sketch.textSize(10);

    // Draw Title Pill (top-left)
    let tw = sketch.textWidth(title);
    sketch.fill("rgba(30, 41, 59, 0.85)");
    sketch.noStroke();
    sketch.rect(15, 12, tw + 20, 22, 11);

    sketch.fill("#ffffff");
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textStyle(sketch.BOLD);
    sketch.text(title, 15 + (tw + 20) / 2, 12 + 11);
    sketch.textStyle(sketch.NORMAL);

    // Draw Metrics Bar Pill (bottom-left)
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
