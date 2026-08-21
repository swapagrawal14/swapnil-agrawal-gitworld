import { create } from "zustand";
import { resetKills } from "@/game/combat";
import { foot, parked, resetLook, sim } from "@/game/input";

export type Panel = null | "about" | "work" | "contact" | "project";

type StudioState = {
  playing: boolean;
  inCar: boolean;
  nearSlug: string | null;
  nearCar: boolean;
  activeSlug: string | null;
  panel: Panel;
  play: () => void;
  setNear: (slug: string | null) => void;
  setNearCar: (near: boolean) => void;
  enterCar: () => void;
  exitCar: () => void;
  openPanel: (panel: Panel) => void;
  openProject: (slug: string) => void;
  closePanel: () => void;
  respawn: () => void;
};

function parkAtSim() {
  parked.x = sim.x;
  parked.z = sim.z;
  parked.yaw = sim.yaw;
  parked.y = sim.y;
}

export const useStudio = create<StudioState>((set, get) => ({
  playing: false,
  inCar: false,
  nearSlug: null,
  nearCar: true,
  activeSlug: null,
  panel: null,
  play: () => {
    resetLook();
    set({ playing: true, panel: null });
  },
  setNear: (nearSlug) => {
    if (get().nearSlug !== nearSlug) set({ nearSlug });
  },
  setNearCar: (nearCar) => {
    if (get().nearCar !== nearCar) set({ nearCar });
  },
  enterCar: () => {
    sim.x = parked.x;
    sim.z = parked.z;
    sim.yaw = parked.yaw;
    sim.y = parked.y;
    sim.speed = 0;
    sim.vy = 0;
    foot.action = null;
    set({ inCar: true, nearCar: false });
  },
  exitCar: () => {
    parkAtSim();
    const fx = -Math.sin(sim.yaw);
    const fz = -Math.cos(sim.yaw);
    sim.x += fz * 2.4;
    sim.z += -fx * 2.4;
    sim.speed = 0;
    sim.vy = 0;
    set({ inCar: false, nearCar: true });
  },
  openPanel: (panel) => set({ panel }),
  openProject: (slug) =>
    set({ panel: "project", activeSlug: slug, playing: true }),
  closePanel: () => set({ panel: null, activeSlug: null }),
  respawn: () => {
    parked.x = 0;
    parked.z = 8;
    parked.yaw = 0;
    parked.y = 0;
    sim.x = 2.6;
    sim.z = 8;
    sim.y = 0;
    sim.yaw = Math.PI / 2;
    sim.speed = 0;
    sim.vy = 0;
    foot.action = null;
    resetLook();
    resetKills();
    set({ inCar: false, nearCar: true });
  },
}));
