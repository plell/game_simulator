import {
  MutableRefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useGame from "../../../Stores/useGame";
import {
  DEAD_ZONE_Y,
  experienceProperties,
  postDebounce,
} from "../../../Stores/constants";
import { Select } from "@react-three/postprocessing";
import { Shader } from "./Shader";
import {
  CircleGeometry,
  Color,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { v4 as uuidv4 } from "uuid";
import { Refs } from "../SpaceGame";
import { Bullet } from "../common/Projectiles/components/Bullet";
import { Projectile } from "../../../Stores/types";
import { useObjectIntersectsManyB } from "../hooks/useObjectsIntersect";
import { useFrame } from "@react-three/fiber";
import { useAudioAnalysis } from "../hooks/useAudioAnalysis";

import { GameProgress } from "../common/GameProgress";

const triangleSize = Math.PI * 6;
const triangleYAdjust = Math.PI * 0.8;

const buffer = 60;

const bulletSpeed = 0.4;

type Triangle = {
  x: number;
  y: number;
  rotation: number;
  projectilePosition: Vector3;
  projectileDirection: Vector3;
  order: number;
};
const triangles: Triangle[] = [
  {
    x: triangleSize,
    y: 0,
    rotation: Math.PI,
    projectilePosition: new Vector3(buffer, 0, 0),
    projectileDirection: new Vector3(-bulletSpeed, 0, 0),
    order: 0,
  },
  {
    x: triangleSize * 0.5,
    y: -triangleSize + triangleYAdjust,
    rotation: Math.PI * 6,
    projectilePosition: new Vector3(buffer * 0.45, -buffer * 0.8, 0),
    projectileDirection: new Vector3(
      -bulletSpeed * 0.35,
      bulletSpeed * 0.65,
      0
    ),
    order: 1,
  },
  {
    x: -triangleSize * 0.5,
    y: -triangleSize + triangleYAdjust,
    rotation: Math.PI * 3,
    projectilePosition: new Vector3(-buffer * 0.45, -buffer * 0.8, 0),
    projectileDirection: new Vector3(bulletSpeed * 0.35, bulletSpeed * 0.65, 0),
    order: 2,
  },
  {
    x: -triangleSize,
    y: 0,
    rotation: Math.PI * 2,
    projectilePosition: new Vector3(-buffer, 0, 0),
    projectileDirection: new Vector3(bulletSpeed, 0, 0),
    order: 3,
  },
  {
    x: -triangleSize * 0.5,
    y: triangleSize - triangleYAdjust,
    rotation: Math.PI * 5,
    projectilePosition: new Vector3(-buffer * 0.45, buffer * 0.8, 0),
    projectileDirection: new Vector3(
      bulletSpeed * 0.35,
      -bulletSpeed * 0.65,
      0
    ),
    order: 4,
  },
  {
    x: triangleSize * 0.5,
    y: triangleSize - triangleYAdjust,
    rotation: Math.PI * 4,
    projectilePosition: new Vector3(buffer * 0.45, buffer * 0.8, 0),
    projectileDirection: new Vector3(
      -bulletSpeed * 0.35,
      -bulletSpeed * 0.65,
      0
    ),
    order: 5,
  },
];

export const Psychedelic = () => {
  const game = useGame((s) => s.game);

  return (
    <group position={experienceProperties[game]?.gamePosition}>
      <Content />
    </group>
  );
};

const Content = () => {
  const [hovered, setHovered] = useState<Triangle | null>(null);
  const sensorRef = useRef<Mesh | null>(null);
  const beatMeshRef = useRef<Mesh | null>(null);

  return (
    <Suspense fallback={null}>
      <group position-z={15}>
        <Beats sensorRef={sensorRef} hovered={hovered} />
        <PsychCone setHovered={setHovered} />

        <mesh
          ref={beatMeshRef}
          visible={false} //!!hovered}
          position-x={hovered?.x}
          position-y={hovered?.y}
          rotation-z={hovered?.rotation}
          position-z={20}
        >
          <circleGeometry args={[triangleSize, 0]} />
          <meshBasicMaterial />
        </mesh>
      </group>

      <mesh ref={sensorRef} rotation-x={Math.PI * 0.5}>
        <cylinderGeometry args={[26, 26, 30, 6]} />
        <meshBasicMaterial wireframe opacity={0} transparent />
      </mesh>

      <Select enabled={true}>
        <mesh rotation-x={Math.PI * 0.5} onPointerOut={() => setHovered(null)}>
          <coneGeometry args={[30, 30, 6, undefined, true]} />
          <Shader />
        </mesh>
      </Select>

      <mesh rotation-z={Math.PI * -0.5} position-z={-30}>
        <planeGeometry args={[200, 300]} />

        <meshBasicMaterial color={"black"} />
      </mesh>
    </Suspense>
  );
};

type BeatsProps = {
  sensorRef: MutableRefObject<Mesh | null>;
  hovered: any;
};

const lime = new Color("white");
const white = new Color("hotpink");

const Beats = ({ sensorRef, hovered }: BeatsProps) => {
  const projectilesRef = useRef<Refs>({});
  const barrierGroupRef = useRef<Group | null>(null);
  const barrierRef = useRef<Mesh | null>(null);
  const barrierMaterialRef = useRef<MeshStandardMaterial | null>(null);
  const [score, setScore] = useState(0);
  const [barrierColor, setBarrierColor] = useState(white);
  const [barrierIntensity, setBarrierIntensity] = useState(1.1);
  const [level, setLevel] = useState(1);
  const [barrierRotation, setBarrierRotation] = useState({
    rotation: 0,
    order: 0,
  });

  useEffect(() => {
    setBarrierIntensity(2);
    setBarrierColor(lime);
    const timeout = setTimeout(() => {
      setBarrierColor(white);
      setBarrierIntensity(1.1);
    }, 100);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [score]);

  useEffect(() => {
    if (hovered) {
      const turn = (Math.PI * 2) / 6;
      const direction = barrierRotation.order - hovered.order;
      let rotation = barrierRotation.rotation + turn * direction;

      if (
        barrierRotation?.order === 0 &&
        hovered.order === triangles.length - 1
      ) {
        rotation = barrierRotation.rotation + turn;
      } else if (
        hovered.order === 0 &&
        barrierRotation.order === triangles.length - 1
      ) {
        rotation = barrierRotation.rotation - turn;
      }

      setBarrierRotation({
        order: hovered.order,
        rotation,
      });
    }
  }, [hovered]);

  const intersect = useObjectIntersectsManyB(barrierRef, projectilesRef);

  useFrame(() => {
    if (barrierGroupRef.current) {
      barrierGroupRef.current.rotation.z = MathUtils.lerp(
        barrierGroupRef.current.rotation.z,
        barrierRotation.rotation,
        0.2
      );
    }

    if (barrierMaterialRef.current) {
      barrierMaterialRef.current.emissiveIntensity = MathUtils.lerp(
        barrierMaterialRef.current.emissiveIntensity,
        barrierIntensity,
        0.3
      );
    }

    if (intersect.current.length > 0) {
      projectilesRef.current[intersect.current[0]].position.set(
        0,
        DEAD_ZONE_Y + 100,
        0
      );

      postDebounce(
        "hit",
        () => {
          setScore(score + 1);
        },
        200
      );
    }
  });

  return (
    <>
      <GameProgress
        position={new Vector3(0, 11.8, 110)}
        type='points'
        max={5}
        score={score}
        level={level}
        levelPrefix='LEVEL '
        setLevel={() => {
          setLevel(level + 1);
          setScore(0);
        }}
        scale={0.1}
      />

      <group ref={barrierGroupRef}>
        <mesh ref={barrierRef} position={[26, 0, 0]}>
          <boxGeometry args={[0.3, 25, 30, 10, 10]} />
          <meshStandardMaterial
            emissive='white'
            wireframe
            ref={barrierMaterialRef}
          />
        </mesh>
      </group>
      <Projectiles sensorRef={sensorRef} refs={projectilesRef} />
    </>
  );
};

type Props = {
  refs: MutableRefObject<Refs>;
  sensorRef: MutableRefObject<Mesh | null>;
};

type BulletProps = {
  position: Vector3;
  direction: Vector3;
};

const bulletMaterial = new MeshBasicMaterial({ color: "white" });
const bulletGeometry = new CircleGeometry(2, 2);

export const Projectiles = ({ refs, sensorRef }: Props) => {
  const [projectiles, setProjectiles] = useState<Record<string, Projectile>>(
    {}
  );

  const orbGroupRef = useRef<Group | null>(null);

  const [selectedPointId, setSelectedPointId] = useState(0);

  const intersect = useObjectIntersectsManyB(sensorRef, refs);

  const { data, update, getLowAvg, getHighAvg } =
    useAudioAnalysis("audio/beat.mp3");

  useFrame(({ camera }, delta) => {
    const lowAvg = getLowAvg();

    camera.fov = MathUtils.lerp(camera.fov, 50 - lowAvg / 105, 0.2);

    camera.updateProjectionMatrix();
    if (intersect.current.length > 0) {
      refs.current[intersect.current[0]].position.set(0, DEAD_ZONE_Y + 100, 0);
    }

    if (lowAvg > 200) {
      postDebounce(
        "newProjectile",
        () => {
          initNewProjectile();
        },
        1000
      );
    }

    if (orbGroupRef.current) {
      // orbGroupRef.current.rotation.z += 1 * delta;
    }
  });

  const initNewProjectile = () => {
    const index = Math.floor(Math.random() * triangles.length);
    const tri = triangles[index];

    setSelectedPointId(index + 1);

    newProjectile({
      position: tri.projectilePosition,
      direction: tri.projectileDirection,
    });
  };

  const newProjectile = ({ position, direction }: BulletProps) => {
    const pCopy = { ...projectiles };
    const id = uuidv4();

    pCopy[id] = {
      id,
      position: position,
      type: "projectile",
      dead: false,
      direction,
    };

    setProjectiles(pCopy);
  };

  const removeProjectile = (id: string) => {
    const pCopy = { ...projectiles };
    delete pCopy[id];
    setProjectiles(pCopy);
  };

  return (
    <group ref={orbGroupRef}>
      {Object.keys(projectiles).map((p) => {
        const self = projectiles[p];
        if (self) {
          return (
            <Bullet
              geometry={bulletGeometry}
              material={bulletMaterial}
              self={self}
              refs={refs}
              removeMe={removeProjectile}
              key={self.id}
            />
          );
        }
        return null;
      })}

      {triangles.map((s, i) => {
        return (
          <Orb
            selectedPointId={selectedPointId}
            position={s.projectilePosition}
            key={i}
            id={i + 1}
          />
        );
      })}
    </group>
  );
};

type OrbProps = {
  position: Vector3;
  id: number;
  selectedPointId: number;
};

const orbVec = new Vector3();

const mediumpurple = new Color("mediumpurple");
const hotpink = new Color("hotpink");

const Orb = ({ position, id, selectedPointId }: OrbProps) => {
  const ref = useRef<Mesh | null>(null);
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const selected = useMemo(() => selectedPointId === id, [id, selectedPointId]);

  useFrame(() => {
    if (ref.current) {
      if (selected) {
        ref.current.scale.lerp(orbVec.set(2, 2, 2), 0.1);
        materialRef.current?.emissive.lerp(mediumpurple, 0.2);
      } else {
        ref.current.scale.lerp(orbVec.set(1, 1, 1), 0.1);
        materialRef.current?.emissive.lerp(hotpink, 0.2);
      }
    }
  });
  return (
    <mesh position={position} ref={ref}>
      <circleGeometry args={[2, 20]} />
      <meshStandardMaterial
        emissive='hotpink'
        emissiveIntensity={6}
        ref={materialRef}
      />
    </mesh>
  );
};

type ConeProps = {
  setHovered: (t: any) => void;
};

const PsychCone = ({ setHovered }: ConeProps) => {
  return (
    <group position-z={140}>
      {triangles.map((t, i) => {
        return (
          <mesh
            key={`${i}-sensor`}
            position-x={t.x}
            position-y={t.y}
            position-z={4}
            onPointerEnter={() => setHovered(t)}
          >
            <circleGeometry args={[triangleSize, 0, t.rotation]} />
            <meshBasicMaterial color='white' transparent opacity={0} />
          </mesh>
        );
      })}
    </group>
  );
};
