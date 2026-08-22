import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { look, sim } from "@/game/input";
import { useStudio } from "@/game/store";

const camPos = new THREE.Vector3();
const desired = new THREE.Vector3();

/** Fixed title camera + play orbit. Always mounted (never behind Suspense). */
export function CameraRig() {
  const { camera } = useThree();

  // Snap to a known-good title view on first frame so we never start on empty sky
  useLayoutEffect(() => {
    camera.position.set(14, 9, 18);
    camera.lookAt(0, 1, 0);
    if ("updateProjectionMatrix" in camera) {
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  }, [camera]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.08);
    const studio = useStudio.getState();
    const playing = studio.playing;

    if (!Number.isFinite(look.yaw)) look.yaw = Math.PI / 2;
    if (!Number.isFinite(look.pitch)) look.pitch = 0.35;

    let tx = 0;
    let ty = 0;
    let tz = 0;
    let dist = 22;
    let lookY = 1.2;
    let lag = 4;

    if (!playing) {
      if (!look.dragging) look.yaw += dt * 0.1;
      tx = 0;
      ty = 0;
      tz = 2;
      dist = 22;
      lookY = 1.2;
      lag = 3;
    } else if (studio.inCar) {
      tx = sim.x;
      ty = sim.y;
      tz = sim.z;
      dist = 11;
      lookY = 1.15;
      lag = 5;
    } else {
      tx = sim.x;
      ty = sim.y;
      tz = sim.z;
      dist = 5.6;
      lookY = 1.32;
      lag = 7;
    }

    const pitch = THREE.MathUtils.clamp(look.pitch, 0.08, 1.2);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    desired.set(
      tx + Math.sin(look.yaw) * dist * cp,
      Math.max(ty + lookY + sp * dist * 0.85, 2),
      tz + Math.cos(look.yaw) * dist * cp,
    );

    if (![desired.x, desired.y, desired.z].every(Number.isFinite)) return;

    const k = 1 - Math.exp(-lag * dt);
    camPos.copy(state.camera.position).lerp(desired, k);
    if (![camPos.x, camPos.y, camPos.z].every(Number.isFinite)) return;
    state.camera.position.copy(camPos);
    state.camera.lookAt(tx, ty + 1.0, tz);

    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      const targetFov = studio.inCar && playing ? 48 + Math.abs(sim.speed) * 0.35 : 50;
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, dt);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
