import { useFrame } from "@react-three/fiber"
import { experienceProperties } from "../../../../Stores/constants"
import useGame from "../../../../Stores/useGame"
import { Vector3 } from "three"

const vec = new Vector3()

export const useGooseNeck = () => {
    const game = useGame(s=>s.game)

    useFrame(({mouse, camera}) => {
        const position = experienceProperties[game]?.cameraPosition
        if (position) {
            const x = mouse.x * 0.5
            const y = mouse.y
            
            camera.position.lerp(vec.set(position.x + x,position.y + y,position.z ),0.05)
        }
    })

}