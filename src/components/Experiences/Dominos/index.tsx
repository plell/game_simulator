import {
  InstancedRigidBodies,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CurvedLine } from "./CurvedLine";
import {
  Event,
  Group,
  InstancedMesh,
  MathUtils,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  Vector3,
} from "three";
import useGame from "../../../Stores/useGame";
import { initDominos } from "./constants";
import { ThreeEvent, useFrame } from "@react-three/fiber";

const radius = 800;
const dominoDistance = 5;

const emissiveMaterial = new MeshStandardMaterial({
  color: "red",
});

const normalizePoints = (pointsArray: Vector3[]) => {
  if (!pointsArray.length) {
    return [];
  }

  const normalizedPoints = [pointsArray[0]]; // Initialize with the first point

  for (let i = 1; i < pointsArray.length; i++) {
    const prevPoint = normalizedPoints[normalizedPoints.length - 1];
    const currentPoint = pointsArray[i];

    // Calculate the distance between the current and previous points
    const distance = prevPoint.distanceTo(currentPoint);

    // If the distance is greater than 2 units, interpolate new points
    if (distance > dominoDistance) {
      const segments = Math.floor(distance / dominoDistance); // Calculate the number of segments to add

      for (let j = 1; j <= segments; j++) {
        const t = j / (segments + 1);
        const interpolatedPoint = new Vector3().lerpVectors(
          prevPoint,
          currentPoint,
          t
        );
        normalizedPoints.push(interpolatedPoint);
      }
    }

    normalizedPoints.push(currentPoint); // Add the current point to the normalized points array
  }

  return normalizedPoints;
};

export const Dominos = () => {
  const instancedRigidBodiesRef = useRef<RapierRigidBody[] | null>(null);

  const mouseDown = useGame((s) => s.mouseDown);

  const [points, setPoints] = useState<Vector3[]>([]);
  const [loadedPoints, setLoadedPoints] = useState<Vector3[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setLoadedPoints(initDominos);
    }, 200);
  }, []);

  const dominoInstances = useMemo(() => {
    const instances = [];

    const normalizedPoints = normalizePoints(loadedPoints);

    for (let i = 0; i < normalizedPoints.length; i += 1) {
      const pos = normalizedPoints[i];
      instances.push({
        key: i,
        position: pos,
        rotation: [0, 0, 0],
      });

      if (instances[i - 1]) {
        const me = new Object3D();
        me.position.set(pos.x, pos.y, pos.z);

        me.lookAt(instances[i - 1].position);
        instances[i - 1].rotation = [
          me.rotation.x,
          me.rotation.y,
          me.rotation.z,
        ];
      }
    }

    // remove last for rotation
    const popped = [...instances];
    popped.pop();
    return popped;
  }, [loadedPoints]);

  useEffect(() => {
    setTimeout(() => {
      startFall();
    }, 500);
  }, [dominoInstances.length]);

  const startFall = useCallback(() => {
    if (
      instancedRigidBodiesRef?.current?.length &&
      instancedRigidBodiesRef?.current?.length > 2
    ) {
      const first = instancedRigidBodiesRef?.current[0];
      const next = instancedRigidBodiesRef?.current[1];

      const pos1 = first.translation();
      const pos2 = next.translation();

      const from = new Vector3(pos1.x, pos1.y, pos1.z);
      const to = new Vector3(pos2.x, pos2.y, pos2.z);

      const amp = 800;

      const force = to.sub(from).normalize();

      const direction = new Vector3(
        force.x * amp,
        force.y * amp,
        force.z * amp
      );

      first.applyImpulse(direction, true);
    }
  }, [instancedRigidBodiesRef.current]);

  const doPoints = (e: ThreeEvent<PointerEvent>) => {
    if (mouseDown) {
      setPoints((prevPoints) => {
        const lastPoint = prevPoints[prevPoints.length - 1];
        if (!lastPoint || lastPoint.distanceTo(e.point) > dominoDistance) {
          return [...prevPoints, e.point];
        }
        return points;
      });
    }
  };

  useEffect(() => {
    if (!mouseDown) {
      if (points.length > 1) {
        setLoadedPoints(points);
      } else {
        setLoadedPoints(initDominos);
      }

      setPoints([]);
    }
  }, [mouseDown]);

  useFrame(() => {
    if (instancedRigidBodiesRef?.current) {
      // instancedRigidBodiesRef.current.map((d) => {
      // console.log("d.rotation()", d.rotation().z);
      // if (Math.abs(d.rotation().x) > 1 && !d.isSleeping) {
      //   d.sleep();
      // }
      // });
    }
  });

  return (
    <group>
      <pointLight
        castShadow
        position={[-90, 80, 100]}
        intensity={9000}
        distance={800}
        color={"white"}
        shadow-bias={-0.001}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-top={500}
        shadow-camera-right={500}
        shadow-camera-bottom={-500}
        shadow-camera-left={-500}
      />

      <pointLight
        castShadow
        position={[90, 80, -100]}
        intensity={9000}
        distance={800}
        color={"orange"}
        shadow-bias={-0.001}
        shadow-camera-near={1}
        shadow-camera-far={1000}
        shadow-camera-top={500}
        shadow-camera-right={500}
        shadow-camera-bottom={-500}
        shadow-camera-left={-500}
      />

      <ambientLight intensity={0.1} />

      <group position-y={1}>
        <CurvedLine points={points} />
      </group>

      <InstancedRigidBodies
        key={dominoInstances.length}
        gravityScale={40}
        restitution={0}
        // friction={0.1}
        // restitution={0}
        instances={dominoInstances}
        ref={instancedRigidBodiesRef}
        // onCollisionEnter={() => {}}
        // onContactForce={(payload) => {
        //   console.log(payload.totalForceMagnitude);
        //   if (payload.totalForceMagnitude < 100) {
        //   }
        // }}
      >
        <instancedMesh
          material={emissiveMaterial}
          castShadow
          args={[null, null, dominoInstances.length]}
        >
          <boxGeometry args={[3, 5, 1]} />
        </instancedMesh>
      </InstancedRigidBodies>

      <RigidBody type={"fixed"} restitution={0} friction={10}>
        <mesh
          rotation-x={Math.PI * -0.5}
          receiveShadow
          onPointerMove={doPoints}
        >
          <boxGeometry args={[radius, radius, 2]} />
          {/* <MeshReflectorMaterial /> */}
          <meshStandardMaterial color={"white"} />
        </mesh>
      </RigidBody>
    </group>
  );
};
