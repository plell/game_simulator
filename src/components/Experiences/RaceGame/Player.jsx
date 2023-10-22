import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from 'three'
import useGame from "./stores/useGame";

export default function Player()
{   
    const startingPosition = [0, 1, 0]
    const body = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    
    const { start, end, restart, blocksCount } = useGame(s=>s)
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(20,10,10))
    const [ smoothedCameraTarget ] = useState(()=> new THREE.Vector3())

    useEffect(() => {
        const unsubscribePhaseListener = useGame.subscribe(
            (state) => state.phase,
            (phase) => {
                if (phase === 'ready') {
                    reset()
                } else if (phase === 'playing') {
                    
                } else if (phase === 'ended') {
                    
                }
                console.log('phase changed to', phase)
            }
        )

        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value) jump()
            })
        const unsubscribeAny = subscribeKeys(
            () => {
                console.log('any')
                start()
            })
        
        return () => {
            unsubscribePhaseListener()
            unsubscribeJump()
            unsubscribeAny()
        }   
    }, [])
    
    const { rapier, world } = useRapier()
    
    const jump = () => {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if (hit?.toi < 0.02) {
            body.current.applyImpulse({x:0,y:1,z:0})    
        }
    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({x:0,y:0,z:0})
    }
    
 
    useFrame((state, delta) => {    
        // Controls
        
        const {left, right, forward, backward} = getKeys()
        const impulse = {x:0,y:0,z:0}
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 0.5 * delta
        const torqueStrength = 0.5 * delta

        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        } 
        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
        if (left) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
        if (right) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        const bodyPosition = body.current.translation()

        

        // Camera
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 3.25
        cameraPosition.y += .95
        

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)
        
        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)


        // phases
        if (bodyPosition.z < -(blocksCount * 4 + 2)) {
            end()
        }
        if (bodyPosition.y < -5) {
            restart()
        }
    })

    return <RigidBody position={startingPosition}
        colliders="ball"
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
        ref={body}>
        <mesh castShadow>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial
                flatShading
                color="mediumpurple"
                 />
        </mesh>
    </RigidBody>

}