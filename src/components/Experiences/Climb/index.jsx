
import Lights from './Lights'
import { Level } from './Level'
import Player from './Player'
import { Stars } from '@react-three/drei'
import { Vector3 } from 'three';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';


const mouseVec3 = new Vector3();
const camVec3 = new Vector3();

export const Climb = () =>
{
  const mouseRef = useRef(mouseVec3);
  const playerRef = useRef(null);
  const [rate, setRate] = useState(0.5)

  useFrame((state,delta) => {
    const { y} = state.camera.position
    
    camVec3.set(0, y + rate * delta, 10)
    state.camera.position.copy(camVec3)
    state.camera.lookAt(camVec3)
  })
  
    return <>
        <Lights />
        <Stars radius={200}
          depth={10}
          count={3000}
          factor={4}
          saturation={0.5}
          // fade
          speed={1} />
        <Level count={3} />
      <Player mouseRef={mouseRef} playerRef={playerRef} />
      
      <mesh onPointerMove={(e) => {
            const { x, y, z } = e.point;
            mouseRef.current.set(x, y, z);
          }}>
            <planeGeometry args={ [40,2000]} />
            <meshBasicMaterial wireframe transparent opacity={0} />
        </mesh>
    </>
}