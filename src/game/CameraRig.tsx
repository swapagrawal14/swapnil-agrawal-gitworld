import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { look, sim } from "@/game/input";
import { useStudio } from "@/game/store";

const camPos = new THREE.Vector3();
const desired = new THREE.Vector3();

/**
 * Always-mounted camera. Must NOT live inside a Suspense that waits on GLBs,
 * or the title screen stays on empty sky until models finish.
 */
export function CameraRig() {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.08);
    const studio = useStudio.getState();
    const playing = studio.playing;

    if (!Number.isFinite(look.yaw) || !Number.isFinite(look.pitch)) {
      look.yaw = sim.yaw;
      look.pitch = 0.42;
    }

    let tx: number;
    let ty: number;
    let tz: number;
    let dist: number;
    let lookY: number;
    let lag: number;

    if (!playing) {
      if (!look.dragging) look.yaw += dt * 0.12;
      tx = 0;
      ty = 0;
      tz = 0;
      dist = 26;
      lookY = 1.5;
      lag = 3.2;
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

    const cp = Math.cos(look.pitch);
    const sp = Math.sin(look.pitch);
    desired.set(
      tx + Math.sin(look.yaw) * dist * cp,
      ty + lookY + sp * dist * 0.9,
      tz + Math.cos(look.yaw) * dist * cp,
    );

    const k = 1 - Math.exp(-lag * dt);
    camPos.copy(state.camera.position).lerp(desired, k);
    if (!Number.isFinite(camPos.x) || !Number.isFinite(camPos.y) || !Number.isFinite(camPos.z)) {
      return;
    }
    state.camera.position.copy(camPos);

    if (Number.isFinite(tx) && Number.isFinite(ty) && Number.isFinite(tz)) {
      state.camera.lookAt(tx, ty + lookY * 0.35, tz);
    }

    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      const targetFov = studio.inCar && playing ? 48 + Math.abs(sim.speed) * 0.35 : 50;
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, dt);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
