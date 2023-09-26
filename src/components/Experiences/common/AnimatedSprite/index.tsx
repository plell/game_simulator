import { useEffect, useState } from "react";

export const CreateSpriteMaterial = (animationFrames: string[]) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrameIndex(
        (prevFrameIndex) => (prevFrameIndex + 1) % animationFrames.length
      );
    }, 100); // Adjust the interval based on your desired animation speed

    return () => clearInterval(frameInterval);
  }, []);

  return <spriteMaterial attach='material' map={animationFrames[frameIndex]} />;
};
