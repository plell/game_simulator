import { RapierRigidBody } from "@react-three/rapier"
import { Group, Vector3 } from "three"

export type PlayerPosition = Vector3

export type Players = Record<string, Player>

export type WorldTileRef = React.MutableRefObject<Group | null> | null

export type Player = {
    id: string | number
    body: React.MutableRefObject<RapierRigidBody | null> | null
    health: number
    type: string
    dead: boolean
}

export type Zone = {
    position: Vector3
    height: number;
    width: number;
    color: string;
    value: number;
}

export type Patterns = Record<string, Pattern>

export type Note = {
    body: React.MutableRefObject<RapierRigidBody | null> | null
    id: string
    step: number
    position: Vector3
    pitch: number
}

export type Notes = Record<string, Note>

export type Pattern = {
    stepCount: number
    notes: Notes
    key: string
}

export type TilePosition = {
    row: number
    column: number
}

export type Direction = 'left' | 'right' | 'top' | 'bottom'

export type Shrine = {
    position: Vector3
    color: string
}

export type Structure = {
    id: string;
    health: number;
    dead: boolean;
    position: Vector3
    color: string
    type: 'house' | 'fountain' | 'statue' | 'station'
}

export type Structures = Record<string, Structure>

export type WorldTile = {
    position: TilePosition
    shrine: Shrine | null
    color: string
    id: number
    patternId: string
    structures: Structures
}

export type NextWorldTile = {
    relativeDirection: Direction
    worldTile: WorldTile
}

export type Interval = ReturnType<typeof setInterval> | null;
export type Timeout = ReturnType<typeof setTimeout> | null;

export type RigidBodyData = {
    type: 'enemy' | 'wall' | 'sensor' | 'player'
    name?: Direction | 'p1'
    strength?: number
}
