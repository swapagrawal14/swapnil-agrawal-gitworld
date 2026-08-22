import { Canvas, useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
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
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const map = mobile ? 512 : 1024;
  return (
    <>
      <hemisphereLight args={["#eaf4f8", "#b8a888", 0.75]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[22, 32, 14]}
        intensity={1.35}
        castShadow={!mobile}
        shadow-mapSize-width={map}
        shadow-mapSize-height={map}
        shadow-camera-far={55}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0003}
      />
    </>
  );
}

/** Camera always runs — not blocked by car/dentist GLB Suspense */
function StudioCamera() {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.08);
    const studio = useStudio.getState();
    if (!Number.isFinite(look.yaw)) look.yaw = Math.PI / 2;
    if (!Number.isFinite(look.pitch)) look.pitch = 0.42;

    let tx = 0;
    let ty = 0;
    let tz = 0;
    let dist = 24;
    let lookY = 1.4;
    let lag = 3.2;

    if (!studio.playing) {
      if (!look.dragging) look.yaw += dt * 0.12;
      tx = 0;
      ty = 0;
      tz = 0;
      dist = 24;
      lookY = 1.4;
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

    const pitch = THREE.MathUtils.clamp(look.pitch, 0.08, 1.15);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    desired.set(
      tx + Math.sin(look.yaw) * dist * cp,
      ty + lookY + sp * dist * 0.9,
      tz + Math.cos(look.yaw) * dist * cp,
    );
    if (![desired.x, desired.y, desired.z].every(Number.isFinite)) return;
    const k = 1 - Math.exp(-lag * dt);
    camPos.copy(state.camera.position).lerp(desired, k);
    if (![camPos.x, camPos.y, camPos.z].every(Number.isFinite)) return;
    state.camera.position.copy(camPos);
    state.camera.lookAt(tx, ty + lookY * 0.4, tz);

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
            <p className="mt-2 text-sm text-muted">Refresh the page to reload the grounds.</p>
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
        shadows={!mobile}
        dpr={mobile ? [1, 1] : [1, 1.25]}
        camera={{ position: [18, 12, 22], fov: 50, near: 0.1, far: 160 }}
        gl={{
          antialias: !mobile,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#c5e4f5", 1);
          gl.toneMappingExposure = 1.05;
          if (gl.shadowMap) gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
        <Sky
          sunPosition={[60, 28, 40]}
          turbidity={3.5}
          rayleigh={0.55}
          mieCoefficient={0.004}
          mieDirectionalG={0.82}
        />
        <fog attach="fog" args={["#c5e4f5", 55, 110]} />
        <Lights />
        <StudioCamera />
        <Terrain />
        <Pathogens />
        <Landmarks />
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
