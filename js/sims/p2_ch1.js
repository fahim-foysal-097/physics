export const p2_ch1_sims = {
  setup: (sketch, vizType) => {
    sketch.textFont("Inter, system-ui, sans-serif");
    
    if (vizType === "carnot_cycle") {
      sketch.phase = 0;
      sketch.progress = 0;
      sketch.speed = 0.008;
      sketch.running = true;
      sketch.TH = 500;
      sketch.TC = 300;
      sketch.gamma = 1.4;

      sketch.toggleRun = () => {
        sketch.running = !sketch.running;
      };

      // Precise cycle points for closing the loop
      // A: (V1, P1), B: (V2, P2), C: (V3, P3), D: (V4, P4)
      const V1 = 70, P1 = 150;
      const V2 = 170, P2 = P1 * (V1 / V2); // Isothermal Exp
      const V3 = 280, P3 = P2 * Math.pow(V2 / V3, 1.4); // Adiabatic Exp
      // To close properly: V2/V1 = V3/V4 => V4 = V1 * (V3/V2)
      const V4_calc = V1 * (V3 / V2);
      const P4_calc = P3 * (V3 / V4_calc); // Isothermal Comp at TC
      
      sketch.cyclePoints = [
        { v: V1, p: P1, t: "H" }, // A
        { v: V2, p: P2, t: "H" }, // B
        { v: V3, p: P3, t: "C" }, // C
        { v: V4_calc, p: P4_calc, t: "C" } // D
      ];
    }
    if (vizType === "process_comparison") {
      sketch.V = 100;
      sketch.gamma = 1.4;
    }
    if (vizType === "pv_diagram") {
      sketch.mx = 150;
      sketch.my = 150;
    }
    if (vizType === "heating_curve") {
      sketch.heat = 0;
      sketch.maxHeat = 800;
      sketch.particles = [];
      for (let i = 0; i < 40; i++) {
        sketch.particles.push({
          x: sketch.random(20, 180),
          y: sketch.random(20, 100),
          vx: sketch.random(-1, 1),
          vy: sketch.random(-1, 1),
        });
      }
    }
  },

  draw: (sketch, vizType) => {
    sketch.background("#ffffff");
    const primaryColor = "#4f46e5";
    const accentColor = "#0d9488";
    const hotColor = "#ef4444";
    const coldColor = "#3b82f6";
    const textColor = "#1e293b";
    const gridColor = "#f1f5f9";

    const drawAxes = (w, h, xLabel = "V", yLabel = "P") => {
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1);
      // Grid
      for(let i=0; i<=w; i+=40) sketch.line(i, 0, i, h);
      for(let i=0; i<=h; i+=40) sketch.line(0, i, w, i);
      
      sketch.stroke(textColor);
      sketch.strokeWeight(2);
      sketch.line(0, 0, 0, h);
      sketch.line(0, h, w, h);
      
      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textSize(12);
      sketch.text(yLabel, -20, 10);
      sketch.text(xLabel, w + 10, h + 5);
    };

    if (vizType === "carnot_cycle") {
      sketch.translate(50, 40);
      let w = sketch.width - 100;
      let h = sketch.height - 200;

      drawAxes(w, h);

      // Animation Logic
      if (sketch.running) {
        sketch.progress += sketch.speed;
        if (sketch.progress >= 1) {
          sketch.progress = 0;
          sketch.phase = (sketch.phase + 1) % 4;
        }
      }

      // Draw Work Area inside the cycle
      sketch.fill(primaryColor + "15");
      sketch.noStroke();
      sketch.beginShape();
      for (let i = 0; i < 4; i++) {
        let start = sketch.cyclePoints[i];
        let end = sketch.cyclePoints[(i + 1) % 4];
        for (let t = 0; t <= 1; t += 0.02) {
          let v = sketch.lerp(start.v, end.v, t);
          let p = (i === 0 || i === 2) ? start.p * (start.v / v) : start.p * Math.pow(start.v / v, 1.4);
          sketch.vertex(v, h - p);
        }
      }
      sketch.endShape(sketch.CLOSE);

      // Draw Cycle Path (High Resolution & Perfect Connection)
      sketch.noFill();
      for (let i = 0; i < 4; i++) {
        let start = sketch.cyclePoints[i];
        let end = sketch.cyclePoints[(i + 1) % 4];
        
        if (i === sketch.phase) {
          sketch.drawingContext.shadowBlur = 12;
          sketch.drawingContext.shadowColor = i % 2 === 0 ? hotColor : coldColor;
          sketch.strokeWeight(3.5);
        } else {
          sketch.drawingContext.shadowBlur = 0;
          sketch.strokeWeight(2);
        }

        sketch.stroke(i % 2 === 0 ? hotColor : coldColor);
        sketch.beginShape();
        for (let t = 0; t <= 1; t += 0.01) {
          let v = sketch.lerp(start.v, end.v, t);
          let p = (i === 0 || i === 2) ? start.p * (start.v / v) : start.p * Math.pow(start.v / v, 1.4);
          sketch.vertex(v, h - p);
        }
        sketch.vertex(end.v, h - end.p); // Guarantee perfect closure
        sketch.endShape();
      }
      sketch.drawingContext.shadowBlur = 0;

      // Draw State Points A, B, C, D
      const stateLabels = ["A", "B", "C", "D"];
      for (let i = 0; i < 4; i++) {
        let pt = sketch.cyclePoints[i];
        sketch.fill(textColor);
        sketch.noStroke();
        sketch.circle(pt.v, h - pt.p, 6);
        sketch.textSize(12);
        sketch.text(stateLabels[i], pt.v + 8, h - pt.p - 8);
      }

      // Current Point Tracking
      let p1 = sketch.cyclePoints[sketch.phase];
      let p2 = sketch.cyclePoints[(sketch.phase + 1) % 4];
      let curV = sketch.lerp(p1.v, p2.v, sketch.progress);
      let curP = (sketch.phase === 0 || sketch.phase === 2) 
        ? p1.p * (p1.v / curV) 
        : p1.p * Math.pow(p1.v / curV, 1.4);
      
      // Draw point and dashed lines to axes
      sketch.stroke(textColor + "55");
      sketch.strokeWeight(1);
      sketch.drawingContext.setLineDash([5, 5]);
      sketch.line(curV, h - curP, curV, h);
      sketch.line(curV, h - curP, 0, h - curP);
      sketch.drawingContext.setLineDash([]);
      
      sketch.fill(primaryColor);
      sketch.noStroke();
      sketch.circle(curV, h - curP, 12);

      // Premium Piston Visualization
      sketch.push();
      sketch.translate(w/2 - 60, h + 60);
      
      // Cylinder walls
      sketch.noFill();
      sketch.stroke("#cbd5e1"); // lighter gray
      sketch.strokeWeight(5);
      sketch.line(0, 0, 0, 90);
      sketch.line(0, 90, 120, 90);
      sketch.line(120, 90, 120, 0);

      // Heat Reservoir Indicator
      sketch.noStroke();
      if (sketch.phase === 0) {
        sketch.fill(hotColor);
        sketch.rect(0, 93, 120, 6, 3);
        sketch.textSize(10);
        sketch.text("Hot Reservoir", 25, 110);
      } else if (sketch.phase === 2) {
        sketch.fill(coldColor);
        sketch.rect(0, 93, 120, 6, 3);
        sketch.textSize(10);
        sketch.text("Cold Reservoir", 25, 110);
      } else {
        sketch.fill("#94a3b8");
        sketch.rect(0, 93, 120, 6, 3);
        sketch.textSize(10);
        sketch.text("Insulated", 35, 110);
      }

      // Gas Volume (Gradient/Alpha)
      let pistonPos = sketch.map(curV, 70, 280, 20, 80);
      let alpha = sketch.map(curV, 70, 280, 200, 50); // density effect
      let gCol = sketch.phase <= 1 ? sketch.color(239, 68, 68, alpha) : sketch.color(59, 130, 246, alpha);
      sketch.fill(gCol);
      sketch.rect(3, pistonPos, 114, 87 - pistonPos);
      
      // Piston Head & Rod
      sketch.fill("#64748b");
      sketch.rect(-5, pistonPos - 8, 130, 12, 4); // thick head
      sketch.fill("#94a3b8");
      sketch.rect(55, pistonPos - 40, 10, 32); // rod
      
      // Title/Labels
      sketch.fill(textColor);
      sketch.textAlign(sketch.LEFT);
      sketch.textSize(15);
      sketch.textStyle(sketch.BOLD);
      const labels = [
        "1. Isothermal Expansion (Q in)", 
        "2. Adiabatic Expansion", 
        "3. Isothermal Compression (Q out)", 
        "4. Adiabatic Compression"
      ];
      sketch.text(labels[sketch.phase], 150, 30);
      sketch.textStyle(sketch.NORMAL);
      sketch.textSize(13);
      sketch.fill("#64748b");
      sketch.text(`Pressure: ${curP.toFixed(1)} atm`, 150, 50);
      sketch.text(`Volume: ${curV.toFixed(1)} L`, 150, 70);
      sketch.pop();
    }

    if (vizType === "pv_diagram") {
      sketch.translate(50, 50);
      let w = sketch.width - 100;
      let h = sketch.height - 100;
      
      drawAxes(w, h);

      let mx = sketch.constrain(sketch.mouseX - 50, 20, w - 20);
      let my = sketch.constrain(sketch.mouseY - 50, 20, h - 20);
      let P = h - my;
      let V = mx;

      // Draw Smooth Isotherm
      sketch.noFill();
      sketch.stroke(hotColor);
      sketch.strokeWeight(2);
      sketch.beginShape();
      for(let x = 20; x <= w; x += 2) {
        let y = P * (V / x);
        if (h - y > 0 && h - y < h) sketch.vertex(x, h - y);
      }
      sketch.endShape();
      sketch.fill(hotColor);
      sketch.noStroke();
      sketch.text("Isotherm", w - 50, h - P*(V/w) - 10);

      // Draw Smooth Adiabat
      sketch.noFill();
      sketch.stroke(coldColor);
      sketch.strokeWeight(2);
      sketch.beginShape();
      for(let x = 20; x <= w; x += 2) {
        let y = P * Math.pow(V / x, 1.4);
        if (h - y > 0 && h - y < h) sketch.vertex(x, h - y);
      }
      sketch.endShape();
      sketch.fill(coldColor);
      sketch.noStroke();
      sketch.text("Adiabat", w - 60, h - P*Math.pow(V/w, 1.4) + 15);

      // Work Shading (Gradient-like effect using alpha)
      sketch.noStroke();
      sketch.fill(primaryColor + "1A"); // very transparent
      sketch.beginShape();
      sketch.vertex(20, h);
      for(let x = 20; x <= V; x += 2) {
        sketch.vertex(x, h - P);
      }
      sketch.vertex(V, h);
      sketch.endShape(sketch.CLOSE);

      // Dashed trackers
      sketch.stroke(textColor + "44");
      sketch.strokeWeight(1);
      sketch.drawingContext.setLineDash([4, 4]);
      sketch.line(V, h - P, V, h);
      sketch.line(V, h - P, 0, h - P);
      sketch.drawingContext.setLineDash([]);

      // Point Glow
      sketch.drawingContext.shadowBlur = 12;
      sketch.drawingContext.shadowColor = primaryColor;
      sketch.fill(primaryColor);
      sketch.noStroke();
      sketch.circle(V, h - P, 14);
      sketch.drawingContext.shadowBlur = 0;

      // Premium Floating Tooltip
      sketch.fill("#ffffffEE");
      sketch.stroke("#e2e8f0");
      sketch.rect(V + 15, h - P - 50, 110, 45, 8);
      sketch.fill(textColor);
      sketch.noStroke();
      sketch.textSize(12);
      sketch.textStyle(sketch.BOLD);
      sketch.text(`P: ${P.toFixed(1)} atm`, V + 25, h - P - 32);
      sketch.text(`V: ${V.toFixed(1)} L`, V + 25, h - P - 16);
      sketch.textStyle(sketch.NORMAL);
      
      sketch.textSize(11);
      sketch.fill("#64748b");
      sketch.text("Drag cursor to update", 10, h + 30);
    }

    if (vizType === "heating_curve") {
      sketch.translate(60, 40);
      let w = sketch.width - 120;
      let h = sketch.height - 220;

      drawAxes(w, h, "Time / Heat", "Temp (°C)");

      // Heating logic
      const getTemp = (heat) => {
        if (heat < 100) return sketch.map(heat, 0, 100, -20, 0);
        if (heat < 250) return 0;
        if (heat < 450) return sketch.map(heat, 250, 450, 0, 100);
        if (heat < 700) return 100;
        return sketch.map(heat, 700, 800, 100, 140);
      };

      // Draw smooth curve
      sketch.noFill();
      sketch.stroke(primaryColor);
      sketch.strokeWeight(3);
      sketch.beginShape();
      for (let x = 0; x <= sketch.heat; x += 1) {
        let temp = getTemp(x);
        let gx = x * (w / 800);
        let gy = sketch.map(temp, -20, 140, h, 20);
        sketch.vertex(gx, gy);
      }
      sketch.endShape();

      let curTemp = getTemp(sketch.heat);
      
      // Sandbox Visualization
      sketch.push();
      sketch.translate(w/2 - 100, h + 60);
      sketch.fill("#f8fafc");
      sketch.stroke("#e2e8f0");
      sketch.rect(0, 0, 200, 120, 12);
      
      let state = "Solid (Ice)";
      let pSpeed = 0.2;
      let pCol = "#94a3b8";

      if (curTemp >= 0 && curTemp < 100) {
        if (sketch.heat < 250) { state = "Melting"; pSpeed = 1.0; }
        else { state = "Liquid (Water)"; pSpeed = 2.5; pCol = "#3b82f6"; }
      } else if (curTemp >= 100) {
        if (sketch.heat < 700) { state = "Boiling"; pSpeed = 6.0; }
        else { state = "Gas (Steam)"; pSpeed = 12.0; pCol = "#f59e0b"; }
      }

      sketch.fill(textColor);
      sketch.textAlign(sketch.CENTER);
      sketch.textSize(14);
      sketch.textStyle(sketch.BOLD);
      sketch.text(state, 100, -15);
      sketch.textSize(12);
      sketch.fill("#64748b");
      sketch.text(`${curTemp.toFixed(1)} °C`, 100, 140);

      // Particles with different behaviors
      sketch.noStroke();
      for (let p of sketch.particles) {
        p.x += p.vx * pSpeed;
        p.y += p.vy * pSpeed;
        if (p.x < 10 || p.x > 190) p.vx *= -1;
        if (p.y < 10 || p.y > 110) p.vy *= -1;
        
        sketch.fill(pCol);
        sketch.circle(p.x, p.y, 6);
      }
      sketch.pop();

      if (sketch.heat < sketch.maxHeat) sketch.heat += 1.5;
      else sketch.heat = 0;
    }
    
    if (vizType === "process_comparison") {
      sketch.translate(60, 50);
      let w = sketch.width - 120;
      let h = sketch.height - 100;
      drawAxes(w, h);

      let startV = 70, startP = 150;
      let curV = sketch.map(sketch.mouseX, 0, sketch.width, 70, 280, true);

      // Isothermal (High Res)
      sketch.noFill();
      sketch.stroke(hotColor);
      sketch.strokeWeight(3);
      sketch.beginShape();
      for (let v = 70; v <= 280; v += 1) {
        let p = startP * (startV / v);
        sketch.vertex(v, h - p);
      }
      sketch.endShape();

      // Adiabatic (High Res)
      sketch.stroke(coldColor);
      sketch.beginShape();
      for (let v = 70; v <= 280; v += 1) {
        let p = startP * Math.pow(startV / v, 1.4);
        sketch.vertex(v, h - p);
      }
      sketch.endShape();
      
      // Vertical Tracker
      sketch.stroke("#cbd5e1");
      sketch.strokeWeight(1);
      sketch.line(curV, 0, curV, h);
      
      sketch.fill(hotColor);
      sketch.circle(curV, h - (startP * (startV / curV)), 8);
      sketch.fill(coldColor);
      sketch.circle(curV, h - (startP * Math.pow(startV / curV, 1.4)), 8);
      
      sketch.fill(textColor);
      sketch.textSize(12);
      sketch.text("Isothermal (Slow)", 160, 40);
      sketch.fill(coldColor);
      sketch.text("Adiabatic (Fast)", 160, 60);
    }
  },
};
