import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, useEffect, type ReactNode } from "react";
import * as THREE from "three";
import { Car } from "@/game/Car";
import { Dentist } from "@/game/Dentist";
import { Pathogens } from "@/game/Pathogens";
import { Landmarks, Terrain } from "@/game/World";
import { Zombies } from "@/game/Zombies";
import { attachControlsTest, bindInput, bindLook, look, sim } from "@/game/input";
import { useStudio } from "@/game/store";

const camPos = new THREE.Vector3();
const desired = new THREE.Vector3();

function Lights() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#ffffff", "#8a9a6a", 0.9]} />
      <directionalLight position={[20, 30, 12]} intensity={1.2} />
    </>
  );
}

function StudioCamera() {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.08);
    const studio = useStudio.getState();
    if (!Number.isFinite(look.yaw)) look.yaw = Math.PI / 2;
    if (!Number.isFinite(look.pitch)) look.pitch = 0.42;

    let tx = 0;
    let ty = 0;
    let tz = 0;
    let dist = 22;
    let lookY = 1.3;
    let lag = 3.5;

    if (!studio.playing) {
      if (!look.dragging) look.yaw += dt * 0.12;
      tx = 0;
      ty = 0;
      tz = 0;
      dist = 22;
      lookY = 1.3;
      lag = 3.5;
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

    const pitch = THREE.MathUtils.clamp(look.pitch, 0.1, 1.15);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    desired.set(
      tx + Math.sin(look.yaw) * dist * cp,
      Math.max(ty + lookY + sp * dist * 0.85, 3),
      tz + Math.cos(look.yaw) * dist * cp,
    );
    if (![desired.x, desired.y, desired.z].every(Number.isFinite)) return;
    const k = 1 - Math.exp(-lag * dt);
    camPos.copy(state.camera.position).lerp(desired, k);
    if (![camPos.x, camPos.y, camPos.z].every(Number.isFinite)) return;
    state.camera.position.copy(camPos);
    state.camera.lookAt(tx, ty + 0.8, tz);

    const cam = state.camera as THREE.PerspectiveCamera;
    if (cam.isPerspectiveCamera) {
      const fov = studio.inCar && studio.playing ? 48 + Math.abs(sim.speed) * 0.35 : 50;
      cam.fov = THREE.MathUtils.damp(cam.fov, fov, 4, dt);
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { err: string | null }> {
  state = { err: null as string | null };
  static getDerivedStateFromError(err: Error) {
    return { err: err.message };
  }
  render() {
    if (this.state.err) {
      return (
        <div className="absolute inset-0 z-20 grid place-items-center bg-bg px-6 text-center">
          <div>
            <p className="font-display text-3xl text-ink italic">Studio hit a snag</p>
            <p className="mt-2 text-sm text-muted">{this.state.err}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ZombieLayer() {
  const playing = useStudio((s) => s.playing);
  if (!playing) return null;
  return (
    <Suspense fallback={null}>
      <Zombies />
    </Suspense>
  );
}

export function StudioCanvas() {
  useEffect(() => {
    attachControlsTest();
    const unbindKeys = bindInput();
    const unbindLook = bindLook();
    return () => {
      unbindKeys();
      unbindLook();
    };
  }, []);

  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="studio-canvas"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        shadows={false}
        dpr={mobile ? 1 : 1.25}
        frameloop="always"
        camera={{ position: [16, 10, 20], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: !mobile,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#7eb8d4", 1);
          gl.toneMapping = THREE.NoToneMapping;
          scene.background = new THREE.Color("#7eb8d4");
        }}
      >
        <fog attach="fog" args={["#7eb8d4", 70, 140]} />
        <Lights />
        <StudioCamera />
        {/* Instant: ground + microbes + all repo pavilions (procedural) */}
        <Terrain />
        <Pathogens />
        <Landmarks />
        {/* Streamed models */}
        <Suspense fallback={null}>
          <Car />
        </Suspense>
        <Suspense fallback={null}>
          <Dentist />
        </Suspense>
        <ZombieLayer />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
