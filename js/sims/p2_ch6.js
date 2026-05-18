export const p2_ch6_sims = {
  setup: (sketch, vizType) => {
    if (vizType === "critical_angle_tir") {
      sketch.i = 45; // Incident angle in degrees
      sketch.n1 = 1.5; // Denser medium refractive index
      sketch.n2 = 1.0; // Rarer medium refractive index
    }
    if (vizType === "prism_ray_tracer") {
      sketch.i1 = 45; // Incident angle on face 1
      sketch.prismA = 60; // Prism refracting angle A
      sketch.nPrism = 1.5; // Prism refractive index
      sketch.lightType = 0; // 0 = Monochromatic Laser, 1 = White Light dispersion
    }
    if (vizType === "thin_lens_ray_tracer") {
      sketch.lensType = 0; // 0 = Convex (Converging), 1 = Concave (Diverging)
      sketch.u = 150; // Object distance in pixels
      sketch.f = 80; // Focal length in pixels
      sketch.objH = 50; // Object height in pixels
    }
  },

  draw: (sketch, vizType) => {
    switch (vizType) {
      case "critical_angle_tir": {
        sketch.translate(sketch.width / 2, sketch.height / 2 + 10);
        let R = 150; // Radius of semi-circle

        // Draw Rarer Medium (Top)
        sketch.noStroke();
        sketch.fill("#f0f9ff");
        sketch.rect(
          -sketch.width / 2,
          -sketch.height / 2,
          sketch.width,
          sketch.height / 2,
        );

        // Draw Denser Medium (Bottom semi-circle)
        sketch.fill("rgba(14, 165, 233, 0.15)");
        sketch.stroke("#0ea5e9");
        sketch.strokeWeight(1.5);
        sketch.arc(0, 0, R * 2, R * 2, 0, sketch.PI);
        sketch.line(-sketch.width / 2, 0, sketch.width / 2, 0); // boundary line

        // Draw Normal line (vertical)
        sketch.stroke("#94a3b8");
        sketch.strokeWeight(1);
        sketch.drawingContext.setLineDash([5, 5]);
        sketch.line(0, -sketch.height / 2, 0, sketch.height / 2);
        sketch.drawingContext.setLineDash([]); // Reset

        // Physics Calculations
        let n1 = sketch.n1;
        let n2 = sketch.n2;
        let swap = false;

        // Ensure n1 is denser, or handle swapping
        if (n1 < n2) {
          let temp = n1;
          n1 = n2;
          n2 = temp;
          swap = true; // Mediums swapped visually
        }

        let criticalAngleRad = sketch.asin(n2 / n1);
        let criticalAngleDeg = (criticalAngleRad * 180) / sketch.PI;

        let iRad = (sketch.i * sketch.PI) / 180;
        let isTIR = n1 > n2 && sketch.i > criticalAngleDeg;

        // Draw Incident Ray
        // Coming from bottom-left (-x, +y) to center (0,0)
        let ix = -R * sketch.sin(iRad);
        let iy = R * sketch.cos(iRad);
        sketch.stroke("#e11d48"); // Red incident ray
        sketch.strokeWeight(3);
        sketch.line(ix, iy, 0, 0);

        // Arrow on incident ray
        let mix = ix / 2;
        let miy = iy / 2;
        sketch.push();
        sketch.translate(mix, miy);
        sketch.rotate(-iRad);
        sketch.fill("#e11d48");
        sketch.noStroke();
        sketch.triangle(0, -6, -5, 6, 5, 6);
        sketch.pop();

        if (isTIR) {
          // Total Internal Reflection: Reflected ray goes bottom-right (+x, +y)
          let rx = R * sketch.sin(iRad);
          let ry = R * sketch.cos(iRad);
          sketch.stroke("#10b981"); // Vibrant green for TIR reflected ray
          sketch.strokeWeight(3);
          sketch.line(0, 0, rx, ry);

          // Arrow on TIR ray
          sketch.push();
          sketch.translate(rx / 2, ry / 2);
          sketch.rotate(iRad);
          sketch.fill("#10b981");
          sketch.noStroke();
          sketch.triangle(0, -6, -5, 6, 5, 6);
          sketch.pop();

          // TIR text indicator
          sketch.fill("#10b981");
          sketch.noStroke();
          sketch.textSize(14);
          sketch.textStyle(sketch.BOLD);
          sketch.textAlign(sketch.CENTER);
          sketch.text(
            "TOTAL INTERNAL REFLECTION (পূর্ণ অভ্যন্তরীণ প্রতিফলন)",
            0,
            -100,
          );
          sketch.textStyle(sketch.NORMAL);
        } else {
          // Refraction occurs
          // Calculate Refracted angle r using Snell's Law
          let sin_r = (n1 * sketch.sin(iRad)) / n2;
          let rRad = sketch.asin(sin_r);
          let rDeg = (rRad * 180) / sketch.PI;

          // Refracted ray goes into top-right (+x, -y)
          let rx = R * sketch.sin(rRad);
          let ry = -R * sketch.cos(rRad);
          sketch.stroke("#e11d48");
          sketch.strokeWeight(3);
          sketch.line(0, 0, rx, ry);

          // Arrow on refracted ray
          sketch.push();
          sketch.translate(rx / 2, ry / 2);
          sketch.rotate(sketch.PI - rRad);
          sketch.fill("#e11d48");
          sketch.noStroke();
          sketch.triangle(0, -6, -5, 6, 5, 6);
          sketch.pop();

          // Draw a faint reflected ray in bottom-right (weak reflection always exists)
          sketch.stroke("rgba(16, 185, 129, 0.35)");
          sketch.strokeWeight(1.5);
          sketch.line(0, 0, R * sketch.sin(iRad), R * sketch.cos(iRad));

          // Angle Labels on Screen
          sketch.fill(0);
          sketch.noStroke();
          sketch.textSize(12);
          sketch.textAlign(sketch.LEFT);
          sketch.text(`Refraction Angle (r): ${rDeg.toFixed(1)}°`, 20, -60);
        }

        // Ambient Labels
        sketch.fill("#475569");
        sketch.noStroke();
        sketch.textSize(12);
        sketch.textAlign(sketch.LEFT);
        sketch.text(
          `Denser Medium (Glass): n₁ = ${n1.toFixed(2)}`,
          -sketch.width / 2 + 20,
          40,
        );
        sketch.text(
          `Rarer Medium (Air): n₂ = ${n2.toFixed(2)}`,
          -sketch.width / 2 + 20,
          -40,
        );
        sketch.text(
          `Incident Angle (i): ${sketch.i}°`,
          -sketch.width / 2 + 20,
          20,
        );
        sketch.text(
          `Critical Angle (θc): ${criticalAngleDeg.toFixed(1)}°`,
          -sketch.width / 2 + 20,
          60,
        );

        sketch.textAlign(sketch.RIGHT);
        sketch.fill(0);
        sketch.text("Normal (অভিলম্ব)", sketch.width / 2 - 20, -120);
        break;
      }

      case "prism_ray_tracer": {
        sketch.translate(sketch.width / 2, sketch.height / 2 + 35);
        let A = sketch.prismA;
        let n = sketch.nPrism;
        let Arad = (A * sketch.PI) / 180;

        let sideLen = 175;
        let h = sideLen * sketch.cos(Arad / 2);
        let b = sideLen * sketch.sin(Arad / 2);

        // Vertices of Prism
        let V1 = sketch.createVector(0, -h / 2 - 20); // Top Apex
        let V2 = sketch.createVector(-b, h / 2 - 20); // Bottom-Left
        let V3 = sketch.createVector(b, h / 2 - 20); // Bottom-Right

        // Draw Prism
        sketch.fill("rgba(56, 189, 248, 0.08)");
        sketch.stroke("#38bdf8");
        sketch.strokeWeight(2.5);
        sketch.triangle(V1.x, V1.y, V2.x, V2.y, V3.x, V3.y);

        // Ray Tracing calculations using mathematically perfect Vector Snell's Law
        let traceRay = (nRef) => {
          let i1Rad = (sketch.i1 * sketch.PI) / 180;

          // Face 1 segment (Left face): V1 to V2
          let vAB = p5.Vector.sub(V2, V1);
          let t_up = p5.Vector.sub(V1, V2).normalize(); // Tangent pointing up-right (towards apex V1)
          let u_in1 = sketch.createVector(vAB.y, -vAB.x).normalize(); // Points inward (right-down)
          let u_n1 = p5.Vector.mult(u_in1, -1); // Outward normal (left-up)

          // Face 2 segment (Right face): V1 to V3
          let vAC = p5.Vector.sub(V3, V1);
          let t2 = vAC.copy().normalize(); // Tangent vector pointing down-right (towards base V3)
          let u_n2 = sketch.createVector(vAC.y, -vAC.x).normalize(); // Outward normal vector (pointing right-up)

          // 1. Point of entry P1: placed at 55% down the left face
          let P1 = p5.Vector.add(V1, p5.Vector.mult(vAB, 0.55));

          // 2. Incident ray vector u_inc: points inside-up, angle with inward normal u_in1 is i1
          let u_inc = p5.Vector.add(
            p5.Vector.mult(u_in1, sketch.cos(i1Rad)),
            p5.Vector.mult(t_up, sketch.sin(i1Rad)),
          ).normalize();

          // 3. Refraction at Face 1 (Air -> Glass)
          let sin_r1 = sketch.sin(i1Rad) / nRef;
          if (Math.abs(sin_r1) > 1.0) return null;
          let r1Rad = sketch.asin(sin_r1);
          let cos_r1 = sketch.cos(r1Rad);

          // Refracted ray vector u_mid: cos(r1)*u_in1 + sin(r1)*t_up
          let u_mid = p5.Vector.add(
            p5.Vector.mult(u_in1, cos_r1),
            p5.Vector.mult(t_up, sketch.sin(r1Rad)),
          ).normalize();

          // 4. Find intersection point P2 with the prism boundaries (Right face AC or Bottom face BC)
          let P2 = null;
          let exitNormal = u_n2;
          let exitTangent = t2;

          // Check Right Face AC intersection
          let s_ac = 999999,
            t_ac = -1;
          let div_ac = u_mid.x * vAC.y - u_mid.y * vAC.x;
          if (Math.abs(div_ac) > 0.0001) {
            s_ac = ((V1.x - P1.x) * vAC.y - (V1.y - P1.y) * vAC.x) / div_ac;
            t_ac = ((V1.x - P1.x) * u_mid.y - (V1.y - P1.y) * u_mid.x) / div_ac;
          }

          // Check Bottom Face BC intersection
          let vBC = p5.Vector.sub(V3, V2);
          let s_bc = 999999,
            t_bc = -1;
          let div_bc = u_mid.x * vBC.y - u_mid.y * vBC.x;
          if (Math.abs(div_bc) > 0.0001) {
            s_bc = ((V2.x - P1.x) * vBC.y - (V2.y - P1.y) * vBC.x) / div_bc;
            t_bc = ((V2.x - P1.x) * u_mid.y - (V2.y - P1.y) * u_mid.x) / div_bc;
          }

          // Determine which face the ray hits first
          let hasAC = s_ac > 0.1 && t_ac >= 0 && t_ac <= 1.0;
          let hasBC = s_bc > 0.1 && t_bc >= 0 && t_bc <= 1.0;

          if (hasAC && (!hasBC || s_ac < s_bc)) {
            P2 = p5.Vector.add(P1, p5.Vector.mult(u_mid, s_ac));
            exitNormal = u_n2;
            exitTangent = t2;
          } else if (hasBC) {
            P2 = p5.Vector.add(P1, p5.Vector.mult(u_mid, s_bc));
            exitNormal = sketch.createVector(0, 1); // Bottom normal points straight down
            exitTangent = sketch.createVector(1, 0); // Bottom tangent points straight right
          } else {
            // Fallback: draw ray exiting straight through the right side
            P2 = p5.Vector.add(P1, p5.Vector.mult(u_mid, 80));
            return {
              P1,
              P2,
              u_inc,
              u_mid,
              u_out: u_mid.copy(),
              isPrismTIR: false,
              i2Deg: 0,
              r1Rad,
              r2Rad: 0,
              D: 0,
              u_n1,
              u_n2,
            };
          }

          // 5. Refraction/Reflection at exit point P2
          let v_t = u_mid.dot(exitTangent);
          let v_n = u_mid.dot(exitNormal);

          let v_out_t = nRef * v_t;
          let isPrismTIR = Math.abs(v_out_t) > 1.0;

          let u_out = null;
          let i2Deg = 0;
          let D_dev = 0;

          if (isPrismTIR) {
            // Total Internal Reflection: reverse normal component, conserve tangent component
            u_out = p5.Vector.add(
              p5.Vector.mult(exitNormal, -v_n),
              p5.Vector.mult(exitTangent, v_t),
            ).normalize();
            D_dev = 180; // TIR placeholder
          } else {
            // Ordinary Refraction
            let cos_i2 = sketch.sqrt(sketch.max(0, 1 - v_out_t * v_out_t));
            u_out = p5.Vector.add(
              p5.Vector.mult(exitNormal, cos_i2),
              p5.Vector.mult(exitTangent, v_out_t),
            ).normalize();

            // Emergent angle i2 (asin of outer tangent component)
            i2Deg =
              (sketch.asin(sketch.max(-1, sketch.min(1, v_out_t))) * 180) /
              sketch.PI;

            // Deviation Angle D: angle between u_inc and u_out
            let dot_inc_out = u_inc.dot(u_out);
            dot_inc_out = Math.max(-1, Math.min(1, dot_inc_out));
            D_dev = (sketch.acos(dot_inc_out) * 180) / sketch.PI;
          }

          return {
            P1,
            P2,
            u_inc,
            u_mid,
            u_out,
            isPrismTIR,
            i2Deg,
            r1Rad,
            r2Rad: sketch.acos(
              sketch.max(-1, sketch.min(1, u_mid.dot(exitNormal))),
            ),
            D: D_dev,
            u_n1,
            u_n2: exitNormal,
          };
        };

        // If Monochromatic Laser (lightType == 0)
        if (sketch.lightType === 0) {
          let res = traceRay(n);
          if (res) {
            // Draw Face Normals (dashed)
            sketch.stroke("#94a3b8");
            sketch.strokeWeight(1);
            sketch.drawingContext.setLineDash([4, 4]);
            sketch.line(
              res.P1.x - res.u_n1.x * 35,
              res.P1.y - res.u_n1.y * 35,
              res.P1.x + res.u_n1.x * 35,
              res.P1.y + res.u_n1.y * 35,
            );
            sketch.line(
              res.P2.x - res.u_n2.x * 35,
              res.P2.y - res.u_n2.y * 35,
              res.P2.x + res.u_n2.x * 35,
              res.P2.y + res.u_n2.y * 35,
            );
            sketch.drawingContext.setLineDash([]);

            // Draw Incoming Ray (Vibrant Pink Laser)
            sketch.stroke("#ff2e63");
            sketch.strokeWeight(3.5);
            let rayStart = p5.Vector.sub(res.P1, p5.Vector.mult(res.u_inc, 90));
            sketch.line(rayStart.x, rayStart.y, res.P1.x, res.P1.y);

            // Draw Refracted Ray inside prism (Vibrant Pink Laser)
            sketch.line(res.P1.x, res.P1.y, res.P2.x, res.P2.y);

            // Draw Outgoing Ray
            if (res.isPrismTIR) {
              sketch.stroke("#10b981"); // green for TIR
              let rayEnd = p5.Vector.add(res.P2, p5.Vector.mult(res.u_out, 80));
              sketch.line(res.P2.x, res.P2.y, rayEnd.x, rayEnd.y);

              sketch.fill("#10b981");
              sketch.noStroke();
              sketch.textSize(12);
              sketch.textStyle(sketch.BOLD);
              sketch.textAlign(sketch.CENTER);
              sketch.text("Total Internal Reflection!", 0, h / 2 + 25);
              sketch.textStyle(sketch.NORMAL);
            } else {
              sketch.stroke("#ff2e63");
              let rayEnd = p5.Vector.add(res.P2, p5.Vector.mult(res.u_out, 90));
              sketch.line(res.P2.x, res.P2.y, rayEnd.x, rayEnd.y);

              // Extension dashed lines to show Deviation D
              sketch.stroke("rgba(148, 163, 184, 0.45)");
              sketch.strokeWeight(1);
              sketch.drawingContext.setLineDash([2, 2]);
              let extIn = p5.Vector.add(res.P1, p5.Vector.mult(res.u_inc, 60));
              let extOut = p5.Vector.sub(res.P2, p5.Vector.mult(res.u_out, 60));
              sketch.line(res.P1.x, res.P1.y, extIn.x, extIn.y);
              sketch.line(res.P2.x, res.P2.y, extOut.x, extOut.y);
              sketch.drawingContext.setLineDash([]);

              // Display Numerical Indicators
              sketch.fill(0);
              sketch.noStroke();
              sketch.textSize(11);
              sketch.textAlign(sketch.LEFT);
              sketch.text(
                `Incident Angle (i₁): ${sketch.i1}°`,
                -sketch.width / 2 + 20,
                -110,
              );
              sketch.text(
                `Refraction Face 1 (r₁): ${((res.r1Rad * 180) / sketch.PI).toFixed(1)}°`,
                -sketch.width / 2 + 20,
                -95,
              );
              sketch.text(
                `Refraction Face 2 (r₂): ${((res.r2Rad * 180) / sketch.PI).toFixed(1)}°`,
                -sketch.width / 2 + 20,
                -80,
              );
              sketch.text(
                `Emergence Angle (i₂): ${res.i2Deg.toFixed(1)}°`,
                -sketch.width / 2 + 20,
                -65,
              );
              sketch.fill("#e11d48");
              sketch.textStyle(sketch.BOLD);
              sketch.text(
                `Angle of Deviation (D): ${res.D.toFixed(1)}°`,
                -sketch.width / 2 + 20,
                -45,
              );
              sketch.textStyle(sketch.NORMAL);
            }
          }
        } else {
          // White Light Dispersion Mode!
          // Define 7 colors of the rainbow and refractive index offsets
          let colors = [
            { name: "Violet", val: "#7f00ff", nOffset: 0.032 },
            { name: "Indigo", val: "#4b0082", nOffset: 0.024 },
            { name: "Blue", val: "#0000ff", nOffset: 0.016 },
            { name: "Green", val: "#00ff00", nOffset: 0.008 },
            { name: "Yellow", val: "#ffff00", nOffset: 0.0 },
            { name: "Orange", val: "#ff7f00", nOffset: -0.008 },
            { name: "Red", val: "#ff0000", nOffset: -0.016 },
          ];

          let baseRes = traceRay(n);
          if (baseRes) {
            // Draw Incident white beam (White light)
            sketch.stroke("#ffffff");
            sketch.strokeWeight(4.5);
            let rayStart = p5.Vector.sub(
              baseRes.P1,
              p5.Vector.mult(baseRes.u_inc, 90),
            );
            sketch.line(rayStart.x, rayStart.y, baseRes.P1.x, baseRes.P1.y);

            // Draw face normals (dashed, faint)
            sketch.stroke("rgba(148, 163, 184, 0.4)");
            sketch.strokeWeight(1);
            sketch.drawingContext.setLineDash([4, 4]);
            sketch.line(
              baseRes.P1.x - baseRes.u_n1.x * 30,
              baseRes.P1.y - baseRes.u_n1.y * 30,
              baseRes.P1.x + baseRes.u_n1.x * 30,
              baseRes.P1.y + baseRes.u_n1.y * 30,
            );
            sketch.line(
              baseRes.P2.x - baseRes.u_n2.x * 30,
              baseRes.P2.y - baseRes.u_n2.y * 30,
              baseRes.P2.x + baseRes.u_n2.x * 30,
              baseRes.P2.y + baseRes.u_n2.y * 30,
            );
            sketch.drawingContext.setLineDash([]);

            // Trace and draw each color component separately
            colors.forEach((col) => {
              let colRes = traceRay(n + col.nOffset);
              if (colRes) {
                sketch.stroke(col.val);
                sketch.strokeWeight(2.0);

                // Draw inside prism ray
                sketch.line(colRes.P1.x, colRes.P1.y, colRes.P2.x, colRes.P2.y);

                // Draw emerging ray
                let rayEnd = p5.Vector.add(
                  colRes.P2,
                  p5.Vector.mult(colRes.u_out, 90),
                );
                sketch.line(colRes.P2.x, colRes.P2.y, rayEnd.x, rayEnd.y);
              }
            });

            // Dispersion summary text
            sketch.fill(0);
            sketch.noStroke();
            sketch.textSize(12);
            sketch.textAlign(sketch.LEFT);
            sketch.textStyle(sketch.BOLD);
            sketch.text(
              "White Light Dispersion (Cauchy Refraction)",
              -sketch.width / 2 + 20,
              -100,
            );
            sketch.textStyle(sketch.NORMAL);
            sketch.text(
              "Red (lower μ) refracts least, Violet (higher μ) refracts most.",
              -sketch.width / 2 + 20,
              -80,
            );
          }
        }

        // General Info
        sketch.fill("#475569");
        sketch.noStroke();
        sketch.textSize(11);
        sketch.textAlign(sketch.RIGHT);
        sketch.text(`Prism Angle (A): ${A}°`, sketch.width / 2 - 20, -110);
        sketch.text(
          `Base Glass Index (n): ${n.toFixed(2)}`,
          sketch.width / 2 - 20,
          -95,
        );
        break;
      }

      case "thin_lens_ray_tracer": {
        sketch.translate(sketch.width / 2, sketch.height / 2);

        let u = sketch.u;
        let f = sketch.f;
        let objH = sketch.objH;
        let lensType = sketch.lensType; // 0 = Convex, 1 = Concave

        // Set lens parameters based on type
        let fLens = lensType === 0 ? f : -f;

        // Draw Optical Axis (horizontal line)
        sketch.stroke("#cbd5e1");
        sketch.strokeWeight(1.5);
        sketch.line(-sketch.width / 2, 0, sketch.width / 2, 0);

        // Draw Focal Points F & 2F
        sketch.strokeWeight(1);
        sketch.fill("#10b981");
        sketch.noStroke();

        // F1 and F2
        sketch.circle(-f, 0, 6);
        sketch.circle(f, 0, 6);
        // 2F1 and 2F2
        sketch.fill("#64748b");
        sketch.circle(-2 * f, 0, 5);
        sketch.circle(2 * f, 0, 5);

        // Labels for F & 2F
        sketch.textSize(10);
        sketch.textAlign(sketch.CENTER);
        sketch.text("F", -f, 15);
        sketch.text("F", f, 15);
        sketch.text("2F", -2 * f, 15);
        sketch.text("2F", 2 * f, 15);

        // Draw Lens Plane (vertical dotted line representing optical center plane)
        sketch.stroke("rgba(148, 163, 184, 0.45)");
        sketch.drawingContext.setLineDash([3, 3]);
        sketch.line(0, -sketch.height / 2 + 40, 0, sketch.height / 2 - 40);
        sketch.drawingContext.setLineDash([]);

        // Draw Lens Illustration - HIGHLY ACCURATE TEXTBOOK LENS DESIGN
        sketch.stroke("#0ea5e9");
        sketch.fill("rgba(14, 165, 233, 0.2)");
        sketch.strokeWeight(2.5);
        if (lensType === 0) {
          // Double Convex Lens: thick in the middle, intersecting arcs at the ends
          sketch.beginShape();
          sketch.vertex(0, -100);
          sketch.quadraticVertex(18, 0, 0, 100);
          sketch.quadraticVertex(-18, 0, 0, -100);
          sketch.endShape(sketch.CLOSE);
        } else {
          // Double Concave Lens: thin in the middle, thick flat ends, curving inwards
          sketch.beginShape();
          sketch.vertex(-18, -100);
          sketch.vertex(18, -100);
          sketch.quadraticVertex(6, 0, 18, 100);
          sketch.vertex(-18, 100);
          sketch.quadraticVertex(-6, 0, -18, -100);
          sketch.endShape(sketch.CLOSE);
        }

        // Draw Object arrow (Blue)
        sketch.stroke("#2563eb");
        sketch.strokeWeight(4);
        sketch.line(-u, 0, -u, -objH);

        // Arrowhead on Object
        sketch.fill("#2563eb");
        sketch.noStroke();
        sketch.triangle(-u, -objH, -u - 5, -objH + 8, -u + 5, -objH + 8);

        // Calculate Image Position v using thin lens formula: 1/u + 1/v = 1/f -> v = (u*f) / (u-f)
        let v = (u * fLens) / (u - fLens);
        let m = -v / u;
        let imageH = m * objH;

        // Tracing Principal Rays
        let tip = sketch.createVector(-u, -objH);

        // Ray 1: Parallel to Axis
        sketch.stroke("#ff7e67");
        sketch.strokeWeight(1.5);
        sketch.line(tip.x, tip.y, 0, -objH);

        if (lensType === 0) {
          // Convex Refraction through focal point F on right: (f, 0)
          sketch.line(0, -objH, f * 3.5, objH * 3.5 - objH);
          if (v < 0) {
            // Virtual extension backwards (dashed)
            sketch.stroke("rgba(239, 68, 68, 0.4)");
            sketch.drawingContext.setLineDash([3, 3]);
            sketch.line(0, -objH, -f * 3.5, -objH * 3.5 - objH);
            sketch.drawingContext.setLineDash([]);
          }
        } else {
          // Concave Refraction: diverging away from F on left: (-f, 0)
          sketch.line(0, -objH, f * 3.5, -objH * 4.5);
          // Virtual extension backwards (dashed)
          sketch.stroke("rgba(239, 68, 68, 0.4)");
          sketch.drawingContext.setLineDash([3, 3]);
          sketch.line(0, -objH, -f, 0);
          sketch.drawingContext.setLineDash([]);
        }

        // Ray 2: Through Optical Center (0,0) (Bends none)
        sketch.stroke("#ec4899"); // Pink
        sketch.line(
          tip.x,
          tip.y,
          sketch.width / 2,
          (sketch.width / 2) * (objH / u),
        );
        if (v < 0) {
          // Virtual extension backwards
          sketch.stroke("rgba(236, 72, 153, 0.4)");
          sketch.drawingContext.setLineDash([3, 3]);
          sketch.line(
            0,
            0,
            -sketch.width / 2,
            (-sketch.width / 2) * (objH / u),
          );
          sketch.drawingContext.setLineDash([]);
        }

        // Ray 3: Through/towards focal point
        sketch.stroke("#a855f7"); // Purple
        if (lensType === 0) {
          // Convex: goes through F on left (-f, 0) to lens plane
          let hLens = (objH * f) / (u - f);
          sketch.line(tip.x, tip.y, 0, -hLens);
          sketch.line(0, -hLens, sketch.width / 2, -hLens);
          if (v < 0) {
            sketch.stroke("rgba(168, 85, 247, 0.4)");
            sketch.drawingContext.setLineDash([3, 3]);
            sketch.line(0, -hLens, -sketch.width / 2, -hLens);
            sketch.drawingContext.setLineDash([]);
          }
        } else {
          // Concave: goes towards F on right (f, 0) to lens plane
          let hLens = (-objH * f) / (u + f);
          sketch.line(tip.x, tip.y, 0, hLens);
          sketch.line(0, hLens, sketch.width / 2, hLens);
          // Virtual extension backwards
          sketch.stroke("rgba(168, 85, 247, 0.4)");
          sketch.drawingContext.setLineDash([3, 3]);
          sketch.line(0, hLens, -sketch.width / 2, hLens);
          sketch.drawingContext.setLineDash([]);
        }

        // Draw Image Arrow (Orange)
        if (Math.abs(v) < sketch.width) {
          sketch.stroke("#ea580c"); // Orange for Image
          sketch.strokeWeight(4);

          if (v < 0) {
            // Virtual Image (Dashed arrow)
            sketch.drawingContext.setLineDash([4, 2.5]);
          }
          sketch.line(v, 0, v, -imageH);
          sketch.drawingContext.setLineDash([]);

          // Image Arrowhead
          sketch.fill("#ea580c");
          sketch.noStroke();
          if (imageH >= 0) {
            sketch.triangle(v, -imageH, v - 5, -imageH + 8, v + 5, -imageH + 8);
          } else {
            sketch.triangle(v, -imageH, v - 5, -imageH - 8, v + 5, -imageH - 8);
          }
        }

        // Numerical Display overlay
        sketch.fill(0);
        sketch.noStroke();
        sketch.textSize(11);
        sketch.textAlign(sketch.LEFT);
        sketch.text(
          `Lens Type: ${lensType === 0 ? "Convex (Converging)" : "Concave (Diverging)"}`,
          -sketch.width / 2 + 20,
          -110,
        );
        sketch.text(
          `Object Dist (u): ${u.toFixed(1)} px`,
          -sketch.width / 2 + 20,
          -95,
        );
        sketch.text(`Focal Length (f): ${f} px`, -sketch.width / 2 + 20, -80);
        sketch.text(
          `Image Dist (v): ${v.toFixed(1)} px`,
          -sketch.width / 2 + 20,
          -65,
        );

        sketch.fill("#ea580c");
        sketch.textStyle(sketch.BOLD);
        sketch.text(
          `Magnification (m): ${(-m).toFixed(2)}x`,
          -sketch.width / 2 + 20,
          -45,
        );
        sketch.text(
          `Image Class: ${v > 0 ? "REAL & INVERTED" : "VIRTUAL & ERECT"}`,
          -sketch.width / 2 + 20,
          -30,
        );
        sketch.textStyle(sketch.NORMAL);
        break;
      }
    }
  },
};
