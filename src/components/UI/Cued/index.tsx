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

  const [cueMounted, setCueMounted] = useState(false);

  const cueIsOnScreen = useIsOnScreen(cueRef);

  useEffect(() => {
    if (!cueMounted && cueIsOnScreen) {
      setCueMounted(true);
    }
  }, [cueIsOnScreen]);

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
