import { projects } from "@/lib/site-data";

export type Site = {
  slug: string;
  x: number;
  z: number;
  color: string;
  roof: string;
  w: number;
  d: number;
  h: number;
  featured: boolean;
};

export const WORLD = 52;
export const LAKE = { x: -28, z: 0, r: 15 };

const FEATURED_SLOTS: Record<string, Omit<Site, "slug" | "featured">> = {
  "motion-graphics-builder": { x: 16, z: 12, color: "#c56a4a", roof: "#9a4e36", w: 5.2, d: 5.2, h: 4.4 },
  "kimchi-ai": { x: 14, z: -12, color: "#5e8f72", roof: "#3f6a54", w: 5, d: 5, h: 4.2 },
  "hitem-3d": { x: 0, z: -22, color: "#5b7388", roof: "#3e5264", w: 5.4, d: 5.4, h: 5.2 },
  "world-3d": { x: -14, z: -12, color: "#4f8f96", roof: "#326870", w: 5.2, d: 5.2, h: 4.6 },
  "dental-documentary": { x: -16, z: 12, color: "#b57a5a", roof: "#8a5a40", w: 5, d: 5, h: 4.2 },
  "prompting-generator": { x: 0, z: 22, color: "#6a6a62", roof: "#4a4a44", w: 5, d: 5, h: 4 },
  "dentalscript-ai": { x: 26, z: -2, color: "#8a6e58", roof: "#6a5240", w: 4.2, d: 4.2, h: 3.4 },
  "celestial-horoscope": { x: -26, z: -2, color: "#6d7c8c", roof: "#4d5c6c", w: 4, d: 4, h: 3.6 },
  "personal-portfolio": { x: 22, z: 22, color: "#8d8a7a", roof: "#6a6758", w: 3.8, d: 3.8, h: 3.2 },
  "3d-portfolio": { x: -22, z: 22, color: "#6e8b82", roof: "#4e6a62", w: 4, d: 4, h: 3.8 },
  "id-card-studio": { x: 30, z: 12, color: "#7a756c", roof: "#5a554c", w: 4.4, d: 4.4, h: 4.2 },
};

const PALETTE: [string, string][] = [
  ["#c56a4a", "#9a4e36"],
  ["#5e8f72", "#3f6a54"],
  ["#5b7388", "#3e5264"],
  ["#4f8f96", "#326870"],
  ["#b57a5a", "#8a5a40"],
  ["#6a6a62", "#4a4a44"],
  ["#8a6e58", "#6a5240"],
  ["#6d7c8c", "#4d5c6c"],
  ["#8d8a7a", "#6a6758"],
  ["#6e8b82", "#4e6a62"],
  ["#7a756c", "#5a554c"],
  ["#c45c48", "#9a3e36"],
];

function tooClose(x: number, z: number, others: Site[], min = 4.2) {
  for (const s of others) {
    if (Math.hypot(x - s.x, z - s.z) < min) return true;
  }
  return false;
}

function packSites(): Site[] {
  const out: Site[] = [];
  for (const p of projects) {
    const slot = FEATURED_SLOTS[p.slug];
    if (slot) out.push({ slug: p.slug, featured: true, ...slot });
  }
  const rest = projects.filter((p) => !FEATURED_SLOTS[p.slug]);
  const spots: [number, number][] = [];
  for (let ring = 0; ring < 6; ring += 1) {
    const r = 18.5 + ring * 5.4;
    const n = 14 + ring * 5;
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2 + ring * 0.31;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 4.5) continue;
      if (Math.hypot(x, z) < 15) continue;
      if (Math.abs(x) > WORLD - 3 || Math.abs(z) > WORLD - 3) continue;
      spots.push([x, z]);
    }
  }
  let si = 0;
  rest.forEach((p, i) => {
    let x = 0;
    let z = 0;
    let found = false;
    while (si < spots.length) {
      const cand = spots[si];
      si += 1;
      if (tooClose(cand[0], cand[1], out, p.featured ? 7 : 3.6)) continue;
      x = cand[0];
      z = cand[1];
      found = true;
      break;
    }
    if (!found) {
      x = 20 + (i % 10) * 2.8;
      z = 28 + Math.floor(i / 10) * 2.8;
    }
    const pal = PALETTE[i % PALETTE.length];
    out.push({
      slug: p.slug,
      x,
      z,
      color: pal[0],
      roof: pal[1],
      w: 2.15,
      d: 2.15,
      h: 2.2,
      featured: false,
    });
  });
  return out;
}

export const sites: Site[] = packSites();

export type BoxHit = { minX: number; maxX: number; minZ: number; maxZ: number };

export const hits: BoxHit[] = [
  ...sites.map((s) => ({
    minX: s.x - s.w / 2 - 0.28,
    maxX: s.x + s.w / 2 + 0.28,
    minZ: s.z - s.d / 2 - 0.28,
    maxZ: s.z + s.d / 2 + 0.28,
  })),
  { minX: -2.2, maxX: 2.2, minZ: -2.2, maxZ: 2.2 },
  { minX: LAKE.x - 5.2, maxX: LAKE.x + 5.2, minZ: LAKE.z - 5.2, maxZ: LAKE.z + 5.2 },
];

export function inLake(x: number, z: number) {
  const dx = x - LAKE.x;
  const dz = z - LAKE.z;
  return dx * dx + dz * dz < LAKE.r * LAKE.r;
}

export function collides(x: number, z: number, rad = 0.95) {
  for (const b of hits) {
    if (x + rad > b.minX && x - rad < b.maxX && z + rad > b.minZ && z - rad < b.maxZ) {
      return true;
    }
  }
  if (Math.abs(x) > WORLD || Math.abs(z) > WORLD) return true;
  return false;
}

export function siteBySlug(slug: string) {
  return sites.find((s) => s.slug === slug);
}

export function projectAt(slug: string) {
  return projects.find((p) => p.slug === slug);
}
