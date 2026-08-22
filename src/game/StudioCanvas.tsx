import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Car } from "@/game/Car";
import { Dentist } from "@/game/Dentist";
import { Pathogens } from "@/game/Pathogens";
import { Landmarks, Terrain } from "@/game/World";
import { Zombies } from "@/game/Zombies";
import { look, sim, attachControlsTest, bindInput, bindLook } from "@/game/input";
import { useStudio } from "@/game/store";

function TitleCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(12, 8, 16);
    camera.lookAt(0, 0.5, 0);
  }, [camera]);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const studio = useStudio.getState();
    if (!studio.playing) {
      if (!look.dragging) look.yaw += dt * 0.15;
      const dist = 18;
      const pitch = 0.4;
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      state.camera.position.set(
        Math.sin(look.yaw) * dist * cp,
        6 + sp * dist * 0.5,
        Math.cos(look.yaw) * dist * cp,
      );
      state.camera.lookAt(0, 0.5, 0);
      return;
    }
    // play mode follow
    const target = studio.inCar
      ? new THREE.Vector3(sim.x, sim.y + 1.2, sim.z)
      : new THREE.Vector3(sim.x, 1.3, sim.z);
    const back = studio.inCar ? 11 : 5.5;
    const yaw = look.yaw;
    const pitch = THREE.MathUtils.clamp(look.pitch, 0.1, 1.1);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const desired = new THREE.Vector3(
      target.x + Math.sin(yaw) * back * cp,
      target.y + sp * back * 0.9,
      target.z + Math.cos(yaw) * back * cp,
    );
    state.camera.position.lerp(desired, 1 - Math.exp(-5 * dt));
    state.camera.lookAt(target);
  });
  return null;
}

/** Hard-to-miss plaza so we know WebGL paints */
function CorePlaza() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial color="#4a7c2f" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshBasicMaterial color="#ff6b00" />
      </mesh>
      <mesh position={[6, 0.8, 4]}>
        <sphereGeometry args={[1.2, 16, 12]} />
        <meshBasicMaterial color="#2ec4b6" />
      </mesh>
      <ambientLight intensity={1} />
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
        <div className="absolute inset-0 z-20 grid place-items-center bg-red-100 px-6 text-center">
          <p className="text-lg text-red-800">{this.state.err}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function WorldLayer() {
  const playing = useStudio((s) => s.playing);
  // Always show terrain landmarks; models stream in
  return (
    <>
      <Suspense fallback={null}>
        <Terrain />
      </Suspense>
      <Suspense fallback={null}>
        <Landmarks />
      </Suspense>
      <Pathogens />
      <Suspense fallback={null}>
        <Car />
      </Suspense>
      <Suspense fallback={null}>
        <Dentist />
      </Suspense>
      {playing ? (
        <Suspense fallback={null}>
          <Zombies />
        </Suspense>
      ) : null}
    </>
  );
}

export function StudioCanvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    attachControlsTest();
    const a = bindInput();
    const b = bindLook();
    return () => {
      a();
      b();
    };
  }, []);

  if (!ready) {
    return (
      <div
        className="absolute inset-0"
        style={{ background: "#4a7c2f" }}
        aria-hidden
      />
    );
  }

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="studio-canvas"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        shadows={false}
        dpr={1}
        camera={{ position: [12, 8, 16], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: "default" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#87b5d0", 1);
        }}
      >
        <color attach="background" args={["#87b5d0"]} />
        <TitleCamera />
        <CorePlaza />
        <WorldLayer />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
