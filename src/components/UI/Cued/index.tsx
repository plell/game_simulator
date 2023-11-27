import { useRef } from "react";
import styled from "styled-components";
import { useIsOnScreen } from "../hooks";
import { FadeLeft } from "../FadeLeft";
import { browserIsChrome } from "../../../Stores/constants";

type Props = {
  children: JSX.Element;
  speed?: number;
  drift?: number;
};

export const Cued = ({ children, speed, drift }: Props) => {
  const cueRef = useRef(null);
  const cueIsOnScreen = useIsOnScreen(cueRef);

  return (
    <Relative>
      <Cue ref={cueRef} />
      <FadeLeft
        drift={drift}
        speed={speed}
        isMounted={!browserIsChrome || cueIsOnScreen}
      >
        {children}
      </FadeLeft>
    </Relative>
  );
};

const Cue = styled.div`
  position: absolute;
  height: 100%;
`;

const Relative = styled.div`
  position: relative;
  width: 100%;
`;
