export const p1_ch5_sims = {
  setup: (sketch, vizType) => {
    sketch.angleMode(sketch.DEGREES);

    // Pump parameters
    sketch.depth = 100;
    sketch.pump_rate = 0.2;
    sketch.pumpInputPower = 250; 
    sketch.wellWaterY = 120;
    sketch.bucketWaterH = 0;
    sketch.gearAngle = 0;

    // Spring parameters
    sketch.k = 20;
    sketch.x = 50; // displacement in pixels

    // Roller coaster parameters
    sketch.h = 150;
    sketch.g_val = 9.8;
    sketch.friction = 0;
    sketch.carX = 40;
    sketch.carY = 100;
    sketch.carVel = 0;
    sketch.carPE = 0;
    sketch.carKE = 0;
    sketch.carThermal = 0;
    sketch.totalE = 0;
    sketch.coasterRunning = false;
    sketch.distTraveled = 0;

    sketch.startCoaster = () => {
      sketch.carX = 40;
      sketch.carVel = 0;
      sketch.carThermal = 0;
      sketch.distTraveled = 0;
      sketch.coasterRunning = true;
      sketch.totalE = 1 * (sketch.g_val || 9.8) * (sketch.h || 150);
    };

    sketch.resetCoaster = () => {
      sketch.carX = 40;
      sketch.carVel = 0;
      sketch.carThermal = 0;
      sketch.distTraveled = 0;
      sketch.coasterRunning = false;
    };
  },

  draw: (sketch, vizType) => {
    sketch.background("#f8fafc");
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "water_pump": {
        let dpt = sketch.depth !== undefined ? sketch.depth : 100; 
        let rate = sketch.pump_rate !== undefined ? sketch.pump_rate : 0.2; 
        
        let py = sketch.height / 2 + 50;

        // Draw Well Bricks
        sketch.stroke("#475569");
        sketch.strokeWeight(3);
        sketch.fill("#94a3b8");
        sketch.rect(sketch.width / 4 - 30, py - 110, 60, 130, 4);

        // Water inside the well
        sketch.noStroke();
        sketch.fill("rgba(14, 165, 233, 0.4)");
        sketch.rect(sketch.width / 4 - 28, py - 40, 56, 60);

        // Well Pipe going down
        sketch.stroke("#64748b");
        sketch.strokeWeight(5);
        sketch.line(sketch.width / 4, py - 100, sketch.width / 4, py + 10);

        // Pump Engine house
        sketch.stroke("#1e293b");
        sketch.strokeWeight(2);
        sketch.fill("#ef4444"); 
        sketch.rect(sketch.width / 4 - 20, py - 140, 40, 30, 4);

        // Rotating Gears inside engine
        sketch.push();
        sketch.translate(sketch.width / 4, py - 125);
        if (rate > 0) sketch.gearAngle += 4 * rate;
        sketch.rotate(sketch.gearAngle);
        sketch.stroke("#334155");
        sketch.strokeWeight(1.5);
        sketch.fill("#cbd5e1");
        sketch.circle(0, 0, 16);
        for (let a = 0; a < 360; a += 45) {
          sketch.line(0, 0, 10 * sketch.cos(a), 10 * sketch.sin(a));
        }
        sketch.pop();

        // Water discharging pipe to the right
        sketch.stroke("#64748b");
        sketch.strokeWeight(5);
        sketch.line(sketch.width / 4 + 10, py - 130, sketch.width / 2 + 30, py - 130);
        sketch.line(sketch.width / 2 + 30, py - 130, sketch.width / 2 + 30, py - 95);

        // Discharging water stream
        sketch.stroke("#38bdf8");
        sketch.strokeWeight(3);
        if (rate > 0.05) {
          let flowOffset = (sketch.frameCount * 3) % 25;
          sketch.line(sketch.width / 2 + 30, py - 95, sketch.width / 2 + 30, py - 70 + flowOffset * 0.5);
        }

        // Draw Bucket on right side
        sketch.stroke("#334155");
        sketch.strokeWeight(2);
        sketch.fill("#cbd5e1");
        sketch.rect(sketch.width / 2 + 15, py - 70, 30, 40, 2);

        // Fill bucket water
        sketch.noStroke();
        sketch.fill("#0ea5e9");
        if (rate > 0.05) {
          sketch.bucketWaterH = Math.min(36, sketch.bucketWaterH + 0.1);
        }
        sketch.rect(sketch.width / 2 + 16, py - 30 - sketch.bucketWaterH, 28, sketch.bucketWaterH);

        // Calculations & readout
        let g = 9.8;
        let massRate = rate * 20; 
        let P_out = massRate * g * (dpt / 5); 
        let efficiency = 0.72; 
        let P_in = P_out / efficiency;
        let HP = P_in / 746; 

        p1_ch5_sims.drawPills(sketch, "Water Pump Power & Efficiency", [
          `Depth h: ${dpt.toFixed(0)}m`,
          `Flow: ${massRate.toFixed(1)} kg/s`,
          `P_out = mgh/t = ${P_out.toFixed(1)} W`,
          `P_in: ${P_in.toFixed(1)} W (${HP.toFixed(2)} HP)`,
          `Efficiency η: ${(efficiency * 100).toFixed(0)}%`
        ]);
        break;
      }

      case "spring_energy_lab": {
        let curK = sketch.k !== undefined ? sketch.k : 20;
        let curX = sketch.x !== undefined ? sketch.x : 50; 

        let startX = 60;
        let equilX = 180;
        let blockX = equilX + curX;
        let springY = 80;

        // Draw rigid left wall
        sketch.stroke("#475569");
        sketch.strokeWeight(4);
        sketch.line(startX, springY - 30, startX, springY + 30);
        sketch.strokeWeight(1);
        for (let i = -25; i <= 25; i += 8) {
          sketch.line(startX, springY + i, startX - 8, springY + i - 4);
        }

        // Draw equilibrium dashed line
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1.5);
        sketch.drawingContext.setLineDash([4, 4]);
        sketch.line(equilX, springY - 40, equilX, springY + 40);
        sketch.drawingContext.setLineDash([]);
        sketch.fill("#94a3b8");
        sketch.noStroke();
        sketch.textSize(9);
        sketch.text("Equilibrium x=0", equilX - 35, springY - 45);

        // Draw Spring Zig-Zag coils
        sketch.stroke("#475569");
        sketch.strokeWeight(2.5);
        sketch.noFill();
        sketch.beginShape();
        sketch.vertex(startX, springY);
        let numCoils = 14;
        let currentSpringW = blockX - startX - 10;
        for (let i = 0; i <= numCoils; i++) {
          let cx = startX + (currentSpringW / numCoils) * i;
          let cy = springY + (i % 2 === 0 ? -12 : 12);
          if (i === 0 || i === numCoils) cy = springY;
          sketch.vertex(cx, cy);
        }
        sketch.endShape();

        // Draw Mass Block
        sketch.fill("#f59e0b");
        sketch.stroke("#d97706");
        sketch.strokeWeight(2);
        sketch.rect(blockX - 12, springY - 12, 24, 24, 4);

        // Draw Forces Vectors
        let forceScale = 0.8;
        if (curX > 5) {
          p1_ch5_sims.drawArrow(sketch, blockX, springY, blockX - curX * forceScale, springY, "#ef4444", 2); 
          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.text("F_s = -kx", blockX - curX*forceScale/2 - 20, springY - 18);
        } else if (curX < -5) {
          p1_ch5_sims.drawArrow(sketch, blockX, springY, blockX - curX * forceScale, springY, "#ef4444", 2); 
          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.text("F_s = -kx", blockX - curX*forceScale/2 - 10, springY - 18);
        }

        // Draw Force vs Displacement Real-Time plot below
        let graphX = 80;
        let graphY = 265;
        let graphW = 160;
        let graphH = 80;

        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1);
        sketch.fill("rgba(255, 255, 255, 0.9)");
        sketch.rect(graphX - 15, graphY - graphH - 10, graphW + 30, graphH + 25, 4);

        // axes
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1.5);
        sketch.line(graphX - 10, graphY, graphX + graphW + 10, graphY); 
        sketch.line(graphX + graphW/2, graphY - graphH, graphX + graphW/2, graphY + 10); 

        sketch.fill("#94a3b8");
        sketch.noStroke();
        sketch.textSize(9);
        sketch.text("x", graphX + graphW, graphY + 12);
        sketch.text("F", graphX + graphW/2 - 14, graphY - graphH + 5);

        // Plot F = kx line
        sketch.stroke("#334155");
        sketch.strokeWeight(1.5);
        let slope = (curK / 50) * 0.8; 
        sketch.line(graphX, graphY - (-graphW/2 * slope), graphX + graphW, graphY - (graphW/2 * slope));

        // Shade integration area (work done)
        let activeX = (curX / 100) * (graphW / 2);
        let activeF = activeX * slope;

        sketch.fill("rgba(79, 70, 229, 0.2)");
        sketch.noStroke();
        sketch.beginShape();
        sketch.vertex(graphX + graphW/2, graphY);
        sketch.vertex(graphX + graphW/2 + activeX, graphY);
        sketch.vertex(graphX + graphW/2 + activeX, graphY - activeF);
        sketch.endShape(sketch.CLOSE);

        sketch.stroke("#4f46e5");
        sketch.strokeWeight(1);
        sketch.line(graphX + graphW/2 + activeX, graphY, graphX + graphW/2 + activeX, graphY - activeF);
        sketch.fill("#4f46e5");
        sketch.circle(graphX + graphW/2 + activeX, graphY - activeF, 5);

        let energyJ = 0.5 * curK * Math.pow(curX / 50, 2); 

        p1_ch5_sims.drawPills(sketch, "Hooke's Law & Elastic Work Integrator", [
          `k: ${curK.toFixed(0)} N/m`,
          `displacement x: ${(curX/50).toFixed(2)} m`,
          `F_s = -kx = ${(-curK * (curX/50)).toFixed(1)} N`,
          `W = ½ k x² = ${energyJ.toFixed(2)} J`
        ]);
        break;
      }

      case "energy_conservation_coaster": {
        let initH = sketch.h !== undefined ? sketch.h : 150;
        let g = sketch.g_val !== undefined ? sketch.g_val : 9.8;
        let fric = sketch.friction !== undefined ? sketch.friction : 0;

        let trackY = (x) => {
          let baseHeight = sketch.height / 2 + 20;
          let amp1 = initH * 0.55;
          return baseHeight - amp1 * sketch.cos((x / sketch.width) * 360);
        };

        // Draw track outline
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(4);
        sketch.noFill();
        sketch.beginShape();
        for (let x = 40; x < sketch.width - 40; x += 5) {
          sketch.vertex(x, trackY(x));
        }
        sketch.endShape();

        // Physics evolution
        if (sketch.coasterRunning) {
          sketch.distTraveled += Math.abs(sketch.carVel) * 0.1;
          let curHeight = (sketch.height / 2 + 100) - trackY(sketch.carX); 
          sketch.carPE = 1.0 * g * curHeight * 0.3; 
          
          sketch.carThermal = sketch.distTraveled * fric * 25.0;
          sketch.carKE = Math.max(0, sketch.totalE - sketch.carPE - sketch.carThermal);

          sketch.carVel = (sketch.carVel > 0 ? 1 : -1) * sketch.sqrt(2 * sketch.carKE);
          
          let slopeAngle = (trackY(sketch.carX + 1) - trackY(sketch.carX - 1));
          sketch.carVel -= slopeAngle * g * 0.15; 

          sketch.carX += sketch.carVel * 0.12;

          if (sketch.carX <= 40) {
            sketch.carX = 40;
            sketch.carVel = -sketch.carVel * 0.8; 
          }
          if (sketch.carX >= sketch.width - 40) {
            sketch.carX = sketch.width - 40;
            sketch.carVel = -sketch.carVel * 0.8;
          }
        } else {
          let curHeight = (sketch.height / 2 + 100) - trackY(sketch.carX);
          sketch.carPE = 1.0 * g * curHeight * 0.3;
          sketch.carKE = 0;
          sketch.carThermal = 0;
        }

        // Draw coaster car
        let cx = sketch.carX;
        let cy = trackY(cx);
        sketch.fill("#ef4444");
        sketch.stroke("#b91c1c");
        sketch.strokeWeight(1.5);
        sketch.circle(cx, cy - 6, 12); 

        // Draw Dynamic Energy Stacked Bar Chart on top-right
        let barX = sketch.width - 130;
        let barY = 45;
        let barW = 16;
        let barMaxH = 80;

        let totalBarE = sketch.carPE + sketch.carKE + sketch.carThermal;
        if (totalBarE === 0) totalBarE = 1;

        let pe_h = (sketch.carPE / totalBarE) * barMaxH;
        let ke_h = (sketch.carKE / totalBarE) * barMaxH;
        let th_h = (sketch.carThermal / totalBarE) * barMaxH;

        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1);
        sketch.fill(255);
        sketch.rect(barX - 10, barY - 10, barW + 70, barMaxH + 20, 4);

        sketch.noStroke();
        // Potential (Green)
        sketch.fill("#10b981");
        sketch.rect(barX, barY + barMaxH - pe_h, barW, pe_h);
        // Kinetic (Blue)
        sketch.fill("#0ea5e9");
        sketch.rect(barX, barY + barMaxH - pe_h - ke_h, barW, ke_h);
        // Thermal (Friction loss - Red)
        sketch.fill("#ef4444");
        sketch.rect(barX, barY + barMaxH - pe_h - ke_h - th_h, barW, th_h);

        // Labels beside bar
        sketch.textSize(8);
        sketch.fill("#10b981");
        sketch.text(`PE: ${sketch.carPE.toFixed(0)}J`, barX + 22, barY + barMaxH - pe_h/2 + 3);
        sketch.fill("#0ea5e9");
        sketch.text(`KE: ${sketch.carKE.toFixed(0)}J`, barX + 22, barY + barMaxH - pe_h - ke_h/2 + 3);
        if (th_h > 2) {
          sketch.fill("#ef4444");
          sketch.text(`Loss: ${sketch.carThermal.toFixed(0)}J`, barX + 22, barY + 12);
        }

        p1_ch5_sims.drawPills(sketch, "Mechanical Energy Conservation Coaster", [
          `h_release: ${initH.toFixed(0)}m`,
          `friction: ${fric.toFixed(3)}`,
          `E_total: ${sketch.totalE.toFixed(0)} J`,
          `PE: ${sketch.carPE.toFixed(1)} J | KE: ${sketch.carKE.toFixed(1)} J | Loss: ${sketch.carThermal.toFixed(1)} J`
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
