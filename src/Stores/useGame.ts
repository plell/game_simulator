import create from 'zustand'

const initialGameState = {
    game:0,
    hit: 0,
    bite: 0,
    mouseDown: false,
    win:false,
    locked: false,
    lockClicked: false,
    selectedDonutIds:[],
    score: 0,
    damage: 0,
    cameraPosition: 0
}

type GameState = {
    game: number
    hit: number
    locked: boolean
    lockClicked: boolean
    bite: number
    win:boolean
    score: number
    mouseDown:boolean
    damage: number
    selectedDonutIds: string[]
    cameraPosition: number
    setGame: (game: number) => void
    setWin: (win: boolean) => void
    setMouseDown: (mouseDown: boolean) => void
    setLocked: (locked: boolean) => void
    setLockClicked: (lockClicked: boolean) => void
    
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
    setGame: (game) => {
        set({ game, win:false })
    },
    setLocked: (locked) => set({ locked }),
    setLockClicked: (lockClicked) => set({ lockClicked }),
    setHit: (hit) => set({ hit }),
    setBite: (bite) => set({ bite }),
    setMouseDown: (mouseDown) => set({ mouseDown }),
    setScore: (score) => set({ score }),
    scoreUp: () => set({ score: get().score + 1 }),
    setWin: (win) => set({ win }),
    
    setDamage: (damage) => set({ damage }),
    damageUp: () => set({ damage: get().damage + 1 }),
    setCameraPosition: (cameraPosition) => set({ cameraPosition }),
    setSelectedDonutIds: (selectedDonutIds) => set({ selectedDonutIds }),

}))
