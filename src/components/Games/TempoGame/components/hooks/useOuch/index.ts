import { useEffect, useState } from "react"


export const useOuch = (health:number) => {

    const [ouch, setOuch] = useState(false);

    useEffect(() => {
        if (health < 100) {    
            setOuch(true);

            setTimeout(() => {
            setOuch(false);
            }, 100);    
        }
    },[health])

    return ouch
}