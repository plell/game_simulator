import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";


const reuseableVec = new Vector3();

type Props = {
    ref: React.MutableRefObject<Group | null>
}

const tiltStrength = 0.2

export const useFollowCursor = ({ ref }: Props) => {
    useFrame(({ mouse }) => {
        if (ref?.current) {
            const position = ref.current.position;
            const rotation = ref.current.rotation;
            const newX = mouse.x * 15
            
            const destination = reuseableVec.set(newX, position.y, position.z);
            position.lerp(destination, 0.09);

            rotation.y = (newX - position.x) * tiltStrength
        }
    });
}