import { Vector3 } from "three";
import { CakeGame } from "../components/Experiences/CakeGame";
import { TempoGame } from "../components/Experiences/TempoGame";
import { Earth } from "../components/Experiences/Earth";
import { SpaceGame } from "../components/Experiences/SpaceGame";
import { CrocGame } from "../components/Experiences/CrocGame";
import { LeafBlower } from "../components/Experiences/LeafBlower";

const { origin } = window.location

export const isDevelopment = false
// !!(
//   origin === 'http://localhost:3000' ||
//   origin === 'http://localhost:5173'
// )

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
  backgroundColor?: string
  game: () => JSX.Element
  showAboutMe?: boolean
}

export const experienceProperties: ExperienceProps[] = [
  {
    cameraPosition: new Vector3(0, 0, 29),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Drag to turn the world. Take a look around.',
    cameraControls: true,
    game: Earth,
    showAboutMe: true
  },
  {
    cameraPosition: new Vector3(0,40,168),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Drag to turn the world. Take a look around.',
    cameraControls: false,
    game: LeafBlower
  },
  {
    cameraPosition: new Vector3(0,100,108),
    cameraTarget: new Vector3(0, -20, -20),
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: '',
    cameraControls: false,
    backgroundColor:'#ffffff',
    game: CakeGame,
  },
  {
    cameraPosition: new Vector3(0, 0, 23),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Click to',
    backgroundColor:'#000000',
    cameraControls: false,
    game: SpaceGame
  },

 
 
  
  // {
  //   cameraPosition: new Vector3(0, 0, 60),
  //   cameraTarget: new Vector3(0, 0, 0),
  //   gamePosition: new Vector3(0, 0, 0),
  //   title: 'Tempo Sneakers',
  //   description: 'A music adventure game.',
  //   instructions: 'The player moves toward the cursor. Click to drop a note, bait enemies toward notes to gain points.',
  //   cameraControls: false,
  //   game:TempoGame
  // },
  
  {
    cameraPosition: new Vector3(0, 18, 14),
    cameraTarget: new Vector3(0, 0, -5),
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Click to',
    cameraControls: false,
    backgroundColor:'#000000',
    game:CrocGame
  },
]
