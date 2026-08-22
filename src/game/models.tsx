import { Clone, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export const MODEL = {
  car: "/models/car.glb",
  tree: "/models/tree.glb",
  treeOak: "/models/tree-oak.glb",
  palm: "/models/palm.glb",
  bush: "/models/bush.glb",
  rock: "/models/rock.glb",
  rockSmall: "/models/rock-small.glb",
  canoe: "/models/canoe.glb",
  fountain: "/models/fountain.glb",
  palace: "/models/palace.glb",
  dentist: "/models/dentist.glb",
  zombie: "/models/zombie.glb",
} as const;

/** Drop compressed HITEM exports here */
export const SITE_GLB: Partial<Record<string, string>> = {
  "id-card-studio": "/models/sites/id-card-studio.glb",
};

export function Prop({
  url,
  scale = 1,
  position,
  rotation,
  castShadow = false,
}: {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
}) {
  const { scene } = useGLTF(url);
  return (
    <Clone
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={false}
    />
  );
}

export function FittedProp({
  url,
  size = 3,
  castShadow = true,
}: {
  url: string;
  size?: number;
  castShadow?: boolean;
}) {
  const { scene } = useGLTF(url);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = castShadow;
        m.receiveShadow = false;
        m.frustumCulled = true;
        const geom = m.geometry;
        if (geom && !geom.getAttribute("normal")) geom.computeVertexNormals();
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const dim = box.getSize(new THREE.Vector3());
    const s = size / Math.max(dim.x, dim.z, dim.y * 0.85, 0.001);
    c.scale.setScalar(s);
    const fitted = new THREE.Box3().setFromObject(c);
    c.position.set(
      -(fitted.min.x + fitted.max.x) / 2,
      -fitted.min.y,
      -(fitted.min.z + fitted.max.z) / 2,
    );
    return c;
  }, [scene, size, castShadow]);
  return <primitive object={obj} />;
}

export function FittedCar() {
  const { scene } = useGLTF(MODEL.car);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const s = 3.2 / Math.max(size.x, size.z, 0.001);
    c.scale.setScalar(s);
    const fitted = new THREE.Box3().setFromObject(c);
    const cx = (fitted.min.x + fitted.max.x) / 2;
    const cz = (fitted.min.z + fitted.max.z) / 2;
    c.position.set(-cx, -fitted.min.y, -cz);
    return c;
  }, [scene]);
  return <primitive object={obj} />;
}

if (typeof window !== "undefined") {
  useGLTF.preload(MODEL.car);
  useGLTF.preload(MODEL.fountain);
  useGLTF.preload(MODEL.palace);
  useGLTF.preload(MODEL.dentist);
  useGLTF.preload(MODEL.palm);
  useGLTF.preload(MODEL.tree);
  useGLTF.preload(MODEL.treeOak);
  Object.values(SITE_GLB).forEach((url) => useGLTF.preload(url));
}
