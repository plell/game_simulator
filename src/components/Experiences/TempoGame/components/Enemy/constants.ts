import { SpriteAnimator } from "@react-three/drei";
import { MeshBasicMaterial, SphereGeometry, TextureLoader } from "three";

// export const spriteAnimator:any = SpriteAnimator({
//         position:[0, 0, 0],
//         startFrame:1,
//         fps:10,
//         autoPlay:true,
//         loop:true,
//         numberOfFrames:4,
//         alphaTest:0.01,
//         textureImageURL:"sprites/enemy_sprites.png",
//         textureDataURL:"sprites/enemy_sprites.json"
// })

export const sphereGeometry = new SphereGeometry(0.4)

const textureLoader = new TextureLoader()

const enemySprite = textureLoader.load("sprites/enemy_sprites.png")

export const spriteMaterial = new MeshBasicMaterial({
    color:'black'
})

