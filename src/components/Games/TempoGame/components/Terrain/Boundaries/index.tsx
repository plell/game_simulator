import { CuboidCollider } from "@react-three/rapier";
import { ReactElement, useMemo } from "react";
import { Vector3 } from "three";
import {
  NeighborTiles,
  getNeighborTiles,
  grid,
  postDebounce,
} from "../../../Stores/constants";
import { Direction, RigidBodyData, WorldTile } from "../../../Stores/types";
import useGame from "../../../Stores/useGame";

type Wall = {
  pos: Vector3;
  args: [width: number, height: number, depth: number];
  name: "top" | "bottom" | "left" | "right";
};

const wallWidth = 8;
const walls: Wall[] = [
  {
    pos: new Vector3(grid.x, grid.top + wallWidth, grid.z),
    args: [grid.width, wallWidth, 5],
    name: "top",
  },
  {
    pos: new Vector3(grid.x, grid.bottom - wallWidth, grid.z),
    args: [grid.width, wallWidth, 5],
    name: "bottom",
  },
  {
    pos: new Vector3(grid.left - wallWidth, grid.y, grid.z),
    args: [wallWidth, grid.height, 5],
    name: "left",
  },
  {
    pos: new Vector3(grid.right + wallWidth, grid.y, grid.z),
    args: [wallWidth, grid.height, 5],
    name: "right",
  },
];

export const Boundaries = () => {
  const worldTile = useGame((s) => s.worldTile);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);

  const doLevelTransition = (boundaryName: Direction) => {
    const neighborTiles: NeighborTiles = getNeighborTiles(worldTile.position);

    const tile: WorldTile | null = boundaryName
      ? neighborTiles[boundaryName]
      : null;

    if (tile) {
      setNextWorldTile({
        relativeDirection: boundaryName,
        worldTile: tile,
      });
    }
  };

  const wallElements: ReactElement[] = useMemo(() => {
    const wallArray: ReactElement[] = [];
    const openPaths = getNeighborTiles(worldTile.position);

    walls.forEach((w, i) => {
      const isSensor = !!openPaths[w.name];

      wallArray.push(
        <CuboidCollider
          args={w.args}
          key={`wall-${i}`}
          restitution={2}
          friction={0}
          position={w.pos}
          sensor={isSensor}
          onIntersectionEnter={({ other }) => {
            const object = other.rigidBodyObject?.userData as RigidBodyData;

            if (object?.type === "player" && object?.name === "p1") {
              postDebounce("wall", () => doLevelTransition(w.name), 500);
            }
          }}
        />
      );
    });

    return wallArray;
  }, [worldTile]);

  return <>{wallElements}</>;
};
