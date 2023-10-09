import { useFrame } from "@react-three/fiber"
import { experienceProperties } from "../../../../Stores/constants"
import useGame from "../../../../Stores/useGame"
import { Vector3 } from "three"
import { CameraControls } from "@react-three/drei"
import { MutableRefObject } from "react"

const vec = new Vector3()

export const useGooseNeck = (cameraControls: MutableRefObject<CameraControls|null>) => {
    const game = useGame(s=>s.game)

    useFrame(({mouse}) => {
        const position = experienceProperties[game]?.cameraPosition
        if (position) {
            const x = mouse.x *10
            const y = mouse.y * 10

            cameraControls.current?.setTarget(x,y,0,true)
            
            // camera.position.lerp(vec.set(position.x + x,position.y + y,position.z ),0.05)
        }
    })

}