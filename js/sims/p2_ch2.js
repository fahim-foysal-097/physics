export const p2_ch2_sims = {
  setup: (sketch, vizType) => {
    const defaults = {
      coulombs_law: { q1: 5, q2: -5, r: 120 },
      electric_field: {
        q1: 5,
        q2: -5,
        resolution: 25,
        probeX: 0,
        probeY: 0,
        t: 0,
      },
      sphere_field_graph: { Q: 10, R: 40, probeR: 80 },
      dipole_torque: {
        E: 5,
        theta: 45,
        fieldAngle: 0,
        isPlaying: false,
        angularVelocity: 0,
      },
      capacitor: { A: 100, d: 40, K: 1, V: 10 },
    };

    const applyDefaults = () => {
      Object.assign(sketch, defaults[vizType] || {});
    };

    sketch.reset = () => {
      applyDefaults();
    };

    if (vizType === "dipole_torque") {
      sketch.toggleRun = () => {
        sketch.isPlaying = !sketch.isPlaying;
      };
    }

    applyDefaults();
  },

  draw: (sketch, vizType) => {
    const drawCharge = (x, y, q, radius) => {
      let c =
        q > 0
          ? sketch.color(239, 68, 68)
          : q < 0
            ? sketch.color(59, 130, 246)
            : sketch.color(156, 163, 175);
      sketch.noStroke();
      for (let i = 4; i > 0; i--) {
        sketch.fill(c.levels[0], c.levels[1], c.levels[2], 20 * i);
        sketch.circle(x, y, radius + i * 8);
      }
      sketch.fill(c);
      sketch.circle(x, y, radius);
      sketch.fill(255);
      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      sketch.textSize(14);
      sketch.text(q > 0 ? "+" : q < 0 ? "-" : "", x, y);
    };

    const drawArrow = (x, y, vec, c, weight) => {
      sketch.push();
      sketch.stroke(c);
      sketch.strokeWeight(weight);
      sketch.fill(c);
      sketch.translate(x, y);
      sketch.line(0, 0, vec.x, vec.y);
      sketch.rotate(vec.heading());
      let arrowSize = sketch.min(7, vec.mag() * 0.3);
      sketch.translate(vec.mag() - arrowSize, 0);
      sketch.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      sketch.pop();
    };

    const fieldFromCharge = (pos, chargePos, q) => {
      const d = p5.Vector.sub(pos, chargePos);
      const mag = d.mag();
      if (mag < 15) return sketch.createVector(0, 0);
      return d.normalize().mult((q * 1000) / (mag * mag));
    };

    switch (vizType) {
      case "coulombs_law": {
        sketch.translate(sketch.width / 2, sketch.height / 2);

        let q1 = sketch.q1 ?? 5;
        let q2 = sketch.q2 ?? -5;
        let r = sketch.r ?? 120;

        let x1 = -r / 2;
        let x2 = r / 2;

        let forceMag = (Math.abs(q1 * q2) / (r * r)) * 50000;
        let isAttractive = q1 * q2 < 0;

        sketch.stroke(200);
        sketch.strokeWeight(2);
        sketch.line(x1, 50, x2, 50);
        sketch.line(x1, 45, x1, 55);
        sketch.line(x2, 45, x2, 55);

        sketch.noStroke();
        sketch.fill(100);
        sketch.textSize(12);
        sketch.textAlign(sketch.CENTER);
        sketch.text(`r = ${r.toFixed(0)}`, 0, 65);

        if (q1 !== 0 && q2 !== 0) {
          let fColor = isAttractive
            ? sketch.color(16, 185, 129)
            : sketch.color(245, 158, 11);
          let dir1 = isAttractive ? 1 : -1;
          let dir2 = isAttractive ? -1 : 1;

          let forceVec1 = sketch.createVector(
            dir1 * Math.min(forceMag, 100),
            0,
          );
          let forceVec2 = sketch.createVector(
            dir2 * Math.min(forceMag, 100),
            0,
          );

          drawArrow(x1 + (isAttractive ? 20 : -20), 0, forceVec1, fColor, 3);
          drawArrow(x2 + (isAttractive ? -20 : 20), 0, forceVec2, fColor, 3);

          sketch.fill(fColor);
          sketch.text(`Force = ${forceMag.toFixed(1)} N`, 0, -50);
        }

        drawCharge(x1, 0, q1, 30);
        drawCharge(x2, 0, q2, 30);
        break;
      }

      case "electric_field": {
        sketch.translate(sketch.width / 2, sketch.height / 2);

        let q1 = sketch.q1 ?? 5;
        let q2 = sketch.q2 ?? -5;
        let res = sketch.resolution ?? 25;
        let time = sketch.t ?? 0;
        sketch.t = time + 0.05;

        let p1 = sketch.createVector(-70, 0);
        let p2 = sketch.createVector(70, 0);

        let startX = -sketch.width / 2;
        let startY = -sketch.height / 2;

        for (let x = startX; x < sketch.width / 2; x += res) {
          for (let y = startY; y < sketch.height / 2; y += res) {
            let pos = sketch.createVector(x, y);
            let e1 = fieldFromCharge(pos, p1, q1);
            let e2 = fieldFromCharge(pos, p2, q2);
            let E = p5.Vector.add(e1, e2);
            let eMag = E.mag();

            if (eMag > 0.1) {
              let len = sketch.map(eMag, 0, 5, 5, res * 0.8);
              len = sketch.constrain(len, 5, res);
              E.setMag(len);

              let alpha = sketch.map(eMag, 0, 2, 50, 200);
              alpha = sketch.constrain(alpha, 50, 255);

              let pulse = sketch.sin(time - pos.mag() * 0.05) * 20;
              drawArrow(
                x,
                y,
                E,
                sketch.color(14, 165, 233, alpha + pulse),
                1.5,
              );
            }
          }
        }

        // Probe point interaction
        let probe = sketch.createVector(sketch.probeX ?? 0, sketch.probeY ?? 0);
        let Ep = p5.Vector.add(
          fieldFromCharge(probe, p1, q1),
          fieldFromCharge(probe, p2, q2),
        );
        let probeLen = sketch.constrain(Ep.mag() * 12, 10, 90);

        sketch.noFill();
        sketch.stroke(20, 184, 166);
        sketch.strokeWeight(2);
        sketch.circle(probe.x, probe.y, 12);

        if (Ep.mag() > 0.001) {
          drawArrow(
            probe.x,
            probe.y,
            Ep.copy().setMag(probeLen),
            sketch.color(20, 184, 166),
            3,
          );
        }

        sketch.noStroke();
        sketch.fill(20, 184, 166);
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(12);
        sketch.text(`Probe E = ${Ep.mag().toFixed(2)}`, probe.x, probe.y - 18);

        drawCharge(p1.x, p1.y, q1, 24);
        drawCharge(p2.x, p2.y, q2, 24);
        break;
      }

      case "sphere_field_graph": {
        sketch.translate(0, sketch.height / 2);

        let Q = sketch.Q ?? 10;
        let R = sketch.R ?? 40;
        let probeR = sketch.constrain(
          sketch.probeR ?? 80,
          0,
          sketch.width - 280,
        );

        const cx = 100;
        const graphStartX = 250;
        const graphWidth = sketch.width - graphStartX - 30;

        // Optional drag interaction for probe distance
        const localMouseY = sketch.mouseY - sketch.height / 2;
        if (
          sketch.mouseIsPressed &&
          sketch.mouseX >= graphStartX &&
          sketch.mouseX <= graphStartX + graphWidth &&
          localMouseY >= -155 &&
          localMouseY <= 105
        ) {
          probeR = sketch.constrain(sketch.mouseX - graphStartX, 0, graphWidth);
          sketch.probeR = probeR;
        }

        const absQ = Math.abs(Q);
        const c =
          Q > 0 ? sketch.color(239, 68, 68) : sketch.color(59, 130, 246);

        // Left: charged conducting sphere
        sketch.noStroke();
        for (let r = R; r > 0; r -= 2) {
          sketch.fill(
            c.levels[0],
            c.levels[1],
            c.levels[2],
            sketch.map(r, 0, R, 255, 40),
          );
          sketch.circle(cx, 0, r * 2);
        }

        // Surface charge signs
        if (Q !== 0) {
          const numCharges = Math.max(6, Math.abs(Q) * 2);
          sketch.fill(255);
          sketch.textAlign(sketch.CENTER, sketch.CENTER);
          sketch.textSize(10);
          for (let i = 0; i < numCharges; i++) {
            const angle = (sketch.TWO_PI / numCharges) * i;
            const x = cx + (R - 5) * sketch.cos(angle);
            const y = (R - 5) * sketch.sin(angle);
            sketch.text(Q > 0 ? "+" : "-", x, y);
          }
        }

        // Labels on sphere
        sketch.fill(40);
        sketch.noStroke();
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(12);
        sketch.text("Conducting sphere", cx, R + 22);
        sketch.text(`Q = ${Q.toFixed(0)}`, cx, R + 40);

        // Right: graph
        sketch.stroke(200);
        sketch.strokeWeight(1);
        sketch.line(graphStartX, 100, graphStartX + graphWidth, 100); // x-axis
        sketch.line(graphStartX, 100, graphStartX, -150); // y-axis

        sketch.fill(100);
        sketch.noStroke();
        sketch.textAlign(sketch.LEFT);
        sketch.text("r", graphStartX + graphWidth - 5, 115);
        sketch.text("Magnitude", graphStartX - 20, -160);

        // Shaded interior region
        const rAxisSphere = sketch.constrain(R, 0, graphWidth);
        sketch.noStroke();
        sketch.fill(148, 163, 184, 35);
        sketch.rect(graphStartX, -150, rAxisSphere, 250);

        sketch.fill(100);
        sketch.textAlign(sketch.LEFT);
        sketch.text("Inside conductor: E = 0", graphStartX + 10, -135);

        // Mark surface
        sketch.stroke(200, 200, 200, 150);
        sketch.drawingContext.setLineDash([5, 5]);
        sketch.line(
          graphStartX + rAxisSphere,
          100,
          graphStartX + rAxisSphere,
          -150,
        );
        sketch.drawingContext.setLineDash([]);
        sketch.noStroke();
        sketch.fill(80);
        sketch.text("r = R", graphStartX + rAxisSphere - 10, 115);

        // Curves
        sketch.noFill();
        sketch.strokeWeight(2.5);

        // Electric field curve
        sketch.stroke(239, 68, 68);
        sketch.beginShape();
        for (let x = graphStartX; x <= graphStartX + graphWidth; x++) {
          const r = x - graphStartX;
          const y = r < R ? 0 : (absQ * 1000) / (r * r);
          sketch.vertex(x, 100 - sketch.min(y, 250));
        }
        sketch.endShape();

        // Potential curve
        sketch.stroke(59, 130, 246);
        sketch.beginShape();
        for (let x = graphStartX; x <= graphStartX + graphWidth; x++) {
          const r = x - graphStartX;
          const y = r <= R ? (absQ * 1000) / R : (absQ * 1000) / r;
          sketch.vertex(x, 100 - sketch.min(y, 250));
        }
        sketch.endShape();

        // Probe marker
        const probeX = graphStartX + probeR;
        const eProbe = probeR < R ? 0 : (absQ * 1000) / (probeR * probeR);
        const vProbe = probeR <= R ? (absQ * 1000) / R : (absQ * 1000) / probeR;

        sketch.stroke(16, 185, 129, 180);
        sketch.strokeWeight(2);
        sketch.line(probeX, 100, probeX, -150);

        sketch.noStroke();
        sketch.fill(16, 185, 129);
        sketch.circle(probeX, 100 - sketch.min(eProbe, 250), 8);
        sketch.circle(probeX, 100 - sketch.min(vProbe, 250), 8);

        sketch.fill(16, 185, 129);
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(12);
        sketch.text(`Probe r = ${probeR.toFixed(0)}`, probeX, -95);
        sketch.text(
          `E = ${eProbe.toFixed(1)}  V = ${vProbe.toFixed(1)}`,
          probeX,
          -80,
        );

        // Legend
        sketch.fill(239, 68, 68);
        sketch.textAlign(sketch.LEFT);
        sketch.text("Electric field  E ∝ 1/r²", graphStartX + 10, -120);

        sketch.fill(59, 130, 246);
        sketch.text("Potential  V ∝ 1/r", graphStartX + 10, -105);

        break;
      }

      case "dipole_torque": {
        sketch.translate(sketch.width / 2, sketch.height / 2);

        let E = sketch.E ?? 5;
        let fieldAngle = sketch.fieldAngle ?? 0;
        let theta = sketch.theta ?? 45;

        if (sketch.isPlaying) {
          let alpha =
            -0.01 * E * sketch.sin(sketch.radians(theta - fieldAngle));
          sketch.angularVelocity += alpha;
          sketch.angularVelocity *= 0.95;
          sketch.theta += sketch.degrees(sketch.angularVelocity);
        }

        // Field lines rotated by fieldAngle
        let ang = sketch.radians(fieldAngle);
        let dx = 150 * sketch.cos(ang);
        let dy = 150 * sketch.sin(ang);
        let px = -sketch.sin(ang);
        let py = sketch.cos(ang);

        sketch.stroke(14, 165, 233, 100);
        sketch.strokeWeight(2);
        let numLines = 9;
        let spacing = 30;
        let start = -((numLines - 1) / 2) * spacing;

        for (let i = 0; i < numLines; i++) {
          let offset = start + i * spacing;
          let ox = px * offset;
          let oy = py * offset;

          sketch.line(-dx + ox, -dy + oy, dx + ox, dy + oy);

          sketch.push();
          sketch.translate(dx + ox, dy + oy);
          sketch.rotate(ang);
          sketch.fill(14, 165, 233, 100);
          sketch.noStroke();
          sketch.triangle(0, 5, 0, -5, 10, 0);
          sketch.pop();
        }

        sketch.push();
        sketch.rotate(sketch.radians(theta));
        let l = 60;

        sketch.stroke(100);
        sketch.strokeWeight(4);
        sketch.line(-l, 0, l, 0);

        drawCharge(-l, 0, -1, 20);
        drawCharge(l, 0, 1, 20);

        sketch.pop();

        let torqueMag = E * sketch.sin(sketch.radians(theta - fieldAngle));
        sketch.fill(0);
        sketch.noStroke();
        sketch.textSize(16);
        sketch.textAlign(sketch.CENTER);
        sketch.text(`θ = ${theta.toFixed(1)}°`, 0, 120);
        sketch.text(`φ = ${fieldAngle.toFixed(1)}°`, 0, 140);
        sketch.text(
          `τ ∝ pE sin(θ - φ) = ${Math.abs(torqueMag).toFixed(1)}`,
          0,
          160,
        );

        if (Math.abs(torqueMag) > 0.1) {
          sketch.noFill();
          sketch.stroke(245, 158, 11, 150);
          sketch.strokeWeight(3);
          sketch.arc(
            0,
            0,
            80,
            80,
            sketch.radians(fieldAngle - 90),
            sketch.radians(theta - 90),
          );
        }

        break;
      }

      case "capacitor": {
        sketch.translate(sketch.width / 2, sketch.height / 2);

        let A = sketch.A ?? 100;
        let d = sketch.d ?? 40;
        let K = sketch.K ?? 1;
        let V = sketch.V ?? 10;

        // Keep the drawing readable even if sliders get extreme
        const plateGap = sketch.constrain(d, 40, 400);
        const plateHeight = sketch.constrain(A, 50, 200);
        const plateWidth = 10;
        const leftX = -plateGap / 2;
        const rightX = plateGap / 2;

        // Background hint for the electric field region
        sketch.noStroke();
        sketch.fill(14, 165, 233, 12);
        sketch.rectMode(sketch.CENTER);
        sketch.rect(0, 0, plateGap, plateHeight + 30, 12);

        // Dielectric slab
        if (K > 1) {
          const dielectricAlpha = sketch.map(K, 1, 10, 35, 160);
          sketch.fill(16, 185, 129, dielectricAlpha);
          sketch.rect(0, 0, plateGap - 2, plateHeight - 10, 10);

          sketch.fill(8, 120, 85);
          sketch.textAlign(sketch.CENTER, sketch.CENTER);
          sketch.textSize(13);
          sketch.text(`Dielectric\nK = ${K.toFixed(1)}`, 0, 0);
        }

        // Field lines
        const fieldLineCount = sketch.max(
          5,
          Math.floor((plateHeight * V) / 60),
        );
        const spacing = plateHeight / (fieldLineCount - 1);
        const startY = -plateHeight / 2;

        sketch.stroke(14, 165, 233, 180);
        sketch.strokeWeight(1.6);

        for (let i = 0; i < fieldLineCount; i++) {
          const y = startY + i * spacing;

          // Straight line across the plates
          sketch.line(leftX + plateWidth / 2, y, rightX - plateWidth / 2, y);

          // Arrowhead
          sketch.noStroke();
          sketch.fill(14, 165, 233, 180);
          sketch.triangle(
            rightX - 7,
            y,
            rightX - 14,
            y - 4,
            rightX - 14,
            y + 4,
          );
          sketch.stroke(14, 165, 233, 180);
        }

        // Slight fringing effect at the top and bottom
        sketch.noFill();
        sketch.stroke(14, 165, 233, 90);
        sketch.strokeWeight(1.2);
        sketch.arc(
          leftX + plateWidth / 2,
          -plateHeight / 2,
          30,
          18,
          0,
          sketch.PI,
        );
        sketch.arc(
          rightX - plateWidth / 2,
          -plateHeight / 2,
          30,
          18,
          sketch.PI,
          sketch.TWO_PI,
        );
        sketch.arc(
          leftX + plateWidth / 2,
          plateHeight / 2,
          30,
          18,
          sketch.PI,
          sketch.TWO_PI,
        );
        sketch.arc(
          rightX - plateWidth / 2,
          plateHeight / 2,
          30,
          18,
          0,
          sketch.PI,
        );

        // Plates
        sketch.rectMode(sketch.CENTER);

        sketch.fill(239, 68, 68);
        sketch.stroke(200, 50, 50);
        sketch.rect(leftX - plateWidth / 2, 0, plateWidth, plateHeight, 4);

        sketch.fill(59, 130, 246);
        sketch.stroke(50, 100, 200);
        sketch.rect(rightX + plateWidth / 2, 0, plateWidth, plateHeight, 4);

        // Charge symbols on plates
        sketch.fill(255);
        sketch.noStroke();
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.textSize(12);
        for (let i = 0; i < fieldLineCount; i++) {
          const y = startY + i * spacing;
          sketch.text("+", leftX - plateWidth / 2, y);
          sketch.text("-", rightX + plateWidth / 2, y);
        }

        // Readouts
        const C = (K * A) / d;
        const Q = C * V;
        const U = 0.5 * C * V * V;
        const E = V / d;

        sketch.noStroke();
        sketch.fill(20);
        sketch.textAlign(sketch.LEFT);
        sketch.textSize(13);
        sketch.text(`C ∝ KA/d : ${C.toFixed(2)}`, -125, plateHeight / 2 + 28);
        sketch.text(`V : ${V.toFixed(1)}`, -125, plateHeight / 2 + 48);
        sketch.text(`Q = CV : ${Q.toFixed(2)}`, -125, plateHeight / 2 + 68);
        sketch.text(
          `U = 1/2 CV² : ${U.toFixed(2)}`,
          -125,
          plateHeight / 2 + 88,
        );
        sketch.text(`E ∝ V/d : ${E.toFixed(2)}`, -125, plateHeight / 2 + 108);

        break;
      }
    }
  },
};
