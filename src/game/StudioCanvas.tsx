import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Car } from "@/game/Car";
import { Dentist } from "@/game/Dentist";
import { Pathogens } from "@/game/Pathogens";
import { Landmarks, Terrain } from "@/game/World";
import { attachControlsTest, bindInput, bindLook } from "@/game/input";

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

function Lights({ mobile }: { mobile: boolean }) {
  return (
    <>
      <hemisphereLight args={["#eaf4f8", "#b8a888", mobile ? 0.85 : 0.7]} />
      <ambientLight intensity={mobile ? 0.55 : 0.45} />
      <directionalLight
        position={[22, 32, 14]}
        intensity={mobile ? 1.15 : 1.4}
        castShadow={false}
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

/** Defer heavy skinned dentist until after first paint */
function DeferredDentist({ mobile }: { mobile: boolean }) {
  const [on, setOn] = useState(!mobile);
  useEffect(() => {
    if (!mobile) return;
    const t = window.setTimeout(() => setOn(true), 400);
    return () => window.clearTimeout(t);
  }, [mobile]);
  if (!on) return null;
  return (
    <Suspense fallback={null}>
      <Dentist />
    </Suspense>
  );
}

export function StudioCanvas() {
  const [mobile] = useState(() => isMobile());

  useEffect(() => {
    attachControlsTest();
    const unbindKeys = bindInput();
    const unbindLook = bindLook();
    return () => {
      unbindKeys();
      unbindLook();
    };
  }, []);

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="studio-canvas"
        shadows={false}
        dpr={mobile ? 1 : [1, 1.2]}
        frameloop="always"
        camera={{ position: [18, 12, 22], fov: 50, near: 0.1, far: mobile ? 90 : 140 }}
        gl={{
          antialias: !mobile,
          powerPreference: mobile ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
          alpha: false,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#c5e4f5", 1);
          gl.toneMappingExposure = 1.05;
          gl.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
        }}
      >
        <Sky
          sunPosition={[60, 28, 40]}
          turbidity={3.5}
          rayleigh={0.55}
          mieCoefficient={0.004}
          mieDirectionalG={0.82}
        />
        <fog attach="fog" args={["#c5e4f5", mobile ? 40 : 55, mobile ? 85 : 110]} />
        <Lights mobile={mobile} />
        <Terrain />
        <Landmarks />
        <Pathogens />
        <Suspense fallback={null}>
          <Car />
        </Suspense>
        <DeferredDentist mobile={mobile} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
