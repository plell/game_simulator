import { useFrame } from "@react-three/fiber";
import {  MutableRefObject, useMemo, useState } from "react";
import { Box3, Group, Mesh } from "three";

type IntersectObject = MutableRefObject<Mesh | Group | null>

export const useObjectsIntersect = (objectA: IntersectObject, objectB: IntersectObject) => {
    const [objectsIntersect, setObjectsIntersecting] = useState(false);
    
    const boundingBoxA = useMemo(() => new Box3(), []);
    const boundingBoxB = useMemo(() => new Box3(), []);

    useFrame(() => {
      if (objectA?.current && objectB?.current) {
            boundingBoxA.setFromObject(objectA.current);
            boundingBoxB.setFromObject(objectB.current);
    
        if (boundingBoxA.intersectsBox(boundingBoxB)) {
                if (!objectsIntersect) {
                    setObjectsIntersecting(true);
                }
              } else if (objectsIntersect) {
                setObjectsIntersecting(false);
              }    
        }
    })


  return { objectsIntersect };
};
