export const p2_ch7_sims = {
  setup: (sketch, vizType) => {
    sketch.t = 0;
    if (vizType === "youngs_double_slit_sim") {
      sketch.lambda = 550; // Wavelength in nm
      sketch.slitD = 40; // Slit spacing in pixels
      sketch.screenDist = 200; // Screen distance in pixels
      sketch.phaseShift = 0; // Phase shift in degrees between slits
    }
    if (vizType === "single_slit_diffraction_sim") {
      sketch.lambda = 550; // Wavelength in nm
      sketch.slitWidth = 30; // Slit width in pixels
      sketch.diffractionMode = 0; // 0 = Fraunhofer, 1 = Fresnel
    }
    if (vizType === "diffraction_grating_sim") {
      sketch.lambda = 550;
      sketch.gratingLines = 500; // lines/mm
      sketch.gratingLightMode = 0; // 0 = Mono, 1 = White
    }
    if (vizType === "wavefront_huygens") {
      sketch.waveType = 0; // 0 = Plane wavefront, 1 = Spherical wavefront
    }
    if (vizType === "em_wave_poynting") {
      sketch.wavelength = 150; // Spatial wavelength of the EM wave
    }
    if (vizType === "polarization_malus_sim") {
      sketch.theta = 45; // Analyzer angle in degrees
      sketch.polarizationMode = 0; // 0 = Malus's Law, 1 = Polarization by Refraction/Brewster
    }
  },

  draw: (sketch, vizType) => {
    // Color helper: Convert wavelength in nm to RGB hex string
    let getWavelengthColor = (nm) => {
      let r = 0,
        g = 0,
        b = 0;
      if (nm >= 380 && nm < 440) {
        r = -(nm - 440) / (440 - 380);
        b = 1.0;
      } else if (nm >= 440 && nm < 490) {
        g = (nm - 440) / (490 - 440);
        b = 1.0;
      } else if (nm >= 490 && nm < 510) {
        g = 1.0;
        b = -(nm - 510) / (510 - 490);
      } else if (nm >= 510 && nm < 580) {
        r = (nm - 510) / (580 - 510);
        g = 1.0;
      } else if (nm >= 580 && nm < 645) {
        r = 1.0;
        g = -(nm - 645) / (645 - 580);
      } else if (nm >= 645 && nm <= 780) {
        r = 1.0;
      }

      // Factor for intensity fading at edges of visible spectrum
      let factor = 0;
      if (nm >= 380 && nm < 420) {
        factor = 0.3 + (0.7 * (nm - 380)) / (420 - 380);
      } else if (nm >= 420 && nm < 701) {
        factor = 1.0;
      } else if (nm >= 701 && nm <= 780) {
        factor = 0.3 + (0.7 * (780 - nm)) / (780 - 701);
      }

      let R = Math.round(r * factor * 255);
      let G = Math.round(g * factor * 255);
      let B = Math.round(b * factor * 255);
      return { r: R, g: G, b: B, hex: `rgb(${R}, ${G}, ${B})` };
    };

    switch (vizType) {
      case "youngs_double_slit_sim": {
        let cy = sketch.height / 2;
        let wlColorObj = getWavelengthColor(sketch.lambda);

        // 1. Draw 2D wave propagation (Left 60% of canvas)
        sketch.noStroke();
        sketch.fill("#0f172a"); // Dark slate background for physical wave overlap
        sketch.rect(0, 0, sketch.width - 150, sketch.height);

        // Draw sources and incoming wave representation
        sketch.stroke("rgba(255, 255, 255, 0.2)");
        sketch.strokeWeight(1);
        for (let x = 0; x < 50; x += 15) {
          let waveX = (x + sketch.t * 1.5) % 50;
          sketch.line(waveX, 0, waveX, sketch.height);
        }

        // Draw double slits screen at x = 50
        sketch.stroke("#475569");
        sketch.strokeWeight(4);
        let sD = sketch.slitD;
        sketch.line(50, 0, 50, cy - sD / 2 - 4);
        sketch.line(50, cy - sD / 2 + 4, 50, cy + sD / 2 - 4);
        sketch.line(50, cy + sD / 2 + 4, 50, sketch.height);

        // Double slit source points
        let slit1Y = cy - sD / 2;
        let slit2Y = cy + sD / 2;

        // Draw circular expanding wavefronts from the two slits
        sketch.noFill();
        sketch.strokeWeight(1);
        let speed = 2.0;
        let wavelengthPx = sketch.lambda * 0.05; // Wavelength scaled to pixels
        let maxRadius = sketch.width - 200;

        for (
          let r = (sketch.t * speed) % wavelengthPx;
          r < maxRadius;
          r += wavelengthPx
        ) {
          if (r < 5) continue;
          let alpha = sketch.map(r, 0, maxRadius, 150, 0);

          // Slit 1 wavefront (with custom phase shift applied dynamically)
          sketch.stroke(wlColorObj.r, wlColorObj.g, wlColorObj.b, alpha);
          sketch.arc(50, slit1Y, r * 2, r * 2, -sketch.HALF_PI, sketch.HALF_PI);

          // Slit 2 wavefront
          let phaseShiftRad = (sketch.phaseShift * sketch.PI) / 180;
          let r2 = r + (phaseShiftRad / sketch.TWO_PI) * wavelengthPx;
          sketch.stroke(wlColorObj.r, wlColorObj.g, wlColorObj.b, alpha);
          sketch.arc(
            50,
            slit2Y,
            r2 * 2,
            r2 * 2,
            -sketch.HALF_PI,
            sketch.HALF_PI,
          );
        }

        // 2. Draw screen fringes strip (Right vertical bar at x = width - 30)
        let screenX = sketch.width - 30;
        let screenW = 20;
        sketch.fill(0);
        sketch.stroke("#475569");
        sketch.strokeWeight(2);
        sketch.rect(screenX, 10, screenW, sketch.height - 20);

        // Render physics-accurate fringes on screen
        // Standard double slit phase diff: phi = 2*pi/lambda * d * sin(theta) + phaseShift
        // Where sin(theta) = y_offset / D
        let D = sketch.screenDist;
        let lambdaScale = sketch.lambda * 0.015;
        let phaseShiftRad = (sketch.phaseShift * sketch.PI) / 180;

        sketch.strokeWeight(1);
        for (let y = 12; y < sketch.height - 12; y++) {
          let dy = y - cy;
          let phi =
            (sketch.TWO_PI / lambdaScale) * ((sketch.slitD * dy) / D) +
            phaseShiftRad;
          let intensity = sketch.cos(phi / 2) * sketch.cos(phi / 2); // I = I0 * cos^2(phi/2)

          let fringeColor = sketch.color(
            wlColorObj.r * intensity,
            wlColorObj.g * intensity,
            wlColorObj.b * intensity,
          );
          sketch.stroke(fringeColor);
          sketch.line(screenX + 1, y, screenX + screenW - 1, y);
        }

        // 3. Plot Intensity Graph (between wave overlap and screen, x = width - 130 to width - 40)
        let graphCenterX = sketch.width - 80;
        sketch.noFill();
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1.5);
        sketch.beginShape();
        for (let y = 12; y < sketch.height - 12; y++) {
          let dy = y - cy;
          let phi =
            (sketch.TWO_PI / lambdaScale) * ((sketch.slitD * dy) / D) +
            phaseShiftRad;
          let intensity = sketch.cos(phi / 2) * sketch.cos(phi / 2);

          let graphX = graphCenterX - intensity * 50; // Peak goes to the left
          sketch.vertex(graphX, y);
        }
        sketch.endShape();

        // Draw graph labels
        sketch.fill("#475569");
        sketch.noStroke();
        sketch.textSize(10);
        sketch.textAlign(sketch.RIGHT);
        sketch.text("Intensity", graphCenterX - 10, 25);
        sketch.text("Screen", screenX + 10, 25);

        // Highlight central bright node (or shifted central bright node)
        // Shifted central maximum occurs when phi = 0 -> dy = - (phaseShiftRad * D * lambdaScale) / (2*pi * slitD)
        let shiftedCenterY =
          cy -
          (phaseShiftRad * D * lambdaScale) / (sketch.TWO_PI * sketch.slitD);
        if (shiftedCenterY > 15 && shiftedCenterY < sketch.height - 15) {
          sketch.stroke("rgba(239, 68, 68, 0.6)");
          sketch.strokeWeight(1);
          sketch.line(
            graphCenterX - 60,
            shiftedCenterY,
            screenX,
            shiftedCenterY,
          );
          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.textSize(9);
          sketch.textAlign(sketch.RIGHT);
          sketch.text(
            "Bright Max (চরম)",
            graphCenterX - 65,
            shiftedCenterY + 3,
          );
        }

        // General Overlay Text
        sketch.fill("#f8fafc");
        sketch.noStroke();
        sketch.textSize(11);
        sketch.textAlign(sketch.LEFT);
        sketch.text(`Wavelength (λ): ${sketch.lambda} nm`, 15, 25);
        sketch.text(`Slit Spacing (d): ${sketch.slitD} px`, 15, 42);
        sketch.text(`Screen Dist (D): ${sketch.screenDist} px`, 15, 59);
        sketch.text(`Slit Phase Diff (δ): ${sketch.phaseShift}°`, 15, 76);

        sketch.textSize(12);
        sketch.textStyle(sketch.BOLD);
        sketch.text(
          "Double Slit Interference (দ্বি-চির ব্যতিচার)",
          15,
          sketch.height - 20,
        );
        sketch.textStyle(sketch.NORMAL);

        sketch.t += 0.3;
        break;
      }

      case "single_slit_diffraction_sim": {
        let cy = sketch.height / 2;
        let wlColorObj = getWavelengthColor(sketch.lambda);

        // 1. Draw single slit wave expansion (Left 60% of canvas)
        sketch.noStroke();
        sketch.fill("#0f172a");
        sketch.rect(0, 0, sketch.width - 150, sketch.height);

        // Draw incoming parallel wavefronts (Plane waves)
        if (sketch.diffractionMode === 0) {
          sketch.stroke("rgba(255, 255, 255, 0.15)");
          sketch.strokeWeight(1.5);
          for (let x = 0; x < 50; x += 15) {
            let waveX = (x + sketch.t * 1.5) % 50;
            sketch.line(waveX, 0, waveX, sketch.height);
          }
        }

        // Draw single slit boundary at x = 50
        sketch.stroke("#475569");
        sketch.strokeWeight(4);
        let sw = sketch.slitWidth;
        sketch.line(50, 0, 50, cy - sw / 2);
        sketch.line(50, cy + sw / 2, 50, sketch.height);

        // Define a unified physical intensity retriever
        let getIntensity = (yVal) => {
          let dy = yVal - cy;
          if (sketch.diffractionMode === 0) {
            // Fraunhofer (Far-Field)
            let D_far = 180;
            let lambdaScale = sketch.lambda * 0.014; // Adjusted scale to fit more secondary peaks beautifully
            let sinTheta = dy / sketch.sqrt(D_far * D_far + dy * dy);
            let alpha = (sketch.PI * sketch.slitWidth * sinTheta) / lambdaScale;
            if (Math.abs(alpha) < 0.0001) return 1.0;
            return (sketch.sin(alpha) / alpha) * (sketch.sin(alpha) / alpha);
          } else {
            // Fresnel (Near-Field) using direct Kirchhoff-Fresnel numerical integration across the slit aperture!
            let lambdaScale = sketch.lambda * 0.012;
            let L_dist = 70; // Close distance representing near field
            let k_fresnel = sketch.PI / (lambdaScale * L_dist);
            let re = 0,
              im = 0;
            let steps = 20;
            let dy_seg = sw / steps;
            for (let i = 0; i <= steps; i++) {
              let y_source = -sw / 2 + i * dy_seg;
              let distSq = (dy - y_source) * (dy - y_source);
              let phase = k_fresnel * distSq;
              re += sketch.cos(phase);
              im += sketch.sin(phase);
            }
            let val = (re * re + im * im) / ((steps + 1) * (steps + 1));
            return sketch.min(1.0, val * 1.8); // Scale boost for bright near-field display
          }
        };

        if (sketch.diffractionMode === 0) {
          // Huygens' wave spreading (expanding arcs) from slit aperture
          sketch.noFill();
          sketch.strokeWeight(1);
          let speed = 2.0;
          let wavelengthPx = sketch.lambda * 0.05;
          let maxRadius = sketch.width - 200;

          for (
            let r = (sketch.t * speed) % wavelengthPx;
            r < maxRadius;
            r += wavelengthPx
          ) {
            if (r < 5) continue;
            let alpha = sketch.map(r, 0, maxRadius, 140, 0);
            sketch.stroke(wlColorObj.r, wlColorObj.g, wlColorObj.b, alpha);

            // Overlapping circles from top, middle, and bottom of slit
            sketch.arc(
              50,
              cy - sw / 3,
              r * 2,
              r * 2,
              -sketch.HALF_PI,
              sketch.HALF_PI,
            );
            sketch.arc(50, cy, r * 2, r * 2, -sketch.HALF_PI, sketch.HALF_PI);
            sketch.arc(
              50,
              cy + sw / 3,
              r * 2,
              r * 2,
              -sketch.HALF_PI,
              sketch.HALF_PI,
            );
          }
        } else {
          // Fresnel (Near-Field) wave rendering
          // Draw spherical waves from nearby point source
          sketch.noFill();
          sketch.strokeWeight(1.2);
          let speed = 2.0;
          let wavelengthPx = sketch.lambda * 0.05;

          for (
            let r = (sketch.t * speed) % wavelengthPx;
            r < 40;
            r += wavelengthPx
          ) {
            let alpha = sketch.map(r, 0, 40, 180, 0);
            sketch.stroke(wlColorObj.r, wlColorObj.g, wlColorObj.b, alpha);
            sketch.arc(
              10,
              cy,
              r * 2,
              r * 2,
              -sketch.QUARTER_PI,
              sketch.QUARTER_PI,
            );
          }

          sketch.fill("#ef4444");
          sketch.noStroke();
          sketch.circle(10, cy, 6);

          // Draw energy rays starting from slit aperture to the screen, shaded by the near-field intensity!
          sketch.strokeWeight(1);
          let numRays = 36;
          for (let i = 0; i < numRays; i++) {
            let yTarget = sketch.map(i, 0, numRays - 1, 20, sketch.height - 20);
            let intensity = getIntensity(yTarget);
            // Apply visual response boost for the rays as well
            let visualIntensity = sketch.pow(intensity, 0.4);
            let alpha = sketch.map(visualIntensity, 0, 1, 0, 150);
            sketch.stroke(wlColorObj.r, wlColorObj.g, wlColorObj.b, alpha);

            let yStart = cy - sw / 2 + (sw * (i % 5)) / 4;
            sketch.line(50, yStart, sketch.width - 150, yTarget);
          }
        }

        // 2. Draw diffraction fringes screen (Right vertical bar at width - 30)
        let screenX = sketch.width - 30;
        let screenW = 20;
        sketch.fill(0);
        sketch.stroke("#475569");
        sketch.strokeWeight(2);
        sketch.rect(screenX, 10, screenW, sketch.height - 20);

        sketch.strokeWeight(1);
        for (let y = 12; y < sketch.height - 12; y++) {
          let intensity = getIntensity(y);
          // Apply non-linear human visual response (gamma = 0.4) to make secondary and tertiary peaks clearly visible
          let visualIntensity = sketch.pow(intensity, 0.4);
          let fringeColor = sketch.color(
            wlColorObj.r * visualIntensity,
            wlColorObj.g * visualIntensity,
            wlColorObj.b * visualIntensity,
          );
          sketch.stroke(fringeColor);
          sketch.line(screenX + 1, y, screenX + screenW - 1, y);
        }

        // 3. Plot Intensity Graph (displays linear physical intensity for mathematical accuracy)
        let graphCenterX = sketch.width - 80;
        sketch.noFill();
        sketch.stroke("#38bdf8");
        sketch.strokeWeight(2);
        sketch.beginShape();
        for (let y = 12; y < sketch.height - 12; y++) {
          let intensity = getIntensity(y);
          let graphX = graphCenterX - intensity * 60;
          sketch.vertex(graphX, y);
        }
        sketch.endShape();

        // Screen Overlay Text
        sketch.fill("#f8fafc");
        sketch.noStroke();
        sketch.textSize(11);
        sketch.textAlign(sketch.LEFT);
        sketch.text(`Wavelength (λ): ${sketch.lambda} nm`, 15, 25);
        sketch.text(`Slit Width (a): ${sketch.slitWidth} px`, 15, 42);
        sketch.text(
          `Diffraction: ${sketch.diffractionMode === 0 ? "Fraunhofer (Far-Field)" : "Fresnel (Near-Field)"}`,
          15,
          59,
        );

        sketch.textSize(12);
        sketch.textStyle(sketch.BOLD);
        sketch.text(
          `Single Slit Diffraction (${sketch.diffractionMode === 0 ? "Fraunhofer" : "Fresnel"})`,
          15,
          sketch.height - 20,
        );
        sketch.textStyle(sketch.NORMAL);

        sketch.t += 0.3;
        break;
      }

      case "diffraction_grating_sim": {
        let cy = sketch.height / 2;
        let wlColorObj = getWavelengthColor(sketch.lambda);

        // 1. Draw 2D wave propagation (Left 60% of canvas)
        sketch.noStroke();
        sketch.fill("#0f172a");
        sketch.rect(0, 0, sketch.width - 150, sketch.height);

        // Draw incoming parallel wavefronts (Plane waves)
        sketch.stroke("rgba(255, 255, 255, 0.15)");
        sketch.strokeWeight(1.5);
        for (let x = 0; x < 50; x += 15) {
          let waveX = (x + sketch.t * 1.5) % 50;
          sketch.line(waveX, 0, waveX, sketch.height);
        }

        // Draw Grating Barrier at x = 50
        sketch.stroke("#475569");
        sketch.strokeWeight(4);
        sketch.line(50, 0, 50, sketch.height);

        // ruled line marks (black tick lines representing opaque rulings of grating)
        sketch.stroke("#000000");
        sketch.strokeWeight(2);
        for (let y = 5; y < sketch.height; y += 8) {
          sketch.line(48, y, 52, y);
        }

        // Grating physics parameters
        let N = sketch.gratingLines;
        let d_nm = 1000000 / N; // Grating element in nm
        let D = sketch.width - 200; // Screen distance on canvas

        let getEmergentY = (nm, order) => {
          let sinTheta = (order * nm) / d_nm;
          if (Math.abs(sinTheta) > 0.99) return null; // Evanescent cutoff
          let theta = sketch.asin(sinTheta);
          return cy + D * sketch.tan(theta);
        };

        let screenX = sketch.width - 30;
        let screenW = 20;

        // Draw screen back plate
        sketch.fill(0);
        sketch.stroke("#475569");
        sketch.strokeWeight(2);
        sketch.rect(screenX, 10, screenW, sketch.height - 20);

        if (sketch.gratingLightMode === 0) {
          // --- MONOCHROMATIC LASER MODE ---
          sketch.strokeWeight(2.0);
          let maxOrder = sketch.floor(d_nm / sketch.lambda);
          for (let n = -maxOrder; n <= maxOrder; n++) {
            let yEnd = getEmergentY(sketch.lambda, n);
            if (yEnd !== null && yEnd >= 12 && yEnd <= sketch.height - 12) {
              // Draw light ray fanning out
              sketch.stroke(wlColorObj.r, wlColorObj.g, wlColorObj.b, 170);
              sketch.line(50, cy, screenX, yEnd);

              // Draw sharp spectral line on screen
              sketch.stroke(wlColorObj.r, wlColorObj.g, wlColorObj.b);
              sketch.strokeWeight(3.5);
              sketch.line(screenX + 1, yEnd, screenX + screenW - 1, yEnd);

              sketch.fill("#94a3b8");
              sketch.noStroke();
              sketch.textSize(9);
              sketch.textAlign(sketch.LEFT);
              sketch.text(`n = ${n}`, screenX + screenW + 4, yEnd + 3);
            }
          }

          // Plot sharp delta-like peak intensity graph
          let graphCenterX = sketch.width - 80;
          sketch.noFill();
          sketch.stroke("#10b981");
          sketch.strokeWeight(2);
          sketch.beginShape();
          for (let y = 12; y < sketch.height - 12; y++) {
            let intensitySum = 0;
            for (let n = -maxOrder; n <= maxOrder; n++) {
              let yMax = getEmergentY(sketch.lambda, n);
              if (yMax !== null) {
                let dist = Math.abs(y - yMax);
                intensitySum += Math.exp((-dist * dist) / 9); // Delta approximation
              }
            }
            intensitySum = sketch.min(1.0, intensitySum);
            let graphX = graphCenterX - intensitySum * 60;
            sketch.vertex(graphX, y);
          }
          sketch.endShape();

          // Monochromatic Overlay
          sketch.fill("#f8fafc");
          sketch.noStroke();
          sketch.textSize(11);
          sketch.textAlign(sketch.LEFT);
          sketch.text(`Wavelength (λ): ${sketch.lambda} nm`, 15, 25);
          sketch.text(`Line Density (N): ${N} lines/mm`, 15, 42);
          sketch.text(
            `Grating element (d): ${(d_nm / 1000).toFixed(2)} μm`,
            15,
            59,
          );
          sketch.text(`Max Order (n_max): ±${maxOrder}`, 15, 76);
        } else {
          // --- WHITE LIGHT SPECTROGRAPH MODE ---
          sketch.strokeWeight(3.0);
          sketch.stroke(255, 255, 255, 180);
          sketch.line(10, cy, 50, cy); // Incident white light

          // Fanning guides for spectrum segments
          let spectrumNM = [400, 450, 500, 550, 600, 650, 700];
          spectrumNM.forEach((wl) => {
            let cObj = getWavelengthColor(wl);
            sketch.stroke(cObj.r, cObj.g, cObj.b, 90);
            sketch.strokeWeight(1.5);
            [-1, 1].forEach((n) => {
              let yEnd = getEmergentY(wl, n);
              if (yEnd !== null) {
                sketch.line(50, cy, screenX, yEnd);
              }
            });
          });

          // Draw continuous fanned-out rainbow spectrum on the screen
          sketch.strokeWeight(2);
          for (let wl = 400; wl <= 700; wl += 2) {
            let cObj = getWavelengthColor(wl);
            sketch.stroke(cObj.r, cObj.g, cObj.b);

            [-2, -1, 1, 2].forEach((n) => {
              let yEnd = getEmergentY(wl, n);
              if (yEnd !== null && yEnd >= 12 && yEnd <= sketch.height - 12) {
                sketch.line(screenX + 1, yEnd, screenX + screenW - 1, yEnd);
              }
            });
          }

          // Undispersed central maximum (n=0) is white
          sketch.stroke(255);
          sketch.strokeWeight(4);
          sketch.line(screenX + 1, cy, screenX + screenW - 1, cy);

          sketch.strokeWeight(1.5);
          sketch.stroke(255, 255, 255, 180);
          sketch.line(50, cy, screenX, cy); // Central ray

          // Plot white light intensity graph
          let graphCenterX = sketch.width - 80;
          sketch.noFill();
          sketch.stroke("#ffffff");
          sketch.strokeWeight(2);
          sketch.beginShape();
          for (let y = 12; y < sketch.height - 12; y++) {
            let dy = y - cy;
            let intensitySum = 0;
            // Central peak is extremely high
            intensitySum += Math.exp((-dy * dy) / 15);
            // Higher order peaks (smoothed out over spectrum)
            [-2, -1, 1, 2].forEach((n) => {
              let yWlMin = getEmergentY(400, n);
              let yWlMax = getEmergentY(700, n);
              if (yWlMin !== null && yWlMax !== null) {
                let midY = (yWlMin + yWlMax) / 2;
                let spread = Math.abs(yWlMax - yWlMin) / 2;
                let dist = Math.abs(y - midY);
                if (dist <= spread) {
                  intensitySum +=
                    0.45 *
                    Math.exp(
                      -((dist - spread / 2) * (dist - spread / 2)) / 500,
                    );
                }
              }
            });
            intensitySum = sketch.min(1.0, intensitySum);
            let graphX = graphCenterX - intensitySum * 60;
            sketch.vertex(graphX, y);
          }
          sketch.endShape();

          // White Light Overlay
          sketch.fill("#f8fafc");
          sketch.noStroke();
          sketch.textSize(11);
          sketch.textAlign(sketch.LEFT);
          sketch.text("White Light Diffraction Spectrograph", 15, 25);
          sketch.text(`Density (N): ${N} lines/mm`, 15, 42);
          sketch.text("Central Order (n=0): Undispersed White", 15, 59);
          sketch.text(
            "Higher Orders (n=±1, ±2): Continuous Rainbow Spectrum",
            15,
            76,
          );
        }

        sketch.fill(0);
        sketch.noStroke();
        sketch.textSize(12);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.LEFT);
        sketch.text(
          "Diffraction Grating Spectrometer (গ্রেটিং অপবর্তন)",
          15,
          sketch.height - 20,
        );
        sketch.textStyle(sketch.NORMAL);

        sketch.t += 0.3;
        break;
      }

      case "wavefront_huygens": {
        sketch.translate(50, sketch.height / 2);

        let wlColorObj = getWavelengthColor(550); // green
        let speed = 1.2;
        let r = (sketch.t * speed) % 60;

        // Draw Wave Type selector state
        let waveType = sketch.waveType; // 0 = Plane, 1 = Spherical

        sketch.strokeWeight(1.5);
        if (waveType === 0) {
          // --- PLANE WAVEFRONT ---
          // Draw original primary wavefront (solid vertical blue line)
          sketch.stroke("#38bdf8");
          sketch.line(30, -100, 30, 100);

          // Draw source points along the wavefront (Huygens' sources)
          let sourcesY = [-80, -50, -20, 10, 40, 70];

          sourcesY.forEach((y) => {
            // Expanding circular wavelets (dashed red)
            sketch.noFill();
            sketch.stroke("rgba(239, 68, 68, 0.45)");
            sketch.drawingContext.setLineDash([3, 3]);
            sketch.circle(30, y, r * 2);
            sketch.drawingContext.setLineDash([]);

            // Draw wave direction arrow
            sketch.stroke("#94a3b8");
            sketch.line(30 + r, y, 30 + r + 8, y);
            sketch.fill("#94a3b8");
            sketch.triangle(
              30 + r + 8,
              y,
              30 + r + 4,
              y - 3,
              30 + r + 4,
              y + 3,
            );

            // Red source dots
            sketch.fill("#ef4444");
            sketch.noStroke();
            sketch.circle(30, y, 6);
          });

          // Draw Envelope / New Wavefront (solid blue wavefront at distance r)
          sketch.stroke("#0284c7");
          sketch.strokeWeight(2.5);
          sketch.line(30 + r, -100, 30 + r, 100);

          sketch.fill("#38bdf8");
          sketch.noStroke();
          sketch.textSize(11);
          sketch.textAlign(sketch.CENTER);
          sketch.text("Primary Wavefront\n(প্রাথমিক তরঙ্গমুখ)", 30, 125);
          sketch.fill("#0284c7");
          sketch.text("New Wavefront\n(নতুন তরঙ্গমুখ)", 30 + r, -125);
        } else {
          // --- SPHERICAL WAVEFRONT ---
          // Source point at (0, 0)
          let center = sketch.createVector(0, 0);
          let primaryR = 80;

          // Draw point source
          sketch.fill("#e11d48");
          sketch.noStroke();
          sketch.circle(0, 0, 8);
          sketch.textSize(10);
          sketch.text("Light Source (উৎস)", 0, 15);

          // Draw primary spherical wavefront
          sketch.noFill();
          sketch.stroke("#38bdf8");
          sketch.strokeWeight(1.5);
          sketch.circle(0, 0, primaryR * 2);

          // Generate 6 source points on the arc facing right (from -60 deg to +60 deg)
          let angles = [-1.0, -0.6, -0.2, 0.2, 0.6, 1.0];
          angles.forEach((ang) => {
            let sx = primaryR * sketch.cos(ang);
            let sy = primaryR * sketch.sin(ang);

            // Expanding wavelets centered at (sx, sy)
            sketch.noFill();
            sketch.stroke("rgba(239, 68, 68, 0.45)");
            sketch.drawingContext.setLineDash([3, 3]);
            sketch.circle(sx, sy, r * 2);
            sketch.drawingContext.setLineDash([]);

            // Draw wave direction arrow
            sketch.stroke("#94a3b8");
            let ax = (primaryR + r) * sketch.cos(ang);
            let ay = (primaryR + r) * sketch.sin(ang);
            sketch.line(sx, sy, ax, ay);

            // Huygens source dots
            sketch.fill("#ef4444");
            sketch.noStroke();
            sketch.circle(sx, sy, 6);
          });

          // Draw New Wavefront (Spherical envelope with radius primaryR + r)
          sketch.noFill();
          sketch.stroke("#0284c7");
          sketch.strokeWeight(2.5);
          sketch.arc(0, 0, (primaryR + r) * 2, (primaryR + r) * 2, -1.3, 1.3);

          sketch.fill("#38bdf8");
          sketch.noStroke();
          sketch.textSize(11);
          sketch.textAlign(sketch.LEFT);
          sketch.text("Primary Wavefront (spherical)", primaryR - 40, -100);
          sketch.fill("#0284c7");
          sketch.text("New Wavefront Envelope", primaryR + r - 10, 100);
        }

        // Title and Info
        sketch.fill(0);
        sketch.noStroke();
        sketch.textSize(12);
        sketch.textStyle(sketch.BOLD);
        sketch.textAlign(sketch.LEFT);
        sketch.text("Huygens' Principle (হাইগেনসের তরঙ্গ নীতি)", -30, -145);
        sketch.textStyle(sketch.NORMAL);
        sketch.textSize(10);
        sketch.fill("#475569");
        sketch.text(
          "Wavelets form a new envelope wavefront tangentially.",
          -30,
          -130,
        );

        sketch.t += 0.35;
        break;
      }

      case "em_wave_poynting": {
        // Beautiful pseudo-3D perspective drawing of Electromagnetic Wave
        sketch.translate(30, sketch.height / 2);

        // Draw 3D axis system
        let xAxisX = sketch.width - 80;
        let xAxisY = 0;

        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1);
        sketch.line(0, 0, xAxisX, 0); // X-axis (Propagation)
        sketch.line(0, -sketch.height / 2 + 20, 0, sketch.height / 2 - 20); // Y-axis (Electric Field)
        sketch.line(
          0,
          0,
          120 * sketch.cos(sketch.QUARTER_PI),
          120 * sketch.sin(sketch.QUARTER_PI),
        ); // Z-axis (Magnetic)

        sketch.fill("#475569");
        sketch.noStroke();
        sketch.textSize(10);
        sketch.text("Electric E (Y)", 8, -sketch.height / 2 + 30);
        sketch.text("Magnetic B (Z)", 75, 90);
        sketch.text(
          "Propagation Vector k / Poynting Vector S (X)",
          xAxisX - 160,
          -10,
        );

        let k = sketch.TWO_PI / sketch.wavelength;
        let omega = 0.06;

        // Draw sine wave surfaces
        let prevPtE = null;
        let prevPtB = null;

        for (let x = 0; x < xAxisX - 40; x += 3) {
          let phase = k * x - sketch.t * omega;
          let valE = 55 * sketch.sin(phase);
          let valB = 55 * sketch.sin(phase);

          // E-Field point in 3D: (x, -valE)
          let ePt = sketch.createVector(x, -valE);

          // B-Field point in 3D: projected along Z-axis at 45 degrees
          let bZ = valB * sketch.cos(sketch.QUARTER_PI);
          let bY = valB * sketch.sin(sketch.QUARTER_PI);
          let bPt = sketch.createVector(x + bZ, bY);

          // Draw vertical lines representing E-field vectors (Red)
          if (x % 15 === 0) {
            sketch.stroke("rgba(239, 68, 68, 0.45)");
            sketch.strokeWeight(1.5);
            sketch.line(x, 0, ePt.x, ePt.y);
          }
          // Draw diagonal lines representing B-field vectors (Blue)
          if (x % 15 === 0) {
            sketch.stroke("rgba(59, 130, 246, 0.45)");
            sketch.strokeWeight(1.5);
            sketch.line(x, 0, bPt.x, bPt.y);
          }

          // Draw outline curves
          if (prevPtE) {
            sketch.stroke("#ef4444"); // Electric (Red)
            sketch.strokeWeight(2);
            sketch.line(prevPtE.x, prevPtE.y, ePt.x, ePt.y);

            sketch.stroke("#3b82f6"); // Magnetic (Blue)
            sketch.strokeWeight(2);
            sketch.line(prevPtB.x, prevPtB.y, bPt.x, bPt.y);
          }

          prevPtE = ePt;
          prevPtB = bPt;
        }

        // Draw Poynting Vector vectors dynamically at x = 160
        let phasePoint = k * 160 - sketch.t * omega;
        let pE = 55 * sketch.sin(phasePoint);
        let pB = 55 * sketch.sin(phasePoint);

        let pBZ = pB * sketch.cos(sketch.QUARTER_PI);
        let pBY = pB * sketch.sin(sketch.QUARTER_PI);

        sketch.strokeWeight(3.5);
        // E vector (vertical Red)
        sketch.stroke("#b91c1c");
        sketch.line(160, 0, 160, -pE);

        // B vector (diagonal Blue)
        sketch.stroke("#1d4ed8");
        sketch.line(160, 0, 160 + pBZ, pBY);

        // Poynting Vector S (horizontal Orange arrow pointing along propagation)
        // S = E x B, so it always points right in this system
        sketch.stroke("#ea580c"); // Orange
        sketch.line(160, 0, 230, 0);
        sketch.fill("#ea580c");
        sketch.noStroke();
        sketch.triangle(230, 0, 222, -4, 222, 4);

        sketch.textSize(11);
        sketch.textStyle(sketch.BOLD);
        sketch.fill("#ea580c");
        sketch.text("Poynting Vector S = E × B / μ₀ (শক্তি প্রবাহ)", 170, -25);
        sketch.textStyle(sketch.NORMAL);

        // Title text
        sketch.fill(0);
        sketch.textSize(12);
        sketch.textStyle(sketch.BOLD);
        sketch.text(
          "Electromagnetic Wave Propagation (তড়িৎচৌম্বক তরঙ্গ)",
          10,
          -110,
        );
        sketch.textStyle(sketch.NORMAL);
        sketch.textSize(10);
        sketch.fill("#475569");
        sketch.text(
          "Red: E (Electric field), Blue: B (Magnetic field) vibrating in perpendicular planes.",
          10,
          -95,
        );

        sketch.t += 1.0;
        break;
      }

      case "polarization_malus_sim": {
        let cy = sketch.height / 2;
        let thetaRad = (sketch.theta * sketch.PI) / 180;

        if (sketch.polarizationMode === 0) {
          // --- MODE 0: MALUS'S LAW ---
          sketch.translate(20, cy);

          // Phase boundaries
          let px1 = 80; // Position of Polarizer
          let px2 = 210; // Position of Analyzer
          let px3 = sketch.width - 150; // Output span

          // Draw Polarizer 1 (Vertical)
          sketch.stroke("#475569");
          sketch.strokeWeight(3);
          sketch.fill("rgba(71, 85, 105, 0.1)");
          sketch.rect(px1 - 6, -50, 12, 100, 3);
          sketch.strokeWeight(1);
          for (let ly = -40; ly <= 40; ly += 10) {
            sketch.line(px1 - 4, ly, px1 + 4, ly); // Vertical slits
          }
          sketch.fill(0);
          sketch.noStroke();
          sketch.textSize(10);
          sketch.textAlign(sketch.CENTER);
          sketch.text("Polarizer\n(Vertical)", px1, 65);

          // Draw Analyzer (Rotated by sketch.theta)
          sketch.stroke("#0ea5e9");
          sketch.strokeWeight(3);
          sketch.fill("rgba(14, 165, 233, 0.15)");
          sketch.push();
          sketch.translate(px2, 0);
          sketch.rotate(thetaRad);
          sketch.rect(-6, -50, 12, 100, 3);
          sketch.strokeWeight(1);
          for (let ly = -40; ly <= 40; ly += 10) {
            sketch.line(-4, ly, 4, ly); // Slits rotated
          }
          sketch.pop();

          sketch.fill("#0284c7");
          sketch.noStroke();
          sketch.text(`Analyzer\n(θ = ${sketch.theta}°)`, px2, 65);

          // Trace Light Waves Propagation
          let omega = 0.08;
          let k = sketch.TWO_PI / 80;

          // 1. Left of Polarizer: Unpolarized Light (Vertical and Horizontal components)
          sketch.noFill();
          sketch.strokeWeight(1.5);

          sketch.stroke("rgba(239, 68, 68, 0.65)"); // Vertical E component
          sketch.beginShape();
          for (let x = 0; x < px1; x += 2) {
            let y = 30 * sketch.sin(k * x - sketch.t * omega);
            sketch.vertex(x, y);
          }
          sketch.endShape();

          sketch.stroke("rgba(59, 130, 246, 0.4)"); // Horizontal component (drawn diagonal)
          sketch.beginShape();
          for (let x = 0; x < px1; x += 2) {
            let amp = 30 * sketch.sin(k * x - sketch.t * omega);
            sketch.vertex(x + amp * 0.5, -amp * 0.5);
          }
          sketch.endShape();

          // 2. Middle: Vertically Polarized Light (Horizontal component is blocked!)
          sketch.stroke("#ef4444"); // Solid red vertical wave
          sketch.strokeWeight(2);
          sketch.beginShape();
          for (let x = px1; x < px2; x += 2) {
            let y = 30 * sketch.sin(k * x - sketch.t * omega);
            sketch.vertex(x, y);
          }
          sketch.endShape();

          // 3. Right: Light polarized at analyzer angle theta
          // Amplitude = A0 * cos(theta), Intensity = I0 * cos^2(theta)
          let ampFactor = sketch.cos(thetaRad);
          let intensity = ampFactor * ampFactor;

          sketch.strokeWeight(2);
          // Wave will vibrate in the plane of the analyzer (rotated at theta)
          sketch.stroke(
            sketch.color(239 * intensity, 68 * intensity, 68 * intensity),
          ); // Intensity dims the color
          sketch.beginShape();
          for (let x = px2; x < px3; x += 2) {
            let waveAmp = 30 * ampFactor * sketch.sin(k * x - sketch.t * omega);
            // Project into 2D rotated plane
            let wy = waveAmp * sketch.cos(thetaRad);
            let wxProj = waveAmp * sketch.sin(thetaRad) * 0.5;
            sketch.vertex(x + wxProj, wy);
          }
          sketch.endShape();

          // 4. Vector projection gauge in bottom-right corner
          let gx = sketch.width - 90;
          let gy = 0;
          sketch.stroke("#64748b");
          sketch.strokeWeight(1.5);
          sketch.noFill();
          sketch.circle(gx - 20, gy, 60);
          sketch.line(gx - 50, gy, gx + 10, gy); // Horizontal reference
          sketch.line(gx - 20, gy - 30, gx - 20, gy + 30); // Vertical reference

          // Draw vertical component vector A0 (Red arrow)
          sketch.stroke("#ef4444");
          sketch.strokeWeight(3);
          sketch.line(gx - 20, gy, gx - 20, gy - 25);
          sketch.fill("#ef4444");
          sketch.triangle(gx - 20, gy - 25, gx - 23, gy - 20, gx - 17, gy - 20);

          // Draw analyzer axis (rotated dashed line)
          sketch.stroke("#0ea5e9");
          sketch.strokeWeight(1);
          sketch.drawingContext.setLineDash([2, 2]);
          sketch.line(
            gx - 20 - 30 * sketch.sin(thetaRad),
            gy + 30 * sketch.cos(thetaRad),
            gx - 20 + 30 * sketch.sin(thetaRad),
            gy - 30 * sketch.cos(thetaRad),
          );
          sketch.drawingContext.setLineDash([]);

          // Projected vector on analyzer: A = A0 * cos(theta) (Orange arrow along analyzer axis)
          let projLen = 25 * sketch.cos(thetaRad);
          let pxVal = gx - 20 + projLen * sketch.sin(thetaRad);
          let pyVal = gy - projLen * sketch.cos(thetaRad);
          sketch.stroke("#f97316"); // Orange
          sketch.strokeWeight(3);
          sketch.line(gx - 20, gy, pxVal, pyVal);

          sketch.fill(0);
          sketch.noStroke();
          sketch.textSize(11);
          sketch.textAlign(sketch.CENTER);
          sketch.text(
            `I = I₀ cos²θ\nIntensity: ${(intensity * 100).toFixed(1)}%`,
            gx - 20,
            gy + 50,
          );

          // General Overlay
          sketch.fill(0);
          sketch.textSize(12);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.LEFT);
          sketch.text(
            "Malus's Law Sandbox (মালুসের সূত্র সিমুলেশন)",
            -10,
            -110,
          );
          sketch.textStyle(sketch.NORMAL);
          sketch.textSize(10);
          sketch.fill("#475569");
          sketch.text(
            "Rotate the analyzer. Extinction (zero intensity) occurs at 90° and 270°.",
            -10,
            -95,
          );
        } else {
          // --- MODE 1: POLARIZATION BY REFRACTION / BREWSTER ---
          sketch.translate(sketch.width / 2, cy + 20);

          let R = 150;
          // Boundary line is horizontal at y = 0
          sketch.noStroke();
          sketch.fill("#f1f5f9"); // Air (top)
          sketch.rect(
            -sketch.width / 2,
            -sketch.height / 2,
            sketch.width,
            sketch.height / 2,
          );
          sketch.fill("rgba(148, 163, 184, 0.2)"); // Glass (bottom)
          sketch.rect(-sketch.width / 2, 0, sketch.width, sketch.height / 2);

          sketch.stroke("#64748b");
          sketch.strokeWeight(1.5);
          sketch.line(-sketch.width / 2, 0, sketch.width / 2, 0); // boundary line

          // Normals
          sketch.stroke("#94a3b8");
          sketch.drawingContext.setLineDash([3, 3]);
          sketch.line(0, -110, 0, 110);
          sketch.drawingContext.setLineDash([]);

          // Brewster Angle calculation: tan(ip) = mu. Glass mu = 1.5 -> ip = 56.3 deg
          let ip = 56.3;
          let ipRad = (ip * sketch.PI) / 180;
          let rpRad = sketch.HALF_PI - ipRad; // ip + rp = 90

          // 1. Draw Incident Ray (unpolarized)
          let ix = -R * sketch.sin(ipRad);
          let iy = -R * sketch.cos(ipRad);
          sketch.stroke("#ff2e63");
          sketch.strokeWeight(3.5);
          sketch.line(ix, iy, 0, 0);

          // Dots and double arrows to represent unpolarized vibration
          sketch.strokeWeight(1);
          sketch.stroke(0);
          sketch.fill(255);
          for (let d = 0.2; d <= 0.8; d += 0.2) {
            let dx = ix * (1 - d);
            let dy = iy * (1 - d);
            // Draw double arrow
            sketch.line(
              dx - 5 * sketch.cos(ipRad),
              dy + 5 * sketch.sin(ipRad),
              dx + 5 * sketch.cos(ipRad),
              dy - 5 * sketch.sin(ipRad),
            );
            // Draw dot in middle
            sketch.fill("#000");
            sketch.circle(dx, dy, 4);
          }

          // 2. Draw Reflected Ray (100% polarized parallel to boundary, i.e., out of page, shown as dots only!)
          let rx = R * sketch.sin(ipRad);
          let ry = -R * sketch.cos(ipRad);
          sketch.stroke("#10b981"); // Green reflected polarized ray
          sketch.strokeWeight(3.5);
          sketch.line(0, 0, rx, ry);

          // Draw dots only representing linear polarization parallel to surface
          sketch.fill(0);
          sketch.stroke(255);
          sketch.strokeWeight(1);
          for (let d = 0.2; d <= 0.8; d += 0.2) {
            let rdx = rx * d;
            let rdy = ry * d;
            sketch.circle(rdx, rdy, 6);
          }

          // 3. Draw Refracted Ray (partially polarized)
          let refX = R * sketch.sin(rpRad);
          let refY = R * sketch.cos(rpRad);
          sketch.stroke("#3b82f6"); // Blue refracted ray
          sketch.strokeWeight(3.5);
          sketch.line(0, 0, refX, refY);

          // Refraction marks
          for (let d = 0.2; d <= 0.8; d += 0.2) {
            let rfx = refX * d;
            let rfy = refY * d;
            // Draw smaller double arrows (partially polarized)
            sketch.stroke(0);
            sketch.line(
              rfx - 4 * sketch.cos(rpRad),
              rfy - 4 * sketch.sin(rpRad),
              rfx + 4 * sketch.cos(rpRad),
              rfy + 4 * sketch.sin(rpRad),
            );
          }

          // Angle arc indicating 90 degrees between reflected and refracted
          sketch.noFill();
          sketch.stroke("#ea580c");
          sketch.strokeWeight(2);
          sketch.arc(0, 0, 36, 36, -ipRad, sketch.HALF_PI + rpRad);

          sketch.fill("#ea580c");
          sketch.noStroke();
          sketch.textSize(11);
          sketch.text("90°", 18, 10);

          // Overlay Text
          sketch.fill(0);
          sketch.noStroke();
          sketch.textSize(11);
          sketch.textAlign(sketch.LEFT);
          sketch.text(
            `Brewster Angle (i_p): ${ip}°`,
            -sketch.width / 2 + 20,
            -110,
          );
          sketch.text(
            `Refractive Index (μ): 1.50`,
            -sketch.width / 2 + 20,
            -95,
          );
          sketch.text(
            `Reflected Ray: 100% Polarized (linear)`,
            rx - 5,
            ry - 15,
          );
          sketch.text(
            "Refracted Ray: Partially Polarized",
            refX - 10,
            refY + 15,
          );

          sketch.textSize(12);
          sketch.textStyle(sketch.BOLD);
          sketch.text(
            "Polarization by Reflection & Brewster's Law",
            -sketch.width / 2 + 20,
            sketch.height - 210,
          );
          sketch.textStyle(sketch.NORMAL);
        }

        sketch.t += 1.0;
        break;
      }
    }
  },
};
