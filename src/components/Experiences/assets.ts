
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";

// models
const gltfLoader = new GLTFLoader()
export const crocModel = gltfLoader.load("./models/croc_less.gltf");
export const crocArch = gltfLoader.load("./models/crocArch.gltf");
export const crocWall = gltfLoader.load("./models/crocWall.gltf");
export const spaceshipModel = gltfLoader.load("./models/spaceship.gltf");

// textures
const textureLoader = new TextureLoader()
export const earthMapTexture = textureLoader.load("textures/earth/earth.jpeg");
export const bumpMapTexture = textureLoader.load("textures/earth/bump.jpeg");
export const waterMapTexture = textureLoader.load("textures/earth/water.png");
export const galaxyMapTexture = textureLoader.load("textures/earth/galaxy.png");
export const cloudsMapTexture = textureLoader.load("textures/earth/clouds.png");