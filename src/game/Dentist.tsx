import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { combat } from "@/game/combat";
import { foot, keys, sim } from "@/game/input";
import { MODEL } from "@/game/models";
import { useStudio } from "@/game/store";

const _fwd = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _beamQuat = new THREE.Quaternion();

function pinHipsInPlace(clips: THREE.AnimationClip[]) {
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

function findRightHand(root: THREE.Object3D): THREE.Object3D | null {
  const isHand = (n: string) => n === "mixamorigRightHand" || n === "mixamorig:RightHand";
  const found: THREE.Object3D[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.SkinnedMesh;
    if (mesh.isSkinnedMesh && mesh.skeleton) {
      const b = mesh.skeleton.bones.find((x) => isHand(x.name));
      if (b) found[0] = b;
    }
    if (!found[0] && isHand(o.name)) found[0] = o;
  });
  return found[0] ?? null;
}

function makeHandpiece() {
  const root = new THREE.Group();
  root.name = "dentalLaser";
  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.03, 0.16, 10),
    new THREE.MeshStandardMaterial({ color: "#1f2a2e", metalness: 0.55, roughness: 0.35 }),
  );
  grip.position.y = 0.09;
  root.add(grip);
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.018, 0.07, 8),
    new THREE.MeshStandardMaterial({ color: "#c5d0d4", metalness: 0.8, roughness: 0.22 }),
  );
  neck.position.y = 0.18;
  root.add(neck);
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 8, 8),
    new THREE.MeshStandardMaterial({
      color: "#7ef6ff",
      emissive: "#5ee7f2",
      emissiveIntensity: 1.6,
    }),
  );
  tip.position.y = 0.22;
  root.add(tip);
  return root;
}

export function Dentist() {
  const { scene, animations } = useGLTF(MODEL.dentist);
  const handpiece = useMemo(() => makeHandpiece(), []);
  const beam = useRef<THREE.Mesh>(null);

  useMemo(() => {
    pinHipsInPlace(animations);
    scene.traverse((o) => {
      const m = o as THREE.SkinnedMesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = false;
      m.frustumCulled = false;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) {
        const std = mat as THREE.MeshStandardMaterial;
        if (!std.isMeshStandardMaterial) continue;
        std.metalness = 0;
        std.roughness = 0.62;
        std.side = THREE.DoubleSide;
        std.envMapIntensity = 0.35;
        std.needsUpdate = true;
      }
    });
  }, [scene, animations]);

  const { actions } = useAnimations(animations, scene);
  const current = useRef<string>("idle");
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    const hand = findRightHand(scene);
    if (!hand) return;
    hand.add(handpiece);
    handpiece.scale.setScalar(0.01);
    handpiece.position.set(0.00012, 0.0009, 0.00032);
    handpiece.rotation.set(0, 0, 0);
    return () => {
      hand.remove(handpiece);
    };
  }, [scene, handpiece]);

  useEffect(() => {
    actions.idle?.setLoop(THREE.LoopRepeat, Infinity);
    actions.run?.setLoop(THREE.LoopRepeat, Infinity);
    for (const name of ["shoot", "uppercut"] as const) {
      const a = actions[name];
      if (!a) continue;
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
    }
    actions.idle?.reset().fadeIn(0.12).play();
    const mixer = actions.idle?.getMixer();
    const onDone = (e: { action: THREE.AnimationAction }) => {
      const clip = e.action.getClip().name;
      if (clip === "shoot" || clip === "uppercut") {
        if (combat.stun <= 0 && !keys.has("KeyF") && !combat.mobileFire) foot.action = null;
      }
    };
    mixer?.addEventListener("finished", onDone);
    return () => {
      mixer?.removeEventListener("finished", onDone);
    };
  }, [actions]);

  useFrame(() => {
    const inCar = useStudio.getState().inCar;
    const g = group.current;
    if (!g) return;
    g.visible = !inCar;
    handpiece.visible = !inCar;

    const x = Number.isFinite(sim.x) ? sim.x : 0;
    const z = Number.isFinite(sim.z) ? sim.z : 0;
    const yaw = Number.isFinite(sim.yaw) ? sim.yaw : 0;
    g.position.set(x, 0.02, z);
    g.rotation.set(0, yaw + Math.PI, 0);

    if (inCar) {
      combat.firing = false;
      if (beam.current) beam.current.visible = false;
      return;
    }

    const stunned = combat.stun > 0;
    const wantFire = !stunned && (keys.has("KeyF") || combat.mobileFire);
    if (stunned) {
      foot.action = "uppercut";
      combat.firing = false;
    } else if (wantFire) {
      if (foot.action !== "shoot") foot.action = "shoot";
      combat.firing = true;
    } else {
      combat.firing = false;
    }

    try {
      handpiece.updateWorldMatrix(true, false);
      handpiece.getWorldPosition(combat.origin);
      _fwd.set(0, 1, 0).transformDirection(handpiece.matrixWorld);
      if (_fwd.lengthSq() > 0.0001) {
        _fwd.normalize();
        combat.dir.copy(_fwd);
      } else {
        combat.dir.set(-Math.sin(yaw), 0.04, -Math.cos(yaw)).normalize();
      }
      combat.origin.addScaledVector(combat.dir, 0.18);
    } catch {
      combat.dir.set(-Math.sin(yaw), 0.04, -Math.cos(yaw)).normalize();
      combat.origin.set(x, 1.2, z);
    }

    if (beam.current) {
      const on = combat.firing && Number.isFinite(combat.origin.x) && Number.isFinite(combat.dir.x);
      beam.current.visible = on;
      if (on) {
        beam.current.position.copy(combat.origin).addScaledVector(combat.dir, 8);
        _beamQuat.setFromUnitVectors(_up, combat.dir);
        beam.current.quaternion.copy(_beamQuat);
      }
    }

    const speed = Math.abs(sim.speed) || 0;
    let next = current.current;
    if (foot.action) next = foot.action;
    else if (current.current === "run") next = speed > 0.28 ? "run" : "idle";
    else next = speed > 0.7 ? "run" : "idle";

    if (next !== current.current) {
      const prev = actions[current.current];
      const act = actions[next];
      prev?.fadeOut(0.12);
      if (act) {
        if (next === "run" || next === "idle") {
          act.setLoop(THREE.LoopRepeat, Infinity);
          act.clampWhenFinished = false;
        }
        if (!act.isRunning()) act.reset();
        act.enabled = true;
        act.fadeIn(0.12).play();
      }
      current.current = next;
    }

    const run = actions.run;
    if (run && current.current === "run") {
      const dir = sim.speed < 0 ? -1 : 1;
      const ts = dir * THREE.MathUtils.clamp(speed / 4.8, 0.9, 1.75);
      if (Number.isFinite(ts)) run.timeScale = ts;
    }
  }, 1);

  return (
    <>
      <group ref={group}>
        <primitive object={scene} />
      </group>
      <mesh ref={beam} visible={false} frustumCulled={false}>
        <cylinderGeometry args={[0.016, 0.05, 16, 7]} />
        <meshBasicMaterial color="#7ef6ff" transparent opacity={0.72} depthWrite={false} />
      </mesh>
    </>
  );
}
