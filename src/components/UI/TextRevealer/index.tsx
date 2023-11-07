import { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { useIsOnScreen } from "../hooks";

import { browserIsChrome } from "../../../Stores/constants";
import { Interval } from "../../../Stores/types";

type Props = {
  children: string;
};

const chars =
  `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()`.split(
    ""
  );

export const TextRevealer = ({ children }: Props) => {
  const cueRef = useRef(null);

  const [cueMounted, setCueMounted] = useState(!browserIsChrome);

  const [textToRender, setTextToRender] = useState("");

  const cueIsOnScreen = useIsOnScreen(cueRef);

  useEffect(() => {
    if (!cueMounted && cueIsOnScreen) {
      setCueMounted(true);
    }
  }, [cueIsOnScreen]);

  useEffect(() => {
    let count = 0;
    let interval: Interval = null;

    interval = setInterval(() => {
      count += 1;
      const stop = children.length < count;
      if (stop) {
        if (interval) {
          clearInterval(interval);
        }
      } else {
        // transform
        const transformedString = [];
        for (let i = 0; i < children.length; i += 1) {
          if (i <= count) {
            // const myChar = children[i];
            // const charIndex = chars.findIndex((f) => f === myChar);
            let letter = children[i];
            // if (count < children.length && count < i + 6) {
            //   const randomIndex = Math.floor(Math.random() * chars.length);
            //   console.log("randomIndex", randomIndex);
            //   letter = chars[randomIndex];
            // }

            transformedString.push(letter);
          }
        }

        let stringified = "";
        transformedString.forEach((s) => (stringified += s));
        setTextToRender(stringified);
      }
    }, 10);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cueMounted]);

  const hideBlock = useMemo(
    () => textToRender.length === children.length,
    [textToRender, children]
  );

  return (
    <Inline>
      <Cue ref={cueRef} isMounted={!cueMounted} />
      <>
        {textToRender} {!hideBlock && <span style={{ opacity: 0.9 }}>▌</span>}
      </>
      <HiddenText>
        {children.slice(textToRender.length, children.length)}
      </HiddenText>
    </Inline>
  );
};

type CueProps = {
  isMounted: boolean;
};
const Inline = styled.div`
  display: inline !important;
  position: relative;
`;

const Cue = styled.span<CueProps>``;
const HiddenText = styled.div`
  display: inline;
  opacity: 0;
  user-select: none;
  pointer-events: none;
`;
