import create from 'zustand'
import { defaultTempo, generatedWorld, initialEnemyState, initialZones } from './constants'
import { NextWorldTile, Patterns, Players, WorldTile, Zone } from './types'

const initialGameState = {
    players: {},
    enemies: initialEnemyState,
    zones: initialZones,
    world: generatedWorld.worldTiles,
    patterns: generatedWorld.worldPatterns,
    worldTile: generatedWorld.worldTiles.filter(f => !f.shrine)[Math.floor(Math.random() * generatedWorld.worldTiles.filter(f => !f.shrine).length)],
    discoveredWorldTiles: [],
    nextWorldTile: null,
    
    tempo: defaultTempo,
    snapTo: false,
}

type GameState = {
    tempo: number
    players: Players
    enemies: Players
    zones: Zone[]
    patterns: Patterns
    world: WorldTile[]
    
    worldTile: WorldTile
    discoveredWorldTiles: number[]
    snapTo: boolean
    nextWorldTile: NextWorldTile | null
    setTempo: (tempo: number) => void
    
    setPlayers: (players: Players) => void
    setEnemies: (enemies: Players) => void
    setPatterns: (patterns: Patterns) => void
    setZones: (zones: Zone[]) => void
    setWorld: (world: WorldTile[]) => void
    setWorldTile: (worldTile: WorldTile) => void
    setDiscoveredWorldTiles: (discoveredWorldTiles: number[]) => void
    setNextWorldTile: (nextWorldTile: NextWorldTile | null) => void
    setTempoUp: () => void,
    setTempoDown: () => void,
    setSnapTo: (snapTo:boolean) => void,
    restartGame: () => void,
}

export default create<GameState>((set, get) => ({
    ...initialGameState,
    setTempoUp: () => {
        const tempo = get().tempo + 2

        if (tempo <= 70) {
            set({ tempo })
        }

    },
    setTempoDown: () => {
        const tempo = get().tempo - 2

        if (tempo >= 0) {
            set({ tempo })
        }

    },
    setTempo: (tempo) => set({ tempo }),
    setSnapTo: (snapTo) => set({ snapTo }),
   
    setPlayers: (players) => set({ players }),
    setEnemies: (enemies) => set({ enemies }),
    setPatterns: (patterns) => set({ patterns }),
    setZones: (zones) => set({ zones }),
    setWorld: (world) => set({ world }),
    setWorldTile: (worldTile) => set({ worldTile }),
    setNextWorldTile: (nextWorldTile) => set({ nextWorldTile }),
    setDiscoveredWorldTiles: (discoveredWorldTiles) => set({ discoveredWorldTiles }),
    restartGame: () => {
        const {players} = get()
        const {p1} = players
        p1.health = 100
        p1.dead = false

        players.p1 = p1

        set({ players })
    },
}))
