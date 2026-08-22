import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
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
      <hemisphereLight args={["#eaf4f8", "#b8a888", 1.0]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[22, 32, 14]} intensity={1.4} />
    </>
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
            <p className="mt-2 text-sm text-muted">Refresh the page to reload the grounds.</p>
            <p className="mt-1 text-xs text-subtle">{this.state.err}</p>
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
      <Sky
        sunPosition={[60, 28, 40]}
        turbidity={3.5}
        rayleigh={0.55}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />
      <fog attach="fog" args={["#c5e4f5", 80, 150]} />
      <Lights />
      <CameraRig />
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

  // Avoid SSR WebGL — canvas only after client mount
  if (!ready) {
    return <div className="studio-canvas absolute inset-0 bg-bg" aria-hidden />;
  }

  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="studio-canvas"
        shadows={false}
        dpr={mobile ? [1, 1] : [1, 1.2]}
        camera={{ position: [16, 10, 20], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: !mobile,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          alpha: false,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#c5e4f5", 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          scene.background = new THREE.Color("#c5e4f5");
        }}
      >
        <Scene />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
