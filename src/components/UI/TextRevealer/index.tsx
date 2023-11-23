import { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { useIsOnScreen } from "../hooks";

import { browserIsChrome } from "../../../Stores/constants";
import { Interval } from "../../../Stores/types";

import { clickClack } from "../../Experiences/TempoGame/components/Sounds/Tone";

type Props = {
  children: string;
  sound?: boolean;
};

export const TextRevealer = ({ children, sound }: Props) => {
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
            let letter = children[i];
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

  useEffect(() => {
    if (sound) {
      playTypingSound();
    }
  }, [textToRender]);

  const playTypingSound = () => {
    clickClack();
  };

  const hideBlock = useMemo(
    () => textToRender.length === children.length,
    [textToRender, children]
  );

  const hiddenText = useMemo(() => {
    let s = children.slice(textToRender.length, children.length);

    return s;
  }, [children, textToRender]);

  return (
    <Inline>
      <Cue ref={cueRef} isMounted={!cueMounted} />
      <>
        {textToRender}
        {!hideBlock && <Block>▐</Block>}
      </>
      <HiddenText>{hiddenText}</HiddenText>
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

const Block = styled.span`
  opacity: 0.9;
  overflow: hidden;
`;

const Cue = styled.span<CueProps>``;
const HiddenText = styled.span`
  display: inline;
  opacity: 0;
  user-select: none;
  pointer-events: none;
`;
