import { useEffect, useMemo, useRef } from "react";
import { grid } from "../../Stores/constants";
import useGame from "../../Stores/useGame";
import { Boundaries } from "./Boundaries";

import { Shrine } from "./Shrine";
// import { Structures } from "./Structures";
import { useTexture } from "@react-three/drei";
import {
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  TextureLoader,
} from "three";

const loader = new TextureLoader();
const texture = loader.load("textures/sand/aerial_beach_01_diff_1k.jpg");
const material = new MeshStandardMaterial({ map: texture });

export const Terrain = () => {
  const worldTile = useGame((s) => s.worldTile);
  const discoveredWorldTiles = useGame((s) => s.discoveredWorldTiles);
  const setDiscoveredWorldTiles = useGame((s) => s.setDiscoveredWorldTiles);
  const ref = useRef<Mesh | null>(null);
  const geometry = useMemo(
    () => new PlaneGeometry(grid.width, grid.height),
    []
  );

  useEffect(() => {
    const discoveredWorldTilesCopy = [...discoveredWorldTiles];
    if (!discoveredWorldTilesCopy.includes(worldTile.id)) {
      discoveredWorldTilesCopy.push(worldTile.id);
      setDiscoveredWorldTiles(discoveredWorldTilesCopy);
    }
    if (ref.current) {
      ref.current.material.color.set(worldTile.color);
    }
  }, [worldTile]);

  const planeRotation = useMemo(() => {
    return worldTile.id % 2 < 1 ? 1 : 2;
  }, [worldTile]);

  return (
    <>
      <Boundaries />

      <mesh
        receiveShadow
        position={[grid.x, grid.y, grid.z]}
        rotation-z={Math.PI * planeRotation}
        material={material}
        geometry={geometry}
        ref={ref}
      />

      {/* <Grid /> */}
      <Shrine />
      {/* <Structures /> */}
    </>
  );
};
