export const p1_ch9_sims = {
  setup: (sketch, vizType) => {
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
    if (vizType === "sound_wave") {
      sketch.freq = 0.05;
      sketch.amp = 15;
      sketch.t = 0;
    }
    if (vizType === "progressive_wave") {
      sketch.t = 0;
      sketch.omega = 0.05;
      sketch.k_wave = 0.05;
      sketch.amp = 40;
    }
    if (vizType === "standing_wave") {
      sketch.t = 0;
      sketch.omega = 0.4;
      sketch.k_wave = 0.03;
      sketch.amp = 40;
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
    if (vizType === "wave_interference") {
      sketch.interferenceType = 0;
      sketch.t = 0;
      sketch.pulseT = 0;
      sketch.amp = 40;
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
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
          let bz = 60 * sketch.sin(ph);
          sketch.stroke("#ef4444");
          sketch.line(i, 0, i, ey);
          sketch.stroke("#0ea5e9");
          sketch.line(i, 0, i + bz * 0.5, -bz * 0.5);
        }
        sketch.t += sketch.freq;
        sketch.fill(0);
        sketch.noStroke();
        sketch.textSize(11);
        sketch.text("Red: E (Electric), Blue: B (Magnetic)", 10, -80);
        break;

      case "sound_wave":
        sketch.translate(0, sketch.height / 2);
        for (let i = 0; i < 60; i++) {
          let x = i * (sketch.width / 60);
          let off = sketch.amp * sketch.sin(x * 0.05 - sketch.t);
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

      case "progressive_wave":
        sketch.translate(0, sketch.height / 2);
        sketch.noFill();
        sketch.stroke("#0ea5e9");
        sketch.strokeWeight(2);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 5) {
          let y =
            sketch.amp *
            sketch.sin(sketch.omega * sketch.t - sketch.k_wave * x);
          sketch.vertex(x, y);
        }
        sketch.endShape();
        sketch.t += 1;
        break;

      case "standing_wave":
        sketch.translate(0, sketch.height / 2);
        sketch.noFill();

        sketch.stroke(255, 100, 100, 100);
        sketch.strokeWeight(1);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 2) {
          sketch.vertex(
            x,
            sketch.amp *
              sketch.sin(sketch.omega * sketch.t - sketch.k_wave * x),
          );
        }
        sketch.endShape();

        sketch.stroke(100, 100, 255, 100);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 2) {
          sketch.vertex(
            x,
            sketch.amp *
              sketch.sin(sketch.omega * sketch.t + sketch.k_wave * x),
          );
        }
        sketch.endShape();

        sketch.stroke("#4f46e5");
        sketch.strokeWeight(3);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 2) {
          let y =
            2 *
            sketch.amp *
            sketch.cos(sketch.k_wave * x) *
            sketch.sin(sketch.omega * sketch.t);
          sketch.vertex(x, y);
        }
        sketch.endShape();
        sketch.t += 0.1;
        break;

      case "wave_interference":
        sketch.translate(0, sketch.height / 2);
        sketch.noFill();

        if (sketch.pulseT > sketch.width + 100) sketch.pulseT = 0;
        let phase = (sketch.interferenceType || 0) === 1 ? -1 : 1;

        sketch.strokeWeight(1);
        sketch.stroke(255, 100, 100, 150);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 2) {
          let d = sketch.abs(x - sketch.pulseT);
          let y =
            d < 60
              ? (sketch.amp || 40) *
                sketch.cos(sketch.map(d, 0, 60, 0, sketch.HALF_PI))
              : 0;
          sketch.vertex(x, -y);
        }
        sketch.endShape();

        sketch.stroke(100, 100, 255, 150);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 2) {
          let d = sketch.abs(x - (sketch.width - sketch.pulseT));
          let y =
            d < 60
              ? (sketch.amp || 40) *
                phase *
                sketch.cos(sketch.map(d, 0, 60, 0, sketch.HALF_PI))
              : 0;
          sketch.vertex(x, -y);
        }
        sketch.endShape();

        sketch.stroke("#10b981");
        sketch.strokeWeight(3);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 2) {
          let d1 = sketch.abs(x - sketch.pulseT);
          let y1 =
            d1 < 60
              ? (sketch.amp || 40) *
                sketch.cos(sketch.map(d1, 0, 60, 0, sketch.HALF_PI))
              : 0;
          let d2 = sketch.abs(x - (sketch.width - sketch.pulseT));
          let y2 =
            d2 < 60
              ? (sketch.amp || 40) *
                phase *
                sketch.cos(sketch.map(d2, 0, 60, 0, sketch.HALF_PI))
              : 0;
          sketch.vertex(x, -(y1 + y2));
        }
        sketch.endShape();
        sketch.pulseT += 2;
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
        for (let x = 0; x <= pLen; x += 1) {
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
        for (let x = 0; x <= pLen; x += 1) {
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

      case "beats":
        sketch.translate(0, sketch.height / 2);
        let df = Math.abs(sketch.f1 - sketch.f2);

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

        let oneSecPx = 400;
        let k_beat = (Math.PI * df) / oneSecPx;
        let k_avg = (Math.PI * (sketch.f1 + sketch.f2)) / oneSecPx;

        sketch.noFill();
        sketch.stroke("#4f46e5");
        sketch.strokeWeight(2);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 1) {
          let y =
            60 * sketch.cos(x * k_beat) * sketch.cos(x * k_avg - sketch.t);
          sketch.vertex(x, y);
        }
        sketch.endShape();

        sketch.stroke(200, 150);
        sketch.strokeWeight(1);
        sketch.beginShape();
        for (let x = 0; x < sketch.width; x += 5) {
          let env = 60 * sketch.cos(x * k_beat);
          sketch.vertex(x, env);
          sketch.vertex(x, -env);
        }
        sketch.endShape();

        let xOffset = Math.PI / (2 * k_beat);

        sketch.push();
        sketch.translate(xOffset, 100);
        sketch.stroke(0);
        sketch.strokeWeight(1.5);
        sketch.line(0, 0, oneSecPx, 0);
        sketch.line(0, -5, 0, 5);
        sketch.line(oneSecPx, -5, oneSecPx, 5);

        sketch.noStroke();
        sketch.fill(0);
        sketch.textSize(12);
        sketch.textAlign(sketch.CENTER);
        sketch.text("1.0 Second Timeframe", oneSecPx / 2, 20);

        sketch.textAlign(sketch.LEFT);
        sketch.fill("#4f46e5");
        sketch.text(`Beat Frequency: ${df.toFixed(1)} Hz`, 10 - xOffset, -180);
        sketch.text(`${df} beats visible in 1s span`, 10 - xOffset, -165);
        sketch.pop();

        sketch.t += 0.2;
        break;
    }
  },
};
