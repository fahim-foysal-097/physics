export const p2_ch10_sims = {
  setup: (sketch, vizType) => {
    sketch.textFont("Inter, system-ui, sans-serif");

    if (vizType === "pn_junction") {
      sketch.bias = 0.8; // V, forward bias
      sketch.circuitMode = 0; // 0 = Junction, 1 = AC Rectifier
      sketch.particles = [];
      sketch.theta = 0; // AC angle tracker
    }

    if (vizType === "transistor_amplifier") {
      sketch.ib = 20; // uA
      sketch.beta = 120;
      sketch.rl = 4.0; // kOhm
      sketch.particles = [];
      sketch.theta = 0;
    }

    if (vizType === "logic_gates") {
      sketch.selectedGate = "AND";
      sketch.inputA = 0;
      sketch.inputB = 0;

      // Mouse/Touch click handler mapped inside instance with responsive hitboxes
      sketch.mousePressed = () => {
        if (sketch.vizType !== "logic_gates") return;
        if (
          sketch.mouseX < 0 ||
          sketch.mouseX > sketch.width ||
          sketch.mouseY < 0 ||
          sketch.mouseY > sketch.height
        )
          return;

        // 1. Gate Tab Buttons click
        let tabs = ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"];
        let tabW = sketch.width / 7;
        if (sketch.mouseY >= 10 && sketch.mouseY <= 40) {
          let colIdx = sketch.floor(sketch.mouseX / tabW);
          if (colIdx >= 0 && colIdx < 7) {
            sketch.selectedGate = tabs[colIdx];
            if (sketch.selectedGate === "NOT") {
              sketch.inputB = 0;
            }
          }
        }

        // 2. Input A Switch click (Relative coordinates)
        let maxDrawW = sketch.width - 150;
        if (sketch.width < 450) maxDrawW = sketch.width - 120;
        let inputX = maxDrawW * 0.15;

        if (
          sketch.mouseX >= inputX &&
          sketch.mouseX <= inputX + 35 &&
          sketch.mouseY >= 95 &&
          sketch.mouseY <= 125
        ) {
          sketch.inputA = sketch.inputA === 0 ? 1 : 0;
        }

        // 3. Input B Switch click (Relative coordinates)
        if (sketch.selectedGate !== "NOT") {
          if (
            sketch.mouseX >= inputX &&
            sketch.mouseX <= inputX + 35 &&
            sketch.mouseY >= 165 &&
            sketch.mouseY <= 195
          ) {
            sketch.inputB = sketch.inputB === 0 ? 1 : 0;
          }
        }
      };
    }
  },

  draw: (sketch, vizType) => {
    sketch.background("#ffffff"); // Light background

    const primaryColor = "#4f46e5"; // Legible Indigo
    const accentColor = "#0891b2"; // Rich Cyan
    const textColor = "#0f172a"; // Dark slate text
    const mutedTextColor = "#64748b"; // Clean gray text

    if (vizType === "pn_junction") {
      let volt = sketch.bias || 0.8;
      let isRectifier = sketch.circuitMode === 1;

      // Responsive positioning boundary to prevent overlap with right panel
      let maxDrawW = sketch.width - 165;
      if (sketch.width < 450) maxDrawW = sketch.width - 120;

      if (!isRectifier) {
        // JUNCTION VIEW
        let depletionWidth = sketch.map(volt, -4.0, 2.0, 60, 10);
        let currentFlow = volt > 0.3 ? 100 * (sketch.exp(volt - 0.3) - 1) : 0;

        let cx = maxDrawW / 2;
        let cy = 100;
        let blockW = maxDrawW * 0.4;
        let blockH = 100;

        // Draw P-type (left) and N-type (right) blocks
        sketch.noStroke();
        sketch.fill("#1e1b4b"); // P-type (Indigo - solid contrast)
        sketch.rect(cx - blockW, cy - blockH / 2, blockW, blockH, 6, 0, 0, 6);
        sketch.fill("#334155"); // N-type (Slate - solid contrast)
        sketch.rect(cx, cy - blockH / 2, blockW, blockH, 0, 6, 6, 0);

        // Depletion Region (Center - light slate blend)
        sketch.fill("#cbd5e177");
        sketch.rect(
          cx - depletionWidth,
          cy - blockH / 2,
          depletionWidth * 2,
          blockH,
        );

        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1);
        sketch.line(
          cx - depletionWidth,
          cy - blockH / 2,
          cx - depletionWidth,
          cy + blockH / 2,
        );
        sketch.line(
          cx + depletionWidth,
          cy - blockH / 2,
          cx + depletionWidth,
          cy + blockH / 2,
        );

        // Labels
        sketch.noStroke();
        sketch.fill("#ffffff");
        sketch.textSize(12);
        sketch.textAlign(sketch.CENTER);
        sketch.textStyle(sketch.BOLD);
        sketch.text("P-type", cx - blockW / 2, cy - 10);
        sketch.text("N-type", cx + blockW / 2, cy - 10);
        sketch.textStyle(sketch.NORMAL);

        sketch.textSize(9);
        sketch.fill("#cbd5e1");
        sketch.text("Holes (⊕)", cx - blockW / 2, cy + 12);
        sketch.text("Electrons (⊖)", cx + blockW / 2, cy + 12);

        // Charge carriers animations (Holes moving right, Electrons moving left)
        if (sketch.frameCount % 5 === 0 && currentFlow > 3) {
          sketch.particles.push({
            x: sketch.random(cx - blockW + 10, cx - 15),
            y: sketch.random(cy - 20, cy + 30),
            type: "hole",
            speed: sketch.random(1.2, 2.8),
          });
          sketch.particles.push({
            x: sketch.random(cx + 15, cx + blockW - 10),
            y: sketch.random(cy - 20, cy + 30),
            type: "electron",
            speed: sketch.random(1.2, 2.8),
          });
        }

        // Draw and update carriers (Blue holes, Orange electrons - high contrast)
        for (let i = sketch.particles.length - 1; i >= 0; i--) {
          let p = sketch.particles[i];
          if (p.type === "hole") {
            p.x += p.speed;
            sketch.fill("#2563eb");
            sketch.circle(p.x, p.y, 6);
            if (p.x > cx + depletionWidth) sketch.particles.splice(i, 1);
          } else {
            p.x -= p.speed;
            sketch.fill("#ea580c");
            sketch.circle(p.x, p.y, 6);
            if (p.x < cx - depletionWidth) sketch.particles.splice(i, 1);
          }
        }

        // Depletion boundary labels
        sketch.fill(textColor);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.text("Depletion Layer", cx, cy - 60);
        sketch.textStyle(sketch.NORMAL);
        sketch.text(`${(depletionWidth * 0.01).toFixed(2)} μm`, cx, cy - 44);

        // Sidebar stats glass panel (light themed)
        let statsX = sketch.width - 145;
        let statsY = 45;
        let statsW = 130;
        let statsH = 115;

        sketch.fill("#f8fafcdd");
        sketch.stroke("#e2e8f0");
        sketch.strokeWeight(1.5);
        sketch.rect(statsX, statsY, statsW, statsH, 12);

        sketch.noStroke();
        sketch.fill(textColor);
        sketch.textSize(10);
        sketch.textStyle(sketch.BOLD);
        sketch.text("Junction HUD", statsX + statsW / 2, statsY + 18);
        sketch.textStyle(sketch.NORMAL);

        sketch.textSize(8);
        sketch.fill(mutedTextColor);
        sketch.text("DC Bias Voltage", statsX + statsW / 2, statsY + 36);
        sketch.fill(volt >= 0 ? "#10b981" : "#ef4444");
        sketch.textSize(11);
        sketch.textStyle(sketch.BOLD);
        sketch.text(
          `${volt.toFixed(1)} V (${volt >= 0 ? "Forward" : "Reverse"})`,
          statsX + statsW / 2,
          statsY + 48,
        );

        sketch.textSize(8);
        sketch.fill(mutedTextColor);
        sketch.textStyle(sketch.NORMAL);
        sketch.text("Junction Current I_d", statsX + statsW / 2, statsY + 68);
        sketch.fill(textColor);
        sketch.textSize(11);
        sketch.textStyle(sketch.BOLD);
        sketch.text(
          `${currentFlow.toFixed(1)} mA`,
          statsX + statsW / 2,
          statsY + 80,
        );
        sketch.textStyle(sketch.NORMAL);

        sketch.textSize(8);
        sketch.fill(mutedTextColor);
        sketch.text(
          `Depletion: ${(depletionWidth * 0.01).toFixed(2)} μm`,
          statsX + statsW / 2,
          statsY + 100,
        );

        // Schematic wiring
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.line(
          cx - blockW / 2,
          cy + blockH / 2,
          cx - blockW / 2,
          cy + blockH / 2 + 25,
        );
        sketch.line(
          cx + blockW / 2,
          cy + blockH / 2,
          cx + blockW / 2,
          cy + blockH / 2 + 25,
        );

        // Battery box centered
        let batW = 85;
        let batH = 20;
        sketch.fill("#f8fafc");
        sketch.stroke(primaryColor);
        sketch.rect(cx - batW / 2, cy + blockH / 2 + 15, batW, batH, 4);
        sketch.noStroke();
        sketch.fill(textColor);
        sketch.textSize(9);
        sketch.textStyle(sketch.BOLD);
        sketch.text(`${volt.toFixed(1)} V DC Source`, cx, cy + blockH / 2 + 28);
        sketch.textStyle(sketch.NORMAL);
      } else {
        // AC RECTIFIER VIEW
        sketch.theta += 0.045;
        let waveIn = 2.5 * sketch.sin(sketch.theta);

        // Center schematic dynamically in left area
        let cx = maxDrawW / 2;
        let cy = 90;
        let cW = maxDrawW * 0.75;
        let cH = 80;

        // Draw Diode circuit loop
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.rect(cx - cW / 2, cy - cH / 2, cW, cH, 8);

        // Emitter AC source
        sketch.fill("#ffffff");
        sketch.circle(cx - cW / 2, cy, 20);
        sketch.stroke(accentColor);
        sketch.strokeWeight(1.2);
        sketch.beginShape();
        for (let x = -6; x <= 6; x++) {
          sketch.vertex(cx - cW / 2 + x, cy + 3 * sketch.sin(x * 0.4));
        }
        sketch.endShape();

        // Resistor schematic on bottom wire
        sketch.stroke("#64748b");
        sketch.strokeWeight(2);
        let rx = cx;
        let ry = cy + cH / 2;
        sketch.line(rx - 15, ry, rx - 10, ry - 5);
        sketch.line(rx - 10, ry - 5, rx - 5, ry + 5);
        sketch.line(rx - 5, ry + 5, rx, ry - 5);
        sketch.line(rx, ry - 5, rx + 5, ry + 5);
        sketch.line(rx + 5, ry + 5, rx + 10, ry);

        // Diode symbol on top wire (centered)
        let dx = cx;
        let dy = cy - cH / 2;
        sketch.fill("#4f46e533");
        sketch.stroke("#4f46e5");
        sketch.strokeWeight(2);
        sketch.triangle(dx - 10, dy - 8, dx - 10, dy + 8, dx + 6, dy);
        sketch.line(dx + 6, dy - 8, dx + 6, dy + 8);

        sketch.noStroke();
        sketch.fill(textColor);
        sketch.textSize(9);
        sketch.textAlign(sketch.CENTER);
        sketch.textStyle(sketch.BOLD);
        sketch.text("Diode (D)", dx, dy - 12);
        sketch.textStyle(sketch.NORMAL);
        sketch.text("AC Source", cx - cW / 2, cy + 20);
        sketch.text("Load R_L", rx, ry + 15);

        // Wires charge carrier animation when diode conducts (deep gold)
        if (waveIn > 0.1) {
          sketch.fill("#ea580c");
          let tPos = (sketch.frameCount * 1.8) % (cW * 2 + cH * 2);
          let px = 0,
            py = 0;
          let halfW = cW / 2;
          let halfH = cH / 2;

          if (tPos < cW) {
            px = cx - halfW + tPos;
            py = cy - halfH;
          } else if (tPos < cW + cH) {
            px = cx + halfW;
            py = cy - halfH + (tPos - cW);
          } else if (tPos < cW * 2 + cH) {
            px = cx + halfW - (tPos - (cW + cH));
            py = cy + halfH;
          } else {
            px = cx - halfW;
            py = cy + halfH - (tPos - (cW * 2 + cH));
          }
          sketch.circle(px, py, 5);
        }

        // Draw dynamic scrolling AC graphs on right edge
        let graphX = sketch.width - 150;
        let graphY = 22;
        let gw = 135;
        let gh = 52;

        sketch.push();
        sketch.translate(graphX, graphY);

        // Input graph
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1.2);
        sketch.line(0, gh / 2, gw, gh / 2);
        sketch.line(0, 0, 0, gh);
        sketch.noStroke();
        sketch.fill(mutedTextColor);
        sketch.textSize(7);
        sketch.textAlign(sketch.LEFT);
        sketch.text("Input AC V_in", 5, 8);

        sketch.noFill();
        sketch.stroke(accentColor);
        sketch.strokeWeight(1.5);
        sketch.beginShape();
        for (let x = 0; x < gw; x++) {
          let y = gh / 2 + 16 * sketch.sin(x * 0.1 - sketch.theta);
          sketch.vertex(x, y);
        }
        sketch.endShape();

        // Output rectified graph
        sketch.translate(0, gh + 15);
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1.2);
        sketch.line(0, gh / 2, gw, gh / 2);
        sketch.line(0, 0, 0, gh);
        sketch.noStroke();
        sketch.fill(mutedTextColor);
        sketch.text("Rectified V_out", 5, 8);

        sketch.noFill();
        sketch.stroke("#ea580c"); // deep orange for contrast
        sketch.strokeWeight(2);
        sketch.beginShape();
        for (let x = 0; x < gw; x++) {
          let sVal = sketch.sin(x * 0.1 - sketch.theta);
          let y = gh / 2 + (sVal > 0 ? -16 * sVal : 0);
          sketch.vertex(x, y);
        }
        sketch.endShape();
        sketch.pop();
      }

      // Dynamic instructions at bottom
      sketch.textAlign(sketch.LEFT);
      sketch.textSize(10);
      sketch.fill(textColor);
      if (!isRectifier) {
        sketch.text(
          " Holes and electrons cross the junction under forward bias, reducing depletion width.",
          15,
          sketch.height - 18,
        );
      } else {
        sketch.text(
          " Half-wave rectifier yields single-cycle pulsating current, blocking negative phases.",
          15,
          sketch.height - 18,
        );
      }
    }

    if (vizType === "transistor_amplifier") {
      sketch.theta += 0.055;

      let ibVal = sketch.ib || 20;
      let betaVal = sketch.beta || 120;
      let rlVal = sketch.rl || 4.0;

      let icVal = (betaVal * ibVal) / 1000;
      let ieVal = icVal + ibVal / 1000;
      let av = betaVal * (rlVal / 1.5);
      let ap = av * betaVal;

      let maxDrawW = sketch.width - 165;
      if (sketch.width < 450) maxDrawW = sketch.width - 120;

      // 1. Sleek Frosted Glass HUD Panel on Left
      let hudW = maxDrawW * 0.45;
      sketch.fill("#f8fafcdd");
      sketch.stroke("#e2e8f0");
      sketch.strokeWeight(1.5);
      sketch.rect(12, 15, hudW, 140, 10);

      sketch.noStroke();
      sketch.textSize(10);
      sketch.textAlign(sketch.LEFT);
      sketch.fill(textColor);
      sketch.textStyle(sketch.BOLD);
      sketch.text("CE Amplifier HUD", 22, 32);
      sketch.textStyle(sketch.NORMAL);

      sketch.textSize(8.5);
      sketch.fill(mutedTextColor);
      sketch.text(`Emitter I_e: ${ieVal.toFixed(3)} mA`, 22, 50);
      sketch.text(`Collector I_c: ${icVal.toFixed(2)} mA`, 22, 66);
      sketch.text(`Base I_b: ${ibVal.toFixed(0)} μA`, 22, 82);

      sketch.fill(accentColor);
      sketch.textStyle(sketch.BOLD);
      sketch.text(`Voltage Gain A_v: ${av.toFixed(1)}`, 22, 104);
      sketch.fill("#ea580c");
      sketch.text(`Power Gain A_p: ${ap.toFixed(0)}`, 22, 120);
      sketch.textStyle(sketch.NORMAL);

      // 2. Semiconductor NPN Block
      let cx = maxDrawW * 0.72;
      let cy = 18;
      sketch.push();
      sketch.translate(cx, cy);

      let eW = maxDrawW * 0.16;
      let bW = 12;
      let cW = maxDrawW * 0.22;
      let sH = 65;

      sketch.noStroke();
      sketch.fill("#1e1b4b"); // Emitter (N)
      sketch.rect(-eW - bW / 2, 20, eW, sH, 4, 0, 0, 4);
      sketch.fill("#818cf833"); // Base (P - soft transparent purple)
      sketch.rect(-bW / 2, 20, bW, sH);
      sketch.fill("#334155"); // Collector (N - Dark Slate)
      sketch.rect(bW / 2, 20, cW, sH, 0, 4, 4, 0);

      sketch.fill(textColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.CENTER);
      sketch.textStyle(sketch.BOLD);
      sketch.text("E (N)", -eW / 2 - bW / 2, 12);
      sketch.text("B (P)", 0, 12);
      sketch.text("C (N)", cW / 2 + bW / 2, 12);
      sketch.textStyle(sketch.NORMAL);

      // Diffusion carriers animation
      if (sketch.frameCount % 4 === 0) {
        sketch.particles.push({
          x: -eW - bW / 2 + 5,
          y: sketch.random(25, 80),
          vx: sketch.random(1.2, 2.5),
          isRecombined: sketch.random(0, 1) < 0.05,
        });
      }

      sketch.fill("#ea580c"); // Electron carriers
      for (let i = sketch.particles.length - 1; i >= 0; i--) {
        let p = sketch.particles[i];
        p.x += p.vx;
        sketch.circle(p.x, p.y, 4);

        if (p.x >= -bW / 2 && p.x <= bW / 2 && p.isRecombined) {
          p.y += 2;
          p.vx = 0;
          if (p.y > 90) sketch.particles.splice(i, 1);
        } else if (p.x > bW / 2 + cW) {
          sketch.particles.splice(i, 1);
        }
      }
      sketch.pop();

      // 3. Dynamic Waveforms (Bottom area)
      let gw = maxDrawW * 0.46;
      let gh = 50;

      // Input wave (left)
      sketch.push();
      sketch.translate(15, 175);
      sketch.stroke("#cbd5e1");
      sketch.strokeWeight(1.2);
      sketch.line(0, gh / 2, gw, gh / 2);
      sketch.line(0, 5, 0, gh - 5);
      sketch.noStroke();
      sketch.fill(mutedTextColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.LEFT);
      sketch.text("Input AC V_in (10mV)", 6, 8);

      sketch.noFill();
      sketch.stroke(accentColor);
      sketch.strokeWeight(1.5);
      sketch.beginShape();
      for (let x = 0; x < gw; x++) {
        let y = gh / 2 + 10 * sketch.sin(x * 0.12 - sketch.theta);
        sketch.vertex(x, y);
      }
      sketch.endShape();
      sketch.pop();

      // Output wave (amplified + 180deg out of phase)
      sketch.push();
      sketch.translate(sketch.width - gw - 15, 175);
      sketch.stroke("#cbd5e1");
      sketch.strokeWeight(1.2);
      sketch.line(0, gh / 2, gw, gh / 2);
      sketch.line(0, 5, 0, gh - 5);
      sketch.noStroke();
      sketch.fill(mutedTextColor);
      sketch.textSize(8);
      sketch.textAlign(sketch.LEFT);
      sketch.text(`Output V_out (${((10 * av) / 1000).toFixed(2)}V)`, 6, 8);

      sketch.noFill();
      sketch.stroke("#e11d48"); // rich rose red for amplified output
      sketch.strokeWeight(2.2);
      sketch.beginShape();
      for (let x = 0; x < gw; x++) {
        let ampVal = sketch.constrain(10 * (av / 25), 6, 22);
        let y = gh / 2 - ampVal * sketch.sin(x * 0.12 - sketch.theta);
        sketch.vertex(x, y);
      }
      sketch.endShape();
      sketch.pop();

      // Bottom footer description
      sketch.noStroke();
      sketch.textAlign(sketch.CENTER);
      sketch.textSize(10);
      sketch.fill(textColor);
      sketch.text(
        " Emitter electrons diffuse into base; small Base voltage regulates large Collector flows with 180° phase inversion.",
        sketch.width / 2,
        sketch.height - 18,
      );
    }

    if (vizType === "logic_gates") {
      let activeGate = sketch.selectedGate || "AND";
      let a = sketch.inputA || 0;
      let b = sketch.inputB || 0;

      // 1. Dynamic selection tabs (top - clean light buttons)
      let tabs = ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"];
      let tabW = sketch.width / 7;
      sketch.textSize(9);
      sketch.textAlign(sketch.CENTER);
      sketch.strokeWeight(1);

      tabs.forEach((t, i) => {
        if (activeGate === t) {
          sketch.fill("#4f46e5"); // indigo
          sketch.stroke("#4f46e5");
        } else {
          sketch.fill("#f1f5f9"); // light slate
          sketch.stroke("#cbd5e1");
        }
        sketch.rect(i * tabW + 2, 10, tabW - 4, 30, 4);

        sketch.noStroke();
        sketch.fill(activeGate === t ? "#ffffff" : "#475569");
        sketch.textStyle(activeGate === t ? sketch.BOLD : sketch.NORMAL);
        sketch.text(t, i * tabW + tabW / 2, 28);
        sketch.textStyle(sketch.NORMAL);
      });

      // Output calculations
      let yOutput = 0;
      switch (activeGate) {
        case "AND":
          yOutput = a & b;
          break;
        case "OR":
          yOutput = a | b;
          break;
        case "NOT":
          yOutput = a === 0 ? 1 : 0;
          break;
        case "NAND":
          yOutput = (a & b) === 0 ? 1 : 0;
          break;
        case "NOR":
          yOutput = (a | b) === 0 ? 1 : 0;
          break;
        case "XOR":
          yOutput = a ^ b;
          break;
        case "XNOR":
          yOutput = a === b ? 1 : 0;
          break;
      }

      // Responsive spacing calculations
      let maxDrawW = sketch.width - 150;
      if (sketch.width < 450) maxDrawW = sketch.width - 120;

      let inputX = maxDrawW * 0.15;
      let gateX = maxDrawW * 0.45;
      let ledX = maxDrawW * 0.82;

      // 2. Toggle Input A button
      sketch.stroke("#94a3b8");
      sketch.strokeWeight(1.5);
      sketch.fill(a === 1 ? "#10b981" : "#f1f5f9");
      sketch.rect(inputX, 95, 35, 30, 6);
      sketch.noStroke();
      sketch.fill(a === 1 ? "#ffffff" : textColor);
      sketch.textSize(13);
      sketch.textStyle(sketch.BOLD);
      sketch.text(a, inputX + 17, 115);

      // Toggle Input B button
      if (activeGate !== "NOT") {
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1.5);
        sketch.fill(b === 1 ? "#10b981" : "#f1f5f9");
        sketch.rect(inputX, 165, 35, 30, 6);
        sketch.noStroke();
        sketch.fill(b === 1 ? "#ffffff" : textColor);
        sketch.text(b, inputX + 17, 185);
      }

      sketch.textStyle(sketch.NORMAL);
      sketch.textSize(10);
      sketch.fill(mutedTextColor);
      sketch.textAlign(sketch.LEFT);
      sketch.text("Input A", inputX, 88);
      if (activeGate !== "NOT") {
        sketch.text("Input B", inputX, 158);
      }

      // 3. Connective Wire paths
      sketch.stroke(a === 1 ? "#10b981" : "#cbd5e1");
      sketch.strokeWeight(2.5);
      sketch.line(inputX + 35, 110, gateX, 110);

      if (activeGate !== "NOT") {
        sketch.stroke(b === 1 ? "#10b981" : "#cbd5e1");
        sketch.line(inputX + 35, 180, gateX, 180);
      }

      // 4. Draw Gate Schematic symbol (Crisp blueprint look)
      sketch.stroke("#334155");
      sketch.strokeWeight(2.5);
      sketch.fill("#f8fafc");

      sketch.push();
      sketch.translate(gateX, 90);
      let gW = 80;
      let gH = 110;

      switch (activeGate) {
        case "AND":
        case "NAND":
          sketch.beginShape();
          sketch.vertex(0, 10);
          sketch.vertex(40, 10);
          sketch.bezierVertex(75, 10, 75, 100, 40, 100);
          sketch.vertex(0, 100);
          sketch.endShape(sketch.CLOSE);
          if (activeGate === "NAND") {
            sketch.fill("#ffffff");
            sketch.circle(75, 55, 10);
          }
          break;
        case "OR":
        case "NOR":
          sketch.beginShape();
          sketch.vertex(0, 10);
          sketch.bezierVertex(20, 10, 40, 15, 80, 55);
          sketch.bezierVertex(40, 95, 20, 100, 0, 100);
          sketch.bezierVertex(25, 70, 25, 40, 0, 10);
          sketch.endShape(sketch.CLOSE);
          if (activeGate === "NOR") {
            sketch.fill("#ffffff");
            sketch.circle(85, 55, 10);
          }
          break;
        case "NOT":
          sketch.triangle(0, 20, 0, 90, 60, 55);
          sketch.fill("#ffffff");
          sketch.circle(65, 55, 10);
          break;
        case "XOR":
        case "XNOR":
          sketch.noFill();
          sketch.arc(-8, 55, 30, 90, -sketch.HALF_PI, sketch.HALF_PI);
          sketch.fill("#f8fafc");
          sketch.beginShape();
          sketch.vertex(0, 10);
          sketch.bezierVertex(20, 10, 40, 15, 80, 55);
          sketch.bezierVertex(40, 95, 20, 100, 0, 100);
          sketch.bezierVertex(25, 70, 25, 40, 0, 10);
          sketch.endShape(sketch.CLOSE);
          if (activeGate === "XNOR") {
            sketch.fill("#ffffff");
            sketch.circle(85, 55, 10);
          }
          break;
      }
      sketch.pop();

      // Output wire from Gate symbol to LED
      let outWireStart = gateX + 80;
      if (activeGate === "NOT") outWireStart = gateX + 70;
      if (
        activeGate === "NAND" ||
        activeGate === "NOR" ||
        activeGate === "XNOR"
      ) {
        outWireStart += 10;
      }
      sketch.stroke(yOutput === 1 ? "#ea580c" : "#cbd5e1");
      sketch.strokeWeight(3);
      sketch.line(outWireStart, 145, ledX, 145);

      // 5. Draw Glowing output LED lamp
      sketch.stroke("#64748b");
      sketch.strokeWeight(2.5);
      if (yOutput === 1) {
        sketch.drawingContext.shadowBlur = 15;
        sketch.drawingContext.shadowColor = "#eab30866";
        sketch.fill("#facc15");
      } else {
        sketch.fill("#e2e8f0"); // soft inactive light gray
      }
      sketch.circle(ledX + 16, 145, 26);
      sketch.drawingContext.shadowBlur = 0;

      sketch.stroke(yOutput === 1 ? "#ffffff" : "#64748b");
      sketch.strokeWeight(1);
      sketch.line(ledX + 11, 142, ledX + 16, 150);
      sketch.line(ledX + 21, 142, ledX + 16, 150);

      sketch.noStroke();
      sketch.fill(textColor);
      sketch.textSize(10);
      sketch.textAlign(sketch.CENTER);
      sketch.textStyle(sketch.BOLD);
      sketch.text(`Out Y = ${yOutput}`, ledX + 16, 178);
      sketch.fill(yOutput === 1 ? "#d97706" : mutedTextColor);
      sketch.textSize(9);
      sketch.text(yOutput === 1 ? "LED: ON" : "LED: OFF", ledX + 16, 192);
      sketch.textStyle(sketch.NORMAL);

      // 6. Frosted glassmorphic Truth Table below
      sketch.push();
      sketch.translate(20, 218);
      sketch.textSize(9);
      sketch.textAlign(sketch.LEFT);

      sketch.fill("#f8fafcdd");
      sketch.stroke("#cbd5e1");
      sketch.strokeWeight(1.5);
      sketch.rect(0, 0, 135, 120, 8);

      sketch.noStroke();
      sketch.fill(mutedTextColor);
      sketch.text("TRUTH TABLE", 15, 16);
      sketch.stroke("#e2e8f0");
      sketch.line(10, 22, 125, 22);
      sketch.noStroke();

      sketch.fill(textColor);
      if (activeGate === "NOT") {
        sketch.text("Input A  |  Output Y", 15, 34);
      } else {
        sketch.text("In A  |  In B  |  Out Y", 15, 34);
      }

      let rows =
        activeGate === "NOT"
          ? [
              [0, 1],
              [1, 0],
            ]
          : [
              [0, 0, 0],
              [0, 1, 0],
              [1, 0, 0],
              [1, 1, 0],
            ];
      rows.forEach((r, idx) => {
        let isRowActive = false;
        if (activeGate === "NOT") {
          r[1] = r[0] === 0 ? 1 : 0;
          isRowActive = r[0] === a;
        } else {
          switch (activeGate) {
            case "AND":
              r[2] = r[0] & r[1];
              break;
            case "OR":
              r[2] = r[0] | r[1];
              break;
            case "NAND":
              r[2] = (r[0] & r[1]) === 0 ? 1 : 0;
              break;
            case "NOR":
              r[2] = (r[0] | r[1]) === 0 ? 1 : 0;
              break;
            case "XOR":
              r[2] = r[0] ^ r[1];
              break;
            case "XNOR":
              r[2] = r[0] === r[1] ? 1 : 0;
              break;
          }
          isRowActive = r[0] === a && r[1] === b;
        }

        let yOffset = 52 + idx * 15;
        if (isRowActive) {
          sketch.fill("#6366f11a"); // soft glowing violet row
          sketch.rect(6, yOffset - 11, 123, 14, 3);
          sketch.fill(primaryColor);
          sketch.textStyle(sketch.BOLD);
        } else {
          sketch.fill(mutedTextColor);
          sketch.textStyle(sketch.NORMAL);
        }

        if (activeGate === "NOT") {
          sketch.text(`  ${r[0]}    |    ${r[1]}`, 20, yOffset);
        } else {
          sketch.text(`  ${r[0]}   |   ${r[1]}    |    ${r[2]}`, 20, yOffset);
        }
      });
      sketch.textStyle(sketch.NORMAL);
      sketch.pop();

      // UI instructions on right corner
      let instrX = sketch.width - 150;
      if (sketch.width < 450) instrX = sketch.width - 120;
      sketch.textAlign(sketch.LEFT);
      sketch.textSize(9);
      sketch.fill(mutedTextColor);
      sketch.text("Click tabs to select gates.", instrX - 25, 240);
      sketch.text("Click Input boxes to toggle.", instrX - 25, 258);
      sketch.text("Active row glows in indigo.", instrX - 25, 276);
    }
  },
};
