import { Vector3 } from "three"

type Note = {
    id: number
    step: number
    pitch: number
}

type Pattern = {
    stepCount: number
    notes: Note[]
}

export const pattern: Pattern = {
    stepCount: 10,
    notes: [
        {
            id: 1,
            step: 1,
            pitch: 200

        },
        {
            id: 2,
            step: 2,
            pitch: 300

        },
        {
            id: 3,
            step: 7,
            pitch: 400

        },
        {
            id: 4,
            step: 9,
            pitch: 500
        }
    ]
}

type GridPositions = {
    distance: number
    position: Vector3 | null
}

export const getNearestGridPosition = (position: Vector3, intersections: Vector3[]) => {
    const nearest: GridPositions = {
        distance: Infinity,
        position:null
    }

    intersections.forEach((pos) => {
        const distance = position.distanceTo(pos);

        if (distance < nearest.distance) {
            nearest.distance = distance
            nearest.position = pos
        }
    })

    return nearest.position || position
}
