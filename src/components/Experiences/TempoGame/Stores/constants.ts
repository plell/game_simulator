import { Vector3 } from "three";
import { v4 as uuidv4 } from "uuid";
import { Direction, Notes, Patterns, Players, Structures, TilePosition, WorldTile } from "./types";

// make a record with keys, so that tiles can have different scale keys
// later associate color with scale keys
const majorScales = {
  'A': ['A2', 'B2', 'C#3', 'D3', 'E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5'],
  'A#': ['A#2', 'C3', 'D3', 'D#3', 'F3', 'G3', 'A3', 'A#3', 'C4', 'D4', 'D#4', 'F4', 'G4', 'A4', 'A#4', 'C5', 'D5', 'D#5', 'F5', 'G5', 'A5'],
  'B': ['B2', 'C#3', 'D#3', 'E3', 'F#3', 'G#3', 'A#3', 'B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4', 'B4', 'C#5', 'D#5', 'E5', 'F#5', 'G#5', 'A#5'],
  'C': ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'],
  'C#': ['C#3', 'D#3', 'F3', 'F#3', 'G#3', 'A#3', 'C4', 'C#4', 'D#4', 'F4', 'F#4', 'G#4', 'A#4', 'C5', 'C#5', 'D#5', 'F5', 'F#5', 'G#5', 'A#5', 'C6'],
  'D': ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6'],
  'D#': ['D#3', 'F3', 'G3', 'G#3', 'A#3', 'C4', 'D4', 'D#4', 'F4', 'G4', 'G#4', 'A#4', 'C5', 'D5', 'D#5', 'F5', 'G5', 'G#5', 'A#5', 'C6', 'D6'],
  'E': ['E3', 'F#3', 'G#3', 'A3', 'B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5', 'F#5', 'G#5', 'A5', 'B5', 'C#6', 'D#6'],
  'F': ['F3', 'G3', 'A3', 'A#3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'A#4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'A#5', 'C6', 'D6', 'E6'],
  'F#': ['F#3', 'G#3', 'A#3', 'B3', 'C#4', 'D#4', 'F4', 'F#4', 'G#4', 'A#4', 'B4', 'C#5', 'D#5', 'F5', 'F#5', 'G#5', 'A#5', 'B5', 'C#6', 'D#6'],
  'G': ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6', 'F#6'],
  'G#': ['G#3', 'A#3', 'C4', 'C#4', 'D#4', 'F4', 'G4', 'G#4', 'A#4', 'C5', 'C#5', 'D#5', 'F5', 'G5', 'G#5', 'A#5', 'C6', 'C#6', 'D#6', 'F6', 'G6'],
};

export const ALL_NOTES: Record<string, string[]> = majorScales

const ALL_KEYS = Object.keys(ALL_NOTES).map((n:string)=>n)

export const columnLimit = 15

export const controls = [
    {
        name: 'up',
        keys: ['ArrowUp', 'KeyW']
    },
    {
        name: 'down',
        keys: ['ArrowDown', 'KeyS']
    },
    {
        name: 'left',
        keys: ['ArrowLeft', 'KeyA']
    },
    {
        name: 'right',
        keys: ['ArrowRight', 'KeyD']
    },
      {
        name: 'space',
        keys: ['Space']
      },
]

const gridX = 0
const gridY = 0
const gridZ = -1
const gridWidth = 30
const gridHeight = 20

export const grid = {
    x: gridX,
    y: gridY,
    z: gridZ,
    width: gridWidth,
    height: gridHeight,
    left: gridX - gridWidth/2,
    right:gridX + gridWidth/2,
    top: gridY + gridHeight/2,
    bottom: gridY - gridHeight/2,
}

export const getNoteGridPosition = (step: number, stepCount: number) => {
  const stepWidth = grid.width / stepCount;
  return step * stepWidth - grid.width / 2;
};

const randomColor = () => `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;


function generateWorld() {
  const totalTiles = 200
  const shrineCount = 20

  const worldTiles: WorldTile[] = []
  const worldPatterns: Patterns = {
    'shrine': {
      stepCount: 0,
      notes: {},
      key:'A'
  }}

  let row = 0
  let column = 0

  for (let i = 0; i < totalTiles; i += 1){

    const patternId = uuidv4()
    worldTiles.push({
      position: {
          row,
          column
      },
      color: randomColor(),
      id: i,
      patternId,
      structures: generateStructures(),
      shrine: null
    })

    worldPatterns[patternId] = generatePattern()

    column += 1

    if (column > columnLimit) {
      row += 1
      column = 0
    }
  }

  for (let i = 0; i < shrineCount; i+=1){
    // place castles
    const index = Math.floor(Math.random() * totalTiles)

    worldTiles[index].shrine = {
      position: new Vector3(grid.top - grid.height/2,grid.right- grid.width/2,0),
      color: randomColor()
    }
    worldTiles[index].patternId = 'shrine'
  }



  return { worldTiles, worldPatterns }
}

export const generatedWorld = generateWorld()

export const MOVEMENT_DAMPING = 5

const origin = new Vector3()

export const getMovement = (from: Vector3, to: Vector3, speed = 1, tempo: number | boolean = 40) => {
  const amp = 30

  const ratio = typeof tempo === 'number' ? (tempo / defaultTempo) : 1

  const distance = from.distanceTo(to)

  if (distance < .3) {
    return origin
  }

  const movement = to.sub(from).normalize()

  movement.x *= ratio * speed * amp
  movement.y *= ratio * speed * amp

  return movement
}


export const getPushMovement = (pusher: Vector3, pushed: Vector3,) => {
  const amp = 3

  const direction = pushed.sub(pusher).normalize()
  direction.x *= amp
  direction.y *= amp

  return direction
}



type WallCheck = {
    name: Direction;
    check: (position: TilePosition) => TilePosition;
  };

  const directionsCheck: WallCheck[] = [
    {
      name: "right",
      check: (position: TilePosition) => ({
        ...position,
        column: position.column + 1,
      }),
    },
    {
      name: "left",
      check: (position: TilePosition) => ({
        ...position,
        column: position.column - 1,
      }),
    },
    {
      name: "top",
      check: (position: TilePosition) => ({
        ...position,
        row: position.row - 1,
      }),
    },
    {
      name: "bottom",
      check: (position: TilePosition) => ({
        ...position,
        row: position.row + 1,
      }),
    },
  ];

export type NeighborTiles = {
    top: WorldTile | null
    right: WorldTile | null
    left: WorldTile | null
    bottom: WorldTile | null
}

export const getNeighborTiles = (worldTilePosition: TilePosition) => {
    const neighborTiles: NeighborTiles = {
        'top': null,
        'right': null,
        'left': null,
        'bottom': null,
    }

    directionsCheck.forEach((d) => {
        const { row, column } = d.check(worldTilePosition);

        const tileFound = generatedWorld.worldTiles.find(
          (f) => f.position.row === row && f.position.column === column
        );

        if (tileFound) {
            neighborTiles[d.name] = tileFound
        }
    });

    return neighborTiles
}




function generatePattern() {
  const noPattern = false
  const stepCount = 8

  const randomKey = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)]

  const notes: Notes = {}

  const usedX:number[] = []

  for (let i = 0; i < stepCount; i += 1){

    const skip = Math.random() > 0.9

    if (skip) {
      continue
    }

    const randomStep = Math.floor(Math.random() * stepCount)
    const randomY = Math.floor(Math.random() * grid.height)

    const id = uuidv4()
    const x = getNoteGridPosition(randomStep, stepCount)

    if (noPattern||usedX.includes(x)) {
      continue
    }

    usedX.push(x)

    notes[id] = {
        id,
        body: null,
        step: randomStep,
        position: new Vector3(x,randomY-(grid.height / 2),0),
        pitch: randomY
    }
  }

  return {
    stepCount,
    notes,
    key:randomKey
  }
}

function generateStructures() {
  const structureCount = Math.floor(Math.random() * 3)

  const structures: Structures = {}

  for (let i = 0; i < structureCount; i += 1){
    const randomY = Math.floor(Math.random() * grid.height) - (grid.height / 2)
    const randomX = Math.floor(Math.random() * grid.width) - (grid.width / 2)

    const id = uuidv4()
    structures[id] = {
      id,
      dead: false,
      color: randomColor(),
      health:100,
      position: new Vector3(randomX,randomY,-0.3),
      type:'house'
    }
  }

  return structures
}

export const initialEnemyState: Players = {};

export const zoneWidth = grid.width / 4
export const zoneHeight = grid.height
export const zoneZ = -0.5

const zoneLeft = grid.left + zoneWidth/2

export const initialZones = [
    {
      position: new Vector3(zoneLeft, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "red",
      value: 2,
    },
    {
      position: new Vector3(zoneLeft+zoneWidth, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "blue",
      value: 3,
    },
    {
      position: new Vector3(zoneLeft+zoneWidth*2, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "teal",
      value: 4,
    },
    {
        position: new Vector3(zoneLeft+zoneWidth*3, 0, zoneZ),
        width: zoneWidth,
        height: zoneHeight,
        color: "lime",
        value: 8,
      },
]

export const debounce = (fn: () => void, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: []) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const defaultTempo = 10

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
