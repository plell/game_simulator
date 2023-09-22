import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Euler, Group, Quaternion, Vector3 } from "three";


const reuseableVec = new Vector3();

type Props = {
    ref: React.MutableRefObject<Group | RapierRigidBody | null>
    strength?: number
}

const tiltStrength = 0.2

const positionOrigin = new Vector3()
const quaternion = new Quaternion()
const euler = new Euler()

export const useFollowCursor = ({ ref, strength = 20 }: Props) => {

    useFrame(({ mouse }) => {
        if (ref?.current) {

            if (ref.current instanceof RapierRigidBody) {
                const newX = mouse.x * strength
                const newY = mouse.y * strength
                const translation = ref.current.translation();
                positionOrigin.set(translation.x,translation.y,translation.z)
                const position = reuseableVec.set(newX, newY, 0)
                ref.current.setTranslation(positionOrigin.lerp(position,0.2), true)
                
                const rotation = quaternion.set(0,0,0,0)
                rotation.setFromEuler(euler.set(0, 0, (newX - translation.x) * -tiltStrength), true)
                
                ref.current.setNextKinematicRotation(rotation)
            }
            
            else {
                const newX = mouse.x * 15
                const position = ref.current.position;
                const rotation = ref.current.rotation;
                const destination = reuseableVec.set(newX, position.y, position.z);
                position.lerp(destination, 0.09);
                rotation.y = (newX - position.x) * tiltStrength
            }
        
            
                
        }
    });
}