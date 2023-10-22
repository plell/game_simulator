import { useEffect, useState } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import { addEffect } from '@react-three/fiber';
import useGame from "./stores/useGame";

export default function Interface() {

    const [time, setTime] = useState(0)
    const {forward,backward,left,right,jump} = useKeyboardControls((state) => state)
    const [restart, phase, startTime, endTime] = useGame(s => [s.restart, s.phase, s.startTime, s.endTime])

    

    useEffect(() => {

        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState()
            let elapsedTime = 0

            if (state.phase === 'playing') {
                elapsedTime = Date.now() - state.startTime
            } else if (state.phase === 'ended') {
                elapsedTime = state.endTime - state.startTime
            }
            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)
            setTime(elapsedTime)
        })

        return () => {
            restart()
            unsubscribeEffect()
        }
    },[])

    return <div className="interface">
        <div className="time">
            {time}
        </div>

        {phase === 'ended' && <div className="restart" onClick={() => restart()}>
            Restart
        </div>}

        {/* Controls */}
    <div className="controls">
        <div className="raw">
                <div className={`key ${forward&&'active'}`} />
        </div>
        <div className="raw">
            <div className={`key ${left&&'active'}`} />
            <div className={`key ${backward&&'active'}`} />
            <div className={`key ${right&&'active'}`} />
        </div>
        <div className="raw">
            <div className={`key large ${jump&&'active'}`} />
        </div>
    </div>

    </div>
}