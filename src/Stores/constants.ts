import { Vector3 } from "three";
import { CakeGame } from "../components/Experiences/CakeGame";
import { TempoGame } from "../components/Experiences/TempoGame";
import { Earth } from "../components/Experiences/Earth";
import { SpaceGame } from "../components/Experiences/SpaceGame";
import { CrocGame } from "../components/Experiences/CrocGame";


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

type ExperienceProps = {
  cameraPosition: Vector3
  cameraTarget: Vector3
  gamePosition: Vector3
  title: string
  description: string
  instructions: string
  cameraControls: boolean
  game: () => JSX.Element
}

export const experienceProperties: ExperienceProps[] = [
  {
    cameraPosition: new Vector3(0, 0, 23),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: 'Earth',
    description: 'Here you are.',
    instructions: 'Drag to turn the world. Take a look around.',
    cameraControls: true,
    game: Earth
  },

  {
    cameraPosition: new Vector3(0, 0, 23),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: 'Feed Two Birds with One Scone',
    description: 'The idea here is to feed the birds.',
    instructions: 'Click to',
    cameraControls: false,
    game: SpaceGame
  },
  {
    cameraPosition: new Vector3(0, 0, 60),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: 'Tempo Sneakers',
    description: 'A music adventure game.',
    instructions: 'The player moves toward the cursor. Click to drop a note, bait enemies toward notes to gain points.',
    cameraControls: false,
    game:TempoGame
  },
  
  {
    cameraPosition: new Vector3(0, 20, 16),
    cameraTarget: new Vector3(0, 7, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: 'Whac-a-croc',
    description: 'Remember this one?',
    instructions: 'Click to',
    cameraControls: false,
    game:CrocGame
  },
  {
    cameraPosition: new Vector3(0, 10, 40),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: 'Cake Drop',
    description: 'Balance the cake.',
    instructions: 'The player moves toward the cursor. Click to drop a note, bait enemies toward notes to gain points.',
    cameraControls: false,
    game: CakeGame
  },
  
  
]
