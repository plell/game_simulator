import { Suspense } from "react";

export const HalloweenGame = () => {
  return (
    <Suspense>
      <directionalLight />
      <ambientLight intensity={0.2} />
      <pointLight position={[1, 4, 0]} intensity={1} />
      <group>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color='pink' />
        </mesh>
      </group>
    </Suspense>
  );
};
