import { RigidBody } from "@react-three/rapier";
import useGame from "../../../Stores/useGame";

export const Shrine = () => {
  const worldTile = useGame((s) => s.worldTile);
  const { shrine } = worldTile;

  if (!shrine) {
    return null;
  }

  return (
    <RigidBody type='fixed'>
      <mesh position={shrine.position} scale={2}>
        <planeGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color={shrine.color} />
      </mesh>
    </RigidBody>
  );
};
