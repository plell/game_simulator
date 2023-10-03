import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdLock,
  MdLockOutline,
} from "react-icons/md";
import styled from "styled-components";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";
import { useEffect, useRef } from "react";
import gsap, { Power4 } from "gsap";
import { Bounce } from "gsap";

export const Browser = () => {
  const game = useGame((s) => s.game);
  const setGame = useGame((s) => s.setGame);
  const setLockClicked = useGame((s) => s.setLockClicked);
  const lockClicked = useGame((s) => s.lockClicked);
  const locked = useGame((s) => s.locked);

  const forwardButton = useRef(null);

  const nopeAnimation = () => {
    if (forwardButton.current) {
      setLockClicked(!lockClicked);
      gsap.from(forwardButton.current, {
        duration: 0.5,
        keyframes: {
          ease: Bounce.easeOut,
          "0%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(10px)" },
          "100%": { transform: "translateX(0px)" },
        },
      });
    }
  };

  useEffect(() => {
    if (!locked && forwardButton.current) {
      gsap
        .to(forwardButton.current, {
          duration: 1,
          ease: Power4.easeOut,
          keyframes: {
            "0%": { transform: "rotateY(0deg)", color: "#fff" },
            "50%": { transform: "rotateY(180deg)", color: "skyblue" },
            "100%": { transform: "rotateY(0deg)", color: "#fff" },
          },
        })
        .play();
    }
  }, [locked]);

  return (
    <Overlay>
      <Title>
        <div>{experienceProperties[game]?.title}</div>
        <Description>{experienceProperties[game]?.description}</Description>
      </Title>

      {game > 0 ? (
        <Button onPointerDown={() => setGame(game - 1)}>
          <MdArrowCircleLeft />
        </Button>
      ) : (
        <div />
      )}
      <Button
        ref={forwardButton}
        onPointerDown={() => {
          if (locked) {
            nopeAnimation();
          } else {
            setGame(game + 1);
          }
        }}
      >
        {locked ? <MdLock color={"#ffffff99"} /> : <MdArrowCircleRight />}
      </Button>
    </Overlay>
  );
};

const Title = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 40px;
`;

const Description = styled.div`
  font-size: 26px;
  font-weight: 300;
  margin: 5px 40px;
  color: #f1f1f1;
`;

const Button = styled.div`
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 70px;
  color: #fff;
  transition: color 0.2s;

  border-radius: 100%;
  &:hover {
    color: #f1f1f1;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: calc(100% - 100px);
  height: calc(100% - 100px);
  padding: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  pointer-events: none;
  font-size: 40px;
  font-weight: 900;
  color: #fff;
  z-index: 10;
`;
