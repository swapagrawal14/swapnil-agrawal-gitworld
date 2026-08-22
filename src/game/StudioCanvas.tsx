import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import * as THREE from "three";
import { CameraRig } from "@/game/CameraRig";
import { Car } from "@/game/Car";
import { Dentist } from "@/game/Dentist";
import { Pathogens } from "@/game/Pathogens";
import { Landmarks, Terrain } from "@/game/World";
import { Zombies } from "@/game/Zombies";
import { attachControlsTest, bindInput, bindLook } from "@/game/input";
import { useStudio } from "@/game/store";

function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#dfeef8", "#8a9a6a", 1.1]} />
      <directionalLight position={[20, 30, 10]} intensity={1.6} />
    </>
  );
}

/** Always-visible markers so we know WebGL is painting */
function VisibilityGuards() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#e85d04" roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[40, 48]} />
        <meshStandardMaterial color="#5d8a3e" roughness={0.95} />
      </mesh>
    </group>
  );
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

function Scene() {
  return (
    <>
      <color attach="background" args={["#9ec9e0"]} />
      <fog attach="fog" args={["#9ec9e0", 90, 160]} />
      <Lights />
      <CameraRig />
      <VisibilityGuards />
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
    </>
  );
}

export function StudioCanvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    attachControlsTest();
    const unbindKeys = bindInput();
    const unbindLook = bindLook();
    return () => {
      unbindKeys();
      unbindLook();
    };
  }, []);

  if (!ready) {
    return <div className="studio-canvas absolute inset-0" style={{ background: "#9ec9e0" }} aria-hidden />;
  }

  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="studio-canvas"
        shadows={false}
        dpr={[1, 1.25]}
        camera={{ position: [14, 9, 18], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: !mobile,
          powerPreference: "default",
          alpha: false,
          depth: true,
          stencil: false,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#9ec9e0", 1);
          gl.toneMapping = THREE.NoToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <Scene />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
