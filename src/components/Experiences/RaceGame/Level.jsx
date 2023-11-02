import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import useGame from './stores/useGame'
import { TextureLoader } from 'three'

THREE.ColorManagement.legacyMode = false

const loader = new TextureLoader()
const sand = loader.load('textures/sand/aerial_beach_01_diff_1k.jpg')

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floor1Material = new THREE.MeshStandardMaterial({
    color: '#C8B6ED', map: sand,
})

const floorEnd = new THREE.MeshStandardMaterial({
    color: 'white', transparent: true,emissive:'#fff',emissiveIntensity:0.7
})
const floor2Material = new THREE.MeshStandardMaterial({  color:'#C8B6ED',map: sand })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered', transparent:true,opacity:0.9})
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey', transparent:true,opacity:0.6 })

function BlockStart({ position = [0, 0, 0] }) {
    return <group position={position}>
        {/* floor */}
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            position-y={-0.1}
            scale={[4,0.2,4]}
            receiveShadow/>
    </group>
}

useGLTF.preload("./models/hamburger.glb");

function BlockEnd({ position = [0, 0, 0] }) {

    const phase = useGame(s => s.phase)
    
    const ref = useRef(null)

    useFrame(({clock},delta) => {
        if (ref.current) {
            ref.current.rotation.y += 1 * delta 
            ref.current.rotation.z = Math.sin(clock.getElapsedTime()*8) * 0.1 
            if (phase === 'ended') {
                const scale = THREE.MathUtils.lerp(ref.current.scale.x,0,0.2)
                ref.current.scale.set(scale,scale,scale)
            } else {
                ref.current.scale.set(0.2,0.2,0.2)
            }
        }
    })

    const hamburger = useGLTF('./models/hamburger.glb')

    return <group position={position} >
        {/* floor */}
        <mesh
            geometry={boxGeometry}
            material={floorEnd}
            position-y={-0.1}
            scale={[4,0.2,4]}
            receiveShadow />
        
            <primitive ref={ref} object={hamburger.scene} scale={0.2} />
    </group>
}

function BlockSpinner({ position = [0, 0, 0] }) {
    const [speed] = useState(() => (Math.random()+0.2)*(Math.random() < 0.5 ? -1 : 1))
    const obstacle = useRef()
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        if (obstacle?.current) {
            obstacle.current.setNextKinematicRotation(rotation)    
        }
    })

    return <group position={position}>
        {/* floor */}
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position-y={-0.1}
            scale={[4,0.2,4]}
            receiveShadow />
        <RigidBody
            ref={obstacle}
            type={'kinematicPosition'}
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                scale={[3.5,0.3,0.3]}
                geometry={boxGeometry}
                material={obstacleMaterial}
                castShadow
                receiveShadow />
        </RigidBody>
    </group>
}

function BlockLimbo({ position = [0, 0, 0] }) {
    const [timeOffset] = useState(() => Math.random()*Math.PI*2)
    const obstacle = useRef()
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const y = Math.sin(time + timeOffset) + 1.2
        obstacle.current.setNextKinematicTranslation({ x: position[0], y:position[1]+y, z: position[2] })
    })

    return <group position={position}>
        {/* floor */}
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position-y={-0.1}
            scale={[4,0.2,4]}
            receiveShadow />
        <RigidBody
            ref={obstacle}
            type={'kinematicPosition'}
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                scale={[3.5,0.3,0.3]}
                geometry={boxGeometry}
                material={obstacleMaterial}
                castShadow
                receiveShadow />
        </RigidBody>
    </group>
}

function BlockAxe({ position = [0, 0, 0] }) {
    const [timeOffset] = useState(() => Math.random()*Math.PI*2)
    const obstacle = useRef()
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const x = Math.sin(time + timeOffset) * 1.25
        if (obstacle?.current) {
            obstacle.current.setNextKinematicTranslation({ x: position[0]+x, y:position[1]+0.7, z: position[2] })   
        }
    })

    return <group position={position}>
        {/* floor */}
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position-y={-0.1}
            scale={[4,0.2,4]}
            receiveShadow />
        <RigidBody
            ref={obstacle}
            type={'kinematicPosition'}
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                scale={[1.5,1.1,0.3]}
                geometry={boxGeometry}
                material={obstacleMaterial}
                castShadow
                receiveShadow />
        </RigidBody>
    </group>
}

function Bounds({length = 1}) {
    return <>
        <RigidBody type={'fixed'}
            friction={0}
            restitution={0.2}
        >
            <mesh
                scale={[0.3, 1.5, 4 * length]}
                position={[2.15, 0.75, - (length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                castShadow
            />
            
            <mesh
            scale={[0.3, 1.5, 4 * length]}
            position={[-2.15, 0.75, - (length * 2) + 2]}
            geometry={boxGeometry}
            material={wallMaterial}
            receiveShadow
            />
            
            <CuboidCollider
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, -(length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    </>
}

function Level({ count = 4, types = [BlockSpinner, BlockAxe, BlockLimbo] }) {
    const blockSeed = useGame(s => s.blockSeed)

    const blocks = useMemo(() => {
        const blocks = []
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * types.length)
            blocks.push(types[randomIndex])
        }
        return blocks
    }, [count, types, blockSeed])
    
    const obstacles = useMemo(() => {
        return blocks.map((Block, i) => {
            return <Block position={[0,0,(i+1)*-4]}  key={"block"+i} />
        })
    },[blocks])

    return (
        <>
            <BlockStart position={[0, 0, 0]} />
            {obstacles}
            <BlockEnd position={[0, 0, -(count + 1) * 4]} />
            <Bounds length={count+2} />
        </>
    )
}

export { Level, BlockSpinner, BlockAxe, BlockLimbo}

