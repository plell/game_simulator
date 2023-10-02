import create from 'zustand'

const initialGameState = {
    game:0,
    hit: 0,
    bite: 0,
    selectedDonutIds:[],
    score: 0,
    damage: 0,
    cameraPosition: 0
}

type GameState = {
    game: number
    hit: number
    bite: number
    score: number
    damage: number
    selectedDonutIds: string[]
    cameraPosition: number
    setGame: (game: number) => void
    setHit: (hit: number) => void
    setBite: (bite: number) => void
    setScore: (score: number) => void
    setSelectedDonutIds: (selectedDonutIds: string[]) => void
    scoreUp: () => void
    setDamage: (damage: number) => void
    setCameraPosition: (cameraPosition: number) => void
    damageUp: () => void
}

export default create<GameState>((set, get) => ({
    ...initialGameState,
    setGame: (game) => set({ game }),
    setHit: (hit) => set({ hit }),
    setBite: (bite) => set({ bite }),
    setScore: (score) => set({ score }),
    scoreUp: () => set({ score: get().score + 1 }),
    
    setDamage: (damage) => set({ damage }),
    damageUp: () => set({ damage: get().damage + 1 }),
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),
    setSelectedDonutIds: (selectedDonutIds) => set({ selectedDonutIds }),

}))
