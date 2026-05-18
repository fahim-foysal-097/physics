export const p1_ch6_sims = {
  setup: (sketch, vizType) => {
    sketch.angleMode(sketch.DEGREES);

    // Orbit parameters
    sketch.t = 0;
    sketch.orbitR = 110;
    sketch.orbitV = 2.0;

    // Kepler parameters
    sketch.ecc = 0.4;
    sketch.semi = 100;
    sketch.showSweep = 0; // 0=Hide, 1=Show
    sketch.keplerTheta = 0;
    sketch.sweptSectors = [];

    // Overhauled Escape Rocket parameters
    sketch.planetSelect = 0; // 0=Earth, 1=Moon, 2=Mars
    sketch.v_launch = 8.0;
    sketch.rocketY = 0; // Altitude above surface
    sketch.rocketVel = 0;
    sketch.rocketState = 0; // 0=Idle, 1=Flying, 2=Crashed, 3=Escaped
    sketch.rocketPath = [];
    sketch.explosionSize = 0;
    
    // Auto-launch trigger function
    sketch.launchRocket = () => {
      sketch.rocketY = 0;
      sketch.rocketVel = sketch.v_launch || 8.0;
      sketch.rocketState = 1;
      sketch.rocketPath = [];
      sketch.explosionSize = 0;
    };

    sketch.resetRocket = () => {
      sketch.rocketY = 0;
      sketch.rocketVel = 0;
      sketch.rocketState = 0;
      sketch.rocketPath = [];
      sketch.explosionSize = 0;
    };
  },

  draw: (sketch, vizType) => {
    sketch.background("#0b1329"); // Dark space background
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeJoin(sketch.ROUND);

    switch (vizType) {
      case "orbit_simulation": {
        let cx = sketch.width / 2;
        let cy = sketch.height / 2;
        
        sketch.push();
        sketch.translate(cx, cy);

        // Stars background
        sketch.stroke(255, 180);
        sketch.strokeWeight(1);
        sketch.point(-140, -80);
        sketch.point(120, -110);
        sketch.point(-100, 90);
        sketch.point(160, 60);

        let r = sketch.orbitR !== undefined ? sketch.orbitR : 110;

        // Draw Earth with details
        sketch.noStroke();
        sketch.fill("rgba(14, 165, 233, 0.18)");
        sketch.circle(0, 0, 56);
        sketch.fill("#0ea5e9"); // ocean
        sketch.circle(0, 0, 46);
        sketch.fill("#10b981"); // green lands
        sketch.arc(-8, -6, 20, 15, 45, 225);
        sketch.arc(10, 8, 16, 24, 135, 315);
        sketch.arc(-4, 10, 12, 10, 0, 180);

        // Draw Orbit Path
        sketch.noFill();
        sketch.stroke("rgba(255, 255, 255, 0.15)");
        sketch.strokeWeight(1);
        sketch.circle(0, 0, r * 2);

        // Satellite coordinates
        let ox = r * sketch.cos(sketch.t);
        let oy = r * sketch.sin(sketch.t);

        // Draw Satellite body
        sketch.push();
        sketch.translate(ox, oy);
        let satelliteAngle = sketch.t + 90;
        sketch.rotate(satelliteAngle);

        // Solar panels
        sketch.fill("#4f46e5"); 
        sketch.stroke("#818cf8");
        sketch.strokeWeight(1);
        sketch.rect(-18, -2, 12, 4);
        sketch.rect(6, -2, 12, 4);
        sketch.stroke(200);
        sketch.line(-6, 0, 6, 0); 
        
        // Satellite center body
        sketch.fill("#cbd5e1");
        sketch.stroke("#475569");
        sketch.rect(-4, -4, 8, 8, 1);
        sketch.fill("#ef4444"); 
        sketch.circle(0, 0, 3);
        sketch.pop();

        // Draw Force Vectors on Satellite
        p1_ch6_sims.drawArrow(sketch, ox, oy, ox - ox * 0.35, oy - oy * 0.35, "#38bdf8", 2); // F_g
        
        let vx = -sketch.sin(sketch.t) * 35;
        let vy = sketch.cos(sketch.t) * 35;
        p1_ch6_sims.drawArrow(sketch, ox, oy, ox + vx, oy + vy, "#f59e0b", 2); // v_tangent

        sketch.fill("#38bdf8");
        sketch.noStroke();
        sketch.textSize(9);
        sketch.text("F_gravity", ox - ox * 0.2, oy - oy * 0.2 - 6);
        sketch.fill("#f59e0b");
        sketch.text("v_orbital", ox + vx + 5, oy + vy);

        sketch.pop();

        // Evolution
        sketch.t += sketch.orbitV;

        let G = 6.67e-11;
        let M = 5.97e24; 
        let R_earth = 6371; 
        let h_scaled = (r - 23) * 50; 
        let actualV = sketch.sqrt((G * M) / ((R_earth + h_scaled) * 1000)); 
        let T_period = 2 * Math.PI * (R_earth + h_scaled) * 1000 / actualV; 

        p1_ch6_sims.drawPills(sketch, "Satellite Orbital Dynamics", [
          `h: ${h_scaled.toFixed(0)} km`,
          `Radius: ${(R_earth + h_scaled).toFixed(0)} km`,
          `v = √[GM/r] = ${(actualV / 1000).toFixed(2)} km/s`,
          `Period T: ${(T_period / 60).toFixed(1)} mins`
        ]);
        break;
      }

      case "kepler_laws_sim": {
        let ecc = sketch.ecc !== undefined ? sketch.ecc : 0.4;
        let a = sketch.semi !== undefined ? sketch.semi : 100;
        let b = a * sketch.sqrt(1 - ecc * ecc);
        let f = a * ecc; 

        let cx = sketch.width / 2;
        let cy = sketch.height / 2;

        sketch.push();
        sketch.translate(cx, cy);

        // Elliptical Orbit Outline
        sketch.stroke("rgba(255, 255, 255, 0.15)");
        sketch.strokeWeight(1.5);
        sketch.noFill();
        sketch.ellipse(-f, 0, a * 2, b * 2);

        // Draw Sun at Focus
        sketch.noStroke();
        sketch.fill("rgba(245, 158, 11, 0.2)");
        sketch.circle(-f * 2, 0, 36);
        sketch.fill("#f59e0b"); 
        sketch.circle(-f * 2, 0, 20);

        // Kepler's 2nd Law - equal area sectors
        if (sketch.showSweep === 1) {
          let sweepWidth = 16; 
          sketch.fill("rgba(16, 185, 129, 0.25)");
          sketch.stroke("rgba(16, 185, 129, 0.5)");
          
          // Sector 1: Perihelion
          sketch.beginShape();
          sketch.vertex(-f*2, 0);
          for (let ang = -sweepWidth; ang <= sweepWidth; ang++) {
            let r_ang = (a * (1 - ecc*ecc)) / (1 + ecc * sketch.cos(ang));
            let sx = r_ang * sketch.cos(ang) - f*2;
            let sy = r_ang * sketch.sin(ang);
            sketch.vertex(sx, sy);
          }
          sketch.endShape(sketch.CLOSE);

          // Sector 2: Aphelion
          sketch.beginShape();
          sketch.vertex(-f*2, 0);
          for (let ang = 180 - sweepWidth / 4; ang <= 180 + sweepWidth / 4; ang++) {
            let r_ang = (a * (1 - ecc*ecc)) / (1 + ecc * sketch.cos(ang));
            let sx = r_ang * sketch.cos(ang) - f*2;
            let sy = r_ang * sketch.sin(ang);
            sketch.vertex(sx, sy);
          }
          sketch.endShape(sketch.CLOSE);

          sketch.fill("#10b981");
          sketch.noStroke();
          sketch.textSize(9);
          sketch.text("A1 (Fast)", -f - 10, 16);
          sketch.text("A2 (Slow)", -f*3.2, 16);
        }

        // Planet mechanics
        let r_current = (a * (1 - ecc*ecc)) / (1 + ecc * sketch.cos(sketch.keplerTheta));
        let px = r_current * sketch.cos(sketch.keplerTheta) - f * 2;
        let py = r_current * sketch.sin(sketch.keplerTheta);

        let dTheta = (2500 / (r_current * r_current));
        sketch.keplerTheta += dTheta;

        // Radial vector Sun -> Planet
        sketch.stroke("rgba(255, 255, 255, 0.25)");
        sketch.strokeWeight(1.2);
        sketch.line(-f * 2, 0, px, py);

        // Draw Planet
        sketch.fill("#6366f1");
        sketch.stroke("#818cf8");
        sketch.strokeWeight(1.5);
        sketch.circle(px, py, 11);

        sketch.pop();

        let periodT = sketch.sqrt(a * a * a) * 0.1; 
        let tSquare = periodT * periodT;
        let aCube = a * a * a;
        let ratio = tSquare / aCube;

        p1_ch6_sims.drawPills(sketch, "Kepler's Laws Elliptical Sandbox", [
          `eccentricity e: ${ecc.toFixed(2)}`,
          `semi-major a: ${a.toFixed(0)}`,
          `T² / a³ Ratio: ${ratio.toFixed(5)}`,
          `2nd Law sweep: dA/dt = constant`
        ]);
        break;
      }

      case "escape_velocity_sandbox": {
        let planetIdx = sketch.planetSelect !== undefined ? sketch.planetSelect : 0;
        let launchSp = sketch.v_launch !== undefined ? sketch.v_launch : 8.0;

        let planetName = "Earth";
        let v_esc = 11.2;
        let gravityVal = 9.8;
        let pColor = "#38bdf8";
        let atmosphereGlow = "rgba(56, 189, 248, 0.15)";

        if (planetIdx === 1) {
          planetName = "Moon";
          v_esc = 2.4;
          gravityVal = 1.62;
          pColor = "#94a3b8"; // gray cratered moon
          atmosphereGlow = null;
        } else if (planetIdx === 2) {
          planetName = "Mars";
          v_esc = 5.0;
          gravityVal = 3.71;
          pColor = "#e28743"; // red iron mars
          atmosphereGlow = "rgba(226, 135, 67, 0.12)";
        }

        let R_planet = 120; // visual planet radius
        let cx = sketch.width / 2 + 50; // offset center to the right
        let cy = sketch.height + 60; // planet center coordinates

        // Draw Stars
        sketch.stroke(255, 100);
        sketch.strokeWeight(1);
        sketch.point(40, 50);
        sketch.point(90, 110);
        sketch.point(160, 40);
        sketch.point(320, 80);

        // Draw Planet circular dome
        sketch.noStroke();
        if (atmosphereGlow) {
          sketch.fill(atmosphereGlow);
          sketch.circle(cx, cy, R_planet * 2 + 35);
          sketch.fill(atmosphereGlow);
          sketch.circle(cx, cy, R_planet * 2 + 15);
        }
        
        sketch.fill(pColor);
        sketch.circle(cx, cy, R_planet * 2);

        // Draw craters on Moon or details on planet
        sketch.fill("rgba(0, 0, 0, 0.08)");
        if (planetIdx === 1) {
          // Moon craters
          sketch.circle(cx - 30, cy - 80, 14);
          sketch.circle(cx + 40, cy - 90, 18);
          sketch.circle(cx - 60, cy - 50, 10);
        } else if (planetIdx === 0) {
          // Earth continents
          sketch.arc(cx - 30, cy - 70, 40, 30, 40, 180);
          sketch.arc(cx + 35, cy - 65, 30, 50, 120, 300);
        } else {
          // Mars polar cap
          sketch.fill("#ffffff");
          sketch.arc(cx, cy - R_planet, 30, 10, 180, 360);
        }

        // Physics solver for vertical rocket escape!
        let groundY = cy - R_planet; // Rocket starts here (y = 0)
        let rocketPos = groundY - sketch.rocketY;

        if (sketch.rocketState === 1) {
          let dt = 0.25;
          // Core Newtonian Gravitational deceleration: a = -g * R^2 / (R+y)^2
          let R_sim = 80; // simulated radius scale
          let acc = -gravityVal * Math.pow(R_sim / (R_sim + sketch.rocketY * 0.4), 2);

          sketch.rocketVel += acc * dt * 0.12;
          sketch.rocketY += sketch.rocketVel * dt * 6.5;

          sketch.rocketPath.push({ x: cx, y: groundY - sketch.rocketY });

          if (sketch.rocketY <= 0) {
            sketch.rocketState = 2; // Crashed
            sketch.explosionSize = 6;
          } else if (sketch.rocketY > 210) {
            if (launchSp >= v_esc) {
              sketch.rocketState = 3; // Escaped successfully!
            } else {
              // Gravitational velocity turned negative, rocket begins falling back
              sketch.rocketVel = 0;
            }
          }
        }

        // Draw Flight path line
        sketch.stroke("rgba(255, 255, 255, 0.25)");
        sketch.strokeWeight(1.5);
        sketch.noFill();
        sketch.beginShape();
        for (let pt of sketch.rocketPath) {
          sketch.vertex(pt.x, pt.y);
        }
        sketch.endShape();

        // Draw Rocket body
        if (sketch.rocketState !== 2) {
          sketch.push();
          sketch.translate(cx, rocketPos);

          // Flicker exhaust engine jet
          if (sketch.rocketState === 1 && sketch.rocketVel > 0) {
            sketch.noStroke();
            sketch.fill("#ef4444");
            sketch.triangle(-4, 8, 4, 8, 0, 8 + sketch.random(5, 12));
            sketch.fill("#eab308");
            sketch.circle(0, 9, 4);
          }

          sketch.fill("#f8fafc");
          sketch.stroke("#475569");
          sketch.strokeWeight(1);
          sketch.rect(-4, -10, 8, 18, 1);
          sketch.fill("#ef4444");
          sketch.triangle(-4, -10, 4, -10, 0, -18); // Nose cone
          sketch.fill("#cbd5e1");
          sketch.rect(-6, 4, 2, 4); // Wings left
          sketch.rect(4, 4, 2, 4);  // Wings right
          sketch.pop();
        }

        // Draw explosion on crash
        if (sketch.rocketState === 2) {
          sketch.noStroke();
          sketch.fill("#ef4444");
          sketch.circle(cx, groundY, sketch.explosionSize);
          sketch.fill("#f97316");
          sketch.circle(cx, groundY, sketch.explosionSize * 0.6);
          if (sketch.explosionSize < 24) sketch.explosionSize += 1.5;
        }

        // 📈 Premium Gravitational Potential Well Curve U(r) = -GM/r!
        // We draw this on the left-half side of the screen
        let wellX = 15;
        let wellY = 80;
        let wellW = 100;
        let wellH = 140;

        sketch.stroke("rgba(255, 255, 255, 0.15)");
        sketch.strokeWeight(1);
        sketch.fill("rgba(15, 23, 42, 0.6)");
        sketch.rect(wellX, wellY, wellW, wellH, 6);

        sketch.noStroke();
        sketch.fill("#cbd5e1");
        sketch.textSize(8);
        sketch.text("Potential Well U(r)", wellX + 10, wellY + 12);
        
        // Potential well zero line
        sketch.stroke("rgba(255, 255, 255, 0.2)");
        sketch.line(wellX + 8, wellY + 25, wellX + wellW - 8, wellY + 25); // asymptotic zero energy

        // Draw curve: U(r) = -k/r
        sketch.stroke("#818cf8");
        sketch.strokeWeight(1.5);
        sketch.noFill();
        sketch.beginShape();
        for (let ry = 25; ry < wellH - 10; ry++) {
          let rx = wellX + 15 + 1800 / (ry + 30);
          sketch.vertex(rx, wellY + ry);
        }
        sketch.endShape();

        // Draw moving Glowing Bead along the gravity potential curve in real-time!
        let beadY = 25 + (sketch.rocketY * 0.48); // scale position
        beadY = sketch.constrain(beadY, 25, wellH - 15);
        let beadX = wellX + 15 + 1800 / (beadY + 30);

        sketch.noStroke();
        sketch.fill("#ef4444");
        sketch.circle(beadX, wellY + beadY, 6); // Moving marble on curve
        sketch.fill(255);
        sketch.circle(beadX, wellY + beadY, 3);

        // Rocket state banners
        if (sketch.rocketState === 2) {
          sketch.fill("#ef4444");
          sketch.textSize(10);
          sketch.text("LAUNCH FAILED: Crashed!", cx - 70, groundY - 30);
        } else if (sketch.rocketState === 3) {
          sketch.fill("#10b981");
          sketch.textSize(10);
          sketch.text("ESCAPE VELOCITY ACHIEVED! 🚀", cx - 85, 45);
        }

        p1_ch6_sims.drawPills(sketch, `Planetary Rocket Launcher (${planetName})`, [
          `Launch v_0: ${launchSp.toFixed(1)} km/s`,
          `v_escape: ${v_esc.toFixed(1)} km/s`,
          `Alt: ${(sketch.rocketY * 1.5).toFixed(0)} km`,
          sketch.rocketState === 3 ? "Escaped well!" : sketch.rocketVel > 0 ? "Flying up..." : sketch.rocketState === 2 ? "Crashed!" : "Ready"
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
    
    // Draw sci-fi dark title pill
    let tw = sketch.textWidth(title);
    sketch.fill("rgba(15, 23, 42, 0.85)");
    sketch.stroke("rgba(129, 140, 248, 0.3)");
    sketch.strokeWeight(1);
    sketch.rect(15, 12, tw + 20, 22, 11);
    
    sketch.fill("#f8fafc");
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textStyle(sketch.BOLD);
    sketch.text(title, 15 + (tw + 20)/2, 12 + 11);
    sketch.textStyle(sketch.NORMAL);

    // Draw dark metrics bar pill
    if (metrics && metrics.length > 0) {
      let metricsStr = metrics.join("   |   ");
      let mw = sketch.textWidth(metricsStr);
      let barW = mw + 30;
      
      sketch.fill("rgba(15, 23, 42, 0.85)");
      sketch.stroke("rgba(129, 140, 248, 0.3)");
      sketch.strokeWeight(1);
      sketch.rect(15, sketch.height - 34, barW, 22, 11);
      
      sketch.noStroke();
      sketch.fill("#cbd5e1");
      sketch.textAlign(sketch.LEFT, sketch.CENTER);
      sketch.text(metricsStr, 30, sketch.height - 34 + 11);
    }
    sketch.pop();
  }
};
