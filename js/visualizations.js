export const vizManager = {
  currentP5Instance: null,
  instances: {},

  render: (vizType, containerId, isLab = false) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Ensure container has dimensions
    if (container.clientWidth === 0) {
      // Retry in a bit if hidden
      setTimeout(() => vizManager.render(vizType, containerId, isLab), 100);
      return;
    }

    container.innerHTML = "";
    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const sketchFn = (sketch) => {
      sketch.vizType = vizType;

      sketch.setup = () => {
        sketch.createCanvas(width, height).parent(containerId);
        sketch.angleMode(sketch.RADIANS);

        // Init properties
        if (
          vizType === "vector_addition" ||
          vizType === "vector_area" ||
          vizType === "banking_road"
        ) {
          sketch.angleMode(sketch.DEGREES);
        }
        if (vizType === "projectile_advanced") {
          sketch.angleMode(sketch.DEGREES);
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
          };
          sketch.reset = () => {
            sketch.isFiring = false;
            sketch.t = 0;
            sketch.path = [];
          };
        }
        if (vizType === "shm_circular") {
          sketch.radius = 70;
          sketch.speed = 0.03;
          sketch.angle = 0;
          sketch.history = [];
        }
        if (vizType === "wave_propagation") {
          sketch.type = 0;
          sketch.freq = 0.05;
          sketch.amp = 30;
          sketch.t = 0;
        }
        if (vizType === "em_wave") {
          sketch.freq = 0.04;
          sketch.t = 0;
        }
        if (vizType === "water_pump") {
          sketch.depth = 100;
        }
        if (vizType === "orbit_simulation") {
          sketch.t = 0;
        }
        if (vizType === "simple_pendulum") {
          sketch.pendAngle = sketch.PI / 4; // 45 degrees in radians
          sketch.pendVel = 0;
        }
        if (vizType === "progressive_wave" || vizType === "standing_wave") {
          sketch.t = 0;
        }
        if (vizType === "sound_wave") {
          sketch.freq = 0.05;
          sketch.amp = 15;
          sketch.t = 0;
        }
        if (vizType === "poissons_ratio") {
          sketch.ratio = 0.3;
          sketch.t = 0;
        }
        if (vizType === "standing_wave_pipes") {
          sketch.pipeType = 0;
          sketch.harmonic = 1;
          sketch.t = 0;
        }
        if (vizType === "beats") {
          sketch.f1 = 440;
          sketch.f2 = 444;
          sketch.t = 0;
          sketch.toggleSound = async () => {
            if (!sketch.audioCtx) {
              sketch.audioCtx = new (
                window.AudioContext || window.webkitAudioContext
              )();
              sketch.osc1 = sketch.audioCtx.createOscillator();
              sketch.osc2 = sketch.audioCtx.createOscillator();
              sketch.gain = sketch.audioCtx.createGain();
              sketch.gain.gain.value = 0.1;
              sketch.osc1.connect(sketch.gain);
              sketch.osc2.connect(sketch.gain);
              sketch.gain.connect(sketch.audioCtx.destination);
              sketch.osc1.start();
              sketch.osc2.start();
              sketch.isPlaying = true;
            } else {
              if (sketch.audioCtx.state === "suspended")
                await sketch.audioCtx.resume();
              else await sketch.audioCtx.suspend();
              sketch.isPlaying = sketch.audioCtx.state === "running";
            }
          };
          sketch.stopSound = async () => {
            if (sketch.audioCtx && sketch.audioCtx.state === "running") {
              await sketch.audioCtx.suspend();
              sketch.isPlaying = false;
            }
          };
        }
      };

      sketch.draw = () => {
        sketch.background("#f8fafc");

        switch (vizType) {
          case "vector_addition":
            sketch.translate(sketch.width / 4, sketch.height / 2 + 50);
            let qA = 45 + sketch.sin(sketch.frameCount * 0.05) * 45;
            let Px = sketch.pMag || 100;
            let Qx = (sketch.qMag || 80) * sketch.cos(qA);
            let Qy = -(sketch.qMag || 80) * sketch.sin(qA);
            vizManager.drawArrow(sketch, 0, 0, Px, 0, "#0ea5e9");
            vizManager.drawArrow(sketch, 0, 0, Qx, Qy, "#f59e0b");
            vizManager.drawArrow(sketch, 0, 0, Px + Qx, Qy, "#4f46e5");
            break;

          case "vector_area":
            sketch.translate(sketch.width / 2 - 50, sketch.height / 2 + 50);
            let aMag = sketch.vecA_mag || 100;
            let bMag = sketch.vecB_mag || 80;
            let ang = sketch.angle || 60;
            let bX = bMag * sketch.cos(ang);
            let bY = -bMag * sketch.sin(ang);

            // Draw parallelogram
            sketch.fill("#bae6fd");
            sketch.stroke("#38bdf8");
            sketch.beginShape();
            sketch.vertex(0, 0);
            sketch.vertex(aMag, 0);
            sketch.vertex(aMag + bX, bY);
            sketch.vertex(bX, bY);
            sketch.endShape(sketch.CLOSE);

            // Draw vectors
            vizManager.drawArrow(sketch, 0, 0, aMag, 0, "#0ea5e9");
            vizManager.drawArrow(sketch, 0, 0, bX, bY, "#f59e0b");

            sketch.fill(0);
            sketch.noStroke();
            sketch.text(
              `Area = |A x B| = ${(aMag * bMag * sketch.sin(ang)).toFixed(0)}`,
              10,
              30,
            );
            break;

          case "projectile_advanced":
            sketch.translate(40, sketch.height - 40);
            sketch.stroke(200);
            sketch.line(-40, 0, sketch.width, 0);
            let s = 2.5;
            if (sketch.isFiring) {
              let x = sketch.u * sketch.cos(sketch.angle) * sketch.t;
              let y =
                sketch.h +
                (sketch.u * sketch.sin(sketch.angle) * sketch.t -
                  0.5 * sketch.g * sketch.t * sketch.t);
              if (y >= -2) {
                sketch.path.push({ x: x * s, y: -y * s });
                sketch.t += 0.15;
              } else {
                sketch.isFiring = false;
                sketch.R = x;
              }
            }
            sketch.noFill();
            sketch.stroke("#4f46e5");
            sketch.strokeWeight(2);
            sketch.beginShape();
            for (let p of sketch.path) sketch.vertex(p.x, p.y);
            sketch.endShape();
            if (sketch.path.length > 0) {
              let curr = sketch.path[sketch.path.length - 1];
              sketch.fill("#ef4444");
              sketch.circle(curr.x, curr.y, 8);
            }
            sketch.resetMatrix();
            sketch.fill(0);
            sketch.noStroke();
            sketch.textSize(14);
            sketch.text(`Range (R): ${sketch.R?.toFixed(2) || 0} m`, 20, 30);
            break;

          case "shm_circular":
            let cx = sketch.width / 5;
            let cy = sketch.height / 2;
            sketch.noFill();
            sketch.stroke(200);
            sketch.circle(cx, cy, sketch.radius * 2);
            let px = cx + sketch.radius * sketch.cos(sketch.angle);
            let py = cy + sketch.radius * sketch.sin(sketch.angle);
            sketch.line(cx, cy, px, py);

            // The Spring (Improved Zigzag)
            let springX = sketch.width / 2.5;
            sketch.stroke(100);
            sketch.noFill();
            sketch.beginShape();
            sketch.vertex(springX, 20);
            for (let i = 0; i < 30; i++) {
              let sy = sketch.lerp(20, py, i / 30);
              let sx = springX + sketch.sin(i * 1.5) * 15;
              sketch.vertex(sx, sy);
            }
            sketch.vertex(springX, py);
            sketch.endShape();
            sketch.fill("#10b981");
            sketch.rect(springX - 20, py, 40, 15, 4);

            // Projection & Graph
            sketch.stroke("#4f46e5");
            sketch.line(px, py, sketch.width / 2, py);
            sketch.fill("#4f46e5");
            sketch.circle(sketch.width / 2, py, 15);
            sketch.history.unshift(py);
            if (sketch.history.length > 200) sketch.history.pop();
            sketch.noFill();
            sketch.beginShape();
            for (let i = 0; i < sketch.history.length; i++)
              sketch.vertex(sketch.width / 2 + i, sketch.history[i]);
            sketch.endShape();
            sketch.angle -= sketch.speed;
            break;

          case "wave_propagation":
            sketch.translate(0, sketch.height / 2);
            for (let i = 0; i < sketch.width; i += 20) {
              let phase = i * 0.05 - sketch.t;
              let y = sketch.type == 0 ? sketch.amp * sketch.sin(phase) : 0;
              let xOff = sketch.type == 1 ? sketch.amp * sketch.sin(phase) : 0;
              sketch.fill("#0ea5e9");
              sketch.circle(i + xOff, y, 8);
            }
            sketch.t += sketch.freq;
            break;

          case "em_wave":
            sketch.translate(50, sketch.height / 2);
            sketch.strokeWeight(1);
            for (let i = 0; i < sketch.width - 100; i += 5) {
              let ph = i * 0.05 - sketch.t;
              let ey = 60 * sketch.sin(ph);
              let bz = 60 * sketch.sin(ph); // For 3D look, draw at an angle
              sketch.stroke("#ef4444");
              sketch.line(i, 0, i, ey); // Electric
              sketch.stroke("#0ea5e9");
              sketch.line(i, 0, i + bz * 0.5, -bz * 0.5); // Magnetic
            }
            sketch.t += sketch.freq;
            sketch.fill(0);
            sketch.noStroke();
            sketch.text(
              "Red: Electric Field (E), Blue: Magnetic Field (B)",
              10,
              -80,
            );
            break;

          case "sound_wave":
            sketch.translate(0, sketch.height / 2);
            for (let i = 0; i < 50; i++) {
              let x = i * (sketch.width / 50);
              let off = sketch.amp * sketch.sin(x * 0.05 - sketch.t);
              // Draw multiple dots per x to represent air density
              for (let j = 0; j < 5; j++) {
                sketch.fill(50, 150);
                sketch.noStroke();
                sketch.circle(
                  x + off + sketch.random(-5, 5),
                  sketch.random(-40, 40),
                  3,
                );
              }
            }
            sketch.t += sketch.freq;
            break;

          case "poissons_ratio":
            // Side-by-side comparison
            let mid = sketch.width / 2;
            let str = sketch.sin(sketch.t) * 40;

            // Left: Positive (Normal)
            sketch.push();
            sketch.translate(mid / 2, sketch.height / 2);
            sketch.fill("#10b981");
            sketch.rect(
              -(40 - str * 0.3) / 2,
              -(100 + str) / 2,
              40 - str * 0.3,
              100 + str,
            );
            sketch.fill(0);
            sketch.noStroke();
            sketch.text("σ = 0.3 (Positive)", -40, 80);
            sketch.pop();

            // Right: Negative (Auxetic)
            sketch.push();
            sketch.translate(mid + mid / 2, sketch.height / 2);
            sketch.fill("#f59e0b");
            sketch.rect(
              -(40 + str * 0.3) / 2,
              -(100 + str) / 2,
              40 + str * 0.3,
              100 + str,
            );
            sketch.fill(0);
            sketch.noStroke();
            sketch.text("σ = -0.3 (Negative)", -40, 80);
            sketch.pop();

            sketch.t += 0.05;
            break;

          case "standing_wave_pipes":
            sketch.translate(50, sketch.height / 2);
            let pLen = sketch.width - 100;
            sketch.stroke(0);
            sketch.strokeWeight(3);
            sketch.line(0, -40, pLen, -40);
            sketch.line(0, 40, pLen, 40);
            if (sketch.pipeType == 1) sketch.line(0, -40, 0, 40);
            sketch.strokeWeight(2);
            sketch.stroke("#4f46e5");
            sketch.noFill();
            let n = sketch.harmonic;
            sketch.beginShape();
            for (let x = 0; x <= pLen; x++) {
              let y =
                sketch.pipeType == 0
                  ? 35 *
                    sketch.sin(sketch.t) *
                    sketch.cos((n * sketch.PI * x) / pLen)
                  : 35 *
                    sketch.sin(sketch.t) *
                    sketch.sin(((2 * n - 1) * sketch.PI * x) / (2 * pLen));
              sketch.vertex(x, y);
            }
            sketch.endShape();
            sketch.beginShape();
            for (let x = 0; x <= pLen; x++) {
              let y =
                sketch.pipeType == 0
                  ? -35 *
                    sketch.sin(sketch.t) *
                    sketch.cos((n * sketch.PI * x) / pLen)
                  : -35 *
                    sketch.sin(sketch.t) *
                    sketch.sin(((2 * n - 1) * sketch.PI * x) / (2 * pLen));
              sketch.vertex(x, y);
            }
            sketch.endShape();
            sketch.t += 0.1;
            break;

          case "banking_road":
            sketch.translate(sketch.width / 2, sketch.height / 2 + 50);
            let theta = sketch.theta || 15; // angle in degrees
            sketch.rotate(-theta);

            // Draw road
            sketch.stroke(100);
            sketch.strokeWeight(4);
            sketch.line(-100, 0, 100, 0);

            // Draw car (box)
            sketch.fill("#ef4444");
            sketch.noStroke();
            sketch.rect(-20, -30, 40, 30, 5);

            // Draw forces
            sketch.strokeWeight(2);
            // Normal force
            vizManager.drawArrow(sketch, 0, -15, 0, -80, "#10b981");
            sketch.fill(0);
            sketch.noStroke();
            sketch.text("N", 5, -85);
            // Gravity (rotate back)
            sketch.push();
            sketch.rotate(theta);
            vizManager.drawArrow(sketch, 0, -15, 0, 60, "#3b82f6");
            sketch.fill(0);
            sketch.noStroke();
            sketch.text("mg", 5, 75);
            sketch.pop();
            break;

          case "water_pump":
            sketch.translate(sketch.width / 2, sketch.height / 2 + 80);
            let depth = sketch.depth || 50;

            // Draw well/tank
            sketch.stroke(100);
            sketch.strokeWeight(4);
            sketch.noFill();
            sketch.beginShape();
            sketch.vertex(-40, -100);
            sketch.vertex(-40, 0);
            sketch.vertex(40, 0);
            sketch.vertex(40, -100);
            sketch.endShape();

            // Water
            sketch.noStroke();
            sketch.fill("#38bdf8");
            sketch.rect(-38, -depth, 76, depth);

            // Pump pipe
            sketch.stroke("#64748b");
            sketch.strokeWeight(6);
            sketch.line(0, -120, 0, -depth + 10);

            // Water flowing out
            if (depth > 0) {
              sketch.noStroke();
              sketch.fill("#38bdf8");
              sketch.circle(20, -115 + (sketch.frameCount % 20), 5);
              sketch.depth -= sketch.pump_rate || 0.1;
              if (sketch.depth < 0) sketch.depth = 0;
            }
            break;

          case "orbit_simulation":
            sketch.translate(sketch.width / 2, sketch.height / 2);
            let orbitR = sketch.orbitR || 80;
            let spd = sketch.orbitV || 0.05;

            // Earth
            sketch.fill("#3b82f6");
            sketch.noStroke();
            sketch.circle(0, 0, 40);

            // Satellite
            let sx = orbitR * sketch.cos(sketch.t);
            let sy = orbitR * sketch.sin(sketch.t);
            sketch.fill("#ef4444");
            sketch.circle(sx, sy, 10);

            // Orbit path
            sketch.noFill();
            sketch.stroke(200);
            sketch.strokeWeight(1);
            sketch.circle(0, 0, orbitR * 2);

            sketch.t += spd;
            break;

          case "simple_pendulum":
            sketch.translate(sketch.width / 2, 20);
            let L = sketch.len || 150;
            let g_val = sketch.gravity || 0.4;
            let damp = sketch.damping || 1.0;

            // Real physics: acceleration = -(g/L) * sin(theta)
            let acc = -((g_val * 10) / L) * sketch.sin(sketch.pendAngle);
            sketch.pendVel += acc;
            sketch.pendVel *= damp;
            sketch.pendAngle += sketch.pendVel;

            let pex = L * sketch.sin(sketch.pendAngle);
            let pey = L * sketch.cos(sketch.pendAngle);

            // Draw ceiling
            sketch.stroke(100);
            sketch.strokeWeight(4);
            sketch.line(-50, 0, 50, 0);

            // Draw string
            sketch.strokeWeight(2);
            sketch.line(0, 0, pex, pey);

            // Draw bob
            sketch.fill("#ef4444");
            sketch.noStroke();
            sketch.circle(pex, pey, 20);
            break;

          case "progressive_wave":
            sketch.translate(0, sketch.height / 2);
            let w = sketch.omega || 0.05;
            let kw = sketch.k_wave || 0.05;
            let pwA = sketch.amp || 40;

            sketch.noFill();
            sketch.stroke("#0ea5e9");
            sketch.strokeWeight(2);
            sketch.beginShape();
            for (let x = 0; x < sketch.width; x += 5) {
              let y = pwA * sketch.sin(w * sketch.t - kw * x);
              sketch.vertex(x, y);
            }
            sketch.endShape();
            sketch.t += 1;
            break;

          case "standing_wave":
            sketch.translate(0, sketch.height / 2);
            let stW = sketch.omega || 0.1;
            let stK = sketch.k_wave || 0.02;
            let stA = sketch.amp || 40;

            sketch.noFill();
            sketch.strokeWeight(2);
            // Incident wave
            sketch.stroke(255, 100, 100, 100);
            sketch.beginShape();
            for (let x = 0; x < sketch.width; x += 5)
              sketch.vertex(x, stA * sketch.sin(stW * sketch.t - stK * x));
            sketch.endShape();

            // Reflected wave
            sketch.stroke(100, 100, 255, 100);
            sketch.beginShape();
            for (let x = 0; x < sketch.width; x += 5)
              sketch.vertex(x, stA * sketch.sin(stW * sketch.t + stK * x));
            sketch.endShape();

            // Resultant standing wave
            sketch.stroke("#4f46e5");
            sketch.beginShape();
            for (let x = 0; x < sketch.width; x += 5) {
              let y =
                2 * stA * sketch.cos(stK * x) * sketch.sin(stW * sketch.t);
              sketch.vertex(x, y);
            }
            sketch.endShape();

            sketch.t += 1;
            break;

          case "beats":
            sketch.translate(0, sketch.height / 2);
            if (sketch.isPlaying && sketch.osc1) {
              sketch.osc1.frequency.setTargetAtTime(
                sketch.f1,
                sketch.audioCtx.currentTime,
                0.05,
              );
              sketch.osc2.frequency.setTargetAtTime(
                sketch.f2,
                sketch.audioCtx.currentTime,
                0.05,
              );
            }
            sketch.noFill();
            sketch.stroke("#4f46e5");
            sketch.beginShape();
            for (let x = 0; x < sketch.width; x += 2) {
              let freqS = (sketch.f1 + sketch.f2) * 0.005;
              let freqD = (sketch.f1 - sketch.f2) * 0.005;
              let y =
                60 * sketch.cos(x * freqD) * sketch.sin(x * freqS - sketch.t);
              sketch.vertex(x, y);
            }
            sketch.endShape();
            sketch.stroke(200, 100);
            sketch.beginShape();
            for (let x = 0; x < sketch.width; x += 2) {
              let fD = (sketch.f1 - sketch.f2) * 0.005;
              let env = 60 * sketch.cos(x * fD);
              sketch.vertex(x, env);
              sketch.vertex(x, -env);
            }
            sketch.endShape();
            sketch.t += 0.2;
            break;
        }
      };
    };

    const instance = new p5(sketchFn);
    if (isLab) vizManager.instances[containerId] = instance;
    else vizManager.currentP5Instance = instance;
  },

  drawArrow: (sketch, x1, y1, x2, y2, colorStr) => {
    sketch.stroke(colorStr);
    sketch.strokeWeight(2);
    sketch.fill(colorStr);
    sketch.line(x1, y1, x2, y2);
    sketch.push();
    sketch.translate(x2, y2);
    let a = sketch.atan2(y1 - y2, x1 - x2);
    sketch.rotate(a);
    sketch.triangle(0, 0, 10, 4, 10, -4);
    sketch.pop();
  },

  stopAllAudio: () => {
    if (
      vizManager.currentP5Instance &&
      typeof vizManager.currentP5Instance.stopSound === "function"
    ) {
      vizManager.currentP5Instance.stopSound();
    }
    Object.values(vizManager.instances).forEach((inst) => {
      if (inst && typeof inst.stopSound === "function") {
        inst.stopSound();
      }
    });
  },
};
