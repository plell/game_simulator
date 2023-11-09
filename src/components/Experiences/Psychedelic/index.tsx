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

const triangleSize = 12.8;
const triangleYAdjust = 1.7;

const buffer = 60;

const bulletSpeed = 0.3;

const triangles = [
  {
    x: triangleSize,
    y: 0,
    rotation: Math.PI,
    projectilePosition: new Vector3(buffer, 0, 0),
    projectileDirection: new Vector3(-bulletSpeed, 0, 0),
  },
  {
    x: -triangleSize,
    y: 0,
    rotation: Math.PI * 2,
    projectilePosition: new Vector3(-buffer, 0, 0),
    projectileDirection: new Vector3(bulletSpeed, 0, 0),
  },
  {
    x: -triangleSize * 0.5,
    y: -triangleSize + triangleYAdjust,
    rotation: Math.PI * 3,
    projectilePosition: new Vector3(-buffer * 0.45, -buffer * 0.8, 0),
    projectileDirection: new Vector3(bulletSpeed * 0.35, bulletSpeed * 0.65, 0),
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

// const circleGeo = new CircleGeometry(triangleSize, 0, hovered?.rotation);

const Content = () => {
  const [hovered, setHovered] = useState(null);
  const sensorRef = useRef<Mesh | null>(null);
  const beatMeshRef = useRef<Mesh | null>(null);

  return (
    <Suspense fallback={null}>
      <group position-z={15}>
        <Beats sensorRef={sensorRef} />
        <PsychCone setHovered={setHovered} />

        <mesh
          ref={beatMeshRef}
          visible={!!hovered}
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
};

const Beats = ({ sensorRef }: BeatsProps) => {
  const projectilesRef = useRef<Refs>({});

  return <Projectiles sensorRef={sensorRef} refs={projectilesRef} />;
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

  const [selectedPointId, setSelectedPointId] = useState(0);

  const intersect = useObjectIntersectsManyB(sensorRef, refs);

  const { data, update, getLowAvg, getHighAvg } =
    useAudioAnalysis("audio/beat.mp3");

  useFrame(({ camera }) => {
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
  });

  const initNewProjectile = () => {
    const index = selectedPointId + 1 > triangles.length ? 0 : selectedPointId; //Math.floor(Math.random() * triangles.length);
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
    <group>
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

const white = new Color("mediumpurple");
const hotpink = new Color("hotpink");

const Orb = ({ position, id, selectedPointId }: OrbProps) => {
  const ref = useRef<Mesh | null>(null);
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const selected = useMemo(() => selectedPointId === id, [id, selectedPointId]);

  useFrame(() => {
    if (ref.current) {
      if (selected) {
        ref.current.scale.lerp(orbVec.set(2, 2, 2), 0.1);
        materialRef.current?.emissive.lerp(white, 0.2);
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
    <group>
      {triangles.map((t, i) => {
        return (
          <mesh
            key={`${i}-sensor`}
            position-x={t.x}
            position-y={t.y}
            position-z={-24}
            onPointerEnter={() => setHovered(t)}
          >
            <circleGeometry args={[triangleSize, 0, t.rotation]} />
            <meshBasicMaterial color='white' transparent opacity={0.1} />
          </mesh>
        );
      })}
    </group>
  );
};
