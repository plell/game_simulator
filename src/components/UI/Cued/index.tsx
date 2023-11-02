import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useIsOnScreen } from "../hooks";
import { FadeLeft } from "../FadeLeft";
import { browserIsChrome } from "../../../Stores/constants";

type Props = {
  children: JSX.Element;
  speed?: number;
};

export const Cued = ({ children, speed }: Props) => {
  const cueRef = useRef(null);

  const [init, setInit] = useState(true);
  const [cueMounted, setCueMounted] = useState(!browserIsChrome);

  const cueIsOnScreen = useIsOnScreen(cueRef);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setInit(true);
    }, 200);
    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  useEffect(() => {
    if (init && !cueMounted && cueIsOnScreen) {
      setCueMounted(true);
    }
  }, [cueIsOnScreen, init]);

  return (
    <>
      <Cue ref={cueRef} isMounted={!cueMounted} />
      <FadeLeft speed={speed} isMounted={cueMounted}>
        {children}
      </FadeLeft>
    </>
  );
};

type CueProps = {
  isMounted: boolean;
};

const Cue = styled.div<CueProps>``;
