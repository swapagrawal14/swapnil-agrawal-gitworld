import { useFrame } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Site } from "@/game/layout";
import { FittedProp, SITE_GLB } from "@/game/models";
import { useStudio } from "@/game/store";

function Mat({
  color,
  roughness = 0.42,
  metalness = 0.08,
}: {
  color: string;
  roughness?: number;
  metalness?: number;
}) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

function Plinth({ r = 2.4, color = "#e8dfd0" }: { r?: number; color?: string }) {
  return (
    <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[r, r + 0.15, 0.16, 24]} />
      <Mat color={color} roughness={0.55} />
    </mesh>
  );
}

function Spin({
  children,
  speed = 0.35,
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += speed * dt;
  });
  return <group ref={ref}>{children}</group>;
}

function MotionRings({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2.2} />
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 1.1, 12]} />
        <Mat color="#d7c4ae" />
      </mesh>
      <Spin speed={0.5}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]} position={[0, 2.4, 0]} castShadow>
          <torusGeometry args={[1.35, 0.12, 10, 48]} />
          <Mat color={color} metalness={0.35} roughness={0.25} />
        </mesh>
      </Spin>
      <Spin speed={-0.32}>
        <mesh rotation={[0.4, 0.6, Math.PI / 5]} position={[0, 2.4, 0]} castShadow>
          <torusGeometry args={[1.05, 0.1, 10, 40]} />
          <Mat color="#f4efe6" metalness={0.2} roughness={0.3} />
        </mesh>
      </Spin>
      <mesh position={[0, 2.4, 0]} castShadow>
        <sphereGeometry args={[0.42, 20, 16]} />
        <Mat color={color} metalness={0.4} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Kimchi({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2.1} />
      <mesh position={[0, 1.55, 0]} castShadow>
        <capsuleGeometry args={[1.05, 1.1, 8, 16]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0.95, 0.85, 0.7]} rotation={[0, 0.6, 0.4]} castShadow>
        <sphereGeometry args={[0.38, 12, 10]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0, 1.7, 1.05]} castShadow>
        <boxGeometry args={[1.1, 0.12, 0.08]} />
        <Mat color="#f4efe6" />
      </mesh>
      <mesh position={[0, 1.4, 1.05]} castShadow>
        <boxGeometry args={[0.75, 0.1, 0.08]} />
        <Mat color="#f4efe6" />
      </mesh>
    </group>
  );
}

function Hitem({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2.3} />
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[1.6, 1.4, 1.6]} />
        <Mat color="#d9cfc0" />
      </mesh>
      <Spin speed={0.45}>
        <mesh position={[0, 2.7, 0]} castShadow>
          <icosahedronGeometry args={[1.15, 0]} />
          <Mat color={color} metalness={0.28} roughness={0.28} />
        </mesh>
        <mesh position={[1.7, 2.7, 0]} castShadow>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <Mat color="#f4efe6" />
        </mesh>
        <mesh position={[-1.2, 3.3, 0.9]} castShadow>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <Mat color="#f4efe6" />
        </mesh>
      </Spin>
    </group>
  );
}

function Globe({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2.15} />
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.55, 1.1, 12]} />
        <Mat color="#cbbba6" />
      </mesh>
      <group position={[0, 2.35, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[1.15, 32, 24]} />
          <Mat color={color} roughness={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.22, 0.035, 8, 48]} />
          <Mat color="#f4efe6" metalness={0.3} roughness={0.25} />
        </mesh>
        <mesh rotation={[0.6, 0.4, 0]}>
          <torusGeometry args={[1.22, 0.03, 8, 40]} />
          <Mat color="#f4efe6" />
        </mesh>
      </group>
    </group>
  );
}

function Film({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2.2} />
      <mesh position={[-0.7, 1.7, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.28, 24]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0.75, 1.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.24, 24]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0.05, 1.5, 0]} castShadow>
        <boxGeometry args={[0.55, 0.9, 1.15]} />
        <Mat color="#2a2724" roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 1.55, 0.62]}>
        <boxGeometry args={[0.42, 0.32, 0.06]} />
        <Mat color="#9ec4c8" metalness={0.2} roughness={0.15} />
      </mesh>
    </group>
  );
}

function PromptStack({ color }: { color: string }) {
  const slabs = [
    { y: 0.45, w: 2.4, d: 1.6, rot: 0.04 },
    { y: 0.78, w: 2.2, d: 1.5, rot: -0.08 },
    { y: 1.1, w: 2.05, d: 1.4, rot: 0.1 },
    { y: 1.42, w: 1.9, d: 1.3, rot: -0.05 },
  ];
  return (
    <group>
      <Plinth r={2.1} />
      {slabs.map((s) => (
        <mesh key={s.y} position={[0, s.y, 0]} rotation={[0, s.rot, 0]} castShadow>
          <boxGeometry args={[s.w, 0.22, s.d]} />
          <Mat color={s.y > 1.2 ? color : "#d7cfc2"} />
        </mesh>
      ))}
      <mesh position={[0, 1.95, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <Mat color={color} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Clinic({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2.2} />
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3.2, 2.8, 2.6]} />
        <Mat color="#f3eee4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.05, 0]} castShadow>
        <boxGeometry args={[3.4, 0.18, 2.8]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0, 2.15, 1.32]}>
        <boxGeometry args={[0.95, 1.15, 0.06]} />
        <Mat color="#9ec4c8" roughness={0.2} />
      </mesh>
      <mesh position={[0, 3.7, 0]} castShadow>
        <boxGeometry args={[0.38, 1.1, 0.18]} />
        <Mat color="#c45c48" />
      </mesh>
      <mesh position={[0, 3.7, 0]} castShadow>
        <boxGeometry args={[1.1, 0.38, 0.18]} />
        <Mat color="#c45c48" />
      </mesh>
    </group>
  );
}

function Orbits({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2} />
      <mesh position={[0, 2.15, 0]} castShadow>
        <sphereGeometry args={[0.7, 24, 18]} />
        <Mat color={color} metalness={0.25} roughness={0.3} />
      </mesh>
      <Spin speed={0.55}>
        <mesh rotation={[1.1, 0, 0]} position={[0, 2.15, 0]}>
          <torusGeometry args={[1.35, 0.06, 8, 48]} />
          <Mat color="#d9cfc0" metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh position={[1.35, 2.15, 0]} castShadow>
          <sphereGeometry args={[0.16, 10, 8]} />
          <Mat color="#f4efe6" />
        </mesh>
      </Spin>
      <Spin speed={-0.28}>
        <mesh rotation={[0.3, 0.8, 0.4]} position={[0, 2.15, 0]}>
          <torusGeometry args={[1.7, 0.045, 8, 48]} />
          <Mat color={color} />
        </mesh>
      </Spin>
    </group>
  );
}

function Frames({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2} />
      {[
        [-0.85, 1.5, 0.2, 0.25],
        [0.15, 1.7, -0.1, -0.15],
        [0.95, 1.35, 0.15, 0.35],
      ].map(([x, y, z, rot], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, rot, 0]} castShadow>
          <boxGeometry args={[1.05, 1.4, 0.12]} />
          <Mat color={i === 1 ? color : "#d7cfc2"} />
        </mesh>
      ))}
    </group>
  );
}

function Solids({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={2.1} />
      <mesh position={[0, 1.15, 0]} castShadow>
        <dodecahedronGeometry args={[0.7]} />
        <Mat color={color} metalness={0.2} />
      </mesh>
      <mesh position={[-1.05, 0.85, 0.4]} castShadow>
        <octahedronGeometry args={[0.4]} />
        <Mat color="#f4efe6" />
      </mesh>
      <mesh position={[1.05, 0.75, 0.25]} castShadow>
        <tetrahedronGeometry args={[0.45]} />
        <Mat color="#cbbba6" />
      </mesh>
    </group>
  );
}

function Badge({ color }: { color: string }) {
  return (
    <group>
      <Plinth r={1.9} />
      <mesh position={[0, 1.05, 0]} rotation={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.7, 1.1, 0.12]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0, 1.05, 0.08]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[1.4, 0.85, 0.04]} />
        <Mat color="#f4efe6" />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.7, 8]} />
        <Mat color="#cbbba6" />
      </mesh>
    </group>
  );
}

function markerKind(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 33 + slug.charCodeAt(i)) >>> 0;
  return h % 5;
}

function InstancedKind({ kind, sites }: { kind: number; sites: Site[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tint = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh || sites.length === 0) return;
    const y = kind === 2 || kind === 4 ? 0.95 : 0.85;
    sites.forEach((s, i) => {
      dummy.position.set(s.x, y, s.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tint.set(s.color);
      mesh.setColorAt(i, tint);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy, kind, sites, tint]);

  if (sites.length === 0) return null;

  const open = (e: { stopPropagation: () => void; instanceId?: number }) => {
    e.stopPropagation();
    const id = e.instanceId;
    if (id == null) return;
    useStudio.getState().openProject(sites[id].slug);
  };

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, sites.length]} frustumCulled onClick={open}>
      {kind === 0 && <boxGeometry args={[0.85, 1.4, 0.85]} />}
      {kind === 1 && <octahedronGeometry args={[0.7]} />}
      {kind === 2 && <cylinderGeometry args={[0.38, 0.5, 1.6, 8]} />}
      {kind === 3 && <icosahedronGeometry args={[0.62, 0]} />}
      {kind === 4 && <coneGeometry args={[0.62, 1.5, 5]} />}
      <meshStandardMaterial roughness={0.45} metalness={0.08} />
    </instancedMesh>
  );
}

function InstancedPlinths({ sites }: { sites: Site[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    sites.forEach((s, i) => {
      dummy.position.set(s.x, 0.05, s.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy, sites]);

  if (sites.length === 0) return null;

  const open = (e: { stopPropagation: () => void; instanceId?: number }) => {
    e.stopPropagation();
    const id = e.instanceId;
    if (id == null) return;
    useStudio.getState().openProject(sites[id].slug);
  };

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, sites.length]} frustumCulled onClick={open}>
      <cylinderGeometry args={[0.95, 1.05, 0.1, 10]} />
      <meshStandardMaterial color="#e8dfd0" roughness={0.65} />
    </instancedMesh>
  );
}

export function ArchiveField({ sites }: { sites: Site[] }) {
  const groups = useMemo(() => {
    const g: Site[][] = [[], [], [], [], []];
    for (const s of sites) g[markerKind(s.slug)].push(s);
    return g;
  }, [sites]);

  return (
    <group>
      <InstancedPlinths sites={sites} />
      {groups.map((list, kind) => (
        <InstancedKind key={kind} kind={kind} sites={list} />
      ))}
    </group>
  );
}

function Sculpture({ slug, color }: { slug: string; color: string }) {
  switch (slug) {
    case "motion-graphics-builder":
      return <MotionRings color={color} />;
    case "kimchi-ai":
      return <Kimchi color={color} />;
    case "hitem-3d":
      return <Hitem color={color} />;
    case "world-3d":
      return <Globe color={color} />;
    case "dental-documentary":
      return <Film color={color} />;
    case "prompting-generator":
      return <PromptStack color={color} />;
    case "dentalscript-ai":
      return <Clinic color={color} />;
    case "celestial-horoscope":
      return <Orbits color={color} />;
    case "personal-portfolio":
      return <Frames color={color} />;
    case "3d-portfolio":
      return <Solids color={color} />;
    case "id-card-studio":
      return <Badge color={color} />;
    default:
      return null;
  }
}

export function Pavilion({ site }: { site: Site }) {
  const open = () => useStudio.getState().openProject(site.slug);
  const custom = SITE_GLB[site.slug];
  return (
    <group position={[site.x, 0, site.z]} onClick={open}>
      {custom ? (
        <Suspense fallback={<Sculpture slug={site.slug} color={site.color} />}>
          <FittedProp url={custom} size={site.featured ? 4.2 : 2.4} castShadow={!!site.featured} />
        </Suspense>
      ) : (
        <Sculpture slug={site.slug} color={site.color} />
      )}
    </group>
  );
}
