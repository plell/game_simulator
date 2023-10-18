import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import {  MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Group, Mesh, Vector3 } from "three";

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

type IntersectsManyObject = MutableRefObject<RapierRigidBody[] | null>

export const useObjectIntersectsMany = (objectA: IntersectObject, objects: IntersectsManyObject) => {
  
  const boundingBoxA = useMemo(() => new Box3(), []);
  const boundingBoxB = useMemo(() => new Box3(), []);

  const intersectingObjectCountRef = useRef<number>(0)

  const reuseableVec = useMemo(()=>new Vector3(),[])
  const reuseableVec2 = useMemo(()=>new Vector3(),[])

  useFrame(() => {
    if (objectA?.current && objects?.current) {
      boundingBoxA.setFromObject(objectA.current);
      let intersectingObjectsCount: number = 0

      objects.current.forEach((o) => {
        const { x, y, z } = o.translation()
        boundingBoxB.setFromCenterAndSize(reuseableVec.set(x, y, z), reuseableVec2.set(0.02, 0.02, 0.02));
        
        if (boundingBoxA.intersectsBox(boundingBoxB)) {
          intersectingObjectsCount += 1
        }
      })

      intersectingObjectCountRef.current = intersectingObjectsCount
    }
  })

  return intersectingObjectCountRef
};

type IntersectsManyGroupObject = MutableRefObject<Record<string,Mesh | Group | null>>

export const useObjectIntersectsManyB = (objectA: IntersectObject, objects: IntersectsManyGroupObject) => {
  
  const boundingBoxA = useMemo(() => new Box3(), []);
  const boundingBoxB = useMemo(() => new Box3(), []);

  const intersectingObjectCountRef = useRef<string[]>([])

  const reuseableVec = useMemo(()=>new Vector3(),[])
  const reuseableVec2 = useMemo(()=>new Vector3(),[])

  useFrame(() => {
    if (objectA?.current && objects?.current) {
      boundingBoxA.setFromObject(objectA.current);
      let intersectingObjectsCount: string[] = []

      Object.values(objects.current).forEach((o) => {
        if (!o) return
        const { x, y, z } = o.position
        boundingBoxB.setFromCenterAndSize(reuseableVec.set(x, y, z), reuseableVec2.set(0.02, 0.02, 0.02));
        
        if (boundingBoxA.intersectsBox(boundingBoxB)) {
          intersectingObjectsCount.push(o.userData.id)
        }
      })

      intersectingObjectCountRef.current = intersectingObjectsCount
    }
  })

  return intersectingObjectCountRef
};