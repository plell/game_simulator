import { CuboidCollider } from "@react-three/rapier";
import { ReactElement, useMemo } from "react";
import { CircleGeometry, MeshBasicMaterial, Vector3 } from "three";
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

const arrowPositions = {
  top: new Vector3(grid.x, grid.top + 2, grid.z),
  bottom: new Vector3(grid.x, grid.bottom - 2, grid.z),
  left: new Vector3(grid.left - 2, grid.y, grid.z),
  right: new Vector3(grid.right + 2, grid.y, grid.z),
};

const turn = 0.83;

const arrowRotations = {
  top: Math.PI * -turn,
  bottom: Math.PI * turn,
  left: Math.PI,
  right: 0,
};

const arrowGeo = new CircleGeometry(0.5, 3);
const arrowMat = new MeshBasicMaterial({ transparent: true, opacity: 0.1 });
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
        <group>
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

          {isSensor && (
            <mesh
              geometry={arrowGeo}
              material={arrowMat}
              position={arrowPositions[w.name]}
              rotation-z={arrowRotations[w.name]}
            ></mesh>
          )}
        </group>
      );
    });

    return wallArray;
  }, [worldTile]);

  return <>{wallElements}</>;
};
