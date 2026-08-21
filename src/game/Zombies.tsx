import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { tickZombies, zombies } from "@/game/combat";
import { sim } from "@/game/input";
import { MODEL } from "@/game/models";
import { useStudio } from "@/game/store";

const TARGET_H = 1.78;

function stripScaleTracks(clips: THREE.AnimationClip[]) {
  for (const clip of clips) {
    clip.tracks = clip.tracks.filter((t) => !t.name.endsWith(".scale"));
    for (const track of clip.tracks) {
      if (!track.name.endsWith("Hips.position")) continue;
      const v = track.values;
      const x0 = v[0];
      const z0 = v[2];
      for (let i = 0; i < v.length; i += 3) {
        v[i] = x0;
        v[i + 2] = z0;
      }
    }
  }
}

export function Zombies() {
  const { scene, animations } = useGLTF(MODEL.zombie);

  const pack = useMemo(() => {
    stripScaleTracks(animations);
    let mesh: THREE.SkinnedMesh | null = null;
    scene.updateMatrixWorld(true);
    scene.traverse((o) => {
      const m = o as THREE.SkinnedMesh;
      if (m.isSkinnedMesh && !mesh) mesh = m;
    });
    let fit = 1;
    if (mesh) {
      const sm = mesh as THREE.SkinnedMesh;
      sm.geometry.computeBoundingBox();
      const box = sm.geometry.boundingBox;
      const ws = new THREE.Vector3();
      sm.getWorldScale(ws);
      const h = box ? (box.max.y - box.min.y) * Math.abs(ws.y) : 1.78;
      fit = TARGET_H / Math.max(h, 0.01);
    }
    return zombies.map(() => {
      const root = SkeletonUtils.clone(scene) as THREE.Object3D;
      root.traverse((o) => {
        const m = o as THREE.SkinnedMesh;
        if (!m.isMesh) return;
        m.castShadow = false;
        m.receiveShadow = false;
        m.frustumCulled = false;
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        for (const mat of mats) {
          const std = mat as THREE.MeshStandardMaterial;
          if (!std.isMeshStandardMaterial) continue;
          std.metalness = 0;
          std.roughness = 0.72;
          std.side = THREE.DoubleSide;
        }
      });
      const mixer = new THREE.AnimationMixer(root);
      const walk = mixer.clipAction(animations[0]);
      const die = mixer.clipAction(animations[1] ?? animations[0]);
      walk.setLoop(THREE.LoopRepeat, Infinity);
      die.setLoop(THREE.LoopOnce, 1);
      die.clampWhenFinished = true;
      walk.play();
      return { root, mixer, walk, die, clip: "walk", fit };
    });
  }, [scene, animations]);

  const wrap = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const playing = useStudio.getState().playing;
    const inCar = useStudio.getState().inCar;
    tickZombies(Math.min(dt, 0.08), sim.x, sim.z, playing, inCar);
    for (let i = 0; i < pack.length; i += 1) {
      const z = zombies[i];
      const p = pack[i];
      if (!z || !p) continue;
      p.root.position.set(z.x, 0, z.z);
      p.root.rotation.y = z.yaw + Math.PI;
      p.root.scale.setScalar(p.fit);
      p.root.visible = true;
      const want = z.state === "die" ? "die" : "walk";
      if (p.clip !== want) {
        if (want === "die") {
          p.walk.fadeOut(0.12);
          p.die.reset().fadeIn(0.08).play();
        } else {
          p.die.stop();
          p.walk.reset().fadeIn(0.12).play();
        }
        p.clip = want;
      }
      p.mixer.update(dt);
    }
  });

  return (
    <group ref={wrap}>
      {pack.map((p, i) => (
        <primitive key={i} object={p.root} />
      ))}
    </group>
  );
}
