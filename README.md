# Lake Studio — Swapnil Agrawal

A driveable 3D playground of [Swapnil Agrawal](https://github.com/swapagrawal14)’s public work. Walk or drive a lakeside Udaipur studio, open 73 GitHub repos as pavilions, and clear pathogens (zombies join after you enter) with a dental laser.

Live: import this repo on [Vercel](https://vercel.com/new) and deploy. GitHub Pages will not run this app (it needs a server).

## Play

| | Desktop | Mobile |
| --- | --- | --- |
| Move | `W A S D` | left joystick |
| Look | drag | drag |
| Enter / exit car | `E` | tap the hint |
| Shoot laser | hold `F` | fire button |
| Punch | `Q` | — |
| Boost | `Shift` | — |

Start on foot next to the car. Pathogens roam the grounds immediately. Zombies spawn after **Enter the studio**.

## What’s in the world

- **Dentist** — Mixamo-rigged Swapnil (idle, run, shoot, uppercut) with a hand laser
- **Zombies** — walk + fall clips, chase after you enter, stun on contact
- **Pathogens** — virus / bacillus / plaque you can laser or punch
- **HITEM models** — palace on the lake, plaza fountain, ID-card studio
- **73 repos** — featured pavilions + an archive ring; click a sculpture to open the case

## Models in this repo

| File | Role |
| --- | --- |
| `public/models/dentist.glb` | Player (~904 KB) |
| `public/models/zombie.glb` | Enemies (~593 KB) |
| `public/models/palace.glb` | Lake palace |
| `public/models/fountain.glb` | Plaza fountain |
| `public/models/sites/id-card-studio.glb` | ID-card pavilion |
| `public/models/car.glb` | Driveable car |

## Run locally

```bash
npm install
npm run dev          # http://localhost:8080
npm run build        # production
npm run preview      # preview the build
```

Requires Node 22.

## Deploy (Vercel)

1. [Import](https://vercel.com/new) `swapagrawal14/swapnil-agrawal-gitworld`
2. Framework: Vite (auto)
3. Build command: `npm run build`
4. Open the `*.vercel.app` URL in a **normal browser tab** (not a tiny iframe) for full GPU

This is a TanStack Start + Vite + Three.js (`@react-three/fiber`) app. Vercel is the intended host.

## Controls reminder in-world

HUD lists movement, `E` for the car, `F` for the laser, and a work index of every public repository.
