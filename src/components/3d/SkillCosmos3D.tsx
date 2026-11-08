import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Terminal, ArrowRight } from "lucide-react";

type SkillNode = {
  name: string;
  color: number;
  size: number;
  level: number;
  desc: string;
  project: string;
};

const SKILL_NODES: SkillNode[] = [
  { name: "Python", color: 0xff6a00, size: 0.26, level: 93, desc: "Core language for end-to-end ML, data ETL & predictive algorithms", project: "FlyRank AI & GyanVerse" },
  { name: "Machine Learning", color: 0xff8a2b, size: 0.25, level: 88, desc: "Supervised/unsupervised models, ranking algorithms & evaluation", project: "FlyRank AI Internship" },
  { name: "RAG & LLMs", color: 0xffb870, size: 0.25, level: 80, desc: "Context-grounded QA with Sentence Transformers & vector embeddings", project: "GyanVerse AI" },
  { name: "Scikit-Learn", color: 0xe05600, size: 0.23, level: 88, desc: "Classification, regression, precision benchmarks & cross-validation", project: "Airline Delay & ML Tasks" },
  { name: "Pandas & NumPy", color: 0xffa043, size: 0.23, level: 90, desc: "High-performance data manipulation, profiling & statistical ETL", project: "Student Record Intelligence" },
  { name: "FAISS & ChromaDB", color: 0xd64d00, size: 0.22, level: 78, desc: "High-dimensional vector indexing & similarity search engine", project: "GyanVerse AI" },
  { name: "Deep Learning", color: 0xff7b1a, size: 0.24, level: 76, desc: "Neural networks, representation learning & transformer architecture", project: "Google Skills Boost" },
  { name: "Flask & Streamlit", color: 0xc84200, size: 0.22, level: 78, desc: "Interactive web applications & low-latency inference APIs", project: "GyanVerse & Analytics UI" },
  { name: "SQL & Analytics", color: 0xff9533, size: 0.24, level: 82, desc: "Relational queries, big data schemas & statistical modeling", project: "Google Analytics Certified" },
  { name: "Computer Vision", color: 0xe8630a, size: 0.22, level: 74, desc: "Visual feature extraction & integrity monitoring techniques", project: "Proctoring Research Paper" },
];

function createTextSprite(text: string, colorHex: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Object3D();

  ctx.font = "bold 20px 'Oswald', 'Inter', sans-serif";
  ctx.fillStyle = colorHex;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255, 106, 0, 0.9)";
  ctx.shadowBlur = 6;
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.0, 0.25, 1);
  sprite.position.set(0, 0.32, 0);
  return sprite;
}

export default function SkillCosmos3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<string>("Python");
  const activeSkillRef = useRef(activeSkill);

  useEffect(() => {
    activeSkillRef.current = activeSkill;
  }, [activeSkill]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const cosmosGroup = new THREE.Group();
    scene.add(cosmosGroup);

    // Orbit Ring Visualizers
    const orbitConfigs = [
      { radius: 1.5, tiltX: Math.PI / 2.6, color: 0xff6a00, opacity: 0.4 },
      { radius: 2.15, tiltX: -Math.PI / 3.2, color: 0xffa043, opacity: 0.3 },
    ];

    orbitConfigs.forEach((cfg) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segs = 96;
      for (let j = 0; j <= segs; j++) {
        const theta = (j / segs) * Math.PI * 2;
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
      cosmosGroup.add(ring);
    });

    // Create 3D Meshes for each skill node with labels
    const nodeMeshes: THREE.Mesh[] = [];

    SKILL_NODES.forEach((node, idx) => {
      const radius = idx < 5 ? 1.5 : 2.15;
      const angle = ((idx % 5) / 5) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle * 2) * 0.35;
      const z = Math.sin(angle) * radius;

      // Group holding mesh + label
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, y, z);

      // Core Solid Mesh
      const geo = new THREE.SphereGeometry(node.size, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { name: node.name };

      // Outer Wireframe Halo
      const haloGeo = new THREE.SphereGeometry(node.size * 1.25, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(halo);

      // 3D Billboard Floating Label
      const label = createTextSprite(node.name, `#${node.color.toString(16).padStart(6, "0")}`);
      mesh.add(label);

      nodeMeshes.push(mesh);
      nodeGroup.add(mesh);
      cosmosGroup.add(nodeGroup);
    });

    // Ambient stars background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 140;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 8;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xffc799,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    cosmosGroup.add(starField);

    // Interactive Drag Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      dragVelocity.x = deltaX * 0.005;
      dragVelocity.y = deltaY * 0.005;
      cosmosGroup.rotation.y += dragVelocity.x;
      cosmosGroup.rotation.x += dragVelocity.y;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Raycaster for clicking spheres
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

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

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Inertia and slow continuous orbital spin
      if (!isDragging) {
        dragVelocity.x *= 0.95;
        dragVelocity.y *= 0.95;
        cosmosGroup.rotation.y += 0.003 + dragVelocity.x;
        cosmosGroup.rotation.x += dragVelocity.y;
      }

      const currentActive = activeSkillRef.current;
      nodeMeshes.forEach((m) => {
        m.rotation.y = time * 0.4;
        m.rotation.x = time * 0.2;

        const isTarget = m.userData.name === currentActive;
        const targetScale = isTarget ? 1.35 + Math.sin(time * 3) * 0.08 : 1.0;
        m.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const activeNode = SKILL_NODES.find((s) => s.name === activeSkill) ?? SKILL_NODES[0];

  return (
    <div className="relative w-full rounded-2xl border border-ember-500/25 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-xl">
      {/* Header bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-ember-500" />
          <h4 className="font-condensed text-xs uppercase tracking-[0.2em] text-white/90 font-semibold">
            Interactive 3D Skill Galaxy
          </h4>
        </div>
        <span className="rounded-full bg-ember-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-ember-400 border border-ember-500/30">
          Drag to Rotate · Click Node
        </span>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="h-[320px] sm:h-[380px] lg:h-[460px] w-full cursor-grab active:cursor-grabbing rounded-xl bg-gradient-to-b from-[#060c14]/40 to-transparent"
      />

      {/* Active Skill HUD Detail Pill */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-ember-500/20 text-ember-400 font-bold text-xs">
            {activeNode.level}%
          </span>
          <div>
            <p className="font-display text-sm text-white uppercase leading-none">{activeNode.name}</p>
            <p className="text-[11px] text-white/60 mt-0.5">{activeNode.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-condensed uppercase tracking-wider text-ember-400 shrink-0">
          <span>{activeNode.project}</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>

      {/* Interactive Selection Pills */}
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {SKILL_NODES.map((node) => (
          <button
            key={node.name}
            onClick={() => setActiveSkill(node.name)}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-all ${
              activeSkill === node.name
                ? "border-ember-500 bg-ember-500 text-black font-semibold shadow-glow"
                : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            {node.name}
          </button>
        ))}
      </div>
    </div>
  );
}
