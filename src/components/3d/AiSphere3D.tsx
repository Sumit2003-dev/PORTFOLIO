import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type AiSphere3DProps = {
  className?: string;
};

export default function AiSphere3D({ className = "relative h-full w-full" }: AiSphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768 || "ontouchstart" in window;
    setIsMobile(mobile);
    if (mobile) return; // Use high-performance CSS animated orbital core on mobile

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    let animId: number;
    let isPaused = false;

    try {
      const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || "ontouchstart" in window);
      const width = container.clientWidth || (isMobile ? 360 : 480);
      const height = container.clientHeight || (isMobile ? 360 : 480);

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        42,
        width / height,
        0.1,
        1000
      );
      camera.position.z = 4.4;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? "low-power" : "high-performance",
      });
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const canvasEl = renderer.domElement;
      const onContextLost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(animId);
        setHasError(true);
      };
      canvasEl.addEventListener("webglcontextlost", onContextLost, false);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // 1. Soft Atmospheric Core Geometries (Optimized complexity on mobile)
      const coreGeo = new THREE.IcosahedronGeometry(1.2, isMobile ? 1 : 2);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xff6a00,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(coreMesh);

      const innerGeo = new THREE.IcosahedronGeometry(0.85, 1);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xff8a2b,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      mainGroup.add(innerMesh);

      // Subtle Soft Inner Nucleus
      const nucleusGeo = new THREE.SphereGeometry(0.42, isMobile ? 8 : 16, isMobile ? 8 : 16);
      const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0xff6a00,
        transparent: true,
        opacity: 0.4,
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      mainGroup.add(nucleusMesh);

      // 2. Soft Orbital Rings (2 rings with 32 segments on mobile; 3 rings with 128 on desktop)
      const ringConfigs = isMobile
        ? [
            { radius: 1.65, tiltX: Math.PI * 0.35, tiltY: Math.PI * 0.15, color: 0xff6a00, opacity: 0.35 },
            { radius: 2.1, tiltX: -Math.PI * 0.25, tiltY: Math.PI * 0.4, color: 0xff8a2b, opacity: 0.25 },
          ]
        : [
            { radius: 1.65, tiltX: Math.PI * 0.35, tiltY: Math.PI * 0.15, color: 0xff6a00, opacity: 0.4 },
            { radius: 2.0, tiltX: -Math.PI * 0.25, tiltY: Math.PI * 0.4, color: 0xff8a2b, opacity: 0.3 },
            { radius: 2.35, tiltX: Math.PI * 0.15, tiltY: -Math.PI * 0.3, color: 0xb84e02, opacity: 0.2 },
          ];

      const rings: THREE.Line[] = [];
      const segments = isMobile ? 32 : 128;
      ringConfigs.forEach((cfg) => {
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
        });
        const ring = new THREE.Line(ringGeo, ringMat);
        ring.rotation.x = cfg.tiltX;
        ring.rotation.y = cfg.tiltY;
        rings.push(ring);
        mainGroup.add(ring);
      });

      // 3. Subtle Floating Data Particles (40 on mobile, 180 on desktop)
      const particleCount = isMobile ? 40 : 180;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const cPrimary = new THREE.Color(0xff6a00);
      const cSecondary = new THREE.Color(0xffa043);

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 1.35 + Math.random() * 0.9;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const c = Math.random() > 0.4 ? cPrimary : cSecondary;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: isMobile ? 0.05 : 0.042,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      mainGroup.add(particles);

      // Mouse Interaction (Desktop only to prevent unnecessary listener overhead on touch screens)
      let targetRotationX = 0;
      let targetRotationY = 0;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const w = rect.width || container.clientWidth || 480;
        const h = rect.height || container.clientHeight || 480;
        const mx = ((e.clientX - rect.left) / w) * 2 - 1;
        const my = -((e.clientY - rect.top) / h) * 2 + 1;
        targetRotationY = mx * 0.45;
        targetRotationX = my * 0.45;
      };

      if (!isMobile) {
        window.addEventListener("mousemove", onMouseMove, { passive: true });
      }

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || 480;
        const h = container.clientHeight || 480;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize, { passive: true });

      const clock = new THREE.Clock();

      const animate = () => {
        if (isPaused) return;
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth rotation animations
        coreMesh.rotation.y = elapsedTime * 0.12;
        coreMesh.rotation.x = elapsedTime * 0.08;

        innerMesh.rotation.y = -elapsedTime * 0.18;
        nucleusMesh.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.06);

        particles.rotation.y = elapsedTime * 0.06;

        rings.forEach((ring, idx) => {
          ring.rotation.z = elapsedTime * (0.05 + idx * 0.03);
        });

        // Lerp to mouse target (on desktop)
        if (!isMobile) {
          mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.04;
          mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.04;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Pause when tab hidden or scrolled out of view to save 100% of GPU/CPU for rest of page
      let isInViewport = true;
      const onVisibilityChange = () => {
        if (document.hidden) {
          isPaused = true;
          cancelAnimationFrame(animId);
        } else if (isInViewport) {
          isPaused = false;
          clock.getDelta();
          animate();
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isInViewport = entry.isIntersecting;
            if (!isInViewport) {
              isPaused = true;
              cancelAnimationFrame(animId);
            } else if (!document.hidden) {
              isPaused = false;
              clock.getDelta();
              animate();
            }
          });
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);

      return () => {
        if (!isMobile) {
          window.removeEventListener("mousemove", onMouseMove);
        }
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        canvasEl.removeEventListener("webglcontextlost", onContextLost);
        intersectionObserver.disconnect();
        cancelAnimationFrame(animId);

        // Clean up geometries & materials
        coreGeo.dispose();
        coreMat.dispose();
        innerGeo.dispose();
        innerMat.dispose();
        nucleusGeo.dispose();
        nucleusMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        rings.forEach((r) => {
          r.geometry.dispose();
          if (Array.isArray(r.material)) {
            r.material.forEach((m) => m.dispose());
          } else {
            r.material.dispose();
          }
        });

        if (renderer?.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer?.dispose();
      };
    } catch (err) {
      console.warn("WebGL initialization failed, falling back to CSS animation:", err);
      setHasError(true);
    }
  }, []);

  if (hasError || isMobile) {
    return (
      <div className={`${className} flex items-center justify-center pointer-events-none`}>
        <div className="relative h-60 w-60 sm:h-64 sm:w-64 rounded-full border border-ember-500/30 animate-pulse bg-gradient-radial from-ember-500/20 via-transparent to-transparent">
          <div className="absolute inset-4 rounded-full border border-burnt-red/40 animate-spin [animation-duration:14s]" />
          <div className="absolute inset-10 rounded-full border border-white/20 animate-spin [animation-duration:9s] [animation-direction:reverse]" />
          <div className="absolute inset-16 rounded-full bg-ember-500/25 blur-md" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-ember-500/10 via-transparent to-transparent" />
    </div>
  );
}
