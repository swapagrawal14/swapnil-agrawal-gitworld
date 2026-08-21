#!/usr/bin/env node
/**
 * Compress a raw HITEM / scan GLB for the studio.
 * Target: <1.2 MB, <25k tris, webp textures ≤1024.
 *
 *   node scripts/optimize-glb.mjs input.glb public/models/name.glb
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
  console.error("usage: node scripts/optimize-glb.mjs input.glb public/models/name.glb");
  process.exit(1);
}

const args = [
  "--yes",
  "@gltf-transform/cli@4",
  "optimize",
  resolve(input),
  resolve(output),
  "--compress",
  "false",
  "--texture-compress",
  "webp",
  "--texture-size",
  "1024",
  "--simplify",
  "true",
  "--simplify-ratio",
  "0.04",
  "--simplify-error",
  "0.02",
  "--instance",
  "false",
];

const result = spawnSync("npx", args, { stdio: "inherit" });
process.exit(result.status ?? 1);
