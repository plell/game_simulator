import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";

import { useRef, useEffect } from "react";

import useGameLocal from "./stores/useGame";
import useGame from "../../../Stores/useGame";


export default function Player({mouseRef,playerRef})
{   
    const startingPosition = [0, 1, 0]
    const body = useRef()
    
    const { start, end, restart, blocksCount } = useGameLocal(s => s)
    const mouseDown= useGame(s=>s.mouseDown)


    useEffect(() => {
        jump()
    }, [mouseDown])
    
    useEffect(() => {
        const unsubscribePhaseListener = useGame.subscribe(
            (state) => state.phase,
            (phase) => {
                if (phase === 'ready') {
                    reset()
                } else if (phase === 'playing') {
                    
                } else if (phase === 'ended') {
                    
                }

            }
        )

        return () => unsubscribePhaseListener()
    },[])
    
    const { rapier, world } = useRapier()
    
    const jump = () => {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if (hit?.toi < 0.02) {
            body.current.applyImpulse({x:0,y:1.8,z:0})    
        }
    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({x:0,y:0,z:0})
    }
 
    useFrame((state, delta) => {    

        const bodyPosition = body.current.translation()
        // Controls
        if (mouseRef?.current && body?.current) {
            const impulse = { x: 0, y: 0, z: 0 }

            const mouse = mouseRef.current;

            impulse.x = ( mouse.x - bodyPosition.x) * .01 
        
            body.current.applyImpulse(impulse, true)
        }
    
        const endPosition = -(blocksCount * 3 + 2)
        
        // phases
        if (bodyPosition.z < endPosition) {
            end()
        }
        if (bodyPosition.y < -5) {
            restart()
        }
    })

    return (
    <RigidBody position={startingPosition}
        colliders="ball"
        restitution={0}
        friction={3}
        gravityScale={1.5}
        linearDamping={0.5}
        angularDamping={0.5}
            onCollisionEnter={(e) => {
                const { rigidBody } = e
                const { userData } = rigidBody

                if (userData.name === 'left') {
                    
                    if (body.current) {
                        body.current.applyImpulse({x:0,y:2,z:0},true)
                    }
                }
                else if (userData.name === 'right') {
                    
                    if (body.current) {
                        body.current.applyImpulse({x:0,y:2,z:0},true)
                    }
                }
            
        }}
        ref={body}>
        <mesh castShadow>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial
                flatShading
                color="white"
                 />
        </mesh>
        </RigidBody>
    )
        

}