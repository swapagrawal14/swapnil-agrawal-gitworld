import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { collides, inLake, sites, WORLD } from "@/game/layout";
import { combat, meleeHit } from "@/game/combat";
import {
  consumeEnterExit,
  foot,
  getSteer,
  getThrottle,
  isBoost,
  isJump,
  keys,
  look,
  parked,
  sim,
} from "@/game/input";
import { FittedCar } from "@/game/models";
import { useStudio } from "@/game/store";

function updateNear(x: number, z: number) {
  let best = 9;
  let slug: string | null = null;
  for (const s of sites) {
    const range = s.featured ? 8.5 : 3.2;
    const d = Math.hypot(x - s.x, z - s.z);
    if (d < range && d < best) {
      best = d;
      slug = s.slug;
    }
  }
  useStudio.getState().setNear(slug);
  return slug;
}

/** Car mesh + drive / walk sim. Camera is handled by CameraRig (always mounted). */
export function Car() {
  const group = useRef<THREE.Group>(null);
  const grounded = useRef(true);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.08);
    const studio = useStudio.getState();
    const playing = studio.playing;
    const g = group.current;
    if (!g) return;

    if (!playing) {
      g.position.set(parked.x, parked.y, parked.z);
      g.rotation.y = parked.yaw + Math.PI;
      return;
    }

    if (keys.has("KeyF") && !studio.inCar && combat.stun <= 0) {
      foot.action = "shoot";
    }
    if (keys.has("KeyQ")) {
      keys.delete("KeyQ");
      if (!studio.inCar && combat.stun <= 0) {
        foot.action = "uppercut";
        meleeHit(sim.x, sim.z);
      }
    }

    if (studio.inCar) {
      const throttle = getThrottle();
      const steer = getSteer();
      const boost = isBoost();
      const maxSpeed = boost ? 26 : 17;
      const accel = boost ? 28 : 20;

      sim.speed += throttle * accel * dt;
      const drag = throttle === 0 ? 3.4 : 1.4;
      sim.speed *= Math.max(0, 1 - drag * dt);
      if (inLake(sim.x, sim.z)) sim.speed *= Math.max(0, 1 - 4 * dt);
      if (sim.speed > maxSpeed) sim.speed = maxSpeed;
      if (sim.speed < -7) sim.speed = -7;

      const speedFactor = Math.min(Math.abs(sim.speed) / 5.5, 1);
      const reverse = sim.speed >= 0 ? 1 : -1;
      sim.yaw += steer * 2.35 * speedFactor * reverse * dt;
      if (!look.dragging) {
        let d = sim.yaw - look.yaw;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        look.yaw += d * (1 - Math.exp(-2.4 * dt));
      }

      if (isJump() && grounded.current) {
        sim.vy = 6.4;
        grounded.current = false;
      }
      sim.vy -= 22 * dt;
      sim.y += sim.vy * dt;
      if (sim.y <= 0) {
        sim.y = 0;
        sim.vy = 0;
        grounded.current = true;
      }

      const fx = -Math.sin(sim.yaw);
      const fz = -Math.cos(sim.yaw);
      const nx = sim.x + fx * sim.speed * dt;
      const nz = sim.z + fz * sim.speed * dt;

      if (!collides(nx, nz)) {
        sim.x = nx;
        sim.z = nz;
      } else if (!collides(nx, sim.z)) {
        sim.x = nx;
        sim.speed *= 0.55;
      } else if (!collides(sim.x, nz)) {
        sim.z = nz;
        sim.speed *= 0.55;
      } else {
        sim.speed *= -0.25;
      }

      if (Math.abs(sim.x) > WORLD + 1 || Math.abs(sim.z) > WORLD + 1) {
        studio.respawn();
      }

      g.position.set(sim.x, sim.y, sim.z);
      g.rotation.y = sim.yaw + Math.PI;
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -steer * 0.12, 8, dt);

      const slug = updateNear(sim.x, sim.z);
      studio.setNearCar(false);

      if (consumeEnterExit() && Math.abs(sim.speed) < 3) studio.exitCar();
      if (keys.has("Enter") && slug) {
        keys.delete("Enter");
        studio.openProject(slug);
      }
    } else {
      const busy = foot.action !== null || combat.stun > 0;
      const throttle = busy ? 0 : getThrottle();
      const steer = getSteer();
      look.yaw += steer * 2.2 * dt;
      if (Math.abs(throttle) > 0.05) sim.yaw = look.yaw;
      const maxSpeed = isBoost() ? 11 : 7.4;
      sim.speed = throttle * maxSpeed;
      if (inLake(sim.x, sim.z)) sim.speed *= 0.45;

      const fx = -Math.sin(look.yaw);
      const fz = -Math.cos(look.yaw);
      const nx = sim.x + fx * sim.speed * dt;
      const nz = sim.z + fz * sim.speed * dt;
      if (!collides(nx, nz, 0.45)) {
        sim.x = nx;
        sim.z = nz;
      } else if (!collides(nx, sim.z, 0.45)) {
        sim.x = nx;
      } else if (!collides(sim.x, nz, 0.45)) {
        sim.z = nz;
      }

      sim.y = 0;
      g.position.set(parked.x, parked.y, parked.z);
      g.rotation.y = parked.yaw + Math.PI;
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 8, dt);

      const distCar = Math.hypot(sim.x - parked.x, sim.z - parked.z);
      studio.setNearCar(distCar < 4.2);
      const slug = updateNear(sim.x, sim.z);

      if (consumeEnterExit() && distCar < 4.2) studio.enterCar();
      if (keys.has("Enter") && slug) {
        keys.delete("Enter");
        studio.openProject(slug);
      }
    }

    if (keys.has("KeyR")) {
      keys.delete("KeyR");
      useStudio.getState().respawn();
    }
  });

  return (
    <group ref={group} castShadow={false}>
      <FittedCar />
    </group>
  );
}
