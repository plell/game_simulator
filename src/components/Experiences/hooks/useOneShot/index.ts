import { useMemo, useState } from "react";


export const useOneShot = (url:string) =>{

  const context = useMemo(()=>new (window.AudioContext || window.webkitAudioContext)(),[]) 

  const play = async () => {

    const res = await fetch(url);
    const source = context.createBufferSource();
    const buffer = await res.arrayBuffer();
    source.buffer = await new Promise((res) =>
      context.decodeAudioData(buffer, res)
    );
    
    // Create gain node 
    const gain = context.createGain();
    source.connect(gain);
    

    gain.connect(context.destination);

    source.onended = () => {
      source.stop()
      gain.disconnect();
      stop()
    }

    source.start(0)
    
  }


  return { play, stop }
}
  
  
  