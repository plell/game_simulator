import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

const sleep = (ms: any) =>
  new Promise((resolve: any) => setTimeout(resolve, ms));

const Fader = styled.div`
  transition: all 1s;
  display: inherit;
  width: 100%;
`;

interface FadeLeftProps {
  drift?: number;
  isMounted: boolean;
  dismountCallback?: () => void;
  style?: React.CSSProperties;
  children?: JSX.Element;
  alwaysRender?: boolean;
  noFadeOnInit?: boolean;
  direction?: string;
  withOverlay?: boolean;
  overlayClick?: () => void;
  noFade?: boolean;
  speed?: number;
  close?: () => void;
}

export const FadeLeft = (props: FadeLeftProps) => {
  const {
    drift,
    isMounted,
    dismountCallback,
    style,
    children,
    alwaysRender,
    noFadeOnInit,
    direction,
    withOverlay,
    overlayClick,
    noFade,
  } = props;
  const [translation, setTranslation] = useState(drift ? drift : -40);
  const [opacity, setOpacity] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  function open() {
    setTranslation(0);
    setOpacity(1);
  }

  const close = useCallback(() => {
    setTranslation(drift ? drift : -40);
    setOpacity(0);
  }, [drift]);

  const doAnimation = useCallback(
    (value: any) => {
      if (value === 1) {
        open();
      } else {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    if (noFadeOnInit) {
      setOpacity(1);
      setTranslation(0);
    }
  }, [noFadeOnInit]);

  useEffect(() => {
    (async () => {
      if (isMounted && !shouldRender) {
        setShouldRender(true);

        await sleep(60);

        doAnimation(1);
      }
    })();
  }, [dismountCallback, doAnimation, isMounted, props.speed]);

  if (!alwaysRender && !shouldRender) {
    return null;
  }

  const transformValue =
    direction === "up"
      ? `translateY(${translation}px)`
      : `translateX(${translation}px)`;

  return (
    <Fader
      style={{
        height: "inherit",
        ...style,
        transform: transformValue,
        opacity: !noFade ? opacity : 1,
      }}
    >
      {children}
    </Fader>
  );
};
