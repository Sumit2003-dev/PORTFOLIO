import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type AiSphere3DProps = {
  className?: string;
};

export default function AiSphere3D({ className = "relative h-full w-full" }: AiSphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId = 0;
    let isPaused = false;
    let resizeObserver: ResizeObserver | null = null;

    try {
      // 1. Scene & Camera Setup
      const scene = new THREE.Scene();

      // Safe initial aspect calculation
      const initialW = container.clientWidth || 520;
      const initialH = container.clientHeight || 520;
      const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 1000);
      camera.position.z = 5.2;

      // WebGL Renderer with antialias and alpha transparency
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(initialW, initialH);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.pointerEvents = "none";
      container.appendChild(renderer.domElement);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // 2. Luminous Central AI Energy Core
      const coreGroup = new THREE.Group();
      mainGroup.add(coreGroup);

      // Inner dense glowing nucleus
      const nucleusGeo = new THREE.SphereGeometry(0.55, 24, 24);
      const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0xff6a00,
        transparent: true,
        opacity: 0.65,
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      coreGroup.add(nucleusMesh);

      // Mid wireframe icosahedron cage
      const cageGeo = new THREE.IcosahedronGeometry(0.95, 1);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0xff8a2b,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
      const cageMesh = new THREE.Mesh(cageGeo, cageMat);
      coreGroup.add(cageMesh);

      // Outer neural shell with vertex node markers
      const shellGeo = new THREE.IcosahedronGeometry(1.45, 2);
      const shellMat = new THREE.MeshBasicMaterial({
        color: 0xffa043,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      coreGroup.add(shellMesh);

      // 3. Expansive Gyroscopic Orbital Rings & Satellites (extending well beyond the card)
      const ringGroup = new THREE.Group();
      mainGroup.add(ringGroup);

      type RingData = {
        ring: THREE.Line;
        satellite: THREE.Mesh;
        radius: number;
        speed: number;
        initialTiltX: number;
        initialTiltY: number;
      };

      const ringConfigs = [
        { radius: 1.85, tiltX: Math.PI * 0.35, tiltY: Math.PI * 0.15, color: 0xff6a00, opacity: 0.7, speed: 0.8 },
        { radius: 2.35, tiltX: -Math.PI * 0.28, tiltY: Math.PI * 0.38, color: 0xff8a2b, opacity: 0.6, speed: -0.65 },
        { radius: 2.85, tiltX: Math.PI * 0.18, tiltY: -Math.PI * 0.32, color: 0xffb870, opacity: 0.5, speed: 0.5 },
      ];

      const ringsData: RingData[] = [];

      ringConfigs.forEach((cfg) => {
        // High-definition smooth ring
        const segments = 128;
        const ringGeo = new THREE.BufferGeometry();
        const points: THREE.Vector3[] = [];
        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * cfg.radius, Math.sin(theta) * cfg.radius, 0));
        }
        ringGeo.setFromPoints(points);

        const ringMat = new THREE.LineBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: cfg.opacity,
          blending: THREE.AdditiveBlending,
        });
        const ring = new THREE.Line(ringGeo, ringMat);
        ring.rotation.x = cfg.tiltX;
        ring.rotation.y = cfg.tiltY;
        ringGroup.add(ring);

        // Glowing orbital beacon satellite traveling along the ring
        const satGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const satMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        });
        const satHaloGeo = new THREE.SphereGeometry(0.18, 12, 12);
        const satHaloMat = new THREE.MeshBasicMaterial({
          color: cfg.color,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const satellite = new THREE.Mesh(satGeo, satMat);
        satellite.add(new THREE.Mesh(satHaloGeo, satHaloMat));
        ring.add(satellite);

        ringsData.push({
          ring,
          satellite,
          radius: cfg.radius,
          speed: cfg.speed,
          initialTiltX: cfg.tiltX,
          initialTiltY: cfg.tiltY,
        });
      });

      // 4. Vibrant Floating Ember Particles
      const particleCount = 260;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorPalette = [
        new THREE.Color(0xff6a00), // Pure Ember
        new THREE.Color(0xff8a2b), // Bright Orange
        new THREE.Color(0xffc799), // Warm Gold
        new THREE.Color(0xffffff), // Radiant White
      ];

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        // Distribute from inside core out to expansive halo
        const r = 1.2 + Math.random() * 2.0;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      mainGroup.add(particles);

      // 5. Interactive Mouse Parallax & Inertia
      let targetRotX = 0;
      let targetRotY = 0;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / (rect.width || 500)) * 2 - 1;
        const my = -((e.clientY - rect.top) / (rect.height || 500)) * 2 + 1;
        targetRotY = mx * 0.55;
        targetRotX = my * 0.45;
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      // 6. Robust Dynamic Resize Observer
      const handleResize = (w: number, h: number) => {
        if (!renderer || w <= 0 || h <= 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.round(entry.contentRect.width || container.clientWidth || 520);
          const h = Math.round(entry.contentRect.height || container.clientHeight || 520);
          handleResize(w, h);
        }
      });
      resizeObserver.observe(container);

      // Initial dimension guarantee
      handleResize(initialW, initialH);

      // 7. Render Loop with Accessibility-Friendly Motion Scaling
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // If user prefers reduced motion, scale speeds down to a serene float rather than freezing
      const speedScale = prefersReducedMotion ? 0.35 : 1.0;
      const clock = new THREE.Clock();

      const animate = () => {
        if (isPaused || !renderer) return;

        const elapsed = clock.getElapsedTime() * speedScale;

        // Core pulsating & spinning
        cageMesh.rotation.y = elapsed * 0.22;
        cageMesh.rotation.x = elapsed * 0.14;

        shellMesh.rotation.y = -elapsed * 0.16;
        shellMesh.rotation.z = elapsed * 0.08;

        const pulse = 1 + Math.sin(elapsed * 2.4) * 0.08;
        nucleusMesh.scale.set(pulse, pulse, pulse);

        // Orbital rings rotation & moving satellites
        ringsData.forEach((rd, idx) => {
          rd.ring.rotation.z = elapsed * 0.12 * rd.speed;

          // Move beacon satellite along its ring
          const satAngle = elapsed * rd.speed * 0.9 + idx * 2.1;
          rd.satellite.position.set(
            Math.cos(satAngle) * rd.radius,
            Math.sin(satAngle) * rd.radius,
            0
          );
        });

        // Particle field rotation
        particles.rotation.y = elapsed * 0.08;
        particles.rotation.x = Math.sin(elapsed * 0.3) * 0.06;

        // Smooth Lerp to mouse target
        mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      animId = requestAnimationFrame(animate);

      // Tab visibility energy saver
      const onVisibilityChange = () => {
        if (document.hidden) {
          isPaused = true;
          cancelAnimationFrame(animId);
        } else {
          isPaused = false;
          clock.getDelta();
          animId = requestAnimationFrame(animate);
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      // Cleanup
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (resizeObserver) resizeObserver.disconnect();
        cancelAnimationFrame(animId);

        // Dispose geometries & materials
        nucleusGeo.dispose();
        nucleusMat.dispose();
        cageGeo.dispose();
        cageMat.dispose();
        shellGeo.dispose();
        shellMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();

        ringsData.forEach((rd) => {
          rd.ring.geometry.dispose();
          if (Array.isArray(rd.ring.material)) {
            rd.ring.material.forEach((m) => m.dispose());
          } else {
            rd.ring.material.dispose();
          }
        });

        if (renderer?.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer?.dispose();
      };
    } catch (err) {
      console.warn("AiSphere3D WebGL initialization failed, falling back to CSS animation:", err);
      setHasError(true);
    }
  }, []);

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="relative h-72 w-72 rounded-full border border-ember-500/40 animate-pulse bg-gradient-radial from-ember-500/25 via-transparent to-transparent">
          <div className="absolute inset-4 rounded-full border border-burnt-red/50 animate-spin [animation-duration:14s]" />
          <div className="absolute inset-10 rounded-full border border-white/30 animate-spin [animation-duration:9s] [animation-direction:reverse]" />
          <div className="absolute inset-16 rounded-full bg-ember-500/35 blur-lg" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center overflow-visible ${className}`}>
      {/* Radiant atmospheric backdrop glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-gradient from-ember-500/15 via-ember-500/5 to-transparent blur-2xl" />
    </div>
  );
}
