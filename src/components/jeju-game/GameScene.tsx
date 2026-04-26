"use client";

import { useEffect, useRef, useState } from "react";
import { PlayerController } from "./PlayerController";
import { CodeSpot } from "./CodeObject";

type Props = {
  code: string;
  codeSpot: CodeSpot;
  onDiscovered: () => void;
  discovered: boolean;
};

declare global {
  interface Window {
    THREE: any;
  }
}

const MOBILE_SPEED = 0.1;
const DESKTOP_SPEED = 0.13;

export default function GameScene({ code, codeSpot, onDiscovered, discovered }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerControllerRef = useRef<PlayerController | null>(null);
  const playerPositionRef = useRef({ x: 0, y: 1.4, z: 0 });
  const cluePlaneRef = useRef<any>(null);
  const [nearClue, setNearClue] = useState(false);

  useEffect(() => {
    let animationId = 0;
    let renderer: any;
    const mountElement = mountRef.current;

    const load = async () => {
      if (!mountElement) return;

      if (!window.THREE) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Three.js 로드 실패"));
          document.body.appendChild(script);
        });
      }

      const THREE = window.THREE;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#d9f4ff");
      scene.fog = new THREE.Fog("#d9f4ff", 12, 75);

      const camera = new THREE.PerspectiveCamera(70, mountElement.clientWidth / mountElement.clientHeight, 0.1, 200);
      camera.position.set(0, 2, 5);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountElement.appendChild(renderer.domElement);

      const hemi = new THREE.HemisphereLight("#fff2df", "#9bc8df", 1.3);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight("#fff3d8", 1.2);
      sun.position.set(14, 20, 8);
      scene.add(sun);

      const ocean = new THREE.Mesh(
        new THREE.PlaneGeometry(120, 120),
        new THREE.MeshStandardMaterial({ color: "#9adfff", roughness: 0.2, metalness: 0 })
      );
      ocean.rotation.x = -Math.PI / 2;
      ocean.position.y = -0.3;
      scene.add(ocean);

      const island = new THREE.Mesh(
        new THREE.CircleGeometry(22, 8),
        new THREE.MeshStandardMaterial({ color: "#f7eccb", roughness: 1 })
      );
      island.rotation.x = -Math.PI / 2;
      island.position.y = 0;
      scene.add(island);

      const zone = (x: number, z: number, color: string, width = 8, depth = 8) => {
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(width, depth),
          new THREE.MeshStandardMaterial({ color, roughness: 1 })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x, 0.03, z);
        scene.add(mesh);
      };

      // map objects are built in this section.
      zone(-12, -8, "#fce8be", 10, 8); // beach
      zone(3, 10, "#e8f7c8", 10, 9); // tangerine farm
      zone(12, 0, "#efe6df", 11, 10); // stone village

      const rockMaterial = new THREE.MeshStandardMaterial({ color: "#6b7580", roughness: 1 });
      for (let i = 0; i < 14; i++) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 + Math.random() * 0.35, 0), rockMaterial);
        rock.position.set((Math.random() - 0.5) * 34, 0.4, (Math.random() - 0.5) * 34);
        scene.add(rock);
      }

      for (let i = 0; i < 8; i++) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.1), new THREE.MeshStandardMaterial({ color: "#83634b" }));
        trunk.position.set(-1 + (i % 4) * 1.7, 0.6, 8 + Math.floor(i / 4) * 2);
        scene.add(trunk);

        const crown = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 8), new THREE.MeshStandardMaterial({ color: "#98db86" }));
        crown.position.set(trunk.position.x, 1.5, trunk.position.z);
        scene.add(crown);

        const orange = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshStandardMaterial({ color: "#ffb347" }));
        orange.position.set(trunk.position.x + 0.2, 1.3, trunk.position.z + 0.15);
        scene.add(orange);
      }

      const wallMaterial = new THREE.MeshStandardMaterial({ color: "#767a77" });
      for (let i = 0; i < 8; i++) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.6), wallMaterial);
        wall.position.set(8 + i * 1, 0.35, 4.5);
        scene.add(wall);
      }

      const cafe = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.8), new THREE.MeshStandardMaterial({ color: "#ffd6d6" }));
      cafe.position.set(14, 1.1, -1);
      scene.add(cafe);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.3, 4), new THREE.MeshStandardMaterial({ color: "#ffb3ba" }));
      roof.position.set(14, 3, -1);
      roof.rotation.y = Math.PI / 4;
      scene.add(roof);

      const dol = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 1.8, 8), new THREE.MeshStandardMaterial({ color: "#8a8f95" }));
      dol.position.set(8, 0.9, 6);
      scene.add(dol);

      cluePlaneRef.current = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 0.9),
        new THREE.MeshBasicMaterial({ color: "#fef3c7", side: THREE.DoubleSide })
      );
      cluePlaneRef.current.position.set(codeSpot.position.x, codeSpot.position.y, codeSpot.position.z);
      cluePlaneRef.current.lookAt(0, 1.5, 0);
      scene.add(cluePlaneRef.current);

      const playerController = new PlayerController();
      playerControllerRef.current = playerController;

      const clock = new THREE.Clock();

      const onResize = () => {
        if (!mountElement || !renderer) return;
        camera.aspect = mountElement.clientWidth / mountElement.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
      };

      window.addEventListener("resize", onResize);

      const animate = () => {
        const delta = clock.getDelta();
        const speed = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? MOBILE_SPEED : DESKTOP_SPEED;
        const moveStep = speed * (delta / 0.016);

        const player = playerPositionRef.current;
        const movement = playerController.movement;

        if (movement.forward) player.z -= moveStep;
        if (movement.backward) player.z += moveStep;
        if (movement.left) player.x -= moveStep;
        if (movement.right) player.x += moveStep;

        player.x = Math.max(-18, Math.min(18, player.x));
        player.z = Math.max(-18, Math.min(18, player.z));

        camera.position.lerp(new THREE.Vector3(player.x, 2.5, player.z + 4.4), 0.12);
        camera.lookAt(player.x, 1.1, player.z - 1.2);

        const dist = Math.hypot(player.x - codeSpot.position.x, player.z - codeSpot.position.z);
        setNearClue(dist < 2.4 && !discovered);

        const wobble = Math.sin(clock.elapsedTime * 2) * 0.08;
        cluePlaneRef.current.position.y = codeSpot.position.y + wobble;
        cluePlaneRef.current.lookAt(camera.position);

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", onResize);
        playerController.dispose();
        renderer.dispose();
      };
    };

    let cleanup: (() => void) | undefined;
    load().then((fn) => {
      cleanup = fn;
    });

    return () => {
      if (cleanup) cleanup();
      if (renderer && mountElement?.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [codeSpot.position.x, codeSpot.position.y, codeSpot.position.z, discovered]);

  const pressMove = (dir: "forward" | "backward" | "left" | "right", active: boolean) => {
    playerControllerRef.current?.setMobileDirection(dir, active);
  };

  return (
    <div className="relative h-[68vh] min-h-[440px] w-full overflow-hidden rounded-3xl border-4 border-white/60 bg-[#b8ebff] shadow-xl">
      <div ref={mountRef} className="h-full w-full" />

      {nearClue && (
        <button
          className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-[#ff8c8c] px-5 py-3 text-sm font-bold text-white shadow-lg"
          onClick={() => onDiscovered()}
        >
          {codeSpot.label} 조사하기
        </button>
      )}

      <div className="absolute bottom-4 left-4 grid grid-cols-3 gap-2 md:hidden">
        <div />
        <MobilePadButton label="↑" onPress={(active) => pressMove("forward", active)} />
        <div />
        <MobilePadButton label="←" onPress={(active) => pressMove("left", active)} />
        <MobilePadButton label="↓" onPress={(active) => pressMove("backward", active)} />
        <MobilePadButton label="→" onPress={(active) => pressMove("right", active)} />
      </div>

      {!discovered && (
        <p className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-slate-700">
          WASD / 방향키 또는 모바일 패드로 이동해 단서를 찾으세요
        </p>
      )}

      {discovered && (
        <p className="pointer-events-none absolute left-4 top-4 rounded-full bg-[#fff7d8] px-3 py-2 text-xs font-bold text-[#7b5d00]">
          찾은 번호: {code}
        </p>
      )}
    </div>
  );
}

function MobilePadButton({ label, onPress }: { label: string; onPress: (active: boolean) => void }) {
  return (
    <button
      className="h-11 w-11 rounded-lg bg-white/85 text-lg font-bold text-slate-700"
      onTouchStart={() => onPress(true)}
      onTouchEnd={() => onPress(false)}
      onMouseDown={() => onPress(true)}
      onMouseUp={() => onPress(false)}
      onMouseLeave={() => onPress(false)}
    >
      {label}
    </button>
  );
}
