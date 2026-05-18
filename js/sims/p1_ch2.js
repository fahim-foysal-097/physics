export const p1_ch2_sims = {
  setup: (sketch, vizType) => {
    sketch.angleMode(sketch.DEGREES);

    // Core parameters for 2D addition/area
    sketch.pMag = 100;
    sketch.qMag = 80;
    sketch.angle = 60;
    sketch.vecA_mag = 120;
    sketch.vecB_mag = 90;

    // River Boat Parameters
    sketch.u = 3.0; // River speed
    sketch.v = 6.0; // Boat speed
    sketch.alpha = 90; // Steer angle
    sketch.mode = 0; // 0=Manual, 1=Min Time, 2=Min Distance
    sketch.boatX = 50;
    sketch.boatY = 220; // river bottom bank initially
    sketch.animating = false;
    sketch.pathHistory = [];
    sketch.crossingTime = 0;
    sketch.drift = 0;

    sketch.startCrossing = () => {
      sketch.boatX = 50;
      sketch.boatY = 220; // bottom bank
      sketch.pathHistory = [];
      sketch.animating = true;
      sketch.crossingTime = 0;
      sketch.drift = 0;
    };

    sketch.resetCrossing = () => {
      sketch.boatX = 50;
      sketch.boatY = 220;
      sketch.pathHistory = [];
      sketch.animating = false;
      sketch.crossingTime = 0;
      sketch.drift = 0;
    };

    // Rain Umbrella Parameters
    sketch.v_m = 5.0; // Man speed
    sketch.v_r = 8.0; // Rain speed
    sketch.theta = 0; // Umbrella angle
    sketch.manX = 100;
    sketch.viewFrame = 0; // 0 = Ground Frame, 1 = Man's Frame (Relative)
    sketch.rainDrops = [];
    for (let i = 0; i < 60; i++) {
      sketch.rainDrops.push({
        x: sketch.random(500),
        y: sketch.random(300),
        speed: sketch.random(6, 10),
      });
    }

    sketch.reset = () => {
      sketch.v_m = 5.0;
      sketch.v_r = 8.0;
      sketch.theta = 0;
      sketch.manX = 100;
      sketch.viewFrame = 0;
    };
  },

  draw: (sketch, vizType) => {
    sketch.background("#f8fafc");
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "vector_addition": {
        sketch.push();
        sketch.translate(sketch.width / 4, sketch.height / 2 + 20);
        p1_ch2_sims.drawGrid(sketch);

        let pVal = sketch.pMag || 100;
        let qVal = sketch.qMag || 80;
        let theta = sketch.angle || 60;

        let qx = qVal * sketch.cos(theta);
        let qy = -qVal * sketch.sin(theta);
        let rx = pVal + qx;
        let ry = qy;

        // Parallelogram dotted lines
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1.5);
        sketch.drawingContext.setLineDash([5, 5]);
        sketch.line(pVal, 0, rx, ry);
        sketch.line(qx, qy, rx, ry);
        sketch.drawingContext.setLineDash([]);

        // Vectors
        p1_ch2_sims.drawArrow(sketch, 0, 0, pVal, 0, "#0ea5e9", 3); // P
        p1_ch2_sims.drawArrow(sketch, 0, 0, qx, qy, "#f59e0b", 3); // Q
        p1_ch2_sims.drawArrow(sketch, 0, 0, rx, ry, "#4f46e5", 4); // Resultant R

        // Labels
        sketch.fill("#0ea5e9");
        sketch.noStroke();
        sketch.textSize(12);
        sketch.text(`P = ${pVal.toFixed(0)}`, pVal / 2, 20);

        sketch.fill("#f59e0b");
        sketch.text(`Q = ${qVal.toFixed(0)}`, qx / 2 - 15, qy / 2 - 10);

        let res = sketch.sqrt(
          pVal * pVal + qVal * qVal + 2 * pVal * qVal * sketch.cos(theta),
        );
        sketch.fill("#4f46e5");
        sketch.text(`R = ${res.toFixed(1)}`, rx / 2 + 10, ry / 2 - 10);

        sketch.pop();

        p1_ch2_sims.drawPills(sketch, "Vector Addition (Resultant)", [
          `P: ${pVal.toFixed(0)}`,
          `Q: ${qVal.toFixed(0)}`,
          `θ: ${theta}°`,
          `R = √[P²+Q²+2PQcos(θ)] = ${res.toFixed(1)}`,
        ]);
        break;
      }

      case "vector_area": {
        sketch.push();
        sketch.translate(sketch.width / 4, sketch.height / 2 + 20);
        p1_ch2_sims.drawGrid(sketch);

        let aVal = sketch.vecA_mag || 120;
        let bVal = sketch.vecB_mag || 90;
        let theta = sketch.angle || 60;

        let bx = bVal * sketch.cos(theta);
        let by = -bVal * sketch.sin(theta);

        // Fill area
        sketch.fill("rgba(14, 165, 233, 0.15)");
        sketch.stroke("rgba(14, 165, 233, 0.4)");
        sketch.strokeWeight(1.5);
        sketch.beginShape();
        sketch.vertex(0, 0);
        sketch.vertex(aVal, 0);
        sketch.vertex(aVal + bx, by);
        sketch.vertex(bx, by);
        sketch.endShape(sketch.CLOSE);

        // Height helper line
        sketch.stroke("#ef4444");
        sketch.strokeWeight(1.5);
        sketch.drawingContext.setLineDash([4, 4]);
        sketch.line(bx, by, bx, 0);
        sketch.drawingContext.setLineDash([]);
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.text(`h = ${Math.abs(by).toFixed(0)}`, bx + 5, by / 2);

        // Vectors
        p1_ch2_sims.drawArrow(sketch, 0, 0, aVal, 0, "#0ea5e9", 3); // A
        p1_ch2_sims.drawArrow(sketch, 0, 0, bx, by, "#f59e0b", 3); // B

        sketch.pop();

        let areaVal = aVal * bVal * sketch.sin(theta);
        p1_ch2_sims.drawPills(sketch, "Vector Area (Cross Product)", [
          `A: ${aVal.toFixed(0)}`,
          `B: ${bVal.toFixed(0)}`,
          `θ: ${theta}°`,
          `Area = A B sin(θ) = ${areaVal.toFixed(0)}`,
          `h = B sin(θ) = ${Math.abs(by).toFixed(1)}`,
        ]);
        break;
      }

      case "river_boat": {
        let riverWidth = 130;
        let riverTopY = 70;
        let riverBottomY = riverTopY + riverWidth;

        // banks
        sketch.noStroke();
        sketch.fill("#cbd5e1");
        sketch.rect(0, 0, sketch.width, riverTopY);
        sketch.rect(
          0,
          riverBottomY,
          sketch.width,
          sketch.height - riverBottomY,
        );

        sketch.fill("#bae6fd");
        sketch.rect(0, riverTopY, sketch.width, riverWidth);

        let curU = sketch.u !== undefined ? sketch.u : 3.0;
        let curV = sketch.v !== undefined ? sketch.v : 6.0;
        let curAlpha = sketch.alpha !== undefined ? sketch.alpha : 90;

        if (sketch.mode === 1) {
          sketch.alpha = 90;
          curAlpha = 90;
        } else if (sketch.mode === 2) {
          if (curV > curU) {
            let targetAng = 180 - sketch.acos(curU / curV);
            sketch.alpha = Math.round(targetAng);
            curAlpha = sketch.alpha;
          } else {
            sketch.alpha = 180;
            curAlpha = 180;
          }
        }

        // River particles
        sketch.fill("#38bdf8");
        for (let i = 0; i < 8; i++) {
          let flowX = (sketch.frameCount * curU * 0.5 + i * 80) % sketch.width;
          let flowY = riverTopY + 15 + i * 15;
          sketch.circle(flowX, flowY, 4);
        }

        let originX = 50;
        let originY = riverBottomY;

        // Steering indicator
        sketch.stroke("#f59e0b");
        sketch.strokeWeight(1.5);
        sketch.drawingContext.setLineDash([3, 3]);
        let indicatorX = originX + 40 * sketch.cos(curAlpha);
        let indicatorY = originY - 40 * sketch.sin(curAlpha);
        sketch.line(originX, originY, indicatorX, indicatorY);
        sketch.drawingContext.setLineDash([]);
        sketch.fill("#f59e0b");
        sketch.noStroke();
        sketch.circle(indicatorX, indicatorY, 6);

        // Update Position
        if (sketch.animating) {
          let dt = 0.3;
          let vx = curV * sketch.cos(curAlpha) + curU;
          let vy = -curV * sketch.sin(curAlpha);

          sketch.boatX += vx * dt;
          sketch.boatY += vy * dt;
          sketch.crossingTime += dt * 0.1;
          sketch.drift = sketch.boatX - 50;

          sketch.pathHistory.push({ x: sketch.boatX, y: sketch.boatY });

          if (sketch.boatY <= riverTopY) {
            sketch.boatY = riverTopY;
            sketch.animating = false;
          }
        }

        // Draw Path
        sketch.stroke("#4f46e5");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.beginShape();
        for (let pt of sketch.pathHistory) {
          sketch.vertex(pt.x, pt.y);
        }
        sketch.endShape();

        // Draw Boat
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.push();
        sketch.translate(sketch.boatX, sketch.boatY);
        let heading = sketch.animating
          ? sketch.atan2(
              -curV * sketch.sin(curAlpha),
              curV * sketch.cos(curAlpha) + curU,
            )
          : -curAlpha;
        sketch.rotate(heading);
        sketch.triangle(12, 0, -8, -5, -8, 5);
        sketch.pop();

        sketch.fill("#10b981");
        sketch.circle(50, riverBottomY, 8);
        sketch.fill("#6366f1");
        sketch.circle(50, riverTopY, 8);

        let calculatedTime = riverWidth / (curV * sketch.sin(curAlpha));
        let calculatedDrift =
          (curV * sketch.cos(curAlpha) + curU) * calculatedTime;

        p1_ch2_sims.drawPills(sketch, "River crossing simulator", [
          `u: ${curU.toFixed(1)} m/s`,
          `v: ${curV.toFixed(1)} m/s`,
          `α: ${curAlpha}°`,
          `t = d/(v sinα) = ${calculatedTime.toFixed(1)}s`,
          `Drift = ${calculatedDrift.toFixed(0)}m`,
        ]);
        break;
      }

      case "rain_umbrella": {
        let curVm = sketch.v_m !== undefined ? sketch.v_m : 5.0;
        let curVr = sketch.v_r !== undefined ? sketch.v_r : 8.0;
        let curTheta = sketch.theta !== undefined ? sketch.theta : 0;

        // Theoretical optimal angle: θ_rel = arctan(v_m / v_r)
        let relTheta = sketch.atan(curVm / curVr);
        let frameMode = sketch.viewFrame !== undefined ? sketch.viewFrame : 0; // 0=Ground, 1=Man's

        // draw background (scenic green meadow and sky)
        sketch.fill("#bae6fd"); // Light blue sky
        sketch.noStroke();
        sketch.rect(0, 0, sketch.width, sketch.height - 40);

        sketch.fill("#10b981"); // Green grass ground
        sketch.rect(0, sketch.height - 40, sketch.width, 40);

        // Draw simple moving dashed pattern on grass to represent forward movement in relative frame
        if (frameMode === 1) {
          sketch.stroke("#059669");
          sketch.strokeWeight(2);
          sketch.grassOffset = ((sketch.grassOffset || 0) - curVm * 0.4) % 60;
          for (let gx = sketch.grassOffset; gx < sketch.width; gx += 60) {
            sketch.line(gx, sketch.height - 20, gx + 15, sketch.height - 20);
          }
        }

        // Stickman position update
        if (frameMode === 0) {
          sketch.manX += curVm * 0.25;
          if (sketch.manX > sketch.width + 50) sketch.manX = -50;
        } else {
          sketch.manX = sketch.width / 2; // Fixed centered position in relative frame
        }

        // Draw raindrops falling
        sketch.stroke("rgba(14, 165, 233, 0.7)");
        sketch.strokeWeight(1.5);
        for (let drop of sketch.rainDrops) {
          if (frameMode === 0) {
            // Ground Frame: vertical rain
            sketch.line(drop.x, drop.y, drop.x, drop.y + 12);
            drop.y += drop.speed * 0.9;

            // Wrap raindrops
            if (drop.y > sketch.height - 40) {
              drop.y = -20;
              drop.x = sketch.random(sketch.width);
            }
          } else {
            // Relative Frame: slanted rain (slants leftwards because man moves right)
            let dx = -(curVm / curVr) * 12;
            sketch.line(drop.x, drop.y, drop.x + dx, drop.y + 12);

            drop.y += drop.speed * 0.9;
            drop.x -= curVm * 0.4; // Rain drifts leftwards relative to the man

            // Wrap raindrops
            if (drop.y > sketch.height - 40) {
              drop.y = -20;
              drop.x = sketch.random(sketch.width + 100);
            }
            if (drop.x < -30) {
              drop.x = sketch.width + 30;
              drop.y = sketch.random(sketch.height - 80);
            }
          }
        }

        // Stickman rendering
        sketch.push();
        sketch.translate(sketch.manX, sketch.height - 75);

        // Protection check: if umbrella is tilted forward (clockwise) close to optimal angle
        let isProtected = Math.abs(curTheta - relTheta) <= 6;

        if (isProtected) {
          // Draw protective glowing shield arc
          sketch.noStroke();
          sketch.fill("rgba(16, 185, 129, 0.2)");
          sketch.circle(10, -22, 55);
          sketch.stroke("#10b981");
          sketch.strokeWeight(2.5);
          sketch.noFill();
          sketch.arc(10, -22, 55, 55, 180, 360);
        } else {
          // Draw rain droplets splashing on head
          if (sketch.frameCount % 5 < 2) {
            sketch.stroke("#0ea5e9");
            sketch.strokeWeight(1.5);
            sketch.line(0, -38, -5, -44);
            sketch.line(0, -38, 5, -44);
          }
        }

        // Stickman Body
        sketch.stroke(0);
        sketch.strokeWeight(3);
        sketch.line(0, 0, 0, -20); // Torso
        sketch.line(0, -20, -10, -5); // Arm left
        sketch.line(0, -20, 10, -10); // Arm right
        sketch.line(0, 0, -8, 15); // Leg left
        sketch.line(0, 0, 8, 15); // Leg right

        sketch.fill(0);
        sketch.noStroke();
        sketch.circle(0, -26, 12); // Head

        // Umbrella (attached to hand)
        sketch.push();
        sketch.translate(10, -10);
        sketch.rotate(curTheta); // Clockwise rotation for positive angles (forward tilt!)

        sketch.stroke("#475569");
        sketch.strokeWeight(3);
        sketch.line(0, 0, 0, -28); // handle shaft

        sketch.noStroke();
        sketch.fill("#ef4444"); // Red umbrella dome
        sketch.arc(0, -28, 44, 28, 180, 360);
        sketch.pop();

        sketch.pop();

        // Relative Vector space Panel
        sketch.push();
        sketch.translate(sketch.width - 70, 75);
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1.5);
        sketch.fill("rgba(15, 23, 42, 0.85)"); // Sci-fi dark panel
        sketch.rect(-45, -45, 90, 105, 6);

        // Vector v_r (pointing down, red)
        p1_ch2_sims.drawArrow(sketch, 0, -20, 0, 15, "#ef4444", 2);
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.textSize(9);
        sketch.text("v_r", 5, 0);

        // Vector -v_m (pointing left from bottom of v_r, orange)
        p1_ch2_sims.drawArrow(sketch, 0, 15, -curVm * 2.5, 15, "#f59e0b", 2);
        sketch.fill("#f59e0b");
        sketch.text("-v_m", -curVm * 1.5 - 12, 28);

        // Resultant v_rel (starts at tail of v_r and ends at head of -v_m, indigo)
        p1_ch2_sims.drawArrow(sketch, 0, -20, -curVm * 2.5, 15, "#818cf8", 2.5);
        sketch.fill("#818cf8");
        sketch.text("v_rel", -curVm * 1.5 - 15, -6);
        sketch.pop();

        // Use custom title with protection status and frame status
        let statusTitle = isProtected
          ? "Umbrella Aligned (Protected! ✅)"
          : "Getting Wet! (Adjust Umbrella ❌)";
        p1_ch2_sims.drawPills(sketch, statusTitle, [
          `Frame: ${frameMode === 0 ? "Ground" : "Man's (Rel)"}`,
          `v_m: ${curVm.toFixed(1)} m/s`,
          `v_r: ${curVr.toFixed(1)} m/s`,
          `Optimal Angle: ${relTheta.toFixed(1)}°`,
          `Umbrella Angle: ${curTheta.toFixed(0)}°`,
        ]);
        break;
      }
    }
  },

  drawGrid: (sketch) => {
    sketch.stroke("#e2e8f0");
    sketch.strokeWeight(1);
    for (let x = -sketch.width; x < sketch.width; x += 40) {
      sketch.line(x, -sketch.height, x, sketch.height);
    }
    for (let y = -sketch.height; y < sketch.height; y += 40) {
      sketch.line(-sketch.width, y, sketch.width, y);
    }
    sketch.stroke("#cbd5e1");
    sketch.strokeWeight(2);
    sketch.line(-sketch.width, 0, sketch.width, 0);
    sketch.line(0, -sketch.height, 0, sketch.height);
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
    sketch.triangle(0, 0, 10, 3.5, 10, -3.5);
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
