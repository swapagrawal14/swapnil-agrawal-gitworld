import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { germs, tickGerms } from "@/game/combat";
import { sim } from "@/game/input";
import { useStudio } from "@/game/store";

const COLORS = {
  virus: "#c45c7a",
  bacillus: "#6b9e4a",
  plaque: "#d4a85a",
} as const;

export function Pathogens() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const playing = useStudio.getState().playing;
    tickGerms(Math.min(dt, 0.08), sim.x, sim.z, playing);
    const root = group.current;
    if (!root) return;
    for (let i = 0; i < germs.length; i += 1) {
      const g = germs[i];
      const child = root.children[i];
      if (!child) continue;
      child.visible = g.alive;
      child.position.set(g.x, g.y, g.z);
      child.rotation.y = g.yaw;
      child.scale.setScalar(g.hit > 0 ? 1.15 : 1);
    }
  });

  return (
    <group ref={group}>
      {germs.map((g) => (
        <mesh key={g.id} castShadow={false}>
          {g.kind === "bacillus" ? (
            <capsuleGeometry args={[0.28, 0.55, 4, 8]} />
          ) : g.kind === "plaque" ? (
            <icosahedronGeometry args={[0.42, 0]} />
          ) : (
            <sphereGeometry args={[0.38, 10, 8]} />
          )}
          <meshStandardMaterial color={COLORS[g.kind]} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}
