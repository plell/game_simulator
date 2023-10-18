import { MdArrowCircleLeft, MdArrowCircleRight } from "react-icons/md";
import styled from "styled-components";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";
import { MutableRefObject, useEffect, useRef } from "react";
import gsap, { Power4 } from "gsap";
import { Bounce } from "gsap";
import { AudioPlayer } from "../AudioPlayer";

export const Browser = () => {
  const game = useGame((s) => s.game);
  const setGame = useGame((s) => s.setGame);
  const setLockClicked = useGame((s) => s.setLockClicked);
  const lockClicked = useGame((s) => s.lockClicked);
  const locked = useGame((s) => s.locked);

  const forwardButton = useRef(null);
  const backButton = useRef(null);

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
      spin(forwardButton);
    }
  }, [locked]);

  const spin = (ref: MutableRefObject<HTMLElement | null>) => {
    if (ref.current) {
      gsap
        .to(ref.current, {
          duration: 1,
          ease: Power4.easeOut,
          keyframes: {
            "0%": { transform: "rotateY(90deg)", color: "#fff" },
            "50%": { transform: "rotateY(180deg)", color: "#fff" },
            "100%": { transform: "rotateY(0deg)", color: "#fff" },
          },
        })
        .play();
    }
  };

  return (
    <Overlay>
      <Title>
        <div>{experienceProperties[game]?.title}</div>
        <Description>{experienceProperties[game]?.description}</Description>
      </Title>

      <Footer>
        <Tag>David Plell's Portfolio</Tag>

        <FlexRow>
          <FlexRowItem>
            <a href='https://github.com/plell' target='_blank'>
              <Image src={"images/github.png"} size={40} />
            </a>
          </FlexRowItem>
          <FlexRowItem>
            <a href='https://www.linkedin.com/in/davidplell/' target='_blank'>
              <Image src={"images/linkedin.png"} size={40} />
            </a>
          </FlexRowItem>
          <FlexRowItem>
            <AudioPlayer />
          </FlexRowItem>
        </FlexRow>
      </Footer>

      {game > 0 ? (
        <Button
          ref={backButton}
          onPointerDown={() => {
            spin(backButton);
            setGame(game - 1);
          }}
        >
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
            spin(forwardButton);
          }
        }}
      >
        {locked ? null : <MdArrowCircleRight />}
      </Button>
    </Overlay>
  );
};

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const FlexRowItem = styled.div`
  display: flex;
  margin-left: 30px;
`;

const Footer = styled.div`
  position: absolute;
  flex-wrap: wrap;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  bottom: 0px;
  left: 0px;
  min-width: calc(100% - 40px);
  padding: 20px;
`;

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

const Tag = styled.div`
  font-size: 26px;
  font-weight: 300;

  color: #f1f1f1;
`;

const Button = styled.div`
  pointer-events: auto;
  user-select: none;
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

type ImageProps = {
  src: string;
  size: number;
};

const Image = styled.img<ImageProps>`
  pointer-events: auto;
  cursor: pointer;
  background-image: ${({ src }) => `url(${src})`};
  background-size: contain;
  background-repeat: no-repeat;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 100%;
`;
