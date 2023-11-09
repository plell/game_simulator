import { useEffect } from "react";
import { suspend } from "suspend-react";

export const useAudioAnalysis = (url:string) =>{
  // This will *not* re-create a new audio source, suspense is always cached,
  // so this will just access (or create and then cache) the source according to the url
  const { gain, context, data, source, update, getLowAvg, getHighAvg } = suspend(
    () => createAudio(url),
    [url]
  );

  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);
    // Disconnect it on unmount
    return () => {
      gain.disconnect();
    }
  }, [gain, context,source]);
    
  return { data, update, getLowAvg, getHighAvg }
}
  
const lowFrequencyMin = 20; // Adjust as needed
const lowFrequencyMax = 200; // Adjust as needed
const highFrequencyMin = 1000; // Adjust as needed
const highFrequencyMax = 5000; // Adjust as needed
  
  async function createAudio(url) {
    // Fetch audio data and create a buffer source
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const source = context.createBufferSource();
    source.buffer = await new Promise((res) =>
      context.decodeAudioData(buffer, res)
    );
    source.loop = true;
  
    source.start(0);
    // Create gain node and an analyser
    const gain = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount
    const lowPassFilter = context.createBiquadFilter();
    lowPassFilter.type = "bandpass";
    lowPassFilter.gain.value = 25;
    lowPassFilter.frequency.value = 50;
    lowPassFilter.Q.value = 6;
    
    analyser.connect(gain)
    source.connect(analyser);

    
    // The data array receive the audio frequencies
    const data = new Uint8Array(bufferLength);
    return {
      context,
      source,
      gain,
      data,
      // This function gets called every frame per audio source
      update: () => {
        analyser.getByteFrequencyData(data);
        // Calculate a frequency average
        return (data.avg = data.reduce(
          (prev, cur) => prev + cur / data.length,
          0
        ));
      },
      getLowAvg: () => {
        analyser.getByteFrequencyData(data);
        // Calculate a frequency average
        
        return (data.lowAvg = data
          .slice(
            0,1
          )
          .reduce((acc, val) => acc + val, 0))
      },
      getHighAvg: () => {
        analyser.getByteFrequencyData(data);
        // Calculate a frequency average
        
        return (data.highAvg = data
          .slice(
            bufferLength-20,
            bufferLength-1
          )
          .reduce((acc, val) => acc + val, 0))
      },
    };
  }
  