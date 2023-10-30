import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useIsOnScreen } from "../hooks";
import { FadeLeft } from "../FadeLeft";

type Props = {
  children: JSX.Element;
};

export const Cued = (props: Props) => {
  const { children } = props;

  const cueRef = useRef(null);

  const [init, setInit] = useState(false);
  const [cueMounted, setCueMounted] = useState(false);

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
      <FadeLeft isMounted={cueMounted}>{children}</FadeLeft>
    </>
  );
};

type CueProps = {
  isMounted: boolean;
};

const Cue = styled.div<CueProps>`
  display: ${(p) => (p.isMounted ? "block" : "none")};
  margin-top: 100px;
  min-height: 1000px;
`;
