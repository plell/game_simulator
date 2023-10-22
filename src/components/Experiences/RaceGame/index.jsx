
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.js'
import { Stars } from '@react-three/drei'

export const RaceGame = () =>
{

    const blocksCount = useGame(state=>state.blocksCount)
    return <>
        <Lights />
        <Stars radius={200}
          depth={10}
          count={3000}
          factor={4}
          saturation={0.5}
          // fade
          speed={1} />
            <Level count={blocksCount} />
            <Player/>
    </>
}