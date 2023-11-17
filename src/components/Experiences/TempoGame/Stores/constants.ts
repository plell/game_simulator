import { Vector3 } from "three";
import { v4 as uuidv4 } from "uuid";
import { Direction, Notes, Patterns, Players, Structures, TilePosition, WorldTile } from "./types";

// make a record with keys, so that tiles can have different scale keys
// later associate color with scale keys

const minor7Scales = {
  'C': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'C#': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
  'Db': [ 'Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bbb',],
  'D': ['C', 'D', 'E', 'F', 'G', 'A', 'Bb', ],
  'Eb': ['Cb', 'Db','Eb', 'F', 'Gb', 'Ab', 'Bb', ],
  'E': ['C', 'D', 'E', 'F#', 'G', 'A', 'B', ],
  'F': ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', ],
  'F#': ['C#', 'D', 'E', 'F#', 'G#', 'A', 'B', ],
  'G': ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
  'Ab': ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb'],
  'A': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  'Bb': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
  'B': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
};

const major7Scales = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'C#': ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
};

const scales = { ...minor7Scales, ...major7Scales }

export const ALL_NOTES: Record<string, string[]> = {
  "A": [
    'A2', 'B2', 'C#3', 'D#3', 'E3', 'F#3', 'G#3',
    'A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G#4',
    'A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5',
  ],
  'Ab': [
    'Ab2', 'Bb2', 'Cb3', 'Db3', 'Eb3', 'Fb3', 'Gb3',
    'Ab3', 'Bb3', 'Cb4', 'Db4', 'Eb4', 'Fb4', 'Gb4',
    'Ab4', 'Bb4', 'Cb5', 'Db5', 'Eb5', 'Fb5', 'Gb5',
  ],
  "B": [
    'A#2', 'B2', 'C#3', 'D#3', 'E#3', 'F#3', 'G#3',
    'A#3', 'B3', 'C#4', 'D#4', 'E#4', 'F#4', 'G#4',
    'A#4', 'B4', 'C#5', 'D#5', 'E#5', 'F#5', 'G#5',
  ],
  "C": [
    'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3',
    'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4',
    'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5',
  ],
  
  
}

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
  const stepCount = 20

  const randomKey = ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)]

  const notes: Notes = {}

  const usedX:number[] = []

  for (let i = 0; i < stepCount; i += 1){

    const skip = Math.random() > 0.5

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
