import { useEffect } from "react";
import { grid } from "../../Stores/constants";
import useGame from "../../Stores/useGame";
import { Boundaries } from "./Boundaries";
import { Grid } from "./Grid";
import { Shrine } from "./Shrine";
import { Structures } from "./Structures";

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

  return (
    <>
      <Boundaries />

      <mesh
        receiveShadow
        position={[grid.x, grid.y, grid.z]}
        rotation-z={Math.PI}
      >
        <planeGeometry args={[grid.width, grid.height]} />
        <meshStandardMaterial color={worldTile.color || "white"} />
      </mesh>

      <Grid />
      <Shrine />
      <Structures />
    </>
  );
};
