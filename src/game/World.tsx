import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { LAKE, WORLD, sites } from "@/game/layout";
import { MODEL, FittedProp, Prop } from "@/game/models";
import { ArchiveField, Pavilion } from "@/game/monuments";

const featuredSites = sites.filter((s) => s.featured);
const archiveSites = sites.filter((s) => !s.featured);

function ImmediateGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WORLD * 2 + 8, WORLD * 2 + 8]} />
        <meshStandardMaterial color="#87a85c" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[13.5, 40]} />
        <meshStandardMaterial color="#e6dcc8" roughness={0.78} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[12.2, 13.4, 40]} />
        <meshStandardMaterial color="#cfc3a8" roughness={0.86} />
      </mesh>
    </group>
  );
}

function GroundTextures() {
  const [grass, plaza, path] = useTexture([
    "/textures/grass.jpg",
    "/textures/plaza.jpg",
    "/textures/path.jpg",
  ]);
  useMemo(() => {
    for (const t of [grass, plaza, path]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 2;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
    }
    grass.repeat.set(12, 12);
    plaza.repeat.set(5, 5);
    path.repeat.set(3, 12);
  }, [grass, plaza, path]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WORLD * 2 + 8, WORLD * 2 + 8]} />
        <meshStandardMaterial map={grass} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, 0]} receiveShadow>
        <circleGeometry args={[13.5, 40]} />
        <meshStandardMaterial map={plaza} roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.031, 0]} receiveShadow>
        <ringGeometry args={[12.2, 13.4, 40]} />
        <meshStandardMaterial map={path} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Water() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = -0.06 + Math.sin(state.clock.elapsedTime * 0.7) * 0.03;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[LAKE.x, -0.06, LAKE.z]}>
      <circleGeometry args={[LAKE.r, 40]} />
      <meshStandardMaterial color="#3d8f96" roughness={0.18} metalness={0.12} />
    </mesh>
  );
}

function PalaceModel() {
  return (
    <group position={[0, 0.2, 0]}>
      <FittedProp url={MODEL.palace} size={8.4} castShadow />
    </group>
  );
}

function Fountain() {
  return <FittedProp url={MODEL.fountain} size={3.15} castShadow />;
}

function Grove() {
  const trees = useMemo(() => {
    const list: { url: string; x: number; z: number; s: number; r: number }[] = [];
    for (let i = 0; i < 14; i += 1) {
      const a = (i / 14) * Math.PI * 2 + 0.35;
      const r = 44 + (i % 4) * 1.4;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 4) continue;
      const kind = i % 5;
      list.push({
        url: kind === 0 ? MODEL.palm : kind === 1 ? MODEL.treeOak : MODEL.tree,
        x,
        z,
        s: kind === 0 ? 0.28 : 0.2 + (i % 3) * 0.03,
        r: a,
      });
    }
    return list;
  }, []);

  const lakePalms = [
    { x: LAKE.x + 6.5, z: 7.2, s: 0.32 },
    { x: LAKE.x + 7.4, z: -6.4, s: 0.28 },
  ];

  return (
    <group>
      {trees.map((t, i) => (
        <Prop key={i} url={t.url} position={[t.x, 0, t.z]} scale={t.s} rotation={[0, t.r, 0]} />
      ))}
      {lakePalms.map((p, i) => (
        <Prop key={`p${i}`} url={MODEL.palm} position={[p.x, 0, p.z]} scale={p.s} />
      ))}
      <Prop url={MODEL.rock} position={[18, 0, -24]} scale={0.35} />
      <Prop url={MODEL.canoe} position={[LAKE.x + 5, 0.02, 3]} scale={0.35} rotation={[0, 0.6, 0]} />
    </group>
  );
}

export function Terrain() {
  return (
    <group>
      <ImmediateGround />
      <Suspense fallback={null}>
        <GroundTextures />
      </Suspense>
      <Water />
    </group>
  );
}

export function Landmarks() {
  return (
    <group>
      <group position={[LAKE.x, 0, LAKE.z]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[5.4, 5.7, 0.22, 28]} />
          <meshStandardMaterial color="#e8dfd0" roughness={0.72} />
        </mesh>
        <Suspense fallback={null}>
          <PalaceModel />
        </Suspense>
      </group>
      <Suspense fallback={null}>
        <Fountain />
      </Suspense>
      {featuredSites.map((s) => (
        <Pavilion key={s.slug} site={s} />
      ))}
      <ArchiveField sites={archiveSites} />
      <Suspense fallback={null}>
        <Grove />
      </Suspense>
    </group>
  );
}

export function World() {
  return (
    <group>
      <Terrain />
      <Landmarks />
    </group>
  );
}
