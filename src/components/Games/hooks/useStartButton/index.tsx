import { useEffect, useState } from "react";

export const useStartButton = () => {
  const [ready, setReady] = useState(false);

  const handleClick = () => {
    setReady(true);
  };

  useEffect(() => {
    const wrapper = document.createElement("div");

    wrapper.style.display = "flex";
    wrapper.style.pointerEvents = "none";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.position = "absolute";
    wrapper.style.top = "0px";
    wrapper.style.left = "0px";
    wrapper.style.height = "100%";
    wrapper.style.width = "100%";
    wrapper.style.zIndex = "9999";

    const button = document.createElement("div");
    button.innerHTML = "Click to Start";
    button.style.display = "flex";
    button.style.pointerEvents = "auto";
    button.style.justifyContent = "center";
    button.style.alignItems = "center";
    button.style.borderRadius = "100%";
    button.style.border = "1px solid #ffffff99";

    // button.style.background = "#ffffff22";
    button.style.color = "#f1f1f1";
    button.style.fontSize = "24px";
    button.style.height = "200px";
    button.style.width = "200px";

    button.style.cursor = "pointer";
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
