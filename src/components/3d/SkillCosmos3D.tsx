import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Sparkles, ArrowRight, RotateCw, ZoomIn } from "lucide-react";

type SkillNode = {
  name: string;
  color: number;
  size: number;
  level: number;
  desc: string;
  project: string;
};

const SKILL_NODES: SkillNode[] = [
  { name: "Python", color: 0xff6a00, size: 0.28, level: 93, desc: "Core language for end-to-end ML, data ETL & predictive algorithms", project: "FlyRank AI & GyanVerse" },
  { name: "Machine Learning", color: 0xff8a2b, size: 0.26, level: 88, desc: "Supervised/unsupervised models, ranking algorithms & evaluation", project: "FlyRank AI Internship" },
  { name: "RAG & LLMs", color: 0xffb870, size: 0.26, level: 80, desc: "Context-grounded QA with Sentence Transformers & vector embeddings", project: "GyanVerse AI" },
  { name: "Scikit-Learn", color: 0xe05600, size: 0.24, level: 88, desc: "Classification, regression, precision benchmarks & cross-validation", project: "Airline Delay & ML Tasks" },
  { name: "Pandas & NumPy", color: 0xffa043, size: 0.24, level: 90, desc: "High-performance data manipulation, profiling & statistical ETL", project: "Student Record Intelligence" },
  { name: "FAISS & ChromaDB", color: 0xd64d00, size: 0.23, level: 78, desc: "High-dimensional vector indexing & similarity search engine", project: "GyanVerse AI" },
  { name: "Deep Learning", color: 0xff7b1a, size: 0.25, level: 76, desc: "Neural networks, representation learning & transformer architecture", project: "Google Skills Boost" },
  { name: "Flask & Streamlit", color: 0xc84200, size: 0.23, level: 78, desc: "Interactive web applications & low-latency inference APIs", project: "GyanVerse & Analytics UI" },
  { name: "SQL & Analytics", color: 0xff9533, size: 0.25, level: 82, desc: "Relational queries, big data schemas & statistical modeling", project: "Google Analytics Certified" },
  { name: "Computer Vision", color: 0xe8630a, size: 0.23, level: 74, desc: "Visual feature extraction & integrity monitoring techniques", project: "Proctoring Research Paper" },
];

function createTextSprite(text: string, colorHex: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Object3D();

  ctx.font = "bold 38px 'Oswald', 'Inter', system-ui, sans-serif";
  ctx.fillStyle = colorHex;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255, 106, 0, 0.95)";
  ctx.shadowBlur = 12;
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.2, 0.3, 1);
  sprite.position.set(0, 0.36, 0);
  sprite.userData = { texture, material: spriteMat };
  return sprite;
}

export default function SkillCosmos3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<string>("Python");
  const [hasError, setHasError] = useState(false);
  const activeSkillRef = useRef(activeSkill);

  useEffect(() => {
    activeSkillRef.current = activeSkill;
  }, [activeSkill]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId = 0;
    let isPaused = false;
    let resizeObserver: ResizeObserver | null = null;
    const disposables: (() => void)[] = [];

    try {
      container.style.touchAction = "none";

      const initialW = container.clientWidth || 600;
      const initialH = container.clientHeight || 420;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, initialW / initialH, 0.1, 1000);
      camera.position.z = 4.9;

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
      container.appendChild(renderer.domElement);

      const cosmosGroup = new THREE.Group();
      scene.add(cosmosGroup);

      // Central Pulsating Core
      const centerGeo = new THREE.SphereGeometry(0.35, 20, 20);
      const centerMat = new THREE.MeshBasicMaterial({
        color: 0xff6a00,
        transparent: true,
        opacity: 0.75,
      });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      cosmosGroup.add(centerMesh);

      const centerHaloGeo = new THREE.IcosahedronGeometry(0.55, 1);
      const centerHaloMat = new THREE.MeshBasicMaterial({
        color: 0xffa043,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const centerHaloMesh = new THREE.Mesh(centerHaloGeo, centerHaloMat);
      cosmosGroup.add(centerHaloMesh);

      disposables.push(() => {
        centerGeo.dispose();
        centerMat.dispose();
        centerHaloGeo.dispose();
        centerHaloMat.dispose();
      });

      // Orbital Track Rings
      const orbitConfigs = [
        { radius: 1.55, tiltX: Math.PI / 2.7, color: 0xff6a00, opacity: 0.45 },
        { radius: 2.25, tiltX: -Math.PI / 3.4, color: 0xffa043, opacity: 0.35 },
      ];

      orbitConfigs.forEach((cfg) => {
        const ringGeo = new THREE.BufferGeometry();
        const points: THREE.Vector3[] = [];
        const segs = 120;
        for (let j = 0; j <= segs; j++) {
          const theta = (j / segs) * Math.PI * 2;
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
        cosmosGroup.add(ring);

        disposables.push(() => {
          ringGeo.dispose();
          ringMat.dispose();
        });
      });

      // Create 3D Meshes for each skill node with labels
      const nodeMeshes: THREE.Mesh[] = [];

      SKILL_NODES.forEach((node, idx) => {
        const isInner = idx < 5;
        const radius = isInner ? 1.55 : 2.25;
        const step = isInner ? 5 : 5;
        const angle = ((idx % step) / step) * Math.PI * 2 + (isInner ? 0 : 0.6);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle * 2) * 0.38;
        const z = Math.sin(angle) * radius;

        // Group holding mesh + label
        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x, y, z);

        // Core Solid Mesh
        const geo = new THREE.SphereGeometry(node.size, 20, 20);
        const mat = new THREE.MeshBasicMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.9,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData = { name: node.name };

        // Outer Wireframe Halo
        const haloGeo = new THREE.SphereGeometry(node.size * 1.35, 14, 14);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        mesh.add(halo);

        // 3D Billboard Floating Label
        const label = createTextSprite(node.name, `#${node.color.toString(16).padStart(6, "0")}`);
        mesh.add(label);

        nodeMeshes.push(mesh);
        nodeGroup.add(mesh);
        cosmosGroup.add(nodeGroup);

        disposables.push(() => {
          geo.dispose();
          mat.dispose();
          haloGeo.dispose();
          haloMat.dispose();
          if (label.userData?.texture) label.userData.texture.dispose();
          if (label.userData?.material) label.userData.material.dispose();
        });
      });

      // Ambient celestial stars background
      const starGeo = new THREE.BufferGeometry();
      const starCount = 180;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 9;
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        size: 0.045,
        color: 0xffd2a6,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const starField = new THREE.Points(starGeo, starMat);
      cosmosGroup.add(starField);

      disposables.push(() => {
        starGeo.dispose();
        starMat.dispose();
      });

      // Interactive Drag Controls (with touch, pointer, and click separation)
      let isDragging = false;
      let startPointerPos = { x: 0, y: 0 };
      let prevPointerPos = { x: 0, y: 0 };
      let dragVelocity = { x: 0, y: 0 };
      let totalDragDist = 0;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        totalDragDist = 0;
        startPointerPos = { x: e.clientX, y: e.clientY };
        prevPointerPos = { x: e.clientX, y: e.clientY };
        dragVelocity = { x: 0, y: 0 };
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevPointerPos.x;
        const deltaY = e.clientY - prevPointerPos.y;
        totalDragDist += Math.abs(deltaX) + Math.abs(deltaY);

        dragVelocity.x = deltaX * 0.005;
        dragVelocity.y = deltaY * 0.005;

        cosmosGroup.rotation.y += dragVelocity.x;
        cosmosGroup.rotation.x += dragVelocity.y;

        prevPointerPos = { x: e.clientX, y: e.clientY };
      };

      const onPointerUp = () => {
        isDragging = false;
      };

      container.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);

      // Raycaster for clicking spheres (only when not actively dragging)
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onClick = (e: MouseEvent) => {
        // If user dragged more than 8 pixels, treat as rotation, not click
        if (totalDragDist > 8) return;

        const rect = container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes, true);
        if (intersects.length > 0) {
          let target = intersects[0].object;
          while (target.parent && !target.userData.name) {
            target = target.parent as THREE.Object3D;
          }
          if (target.userData.name) {
            setActiveSkill(target.userData.name);
          }
        }
      };
      container.addEventListener("click", onClick);

      // Robust Dynamic Resize Observer
      const handleResize = (w: number, h: number) => {
        if (!renderer || w <= 0 || h <= 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.round(entry.contentRect.width || container.clientWidth || 600);
          const h = Math.round(entry.contentRect.height || container.clientHeight || 420);
          handleResize(w, h);
        }
      });
      resizeObserver.observe(container);

      // Initial dimension guarantee
      handleResize(initialW, initialH);

      // Render Loop with Graceful Motion Scaling
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const speedScale = prefersReducedMotion ? 0.35 : 1.0;
      const clock = new THREE.Clock();

      const animate = () => {
        if (isPaused || !renderer) return;

        const time = clock.getElapsedTime() * speedScale;

        // Center core pulse
        const corePulse = 1 + Math.sin(time * 2.2) * 0.08;
        centerMesh.scale.set(corePulse, corePulse, corePulse);
        centerHaloMesh.rotation.y = time * 0.2;
        centerHaloMesh.rotation.x = time * 0.15;

        // Inertia and continuous orbital spin
        if (!isDragging) {
          dragVelocity.x *= 0.94;
          dragVelocity.y *= 0.94;
          cosmosGroup.rotation.y += 0.0032 * speedScale + dragVelocity.x;
          cosmosGroup.rotation.x += dragVelocity.y;
        }

        // Keep label billboards facing the camera
        const currentActive = activeSkillRef.current;
        nodeMeshes.forEach((m) => {
          m.rotation.y = time * 0.4;
          m.rotation.x = time * 0.2;

          const isTarget = m.userData.name === currentActive;
          const targetScale = isTarget ? 1.45 + Math.sin(time * 3.5) * 0.1 : 1.0;
          m.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
        });

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      animId = requestAnimationFrame(animate);

      // Tab Visibility Energy Throttling
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

      return () => {
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
        container.removeEventListener("click", onClick);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (resizeObserver) resizeObserver.disconnect();
        cancelAnimationFrame(animId);

        disposables.forEach((fn) => fn());
        if (renderer?.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer?.dispose();
      };
    } catch (err) {
      console.warn("SkillCosmos WebGL initialization failed, falling back cleanly:", err);
      setHasError(true);
    }
  }, []);

  const activeNode = SKILL_NODES.find((s) => s.name === activeSkill) ?? SKILL_NODES[0];

  return (
    <div className="relative w-full rounded-2xl border border-ember-500/30 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-xl shadow-2xl">
      {/* Header bar */}
      <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-ember-500 animate-pulse" />
          <h4 className="font-condensed text-xs uppercase tracking-[0.2em] text-white/90 font-semibold">
            Interactive 3D Skill Cosmos
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-ember-500/15 px-3 py-1 text-[11px] font-semibold text-ember-400 border border-ember-500/35 shadow-glow">
            <RotateCw className="h-3 w-3 animate-spin [animation-duration:8s]" />
            Drag to Rotate · Click Node to Inspect
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas / Fallback */}
      {hasError ? (
        <div className="flex h-[340px] sm:h-[400px] lg:h-[480px] w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#060c14]/60 to-transparent p-6 text-center">
          <div className="space-y-3">
            <div className="mx-auto h-24 w-24 rounded-full border border-ember-500/40 bg-ember-500/10 flex items-center justify-center animate-pulse">
              <Sparkles className="h-8 w-8 text-ember-400" />
            </div>
            <p className="font-display text-base uppercase text-white tracking-wider">Interactive Skill Galaxy</p>
            <p className="text-xs text-white/60 max-w-sm">Select any skill pill below to inspect core competencies and associated engineering projects.</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#060c14]/60 via-[#071018]/40 to-transparent border border-white/5">
          <div
            ref={containerRef}
            className="h-[340px] sm:h-[400px] lg:h-[480px] w-full cursor-grab active:cursor-grabbing"
          />
          {/* Subtle Ambient Instruction Overlay */}
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] text-white/50 backdrop-blur border border-white/10 flex items-center gap-1.5">
            <ZoomIn className="h-3 w-3 text-ember-400" />
            <span>Interactive 3D Canvas</span>
          </div>
        </div>
      )}

      {/* Active Skill HUD Detail Card */}
      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur shadow-inner">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ember-500/20 text-ember-400 font-bold text-sm border border-ember-500/30 shadow-glow">
            {activeNode.level}%
          </span>
          <div>
            <p className="font-display text-base text-white uppercase leading-none tracking-wide">{activeNode.name}</p>
            <p className="text-xs text-white/65 mt-1">{activeNode.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-condensed uppercase tracking-wider text-ember-400 shrink-0 bg-ember-500/10 px-3 py-1.5 rounded-lg border border-ember-500/25">
          <span>{activeNode.project}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Interactive Selection Pills */}
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {SKILL_NODES.map((node) => (
          <button
            key={node.name}
            onClick={() => setActiveSkill(node.name)}
            className={`rounded-full border px-3 py-1 text-xs transition-all ${
              activeSkill === node.name
                ? "border-ember-500 bg-ember-500 text-black font-semibold shadow-glow scale-105"
                : "border-white/10 text-white/65 hover:border-white/30 hover:text-white bg-white/[0.02]"
            }`}
          >
            {node.name}
          </button>
        ))}
      </div>
    </div>
  );
}
