import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { Component, Suspense, useEffect, type ReactNode } from "react";
import * as THREE from "three";
import { Car } from "@/game/Car";
import { Dentist } from "@/game/Dentist";
import { Pathogens } from "@/game/Pathogens";
import { Landmarks, Terrain } from "@/game/World";
import { attachControlsTest, bindInput, bindLook } from "@/game/input";

function Lights() {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const map = mobile ? 512 : 1024;
  return (
    <>
      <hemisphereLight args={["#eaf4f8", "#b8a888", 0.7]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[22, 32, 14]}
        intensity={1.4}
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
        <fog attach="fog" args={["#c5e4f5", 50, 100]} />
        <Lights />
        <Terrain />
        <Landmarks />
        <Suspense fallback={null}>
          <Car />
        </Suspense>
        <Pathogens />
        <Suspense fallback={null}>
          <Dentist />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
