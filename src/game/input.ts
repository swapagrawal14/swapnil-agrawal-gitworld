/** Held-key input + QA probe. A = +steer (left / +yaw). */

export const keys = new Set<string>();

/** Joystick: x -1 left … +1 right; y -1 reverse … +1 forward */
export const stick = { x: 0, y: 0 };

export const sim = {
  x: 2.6,
  y: 0,
  z: 8,
  yaw: Math.PI / 2,
  speed: 0,
  vy: 0,
};

/** Parked car pose while on foot */
export const parked = {
  x: 0,
  z: 8,
  yaw: 0,
  y: 0,
};

export const look = {
  yaw: Math.PI / 2,
  pitch: 0.42,
  dragging: false,
};

export type FootAction = null | "shoot" | "uppercut";
export const foot = { action: null as FootAction };


let injectedSteer: number | null = null;

export function bindInput() {
  const down = (e: KeyboardEvent) => {
    if (e.repeat) return;
    keys.add(e.code);
    if (
      e.code === "ArrowUp" ||
      e.code === "ArrowDown" ||
      e.code === "ArrowLeft" ||
      e.code === "ArrowRight" ||
      e.code === "Space"
    ) {
      e.preventDefault();
    }
  };
  const up = (e: KeyboardEvent) => {
    keys.delete(e.code);
  };
  const clear = () => keys.clear();
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", clear);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) keys.clear();
  });
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", clear);
  };
}

export function getSteer() {
  if (injectedSteer !== null) return injectedSteer;
  let steer = 0;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) steer += 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) steer -= 1;
  steer += -stick.x;
  if (steer > 1) steer = 1;
  if (steer < -1) steer = -1;
  return steer;
}

export function getThrottle() {
  let t = 0;
  if (keys.has("KeyW") || keys.has("ArrowUp")) t += 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) t -= 1;
  t += stick.y;
  if (t > 1) t = 1;
  if (t < -1) t = -1;
  return t;
}

export function isBoost() {
  return keys.has("ShiftLeft") || keys.has("ShiftRight");
}

export function isJump() {
  return keys.has("Space");
}

export function isEnterExit() {
  return keys.has("KeyE");
}

export function consumeEnterExit() {
  if (!keys.has("KeyE")) return false;
  keys.delete("KeyE");
  return true;
}

function uiTarget(t: EventTarget | null) {
  if (!(t instanceof Element)) return false;
  return Boolean(t.closest("button, a, input, textarea, select, [data-ui]"));
}

export function bindLook() {
  let pointerId: number | null = null;
  let lastX = 0;
  let lastY = 0;

  const down = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (uiTarget(e.target)) return;
    look.dragging = true;
    pointerId = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const move = (e: PointerEvent) => {
    if (!look.dragging || pointerId !== e.pointerId) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    const s = e.pointerType === "touch" ? 0.0072 : 0.0052;
    look.yaw -= dx * s;
    look.pitch += dy * s;
    if (look.pitch < 0.06) look.pitch = 0.06;
    if (look.pitch > 1.18) look.pitch = 1.18;
  };
  const up = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    look.dragging = false;
    pointerId = null;
  };

  window.addEventListener("pointerdown", down, { passive: true });
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  return () => {
    window.removeEventListener("pointerdown", down);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", up);
    look.dragging = false;
  };
}

export function resetLook() {
  look.yaw = sim.yaw;
  look.pitch = 0.42;
  look.dragging = false;
}

export function attachControlsTest() {
  window.__controlsTest = {
    getYaw: () => sim.yaw,
    getSpeed: () => sim.speed,
    setSteer: (v) => {
      injectedSteer = v;
    },
    setKeys: (codes) => {
      keys.clear();
      for (const c of codes) keys.add(c);
    },
  };
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setSteer?: (v: number) => void;
      setKeys?: (codes: string[]) => void;
    };
  }
}
