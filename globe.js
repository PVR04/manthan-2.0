/**
 * MANTHAN 2.0 — 3D Cyber Earth Emblem Animation Engine
 * Continuous autonomous 360° circular rotation of the Earth globe,
 * orbiting satellite node, star beacon flare, and motherboard circuit streams.
 */

(function () {
  'use strict';

  // Emblem geometry relative to 559 x 686 design space
  const REF_W = 559;
  const REF_H = 686;
  const GLOBE_CX = 279.5;
  const GLOBE_CY = 368.0;
  const GLOBE_R = 188.0;

  // Key locations in 559x686 space
  const STAR_POS = { x: 279.5, y: 40.0 };
  const OUTER_SATELLITES = [
    { x: 58, y: 380 },
    { x: 388, y: 235 },
    { x: 505, y: 490 }
  ];

  // Circuit trace paths for downward energy pulses
  const CIRCUIT_PATHS = [
    [ { x: 279.5, y: 480 }, { x: 279.5, y: 550 }, { x: 279.5, y: 640 }, { x: 279.5, y: 680 } ],
    [ { x: 264, y: 510 }, { x: 264, y: 580 }, { x: 264, y: 615 } ],
    [ { x: 295, y: 510 }, { x: 295, y: 590 }, { x: 295, y: 625 } ],
    [ { x: 250, y: 535 }, { x: 240, y: 560 }, { x: 240, y: 600 } ],
    [ { x: 310, y: 535 }, { x: 320, y: 560 }, { x: 320, y: 600 } ],
    [ { x: 215, y: 495 }, { x: 250, y: 535 } ],
    [ { x: 345, y: 495 }, { x: 310, y: 535 } ]
  ];

  // Tech hub coordinates [lat, lon, name]
  const TECH_HUBS = [
    { lat: 12.97, lon: 77.59, name: 'Bengaluru' },
    { lat: 28.61, lon: 77.20, name: 'New Delhi' },
    { lat: 35.67, lon: 139.65, name: 'Tokyo' },
    { lat: 51.50, lon: -0.12, name: 'London' },
    { lat: 37.77, lon: -122.41, name: 'San Francisco' },
    { lat: 25.20, lon: 55.27, name: 'Dubai' },
    { lat: 1.35, lon: 103.82, name: 'Singapore' },
    { lat: -33.86, lon: 151.20, name: 'Sydney' }
  ];

  class CyberGlobeEmblem {
    constructor(container) {
      this.container = container;
      this.initDOMElements();

      // Continuous autonomous rotation state
      this.rotAngle = 0.6;
      this.rotSpeed = 0.015; // smooth, unmistakable continuous circular rotation
      this.axialTiltZ = 0.28; // ~16 deg axial tilt
      this.tiltX = -0.14;     // gentle camera perspective angle

      // Animation time & state
      this.lastTime = performance.now();
      this.active = true;

      // Circuit stream pulses
      this.circuitPulses = [];
      this.nextCircuitPulse = 0;

      // Load land points
      this.initLandDots();

      // Handle responsive resize & visibility
      this.bindEvents();

      // Start continuous circular animation loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initDOMElements() {
      this.container.innerHTML = `
        <div class="hero-emblem-inner">
          <div class="hero-emblem-glow-under"></div>
          <canvas class="hero-emblem-canvas globe-bg-canvas" id="globeBgCanvas"></canvas>
          <img src="assets/emblem_frame.png" alt="MANTHAN 2.0 AI Emblem" class="hero-emblem-frame" id="emblemFrameImg">
          <canvas class="hero-emblem-canvas globe-fg-canvas" id="globeFgCanvas"></canvas>
        </div>
      `;

      this.innerWrap = this.container.querySelector('.hero-emblem-inner');
      this.bgCanvas = this.container.querySelector('#globeBgCanvas');
      this.fgCanvas = this.container.querySelector('#globeFgCanvas');
      this.frameImg = this.container.querySelector('#emblemFrameImg');

      this.bgCtx = this.bgCanvas.getContext('2d');
      this.fgCtx = this.fgCanvas.getContext('2d');

      this.handleResize();
    }

    initLandDots() {
      // 1. High-density accurate world dots from assets/globe_data.js
      if (window.MANTHAN_GLOBE_DOTS && Array.isArray(window.MANTHAN_GLOBE_DOTS)) {
        this.landDots = window.MANTHAN_GLOBE_DOTS.map(([lat, lon]) => ({
          latRad: (lat * Math.PI) / 180,
          lonRad: (lon * Math.PI) / 180
        }));
      } else {
        // Fallback procedural dot matrix
        this.landDots = [];
        for (let lat = -70; lat <= 70; lat += 3.5) {
          const latRad = (lat * Math.PI) / 180;
          for (let lon = -180; lon < 180; lon += 4) {
            const lonRad = (lon * Math.PI) / 180;
            if (
              (lat > 10 && lat < 68 && lon > -165 && lon < -55) ||
              (lat > -55 && lat < 12 && lon > -85 && lon < -35) ||
              (lat > 35 && lat < 70 && lon > -10 && lon < 50) ||
              (lat > -35 && lat < 36 && lon > -18 && lon < 52) ||
              (lat > 5 && lat < 75 && lon > 50 && lon < 150) ||
              (lat > -42 && lat < -10 && lon > 112 && lon < 155)
            ) {
              this.landDots.push({ latRad, lonRad });
            }
          }
        }
      }

      this.techHubs = TECH_HUBS.map(h => ({
        ...h,
        latRad: (h.lat * Math.PI) / 180,
        lonRad: (h.lon * Math.PI) / 180
      }));
    }

    handleResize() {
      const rect = this.container.getBoundingClientRect();
      const width = rect.width || 220;
      const height = width * (REF_H / REF_W);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.dpr = dpr;

      this.viewWidth = width;
      this.viewHeight = height;
      this.scale = width / REF_W;

      [this.bgCanvas, this.fgCanvas].forEach(c => {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      });

      this.bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    bindEvents() {
      window.addEventListener('resize', () => this.handleResize());
    }

    // 3D Spherical Orthographic Projection
    project(latRad, lonRad) {
      // Steady circular rotation around polar axis
      const theta = lonRad + this.rotAngle;
      const x0 = Math.cos(latRad) * Math.sin(theta);
      const y0 = -Math.sin(latRad);
      const z0 = Math.cos(latRad) * Math.cos(theta);

      // Pitch around X axis (tiltX)
      const cosX = Math.cos(this.tiltX);
      const sinX = Math.sin(this.tiltX);
      const y1 = y0 * cosX - z0 * sinX;
      const z1 = y0 * sinX + z0 * cosX;

      // Roll around Z axis (axialTiltZ)
      const cosZ = Math.cos(this.axialTiltZ);
      const sinZ = Math.sin(this.axialTiltZ);
      const x2 = x0 * cosZ - y1 * sinZ;
      const y2 = x0 * sinZ + y1 * cosZ;

      return { x: x2, y: y2, z: z1 };
    }

    animate(now) {
      requestAnimationFrame(this.animate);

      // Always advance continuous circular rotation
      this.rotAngle += this.rotSpeed;

      // Render layers
      this.renderGlobeLayer(now || performance.now());
      this.renderForegroundFX(now || performance.now());
    }

    renderGlobeLayer(now) {
      const ctx = this.bgCtx;
      const s = this.scale;
      const cx = GLOBE_CX * s;
      const cy = GLOBE_CY * s;
      const r = GLOBE_R * s;

      ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
      ctx.save();

      // 1. Clip to globe sphere circle
      ctx.beginPath();
      ctx.arc(cx, cy, r - 0.5 * s, 0, Math.PI * 2);
      ctx.clip();

      // 2. Cosmic sphere background
      const bgGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.35, r * 0.1, cx, cy, r);
      bgGrad.addColorStop(0, '#041738');
      bgGrad.addColorStop(0.4, '#020e24');
      bgGrad.addColorStop(0.85, '#010816');
      bgGrad.addColorStop(1, '#00040d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // 3. Cyber grid lines: Latitude parallels
      const lats = [-60, -30, 0, 30, 60];
      ctx.lineWidth = Math.max(0.7, 0.9 * s);
      ctx.strokeStyle = 'rgba(0, 160, 255, 0.22)';

      for (let i = 0; i < lats.length; i++) {
        const latRad = (lats[i] * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const p = this.project(latRad, (lon * Math.PI) / 180);
          if (p.z > 0.02) {
            const px = cx + p.x * r;
            const py = cy + p.y * r;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 4. Cyber grid lines: Longitude meridians (rotating)
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.18)';
      for (let lon = -180; lon < 180; lon += 30) {
        const lonRad = (lon * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 4) {
          const p = this.project((lat * Math.PI) / 180, lonRad);
          if (p.z > 0.02) {
            const px = cx + p.x * r;
            const py = cy + p.y * r;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 5. Render Rotating Earth Continent Dots
      const dots = this.landDots;
      const dotCount = dots.length;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < dotCount; i++) {
        const d = dots[i];
        const p = this.project(d.latRad, d.lonRad);

        if (p.z > 0.01) {
          const px = cx + p.x * r;
          const py = cy + p.y * r;

          const zDepth = p.z;
          const dotRadius = (0.9 + 1.25 * zDepth) * s;
          const alpha = 0.25 + 0.75 * (zDepth * zDepth);

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.6, dotRadius), 0, Math.PI * 2);

          if (zDepth > 0.65) {
            ctx.fillStyle = `rgba(190, 245, 255, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 0.9})`;
          }
          ctx.fill();
        }
      }

      // 6. Tech Hubs & Pulsing Connecting Arcs
      const visibleHubs = [];
      for (let i = 0; i < this.techHubs.length; i++) {
        const hub = this.techHubs[i];
        const p = this.project(hub.latRad, hub.lonRad);
        if (p.z > 0.15) {
          const px = cx + p.x * r;
          const py = cy + p.y * r;
          visibleHubs.push({ hub, px, py, z: p.z });

          const pulsePhase = (now * 0.003 + i) % 1;
          const pulseR = (2 + pulsePhase * 8) * s;
          const pulseAlpha = (1 - pulsePhase) * 0.7 * p.z;

          ctx.beginPath();
          ctx.arc(px, py, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 255, 255, ${pulseAlpha})`;
          ctx.lineWidth = 1 * s;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, 2.2 * s, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      }

      if (visibleHubs.length >= 2) {
        for (let i = 0; i < visibleHubs.length - 1; i++) {
          const h1 = visibleHubs[i];
          const h2 = visibleHubs[i + 1];

          const midX = (h1.px + h2.px) * 0.5;
          const midY = (h1.py + h2.py) * 0.5;
          const dx = h2.px - h1.px;
          const dy = h2.py - h1.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 30 * s && dist < 140 * s) {
            const fromCenterX = midX - cx;
            const fromCenterY = midY - cy;
            const clen = Math.sqrt(fromCenterX * fromCenterX + fromCenterY * fromCenterY) || 1;
            const bulge = Math.min(dist * 0.35, 22 * s);
            const ctrlX = midX + (fromCenterX / clen) * bulge;
            const ctrlY = midY + (fromCenterY / clen) * bulge;

            ctx.beginPath();
            ctx.moveTo(h1.px, h1.py);
            ctx.quadraticCurveTo(ctrlX, ctrlY, h2.px, h2.py);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.45 * Math.min(h1.z, h2.z)})`;
            ctx.lineWidth = 1.2 * s;
            ctx.stroke();

            const packetT = (now * 0.0012 + i * 0.3) % 1;
            const invT = 1 - packetT;
            const pktX = invT * invT * h1.px + 2 * invT * packetT * ctrlX + packetT * packetT * h2.px;
            const pktY = invT * invT * h1.py + 2 * invT * packetT * ctrlY + packetT * packetT * h2.py;

            ctx.beginPath();
            ctx.arc(pktX, pktY, 2 * s, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
        }
      }

      ctx.restore();

      // 7. Atmospheric Inner Rim Glow
      const rimGrad = ctx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r);
      rimGrad.addColorStop(0, 'rgba(0, 102, 255, 0)');
      rimGrad.addColorStop(0.7, 'rgba(0, 180, 255, 0.1)');
      rimGrad.addColorStop(0.92, 'rgba(0, 229, 255, 0.42)');
      rimGrad.addColorStop(1, 'rgba(0, 255, 255, 0.7)');
      ctx.fillStyle = rimGrad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Inner shadow for spherical depth
      const shadowGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.3, r * 0.4, cx, cy, r);
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadowGrad.addColorStop(0.75, 'rgba(0, 10, 30, 0.15)');
      shadowGrad.addColorStop(1, 'rgba(0, 5, 18, 0.65)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();
    }

    renderForegroundFX(now) {
      const ctx = this.fgCtx;
      const s = this.scale;
      const cx = GLOBE_CX * s;
      const cy = GLOBE_CY * s;

      ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // 1. Front Diagonal Orbital Ring & Traveling Satellite Node
      const pStart = { x: 95 * s, y: 420 * s };
      const pCtrl = { x: 270 * s, y: 368 * s };
      const pEnd = { x: 460 * s, y: 260 * s };

      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
      ctx.lineWidth = Math.max(2, 3.8 * s);
      const ringGlow = ctx.createLinearGradient(pStart.x, pStart.y, pEnd.x, pEnd.y);
      ringGlow.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
      ringGlow.addColorStop(0.4, 'rgba(120, 235, 255, 0.75)');
      ringGlow.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
      ctx.strokeStyle = ringGlow;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.quadraticCurveTo(pCtrl.x, pCtrl.y, pEnd.x, pEnd.y);
      ctx.lineWidth = Math.max(1, 1.6 * s);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.stroke();

      // Traveling Satellite Node along the front ring
      const satSpeed = now * 0.00075;
      const t = 0.5 + 0.5 * Math.sin(satSpeed);
      const invT = 1 - t;
      const satX = invT * invT * pStart.x + 2 * invT * t * pCtrl.x + t * t * pEnd.x;
      const satY = invT * invT * pStart.y + 2 * invT * t * pCtrl.y + t * t * pEnd.y;

      const haloR = (7 + 2 * Math.sin(now * 0.008)) * s;
      const satHalo = ctx.createRadialGradient(satX, satY, 0, satX, satY, haloR);
      satHalo.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      satHalo.addColorStop(0.3, 'rgba(0, 229, 255, 0.75)');
      satHalo.addColorStop(0.7, 'rgba(0, 102, 255, 0.35)');
      satHalo.addColorStop(1, 'rgba(0, 102, 255, 0)');
      ctx.fillStyle = satHalo;
      ctx.beginPath();
      ctx.arc(satX, satY, haloR, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(satX, satY, 2.5 * s, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // 2. Vertical Cyber Axis Line & Data Upstream
      ctx.beginPath();
      ctx.moveTo(cx, 160 * s);
      ctx.lineTo(cx, 470 * s);
      ctx.lineWidth = Math.max(0.9, 1.2 * s);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.stroke();

      const pulseT1 = (now * 0.001) % 1;
      const pulseT2 = (now * 0.001 + 0.5) % 1;
      [pulseT1, pulseT2].forEach(pt => {
        const py = (470 - pt * (470 - 160)) * s;
        ctx.beginPath();
        ctx.arc(cx, py, 2.2 * s, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, py);
        ctx.lineTo(cx, py + 12 * s);
        ctx.lineWidth = 1.5 * s;
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.stroke();
      });

      // 3. Motherboard Circuit Streams at South Pole
      if (now > this.nextCircuitPulse) {
        this.nextCircuitPulse = now + 400 + Math.random() * 500;
        const randomPathIndex = Math.floor(Math.random() * CIRCUIT_PATHS.length);
        this.circuitPulses.push({
          pathIndex: randomPathIndex,
          progress: 0,
          speed: 0.0015 + Math.random() * 0.001
        });
      }

      for (let i = this.circuitPulses.length - 1; i >= 0; i--) {
        const cp = this.circuitPulses[i];
        cp.progress += cp.speed * 16.6;
        if (cp.progress >= 1) {
          this.circuitPulses.splice(i, 1);
          continue;
        }

        const path = CIRCUIT_PATHS[cp.pathIndex];
        const point = this.getPointOnPolyline(path, cp.progress, s);
        if (point) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, (2.4 + 1.2 * Math.sin(now * 0.01)) * s, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(point.x, point.y, 4.5 * s, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 150, 255, 0.35)';
          ctx.fill();
        }
      }

      // 4. Radar Pulses from Outer Satellite Nodes
      OUTER_SATELLITES.forEach((sat, idx) => {
        const sx = sat.x * s;
        const sy = sat.y * s;
        const phase = (now * 0.0018 + idx * 0.4) % 1;
        const ringRad = (5 + phase * 18) * s;
        const ringAlpha = (1 - phase) * 0.65;

        ctx.beginPath();
        ctx.arc(sx, sy, ringRad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${ringAlpha})`;
        ctx.lineWidth = 1 * s;
        ctx.stroke();
      });

      // 5. Star Beacon Radiant Cross Flare
      const starX = STAR_POS.x * s;
      const starY = STAR_POS.y * s;
      const starBreathe = 1 + 0.18 * Math.sin(now * 0.004);
      const flareLenH = 26 * s * starBreathe;
      const flareLenV = 45 * s * starBreathe;

      const vGrad = ctx.createLinearGradient(starX, starY - flareLenV, starX, starY + flareLenV);
      vGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      vGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.strokeStyle = vGrad;
      ctx.lineWidth = Math.max(1.2, 1.8 * s);
      ctx.beginPath();
      ctx.moveTo(starX, starY - flareLenV);
      ctx.lineTo(starX, starY + flareLenV);
      ctx.stroke();

      const hGrad = ctx.createLinearGradient(starX - flareLenH, starY, starX + flareLenH, starY);
      hGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      hGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.strokeStyle = hGrad;
      ctx.lineWidth = Math.max(1, 1.4 * s);
      ctx.beginPath();
      ctx.moveTo(starX - flareLenH, starY);
      ctx.lineTo(starX + flareLenH, starY);
      ctx.stroke();

      const starGlowR = 12 * s * starBreathe;
      const starGlow = ctx.createRadialGradient(starX, starY, 0, starX, starY, starGlowR);
      starGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
      starGlow.addColorStop(0.35, 'rgba(100, 230, 255, 0.8)');
      starGlow.addColorStop(0.7, 'rgba(0, 102, 255, 0.3)');
      starGlow.addColorStop(1, 'rgba(0, 102, 255, 0)');
      ctx.fillStyle = starGlow;
      ctx.beginPath();
      ctx.arc(starX, starY, starGlowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    getPointOnPolyline(pts, t, scale) {
      if (pts.length < 2) return null;
      let totalLen = 0;
      const segLens = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const dx = (pts[i + 1].x - pts[i].x) * scale;
        const dy = (pts[i + 1].y - pts[i].y) * scale;
        const len = Math.sqrt(dx * dx + dy * dy);
        segLens.push(len);
        totalLen += len;
      }
      if (totalLen === 0) return { x: pts[0].x * scale, y: pts[0].y * scale };

      const targetDist = t * totalLen;
      let walked = 0;
      for (let i = 0; i < segLens.length; i++) {
        const slen = segLens[i];
        if (walked + slen >= targetDist) {
          const segT = (targetDist - walked) / slen;
          return {
            x: (pts[i].x + (pts[i + 1].x - pts[i].x) * segT) * scale,
            y: (pts[i].y + (pts[i + 1].y - pts[i].y) * segT) * scale
          };
        }
        walked += slen;
      }
      const last = pts[pts.length - 1];
      return { x: last.x * scale, y: last.y * scale };
    }
  }

  // Initialize on DOM ready
  function initCyberEmblem() {
    const wrap = document.getElementById('heroGlobeWrap') || document.querySelector('.hero-globe-wrap');
    if (!wrap) return;

    if (wrap.dataset.globeInitialized) return;
    wrap.dataset.globeInitialized = 'true';

    new CyberGlobeEmblem(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCyberEmblem);
  } else {
    initCyberEmblem();
  }

  window.CyberGlobeEmblem = CyberGlobeEmblem;
})();
