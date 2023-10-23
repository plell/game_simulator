import { Vector3 } from "three";

export const roomSize = 300;

export const colors = ["#DABE99", "#CF9F6E", "#9D6538", "#652817", "#33140A"];

export const boxPosition = new Vector3(0, 18, 50);


export const focusedScale = 12;
export const regularScale = 15;
export const normalScale = new Vector3(regularScale, regularScale, regularScale);

const randomVector = (r:number) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r]
const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
export const data = Array.from({ length: 1000 }, (r:number = 100) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }))
