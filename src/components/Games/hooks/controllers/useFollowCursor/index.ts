import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { Euler, Group, Quaternion, Vector3 } from "three";


const reuseableVec = new Vector3();

type Props = {
    ref: React.MutableRefObject<Group | RapierRigidBody | null>
    lockY?: boolean
    disabled?: boolean
    strength?: number
}

const tiltStrength = 0.1

const positionOrigin = new Vector3()
const quaternion = new Quaternion()
const euler = new Euler()

export const useFollowCursor = ({ ref, lockY, disabled, strength = 20 }: Props) => {

    useFrame(({ mouse }) => {

        if (!disabled&&ref?.current) {

            if (ref.current instanceof RapierRigidBody) {
                const translation = ref.current.translation();
                const newX = mouse.x * strength
                const newY = lockY ? translation.y : mouse.y * strength
                
                positionOrigin.set(translation.x,translation.y,translation.z)
                const position = reuseableVec.set(newX, newY, 0)
                ref.current.setTranslation(positionOrigin.lerp(position,0.1), true)
                
                const rotation = quaternion.set(0,0,0,0)
                rotation.setFromEuler(euler.set(0, 0, (newX - translation.x) * -tiltStrength), true)
                
                ref.current.setNextKinematicRotation(rotation)
            }
            
            else {
                const newX = mouse.x * 15
                const newY = mouse.y * 2
                const position = ref.current.position;
                const rotation = ref.current.rotation;
                const destination = reuseableVec.set(newX, newY, position.z);
                position.lerp(destination, 0.09);
                rotation.y = (newX - position.x) * tiltStrength
            }       
        }
    });
}