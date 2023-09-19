import { Vector3 } from "three";


export const debounce = (fn: () => void, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: []) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const defaultTempo = 40

const bufferTimeouts: Record<string, ReturnType<typeof setTimeout>> = {}

export const postDebounce = (key:string, fn: () => void, ms = 300) => {
  if (!bufferTimeouts[key]) {
    fn()
    bufferTimeouts[key] = setTimeout(() => {
      if (bufferTimeouts[key]) {
        clearTimeout(bufferTimeouts[key])
        delete bufferTimeouts[key]
      }
    }, ms)
  }
};


type GamePosition = {
  cameraPosition: Vector3
  cameraTarget: Vector3
  gamePosition: Vector3
}

export const gamePositions: Record<number, GamePosition> = {
  0: {
    cameraPosition: new Vector3(0, 20, 16),
    cameraTarget: new Vector3(0, 7, 0),
    gamePosition: new Vector3(0, 0, 0),
  },
  1: {
    cameraPosition: new Vector3(50, 0, 23),
    cameraTarget: new Vector3(50, 0, 0),
    gamePosition: new Vector3(50, 0, 0),
  }
  
}
