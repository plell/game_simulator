import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";

const sleep = (ms: any) =>
  new Promise((resolve: any) => setTimeout(resolve, ms));

const Fader = styled.div`
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
  toggleVisibility?: boolean;
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
    speed,
    overlayClick,
    noFade,
    toggleVisibility,
  } = props;
  const [translation, setTranslation] = useState(drift ? drift : -20);
  const [opacity, setOpacity] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  function open() {
    setTranslation(0);
    setOpacity(1);
  }

  const close = useCallback(() => {
    setTranslation(drift ? drift : -20);
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
      } else if (toggleVisibility && !isMounted && shouldRender) {
        doAnimation(0);

        setShouldRender(false);
      }
    })();
  }, [dismountCallback, doAnimation, isMounted, props.speed]);

  const transformValue =
    direction === "up"
      ? `translateY(${translation}px)`
      : `translateX(${translation}px)`;

  const isInvisible = useMemo(() => {
    return !alwaysRender && !shouldRender;
  }, [alwaysRender, shouldRender]);

  return (
    <Fader
      style={{
        height: "inherit",
        ...style,
        transition: `all ${speed || 0.5}s`,
        transform: transformValue,
        opacity: isInvisible ? 0 : !noFade ? opacity : 1,
      }}
    >
      {children}
    </Fader>
  );
};
