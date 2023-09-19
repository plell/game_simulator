import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";


const reuseableVec = new Vector3();

type Props = {
    ref: React.MutableRefObject<Group | null>
}

export const useFollowCursor = ({ ref }: Props) => {
    useFrame(({ mouse }) => {
        if (ref?.current) {
            const pos = ref.current.position;
            const destination = reuseableVec.set(mouse.x * 15, pos.y, pos.z);
            pos.lerp(destination, 0.09);
        }
    });
}