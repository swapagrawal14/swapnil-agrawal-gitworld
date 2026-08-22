import * as THREE from "three";
import { LAKE, WORLD, collides } from "@/game/layout";

export const combat = {
  firing: false,
  mobileFire: false,
  cooldown: 0,
  stun: 0,
  origin: new THREE.Vector3(),
  dir: new THREE.Vector3(0, 0, -1),
};

export type GermKind = "virus" | "bacillus" | "plaque";

export type Germ = {
  id: number;
  kind: GermKind;
  x: number;
  y: number;
  z: number;
  yaw: number;
  hp: number;
  alive: boolean;
  hit: number;
  phase: number;
  wanderX: number;
  wanderZ: number;
  respawn: number;
};

export type ZombieState = "walk" | "die";

export type Zombie = {
  id: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  hp: number;
  state: ZombieState;
  attackCd: number;
  dieT: number;
  respawn: number;
  hit: number;
};

const KINDS: GermKind[] = ["virus", "bacillus", "plaque"];
export const germs: Germ[] = [];
export const zombies: Zombie[] = [];

function spawnPoint(minR = 14): { x: number; z: number } {
  for (let i = 0; i < 24; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = minR + Math.random() * 26;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 3) continue;
    if (Math.hypot(x, z) < 11) continue;
    if (Math.abs(x) > WORLD - 4 || Math.abs(z) > WORLD - 4) continue;
    if (collides(x, z, 1.2)) continue;
    return { x, z };
  }
  return { x: 18, z: -16 };
}

export function seedGerms(n = 8) {
  germs.length = 0;
  for (let i = 0; i < n; i += 1) {
    const p = spawnPoint();
    germs.push({
      id: i,
      kind: KINDS[i % 3],
      x: p.x,
      y: 0.7,
      z: p.z,
      yaw: Math.random() * Math.PI * 2,
      hp: 1,
      alive: true,
      hit: 0,
      phase: Math.random() * Math.PI * 2,
      wanderX: p.x,
      wanderZ: p.z,
      respawn: 0,
    });
  }
}

export function seedZombies(n = 2) {
  zombies.length = 0;
  const spots = [
    { x: 9.2, z: 4.1 },
    { x: -7.4, z: 10.2 },
  ];
  for (let i = 0; i < n; i += 1) {
    const p = spots[i] ?? spawnPoint(16);
    zombies.push({
      id: i,
      x: p.x,
      y: 0,
      z: p.z,
      yaw: Math.random() * Math.PI * 2,
      hp: 2,
      state: "walk",
      attackCd: 0,
      dieT: 0,
      respawn: 0,
      hit: 0,
    });
  }
}

seedGerms(5);
// seedZombies disabled for performance

const listeners = new Set<() => void>();
let kills = 0;

export function getKills() {
  return kills;
}

export function subscribeKills(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function bumpKills() {
  kills += 1;
  listeners.forEach((cb) => cb());
}

export function resetKills() {
  kills = 0;
  listeners.forEach((cb) => cb());
  seedGerms(5);
  // seedZombies disabled for performance
  combat.stun = 0;
}

function killGerm(g: Germ) {
  if (!g.alive) return;
  g.alive = false;
  g.hp = 0;
  g.respawn = 3.6;
  bumpKills();
  const p = spawnPoint();
  g.wanderX = p.x;
  g.wanderZ = p.z;
}

function killZombie(z: Zombie) {
  if (z.state === "die") return;
  z.state = "die";
  z.dieT = 2.6;
  z.hp = 0;
  bumpKills();
}

export function tickGerms(dt: number, playerX: number, playerZ: number, playing: boolean) {
  combat.cooldown = Math.max(0, combat.cooldown - dt);
  for (const g of germs) {
    g.hit = Math.max(0, g.hit - dt);
    if (!g.alive) {
      g.respawn -= dt;
      if (g.respawn <= 0) {
        g.x = g.wanderX;
        g.z = g.wanderZ;
        g.hp = 1;
        g.alive = true;
        g.yaw = Math.random() * Math.PI * 2;
      }
      continue;
    }
    if (!playing) {
      g.y = 0.62 + Math.sin(g.phase) * 0.1;
      continue;
    }
    g.phase += dt * 2.2;
    const toP = Math.hypot(playerX - g.x, playerZ - g.z);
    if (toP < 18) {
      g.wanderX = playerX;
      g.wanderZ = playerZ;
    } else if (Math.hypot(g.x - g.wanderX, g.z - g.wanderZ) < 1.4) {
      const n = spawnPoint();
      g.wanderX = n.x;
      g.wanderZ = n.z;
    }
    const dx = g.wanderX - g.x;
    const dz = g.wanderZ - g.z;
    const d = Math.hypot(dx, dz) || 1;
    const spd = toP < 18 ? 3.4 : 1.6;
    const nx = g.x + (dx / d) * spd * dt;
    const nz = g.z + (dz / d) * spd * dt;
    if (!collides(nx, nz, 0.7) && Math.hypot(nx - LAKE.x, nz - LAKE.z) > LAKE.r + 1.5) {
      g.x = nx;
      g.z = nz;
    }
    g.yaw = Math.atan2(dx, dz);
    g.y = 0.62 + Math.sin(g.phase) * 0.14;
  }

  if (combat.firing && combat.cooldown <= 0) {
    hitScan();
    combat.cooldown = 0.08;
  }
}

export function tickZombies(dt: number, playerX: number, playerZ: number, playing: boolean, inCar: boolean) {
  combat.stun = Math.max(0, combat.stun - dt);
  for (const z of zombies) {
    z.hit = Math.max(0, z.hit - dt);
    z.attackCd = Math.max(0, z.attackCd - dt);
    if (z.state === "die") {
      z.dieT -= dt;
      if (z.dieT <= 0) {
        const p = spawnPoint(16);
        z.x = p.x;
        z.z = p.z;
        z.hp = 2;
        z.state = "walk";
        z.yaw = Math.random() * Math.PI * 2;
      }
      continue;
    }
    if (!playing) continue;
    const dx = playerX - z.x;
    const dz = playerZ - z.z;
    const dist = Math.hypot(dx, dz) || 1;
    z.yaw = Math.atan2(dx, dz);
    if (dist > 1.7) {
      const spd = 1.55;
      const nx = z.x + (dx / dist) * spd * dt;
      const nz = z.z + (dz / dist) * spd * dt;
      if (!collides(nx, nz, 0.6) && Math.hypot(nx - LAKE.x, nz - LAKE.z) > LAKE.r + 1.2) {
        z.x = nx;
        z.z = nz;
      }
    } else if (!inCar && combat.stun <= 0 && z.attackCd <= 0) {
      combat.stun = 1.35;
      z.attackCd = 2.2;
    }
  }
}

function hitScan() {
  const o = combat.origin;
  const dir = combat.dir;
  if (!Number.isFinite(dir.x) || !Number.isFinite(o.x)) return;
  let best = 18;
  let germ: Germ | null = null;
  for (const g of germs) {
    if (!g.alive) continue;
    const t = (g.x - o.x) * dir.x + (g.y - o.y) * dir.y + (g.z - o.z) * dir.z;
    if (t < 0.4 || t > 18) continue;
    const px = o.x + dir.x * t;
    const py = o.y + dir.y * t;
    const pz = o.z + dir.z * t;
    if (Math.hypot(g.x - px, g.y - py, g.z - pz) < 1.15 && t < best) {
      best = t;
      germ = g;
    }
  }
  if (germ) {
    germ.hit = 0.18;
    germ.hp -= 1;
    if (germ.hp <= 0) killGerm(germ);
  }

  best = 18;
  let zed: Zombie | null = null;
  for (const z of zombies) {
    if (z.state === "die") continue;
    const t = (z.x - o.x) * dir.x + (0.9 - o.y) * dir.y + (z.z - o.z) * dir.z;
    if (t < 0.4 || t > 18) continue;
    const px = o.x + dir.x * t;
    const py = o.y + dir.y * t;
    const pz = o.z + dir.z * t;
    if (Math.hypot(z.x - px, 0.9 - py, z.z - pz) < 1.2 && t < best) {
      best = t;
      zed = z;
    }
  }
  if (zed) {
    zed.hit = 0.2;
    zed.hp -= 1;
    if (zed.hp <= 0) killZombie(zed);
  }
}

export function meleeHit(px: number, pz: number) {
  for (const g of germs) {
    if (!g.alive) continue;
    if (Math.hypot(g.x - px, g.z - pz) < 2.5) {
      g.hit = 0.18;
      killGerm(g);
    }
  }
  for (const z of zombies) {
    if (z.state === "die") continue;
    if (Math.hypot(z.x - px, z.z - pz) < 2.6) {
      z.hit = 0.2;
      z.hp -= 2;
      if (z.hp <= 0) killZombie(z);
    }
  }
}
