import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { hihat, kick, playSound, snare } from "../Tone";
import {
  getMovement,
  getPushMovement,
  grid,
  postDebounce,
} from "../../../Stores/constants";
import useGame from "../../../Stores/useGame";
import { Note } from "../../../Stores/types";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Emitter } from "../../Effects/Emitter";
import { snapToRadius } from "../../Player/Effects/SnapToRadius";
import { playerSpeed } from "../../Player";
import { getNearestGridPosition } from "./constants";
import { getGridPointsAndLines } from "../../Terrain/Grid";

const reuseableVector3 = new Vector3();
const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();
const reuseableVector3c = new Vector3();
const reuseableVector3d = new Vector3();
const reuseableVector3e = new Vector3();

export const Loop = () => {
  const players = useGame((s) => s.players);
  const tempo = useGame((s) => s.tempo);
  const patterns = useGame((s) => s.patterns);
  const setTempoUp = useGame((s) => s.setTempoUp);
  const setTempoDown = useGame((s) => s.setTempoDown);
  const snapTo = useGame((s) => s.snapTo);

  const worldTile = useGame((s) => s.worldTile);

  const pattern = useMemo(
    () => patterns[worldTile.patternId],
    [worldTile, patterns]
  );

  const ref = useRef<Mesh | null>(null);
  const [playedPattern, setPlayedPattern] = useState<string[]>([]);

  const [playedRhythm, setPlayedRhythm] = useState<number[]>([]);

  const { viewport } = useThree();

  const { intersections } = useMemo(
    () => getGridPointsAndLines(pattern),
    [pattern]
  );

  useEffect(() => {
    if (ref.current) {
      let scale = 1;

      if (worldTile.shrine) {
        scale = 0;
      }

      ref.current.scale.set(scale, scale, scale);
    }
  }, [worldTile]);

  useEffect(() => {
    const newPlayed: string[] = [];

    Object.values(pattern.notes).forEach((note) => {
      if (
        !newPlayed?.includes(note.id) &&
        note.position.x < (ref?.current?.position.x || 0)
      ) {
        newPlayed.push(note.id);
      }
    });

    setPlayedPattern(newPlayed);
  }, [pattern]);

  const resetLoop = () => {
    if (ref.current) {
      ref.current.position.x = -grid.width / 2;
    }

    setPlayedPattern([]);
    setPlayedRhythm([]);
  };

  useEffect(() => {
    if (worldTile.shrine) {
      resetLoop();
    }
  }, [worldTile]);

  useFrame(({ mouse, clock }, delta) => {
    if (!ref.current) {
      return;
    }

    ref.current.material.emissiveIntensity =
      1 + Math.abs(Math.sin(clock.getElapsedTime())) * 0.3;

    if (worldTile.shrine || players.p1?.dead) {
      return;
    }

    // move loop forward
    ref.current.position.x += delta * tempo;

    // reset looper
    if (ref.current.position.x > grid.width / 2) {
      ref.current.position.x = -grid.width / 2;
      kick();
      resetLoop();
    }

    // halfway
    if (ref.current.position.x > 0 && !playedRhythm.includes(0)) {
      snare();
      setPlayedRhythm([...playedRhythm, 0]);
    }

    if (
      ref.current.position.x > -(grid.width / 2 / 2) &&
      !playedRhythm.includes(2)
    ) {
      hihat();
      setPlayedRhythm([...playedRhythm, 2]);
    }

    if (
      ref.current.position.x > grid.width / 2 / 2 &&
      !playedRhythm.includes(1)
    ) {
      hihat();
      setPlayedRhythm([...playedRhythm, 1]);
    }

    const playerBody = players.p1.body?.current;
    const playerTranslation = playerBody?.translation();

    const playerPosition = reuseableVector3a.set(
      playerTranslation?.x || 0,
      playerTranslation?.y || 0,
      playerTranslation?.z || 0
    );

    // mouse position
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    const mousePosition = reuseableVector3c.set(mouseX, mouseY, 0);

    // do pattern loop
    Object.values(pattern.notes).forEach((note) => {
      const trans = note.body?.current?.translation();

      const notePosition = trans
        ? reuseableVector3b.set(trans.x, trans.y, trans.z)
        : note.position;

      if (
        !playedPattern?.includes(note.id) &&
        notePosition.x < (ref?.current?.position.x || 0)
      ) {
        postDebounce(
          "pattern",
          () => {
            playSound(note.pitch);
            setPlayedPattern([...playedPattern, note.id]);
          },
          10
        );
      }

      // do snapTo
      if (snapTo && note.body?.current && playerPosition && playerBody) {
        const distance = playerPosition.distanceTo(notePosition);

        // use delta movement to move
        if (distance < snapToRadius) {
          const impulse = { x: 0, y: 0, z: 0 };

          const movement = getMovement(
            playerPosition,
            mousePosition,
            playerSpeed,
            tempo
          );

          impulse.x = movement.x;
          impulse.y = movement.y;

          const lerpPosition = playerPosition.lerp(
            reuseableVector3e.set(
              playerPosition.x + impulse.x,
              playerPosition.y + impulse.y,
              notePosition.z
            ),
            0.5
          );

          const nearestGridPosition = getNearestGridPosition(
            lerpPosition,
            intersections
          );

          note.body.current.setTranslation(nearestGridPosition, true);
        }
      }
    });
  });

  return (
    <>
      <mesh ref={ref}>
        <boxGeometry args={[0.1, grid.height, 0.1]} />
        <meshStandardMaterial emissive={"white"} emissiveIntensity={1.1} />
      </mesh>

      {/* patterns */}
      {Object.values(pattern.notes).map((note, i) => (
        <NoteComponent
          played={playedPattern?.includes(note.id)}
          color={worldTile.color}
          note={note}
          key={`note-${note.id}-${i}`}
        />
      ))}
    </>
  );
};

type NoteComponentProps = {
  note: Note;
  color: string;
  played: boolean;
};

const boxGeo = new BoxGeometry(1, 1, 1);
const white = new Color("white");

const NoteComponent = ({ note, color, played }: NoteComponentProps) => {
  const body = useRef<RapierRigidBody | null>(null);
  const material = useRef<MeshBasicMaterial | null>(null);
  const [loaded, setLoaded] = useState(false);
  const enemies = useGame((s) => s.enemies);
  const worldTile = useGame((s) => s.worldTile);
  const patterns = useGame((s) => s.patterns);
  const setPatterns = useGame((s) => s.setPatterns);
  const setEnemies = useGame((s) => s.setEnemies);
  const [emitterActive, setEmitterActive] = useState(false);
  const myColor = useMemo(() => new Color(color), []);

  const position = useMemo(() => {
    if (body.current) {
      const trans = body.current.translation();
      return reuseableVector3d.set(trans.x, trans.y, trans.z);
    }
    return note.position;
  }, [note, body.current]);

  // update rigid body
  useLayoutEffect(() => {
    const patternsCopy = { ...patterns };
    patternsCopy[worldTile.patternId].notes[note.id] = {
      ...note,
      body,
    };

    setPatterns(patternsCopy);
  }, []);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    } else if (played) {
      emit();
    }
  }, [played, body.current]);

  const emit = () => {
    //  do enemy damage

    // const enemiesClone = { ...enemies };
    // let hit = false;
    // Object.values(enemies).forEach((e) => {
    //   if (e.dead) {
    //     return;
    //   }

    //   const aPosition = e.body?.current?.translation();
    //   const targetPosition = reuseableVector3.set(
    //     aPosition?.x || 0,
    //     aPosition?.y || 0,
    //     aPosition?.z || 0
    //   );

    //   const trans = body?.current?.translation();
    //   const myPosition = reuseableVector3d.set(
    //     trans?.x || 0,
    //     trans?.y || 0,
    //     trans?.z || 0
    //   );

    //   const distance = myPosition.distanceTo(targetPosition);

    //   if (distance < 2) {
    //     hit = true;
    //     enemiesClone[e.id].health -= 20;
    //     if (enemiesClone[e.id]?.body?.current) {
    //       const impulse = getPushMovement(position, targetPosition);
    //       enemiesClone[e.id].body?.current?.applyImpulse(impulse, true);
    //     }
    //   }
    // });

    // if (hit) {
    //   setEnemies(enemiesClone);
    // }

    // flash
    setEmitterActive(true);

    setTimeout(() => {
      setEmitterActive(false);
    }, 200);
  };

  useFrame(() => {
    if (material.current) {
      if (emitterActive) {
        material.current?.color.lerp(white, 0.2);
      } else {
        material.current.color.lerp(myColor, 0.1);
      }
    }
  });

  return (
    <>
      <Emitter body={body} position={position} active={emitterActive} />
      <RigidBody
        ref={body}
        position={note.position}
        type='fixed'
        userData={note}
        restitution={2}
        lockRotations
        friction={1}
      >
        <mesh geometry={boxGeo}>
          <meshBasicMaterial ref={material} color={color} />
        </mesh>
      </RigidBody>
    </>
  );
};
