export const p1_ch10_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "gas_law_interactive") {
      sketch.temp = 300;
      sketch.volume = 120;
      sketch.gas_mode = 0; // 0=Free, 1=Boyle, 2=Charles
      
      sketch.initGasParticles = () => {
        sketch.gasParticles = [];
        for (let i = 0; i < 40; i++) {
          sketch.gasParticles.push({
            x: sketch.random(40, 140),
            y: sketch.random(60, 145),
            vx: sketch.random(-1, 1),
            vy: sketch.random(-1, 1)
          });
          let len = Math.sqrt(sketch.gasParticles[i].vx * sketch.gasParticles[i].vx + sketch.gasParticles[i].vy * sketch.gasParticles[i].vy);
          if (len > 0) {
            sketch.gasParticles[i].vx /= len;
            sketch.gasParticles[i].vy /= len;
          }
        }
      };
      
      sketch.initGasParticles();
      
      sketch.resetGas = () => {
        sketch.temp = 300;
        sketch.volume = 120;
        sketch.gas_mode = 0;
        sketch.initGasParticles();
      };
    }

    if (vizType === "brownian_motion") {
      sketch.bigX = 200;
      sketch.bigY = 200;
      sketch.bigVX = 0;
      sketch.bigVY = 0;
      sketch.trace = [];
      sketch.gasSpeed = 25;
      sketch.particles = [];
      for (let i = 0; i < 120; i++) {
        sketch.particles.push({
          x: sketch.random(sketch.width),
          y: sketch.random(sketch.height),
          vx: sketch.random(-1, 1),
          vy: sketch.random(-1, 1),
        });
      }
    }
    if (vizType === "degrees_of_freedom") {
      sketch.molType = 0;
      sketch.rot = 0;
      sketch.pos = { x: 0, y: 0, z: 0 };
    }
  },

  draw: (sketch, vizType) => {
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "gas_law_interactive": {
        sketch.background("#f8fafc");

        let curT = sketch.temp !== undefined ? sketch.temp : 300;
        let curV = sketch.volume !== undefined ? sketch.volume : 120;
        let curMode = sketch.gas_mode !== undefined ? sketch.gas_mode : 0; // 0=Free, 1=Boyle, 2=Charles

        // Thermodynamic constraint updates
        if (curMode === 1) {
          // Boyle's Law: Constant Temp. Lock temperature to its default (300 K) or its current user value.
          if (sketch.temp !== 300) {
            sketch.temp = 300;
            curT = 300;
          }
        } else if (curMode === 2) {
          // Charles's Law: Constant Pressure. Volume is directly proportional to Temperature.
          // V = T * (120/300) = T * 0.4.
          let idealV = Math.round(curT * 0.4);
          if (sketch.volume !== idealV) {
            sketch.volume = idealV;
            curV = idealV;
          }
        }

        // Pressure calculation: P = T/300 * 120/V atm
        let press = (curT / 300) * (120 / curV);

        p1_ch10_sims.drawGrid(sketch);

        // --- Visual 1: Gas Cylinder Chamber ---
        let leftWall = 35;
        let rightWall = leftWall + curV;
        let topWall = 60;
        let bottomWall = 160;

        // Draw heat source (flame or ice) under cylinder
        if (curT > 300) {
          // Flame effect
          sketch.push();
          sketch.noStroke();
          let flameIntensity = sketch.map(curT, 300, 600, 10, 45);
          for (let i = 0; i < 5; i++) {
            let fx = leftWall + (curV / 5) * i + (curV / 10);
            sketch.fill(239, 68, 68, flameIntensity + sketch.random(15));
            sketch.triangle(fx - 15, bottomWall + 20, fx + 15, bottomWall + 20, fx, bottomWall + 2 + sketch.random(-6, 2));
            sketch.fill(245, 158, 11, flameIntensity + sketch.random(25));
            sketch.triangle(fx - 10, bottomWall + 20, fx + 10, bottomWall + 20, fx, bottomWall + 6 + sketch.random(-4, 2));
          }
          sketch.pop();
        } else if (curT < 300) {
          // Ice effect (blue block)
          sketch.push();
          sketch.noStroke();
          let iceOpacity = sketch.map(curT, 100, 300, 150, 0);
          sketch.fill(186, 230, 253, iceOpacity);
          sketch.rect(leftWall, bottomWall + 2, curV, 15, 3);
          sketch.stroke(56, 189, 248, iceOpacity);
          sketch.strokeWeight(1);
          sketch.line(leftWall, bottomWall + 10, leftWall + curV, bottomWall + 10);
          sketch.pop();
        }

        // Chamber interior background shadow
        sketch.fill("#f1f5f9");
        sketch.noStroke();
        sketch.rect(leftWall, topWall, curV, bottomWall - topWall);

        // Particle dynamics
        let speedMult = Math.sqrt(curT) * 0.16; // Velocity scales with sqrt(T)
        sketch.noStroke();
        sketch.fill("#3b82f6"); // Bright Blue gas molecules

        if (sketch.gasParticles) {
          for (let p of sketch.gasParticles) {
            p.x += p.vx * speedMult;
            p.y += p.vy * speedMult;

            // Boundaries bounces
            if (p.x < leftWall + 4) {
              p.x = leftWall + 4;
              p.vx *= -1;
            }
            if (p.x > rightWall - 4) {
              p.x = rightWall - 4;
              p.vx *= -1;
            }
            if (p.y < topWall + 4) {
              p.y = topWall + 4;
              p.vy *= -1;
            }
            if (p.y > bottomWall - 4) {
              p.y = bottomWall - 4;
              p.vy *= -1;
            }

            // Draw molecule
            sketch.circle(p.x, p.y, 6);
          }
        }

        // Draw Cylinder thick iron walls
        sketch.stroke("#475569");
        sketch.strokeWeight(5);
        sketch.noFill();
        sketch.line(leftWall - 2, topWall - 2, leftWall + 210, topWall - 2); // Top track
        sketch.line(leftWall - 2, bottomWall + 2, leftWall + 210, bottomWall + 2); // Bottom track
        sketch.line(leftWall - 2, topWall - 2, leftWall - 2, bottomWall + 2); // Left end wall

        // Draw sliding Piston head & rod
        sketch.fill("#64748b");
        sketch.stroke("#334155");
        sketch.strokeWeight(2);
        sketch.rect(rightWall - 6, topWall + 1, 10, bottomWall - topWall - 2, 2); // Piston head
        sketch.strokeWeight(4);
        sketch.stroke("#475569");
        sketch.line(rightWall + 4, (topWall + bottomWall)/2, leftWall + 225, (topWall + bottomWall)/2); // Piston rod

        // --- Visual 2: P-V Diagram coordinate plot ---
        let gx = sketch.width - 150;
        let gy = 150;
        let gw = 120;
        let gh = 85;

        // Graph bounding box
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1);
        sketch.fill(255);
        sketch.rect(gx - 10, gy - gh - 15, gw + 20, gh + 28, 6);

        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1);
        sketch.line(gx, gy, gx + gw, gy); // V Axis
        sketch.line(gx, gy, gx, gy - gh); // P Axis

        sketch.noStroke();
        sketch.fill("#475569");
        sketch.textSize(8);
        sketch.text("Volume (V)", gx + gw - 40, gy + 10);
        sketch.text("Pressure (P)", gx - 8, gy - gh - 4);

        // Coordinate scaling: X maps V [0, 220], Y maps P [0, 3 atm]
        let mapV = (vVal) => gx + (vVal / 220) * gw;
        let mapP = (pVal) => gy - (pVal / 3.0) * gh;

        // Draw Boyle's Isotherm comparison curve
        sketch.push();
        sketch.drawingContext.setLineDash([2, 2]);
        sketch.stroke("rgba(245, 158, 11, 0.4)");
        sketch.strokeWeight(1.2);
        sketch.noFill();
        sketch.beginShape();
        for (let v = 50; v <= 200; v += 5) {
          let pBoyle = (curT / 300) * (120 / v);
          sketch.vertex(mapV(v), mapP(pBoyle));
        }
        sketch.endShape();
        sketch.pop();

        // Draw active state point
        let ptX = mapV(curV);
        let ptY = mapP(press);
        sketch.fill("#ef4444");
        sketch.noStroke();
        sketch.circle(ptX, ptY, 6);
        
        // Dynamic coordinate tooltip on graph
        sketch.fill("#1e293b");
        sketch.textSize(8);
        sketch.text(`(${press.toFixed(2)} atm, ${curV}L)`, ptX - 10, ptY - 8);

        // Interactive title & metric pills
        let constraintTitle = curMode === 0 ? "Ideal Gas Chamber (Free Mode)" : curMode === 1 ? "Boyle's Law Rig (Constant T)" : "Charles's Law Rig (Constant P)";
        p1_ch10_sims.drawPills(sketch, constraintTitle, [
          `P: ${press.toFixed(2)} atm`,
          `V: ${curV} L`,
          `T: ${curT} K`,
          `PV/T: ${((press * curV) / curT).toFixed(3)}`
        ]);
        break;
      }

      case "brownian_motion":
        sketch.background("#f8fafc");
        let speedMult = (sketch.gasSpeed || 100) / 10;

        sketch.noFill();
        sketch.stroke(239, 68, 68, 120);
        sketch.strokeWeight(2);
        sketch.beginShape();
        for (let p of sketch.trace) sketch.vertex(p.x, p.y);
        sketch.endShape();

        sketch.noStroke();
        sketch.fill(239, 68, 68, 50);
        sketch.circle(sketch.bigX, sketch.bigY, 38);
        sketch.fill("#ef4444");
        sketch.circle(sketch.bigX, sketch.bigY, 30);

        sketch.fill("#3b82f6");
        for (let p of sketch.particles) {
          p.x += p.vx * speedMult;
          p.y += p.vy * speedMult;
          if (p.x < 0 || p.x > sketch.width) p.vx *= -1;
          if (p.y < 0 || p.y > sketch.height) p.vy *= -1;

          let d = sketch.dist(p.x, p.y, sketch.bigX, sketch.bigY);
          if (d < 15 + 3) {
            sketch.bigVX += p.vx * 0.6 * speedMult;
            sketch.bigVY += p.vy * 0.6 * speedMult;
            p.vx *= -1;
            p.vy *= -1;
          }
          sketch.circle(p.x, p.y, 6);
        }

        sketch.bigX += sketch.bigVX;
        sketch.bigY += sketch.bigVY;
        sketch.bigVX *= 0.94;
        sketch.bigVY *= 0.94;

        if (sketch.frameCount % 4 === 0) {
          sketch.trace.push({ x: sketch.bigX, y: sketch.bigY });
          if (sketch.trace.length > 120) sketch.trace.shift();
        }

        sketch.bigX = sketch.constrain(sketch.bigX, 20, sketch.width - 20);
        sketch.bigY = sketch.constrain(sketch.bigY, 20, sketch.height - 20);
        
        p1_ch10_sims.drawPills(sketch, "Brownian Motion & Elastic Collisions", [
          `Gas Speed (T): ${sketch.gasSpeed.toFixed(0)}`,
          `Molecules: 120`,
          `X_pos: ${sketch.bigX.toFixed(0)}`,
          `Y_pos: ${sketch.bigY.toFixed(0)}`
        ]);
        break;

      case "degrees_of_freedom":
        sketch.background("#f8fafc");
        sketch.translate(sketch.width / 2, sketch.height / 2 - 20);

        sketch.strokeWeight(1.5);
        sketch.stroke("#818cf8");
        sketch.line(-120, 0, 120, 0);
        sketch.fill("#4f46e5");
        sketch.noStroke();
        sketch.text("X (Translation)", 125, 5);

        sketch.stroke("#34d399");
        sketch.line(0, -120, 0, 120);
        sketch.fill("#059669");
        sketch.noStroke();
        sketch.text("Y (Translation)", 5, -125);

        sketch.stroke("#fbbf24");
        sketch.line(-80, 80, 80, -80);
        sketch.fill("#d97706");
        sketch.noStroke();
        sketch.text("Z (Translation)", 85, -85);

        let type = sketch.molType || 0;
        sketch.rot += 0.04;

        sketch.push();
        let tx = sketch.sin(sketch.frameCount * 0.08) * 15;
        let ty = sketch.cos(sketch.frameCount * 0.07) * 10;
        sketch.translate(tx, ty);

        if (type === 0) {
          sketch.noStroke();
          sketch.fill(239, 68, 68, 50);
          sketch.circle(0, 0, 40);
          sketch.fill("#ef4444");
          sketch.circle(0, 0, 30);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Monoatomic (e.g. He, Ne): f = 3", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 0 | Vibration: 0", 0, 18);
        } else if (type === 1) {
          sketch.rotate(sketch.rot);
          sketch.stroke("#94a3b8");
          sketch.strokeWeight(6);
          sketch.line(-35, 0, 35, 0);
          sketch.noStroke();
          sketch.fill("#ef4444");
          sketch.circle(-35, 0, 24);
          sketch.fill("#ef4444");
          sketch.circle(35, 0, 24);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Diatomic (e.g. O₂, N₂): f = 5", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 2 | Vibration: 0", 0, 18);
        } else if (type === 2) {
          sketch.rotate(sketch.rot);
          sketch.stroke("#94a3b8");
          sketch.strokeWeight(6);
          sketch.line(-55, 0, 55, 0);
          sketch.noStroke();
          sketch.fill("#1e293b");
          sketch.circle(0, 0, 28);
          sketch.fill("#ef4444");
          sketch.circle(-55, 0, 22);
          sketch.circle(55, 0, 22);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Linear Triatomic (CO₂): f = 5", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 2 | Vibration: 0", 0, 18);
        } else {
          sketch.rotate(sketch.rot);
          sketch.stroke("#94a3b8");
          sketch.strokeWeight(5);
          sketch.line(0, 0, -35, 35);
          sketch.line(0, 0, 35, 35);
          sketch.noStroke();
          sketch.fill("#3b82f6");
          sketch.circle(0, 0, 28);
          sketch.fill("#ef4444");
          sketch.circle(-35, 35, 18);
          sketch.circle(35, 35, 18);

          sketch.resetMatrix();
          sketch.translate(20, sketch.height - 40);
          sketch.fill(0);
          sketch.textSize(14);
          sketch.text("Bent Triatomic (H₂O): f = 6", 0, 0);
          sketch.textSize(11);
          sketch.fill(100);
          sketch.text("Translation: 3 | Rotation: 3 | Vibration: 0", 0, 18);
        }
        sketch.pop();
        break;
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
    sketch.text(title, 15 + (tw + 20)/2, 12 + 11);
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
  }
};
