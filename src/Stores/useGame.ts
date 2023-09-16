import create from 'zustand'

const initialGameState = {
    hit: 0,
    bite: 0,
    score: 0,
    damage: 0 
}

type GameState = {
    hit: number
    bite: number
    score: number
    damage: number
    setHit: (hit: number) => void
    setBite: (bite: number) => void
    setScore: (score: number) => void
    scoreUp: () => void
    setDamage: (damage: number) => void
    damageUp: () => void
}

export default create<GameState>((set, get) => ({
    ...initialGameState,
    setHit: (hit) => set({ hit }),
    setBite: (bite) => set({ bite }),
    setScore: (score) => set({ score }),
    scoreUp: () => set({ score: get().score + 1 }),
    
    setDamage: (damage) => set({ damage }),
    damageUp: () => set({ damage: get().damage + 1 }),

}))
