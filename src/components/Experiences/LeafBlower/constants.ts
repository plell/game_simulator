import { BoxGeometry, CylinderGeometry, TorusGeometry } from "three"

export type LevelProps = {
    color: string
    dimensions: number[]
    position: number[]
    geometry: CylinderGeometry|BoxGeometry
    boundaryGeometry: TorusGeometry | BoxGeometry
    boundaryRotation: number
}
