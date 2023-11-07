import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { suspend } from "suspend-react";
import { Color, Object3D } from "three";

export const AudioShader = () => {
  return (
    <group>
      <pointLight castShadow position={[0, 3, 0]} intensity={6} />

      <Suspense fallback={null}>
        <Track position-y={1} url='audio/beat.mp3' />
      </Suspense>

      <mesh receiveShadow rotation-x={Math.PI * -0.5} position={[0, -0.025, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
};

const red = new Color("red");
const white = new Color("white");

function Track({
  url,
  y = 300,
  space = 5.8,
  width = 0.05,
  height = 0.19,
  obj = new Object3D(),
  ...props
}) {
  const ref = useRef();
  const [positiveColor, setPositiveColor] = useState(true);
  // suspend-react is the library that r3f uses internally for useLoader. It caches promises and
  // integrates them with React suspense. You can use it as-is with or without r3f.
  const { gain, context, update, data } = suspend(
    () => createAudio(url),
    [url]
  );
  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);
    // Disconnect it on unmount
    return () => gain.disconnect();
  }, [gain, context]);

  useFrame((state) => {
    let avg = update();
    // Distribute the instanced planes according to the frequency daza
    for (let i = 0; i < data.length; i++) {
      obj.position.set(
        i * width * space - (data.length * width * space) / 2,
        data[i] / y,
        0
      );
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
    }

    // Set the hue according to the frequency average
    ref.current.material.color.setHSL(0.5, 0.75, 0.75);
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      castShadow
      ref={ref}
      args={[null, null, data.length]}
      {...props}
    >
      <boxGeometry args={[width, height, 0.5]} />
      <meshStandardMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Zoom({ url }) {
  // This will *not* re-create a new audio source, suspense is always cached,
  // so this will just access (or create and then cache) the source according to the url
  const { data } = suspend(() => createAudio(url), [url]);
  return useFrame((state) => {
    // Set the cameras field of view according to the frequency average
    state.camera.fov = 25 - data.avg / 15;
    state.camera.updateProjectionMatrix();
  });
}

async function createAudio(url) {
  // Fetch audio data and create a buffer source
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const source = context.createBufferSource();
  source.buffer = await new Promise((res) =>
    context.decodeAudioData(buffer, res)
  );
  source.loop = true;

  source.start(0);
  // Create gain node and an analyser
  const gain = context.createGain();
  const analyser = context.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(gain);
  // The data array receive the audio frequencies
  const data = new Uint8Array(analyser.frequencyBinCount);
  return {
    context,
    source,
    gain,
    data,
    // This function gets called every frame per audio source
    update: () => {
      analyser.getByteFrequencyData(data);
      // Calculate a frequency average
      return (data.avg = data.reduce(
        (prev, cur) => prev + cur / data.length,
        0
      ));
    },
  };
}
