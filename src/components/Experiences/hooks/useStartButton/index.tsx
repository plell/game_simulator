import { useEffect, useState } from "react";

export const useStartButton = () => {
  const [ready, setReady] = useState(false);

  const handleClick = () => {
    setReady(true);
  };

  useEffect(() => {
    const wrapper = document.createElement("div");

    wrapper.className = "clickStartWrap";

    const button = document.createElement("div");
    button.innerHTML = "Click to start";
    button.className = "clickStartButton";

    button.onpointerdown = () => {
      button.remove();
      wrapper.remove();

      setTimeout(() => {
        handleClick();
      }, 200);
    };

    wrapper.appendChild(button);

    const anchor = document.getElementById("anchor");

    if (anchor) {
      anchor.appendChild(wrapper);
    }

    return () => {
      button.remove();
      wrapper.remove();
    };
  }, []);

  return { ready };
};
