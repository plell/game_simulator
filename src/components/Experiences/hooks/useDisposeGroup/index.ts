
import {   MutableRefObject, useEffect, } from "react";
import {  Group, Mesh,  } from "three";


export const useDisposeGroup = (groupRef: MutableRefObject<Group|null>) => {

    useEffect(() => {
      return () => {
        groupRef?.current?.children?.forEach((c) => {
          if (c instanceof Mesh) {
            c.geometry.dispose()
            c.material.texture.dispose()
            c.material.dispose()
          }
        })
      }
    },[])


  return null
};
