import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import { dismount, mount, hihat, kick, playSound, snare } from "../Tone";
import {
  ALL_NOTES,
  getMovement,
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

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();
const reuseableVector3c = new Vector3();
const reuseableVector3d = new Vector3();
const reuseableVector3e = new Vector3();

export const Loop = () => {
  useEffect(() => {
    mount();
    return () => dismount();
  }, []);

  const players = useGame((s) => s.players);
  const tempo = useGame((s) => s.tempo);
  const patterns = useGame((s) => s.patterns);
  const setTempoUp = useGame((s) => s.setTempoUp);
  const setTempoDown = useGame((s) => s.setTempoDown);
  const snapTo = useGame((s) => s.snapTo);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const [playedPattern, setPlayedPattern] = useState<string[]>([]);
  const [playedRhythm, setPlayedRhythm] = useState<number[]>([]);

  const worldTile = useGame((s) => s.worldTile);

  const pattern = useMemo(
    () => patterns[worldTile.patternId],
    [worldTile, patterns]
  );

  useEffect(() => {
    if (activeNoteId && !playedPattern.includes(activeNoteId)) {
      updatePlayedPattern(activeNoteId);
    }
  }, [activeNoteId]);

  const updatePlayedPattern = (id: string) => {
    setPlayedPattern([...playedPattern, id]);
  };

  const ref = useRef<Mesh | null>(null);

  useEffect(() => {
    const newPlayed: string[] = [];

    const looperX = ref?.current?.position.x || 100;

    Object.values(pattern.notes).forEach((note) => {
      if (note.position.x < looperX) {
        newPlayed.push(note.id);
      }
    });

    setActiveNoteId(null);
    setPlayedPattern(newPlayed);
  }, [pattern, ref]);

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
        if (note.id !== activeNoteId) {
          setActiveNoteId(note.id);
        }
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

  const notes = useMemo(() => {
    return Object.values(pattern.notes).map((note, i) => (
      <NoteComponent
        played={activeNoteId === note.id}
        color={worldTile.color}
        note={note}
        key={`note-${note.id}-${i}`}
      />
    ));
  }, [pattern, worldTile, activeNoteId]);

  return (
    <>
      <mesh ref={ref}>
        <boxGeometry args={[0.1, grid.height, 0.1]} />
        <meshStandardMaterial emissive={"white"} emissiveIntensity={1.1} />
      </mesh>

      {/* patterns */}
      {notes}
    </>
  );
};

type NoteComponentProps = {
  note: Note;
  color: string;
  played: boolean;
};

const noteGeo = new CylinderGeometry(1, 1, 1, 5);

const white = new Color("white");

const NoteComponent = ({ note, color, played }: NoteComponentProps) => {
  const body = useRef<RapierRigidBody | null>(null);
  const ref = useRef<Mesh | null>(null);
  const [loaded, setLoaded] = useState(false);

  const worldTile = useGame((s) => s.worldTile);
  const patterns = useGame((s) => s.patterns);
  const setPatterns = useGame((s) => s.setPatterns);

  const [emitterActive, setEmitterActive] = useState(false);
  const myColor = useMemo(() => new Color(color), []);
  const noteMaterial = useMemo(() => new MeshBasicMaterial(), []);

  const pattern = useMemo(() => {
    return patterns[worldTile.patternId];
  }, [patterns, worldTile]);

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
    // flash
    const pitch = ALL_NOTES[pattern.key][note.pitch];
    playSound(pitch);
    setEmitterActive(true);

    setTimeout(() => {
      setEmitterActive(false);
    }, 200);
  };

  useFrame(() => {
    if (ref.current) {
      if (emitterActive) {
        ref.current.material.color.lerp(white, 0.2);
      } else {
        ref.current.material.color.lerp(myColor, 0.1);
      }
    }
  });

  const randomRotate = useMemo(() => Math.random() * Math.PI * 2, []);

  return (
    <>
      <Emitter body={body} position={position} active={emitterActive} />

      <mesh
        ref={ref}
        scale={0.4}
        geometry={noteGeo}
        material={noteMaterial}
        position={note.position}
        rotation-x={Math.PI * 0.5}
        rotation-y={randomRotate}
      />
    </>
  );
};
