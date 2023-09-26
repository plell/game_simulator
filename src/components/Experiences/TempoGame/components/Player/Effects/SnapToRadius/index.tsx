import useGame from "../../../../Stores/useGame";

export const snapToRadius = 5;

export const SnapRadius = () => {
  const snapTo = useGame((s) => s.snapTo);

  if (!snapTo) {
    return null;
  }

  return (
    <mesh position-z={-0.6}>
      <circleGeometry args={[snapToRadius]} />
      <meshStandardMaterial color="#fff" transparent opacity={0.3} />
    </mesh>
  );
};
