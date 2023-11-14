import { useEffect, useMemo } from "react";
import { grid } from "../../Stores/constants";
import useGame from "../../Stores/useGame";
import { Boundaries } from "./Boundaries";

import { Shrine } from "./Shrine";
import { Structures } from "./Structures";
import { useTexture } from "@react-three/drei";

export const Terrain = () => {
  const worldTile = useGame((s) => s.worldTile);
  const discoveredWorldTiles = useGame((s) => s.discoveredWorldTiles);
  const setDiscoveredWorldTiles = useGame((s) => s.setDiscoveredWorldTiles);

  useEffect(() => {
    const discoveredWorldTilesCopy = [...discoveredWorldTiles];
    if (!discoveredWorldTilesCopy.includes(worldTile?.id)) {
      discoveredWorldTilesCopy.push(worldTile?.id);
      setDiscoveredWorldTiles(discoveredWorldTilesCopy);
    }
  }, [worldTile]);

  const diffMap = useTexture("textures/sand/aerial_beach_01_diff_1k.jpg");

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
      >
        <planeGeometry args={[grid.width, grid.height]} />
        <meshStandardMaterial
          map={diffMap}
          color={worldTile.color || "white"}
        />
      </mesh>

      {/* <Grid /> */}
      <Shrine />
      <Structures />
    </>
  );
};
