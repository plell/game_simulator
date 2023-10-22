import { useControls } from "leva"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

const intensity = 0.5

export default function Lights()
{
    // const { intensity} = useControls('lights', {
    //     intensity: 0.5
    // })

    const light = useRef()

    useFrame((state) => {
        light.current.position.z = state.camera.position.z + 1 - 10
        light.current.target.position.z = state.camera.position.z - 10

        light.current.target.updateMatrixWorld()
        
    })

    return <>
        <directionalLight
            ref={light}
            castShadow
            position={ [ 4, 4, 1 ] }
            intensity={ 1.5 }
            shadow-mapSize={ [ 1024, 1024 ] }
            shadow-camera-near={ 1 }
            shadow-camera-far={ 10 }
            shadow-camera-top={ 10 }
            shadow-camera-right={ 10 }
            shadow-camera-bottom={ - 10 }
            shadow-camera-left={ - 10 }
        />
        <ambientLight intensity={ intensity } />
    </>
}