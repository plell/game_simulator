import { Vector3 } from "three";
// import { TempoGame } from "../components/Experiences/TempoGame";
import { Earth } from "../components/Experiences/Earth";
import { SpaceGame } from "../components/Experiences/SpaceGame";
import { CrocGame } from "../components/Experiences/CrocGame";
import { LeafBlower } from "../components/Experiences/LeafBlower";
import { RaceGame } from "../components/Experiences/RaceGame";
import Interface from "../components/Experiences/RaceGame/Interface";
import { Donut } from "../components/Experiences/Donut";
import { Psychedelic } from "../components/Experiences/Psychedelic";
import { Climb } from "../components/Experiences/Climb";
import { AudioShader } from "../components/Experiences/AudioShader";
// import { WhackASoul } from "../components/Experiences/WhackASoul";

const { origin } = window.location

export const isDevelopment = !!(
  origin === 'http://localhost:3000' ||
  origin === 'http://localhost:5173'
)

var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");

export const browserIsChrome = isIOSChrome || (isChromium !== null &&
  typeof isChromium !== "undefined" &&
  vendorName === "Google Inc." &&
  isOpera === false &&
  isIEedge === false)


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
  cameraNear: number
  cameraFar:number
  
  gamePosition: Vector3
  title: string
  description: string
  instructions?: string
  cameraControls: boolean
  backgroundColor?: string
  game: () => JSX.Element
  uiComponent?: () => JSX.Element
  showAboutMe?: boolean
  killCameraControls?:boolean
}

export const DEAD_ZONE_Y = 5000

export const experienceProperties: ExperienceProps[] = [
  
  {
    cameraPosition: new Vector3(0, 0, 29),
    cameraTarget: new Vector3(0, 0, 0),
    gamePosition: new Vector3(0, 0, 0),
    cameraNear: 10,
    cameraFar: 2500,
    title: '',
    description: '',
    cameraControls: true,
    game: Earth,
    showAboutMe: true,
  },
  
   {
    cameraPosition: new Vector3(0,0,40),
    cameraTarget: new Vector3(0, 0, 0),
    cameraNear: 10,
    cameraFar: 2500,
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Drag to turn',
    cameraControls: true,
    backgroundColor:'hotpink',
    game: Donut,
    
  },
  {
    cameraPosition: new Vector3(0,40,168),
    cameraTarget: new Vector3(0, 0, 0),
    cameraNear: 10,
    cameraFar: 2500,
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Click to play',
    
    cameraControls: false,
    game: LeafBlower
  },
 
  {
    cameraPosition: new Vector3(0, 0, 33),
    cameraTarget: new Vector3(0, 0, 0),
    cameraNear: 10,
    cameraFar: 2500,
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    instructions: 'Click to play',
    
    cameraControls: false,
    game: SpaceGame
  },
  {
    cameraPosition: new Vector3(0, 0, 170),
    cameraTarget: new Vector3(0, 0, 0),
    cameraNear: 10,
    cameraFar: 2500,
    gamePosition: new Vector3(0, 0, 0),
    title: '',
    description: '',
    // instructions: 'Click to play',
    cameraControls: false,
    backgroundColor:'#000000',
    game: Psychedelic,
    // showAboutMe: true,
  },
 
]
