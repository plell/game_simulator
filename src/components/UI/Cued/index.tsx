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

  const [cueMounted, setCueMounted] = useState(!browserIsChrome);
  const [bufferDone, setBufferDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBufferDone(true), 500);
    return () => clearTimeout(t);
  }, []);

  const cueIsOnScreen = useIsOnScreen(cueRef);

  useEffect(() => {
    if (!cueMounted && cueIsOnScreen) {
      setCueMounted(true);
    }
  }, [cueIsOnScreen]);

  return (
    <>
      <Cue ref={cueRef} />
      <FadeLeft speed={speed} isMounted={cueMounted && bufferDone}>
        {children}
      </FadeLeft>
    </>
  );
};

const Cue = styled.div``;
