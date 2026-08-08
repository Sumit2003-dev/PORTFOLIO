import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SKILL_NODES = [
  { name: "Python", color: 0xff6a00, size: 0.32 },
  { name: "Machine Learning", color: 0xff8a2b, size: 0.30 },
  { name: "RAG & LLMs", color: 0xffb870, size: 0.28 },
  { name: "Scikit-Learn", color: 0xe05600, size: 0.25 },
  { name: "Pandas & NumPy", color: 0xffa043, size: 0.25 },
  { name: "FAISS & ChromaDB", color: 0xd64d00, size: 0.23 },
  { name: "PyTorch & DL", color: 0xff7b1a, size: 0.26 },
  { name: "Flask & Streamlit", color: 0xc84200, size: 0.24 },
  { name: "SQL & Data Engineering", color: 0xff9533, size: 0.27 },
  { name: "Computer Vision", color: 0xe8630a, size: 0.24 },
];

export default function SkillCosmos3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<string>("Python");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5.0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const cosmosGroup = new THREE.Group();
    scene.add(cosmosGroup);

    // Orbit Ring Visualizers (Brighter lines)
    const orbit1Geo = new THREE.RingGeometry(1.6, 1.62, 64);
    const orbit1Mat = new THREE.MeshBasicMaterial({ color: 0xff6a00, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
    const orbit1 = new THREE.Mesh(orbit1Geo, orbit1Mat);
    orbit1.rotation.x = Math.PI / 2.5;
    cosmosGroup.add(orbit1);

    const orbit2Geo = new THREE.RingGeometry(2.3, 2.32, 64);
    const orbit2Mat = new THREE.MeshBasicMaterial({ color: 0xffa043, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const orbit2 = new THREE.Mesh(orbit2Geo, orbit2Mat);
    orbit2.rotation.x = Math.PI / -3;
    cosmosGroup.add(orbit2);

    // Create 3D Meshes for each skill node
    const nodeMeshes: THREE.Mesh[] = [];

    SKILL_NODES.forEach((node, idx) => {
      const radius = idx < 5 ? 1.6 : 2.3;
      const angle = ((idx % 5) / 5) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = (Math.sin(angle * 2) * 0.45);
      const z = Math.sin(angle) * radius;

      const geo = new THREE.SphereGeometry(node.size, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: node.color,
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { name: node.name, originalScale: 1, basePos: new THREE.Vector3(x, y, z) };
      nodeMeshes.push(mesh);
      cosmosGroup.add(mesh);
    });

    // Ambient stars background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 180;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 8;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.045, color: 0xffc799, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending });
    const starField = new THREE.Points(starGeo, starMat);
    cosmosGroup.add(starField);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      cosmosGroup.rotation.y = time * 0.15;
      cosmosGroup.rotation.x = Math.sin(time * 0.05) * 0.18;

      nodeMeshes.forEach((m) => {
        m.rotation.y = time * 0.45;
        m.rotation.x = time * 0.25;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-ember-500/30 bg-white/[0.03] p-6 backdrop-blur-xl shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-condensed text-xs uppercase tracking-[0.25em] text-ember-500 font-semibold">
          Interactive 3D Skill Cosmos
        </h4>
        <span className="rounded-full bg-ember-500/20 px-3.5 py-1 text-[11px] font-semibold text-ember-400 border border-ember-500/40">
          WebGL Accelerated
        </span>
      </div>
      <div ref={containerRef} className="h-[300px] w-full sm:h-[360px]" />
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {SKILL_NODES.map((node) => (
          <button
            key={node.name}
            onClick={() => setActiveSkill(node.name)}
            className={`rounded-full border px-3.5 py-1 text-xs transition-all ${
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
