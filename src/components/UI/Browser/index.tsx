import { MdArrowCircleLeft, MdArrowCircleRight } from "react-icons/md";
import styled from "styled-components";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";
import { MutableRefObject, useMemo, useRef } from "react";
import gsap, { Power4 } from "gsap";

import { AudioPlayer } from "../AudioPlayer";
import { AboutMe } from "../AboutMe";
import { useIsMobile } from "../hooks";

export const Browser = () => {
  const game = useGame((s) => s.game);
  const setGame = useGame((s) => s.setGame);

  const forwardButton = useRef(null);
  const backButton = useRef(null);

  const isMobile = useIsMobile();

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

  const showAboutMe = useMemo(
    () => experienceProperties[game]?.showAboutMe,
    [game]
  );

  return (
    <>
      {showAboutMe && <AboutMe />}
      <Overlay isMobile={isMobile}>
        <Title style={{ lineHeight: "40px" }}>
          <div>{experienceProperties[game]?.title}</div>
          <Description>{experienceProperties[game]?.description}</Description>
        </Title>

        <Footer style={{ background: showAboutMe ? "#00000088" : "" }}>
          {!isMobile && (
            <Tag style={{ lineHeight: "40px" }}>David Plell's Portfolio</Tag>
          )}

          <FlexRow>
            {!isMobile && (
              <>
                <FlexRowItem>
                  <a href='https://github.com/plell' target='_blank'>
                    <Image src={"images/github.png"} size={36} />
                  </a>
                </FlexRowItem>
                <ItemSpacer />
                <FlexRowItem>
                  <a
                    href='https://www.linkedin.com/in/davidplell/'
                    target='_blank'
                  >
                    <Image src={"images/linkedin.png"} size={36} />
                  </a>
                </FlexRowItem>
                <ItemSpacer />
              </>
            )}
            <FlexRowItem>
              <AudioPlayer />
            </FlexRowItem>
          </FlexRow>
        </Footer>

        <Button
          isMobile={isMobile}
          ref={backButton}
          onClick={() => {
            spin(backButton);

            let toGame = game - 1;
            if (toGame < 0) {
              toGame = experienceProperties.length - 1;
            }
            setGame(toGame);
          }}
        >
          <MdArrowCircleLeft />
        </Button>

        <Button
          isMobile={isMobile}
          ref={forwardButton}
          onClick={() => {
            let toGame = game + 1;
            if (toGame > experienceProperties.length - 1) {
              toGame = 0;
            }
            setGame(toGame);
            spin(forwardButton);
          }}
        >
          <MdArrowCircleRight />
        </Button>
      </Overlay>
    </>
  );
};

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const ItemSpacer = styled.div`
  width: 30px;
`;

const FlexRowItem = styled.div`
  display: flex;
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
  padding: 20px;
  font-size: 26px;
  font-weight: 300;
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

type ButtonProps = {
  isMobile?: boolean;
};

const Button = styled.div<ButtonProps>`
  pointer-events: auto;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: ${(p) => (p.isMobile ? "40px" : "70px")};
  color: #fff;
  transition: color 0.2s;

  border-radius: 100%;
  &:hover {
    color: #f1f1f1;
  }
`;

type OverlayProps = {
  isMobile?: boolean;
};

const Overlay = styled.div<OverlayProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: calc(100% - ${(p) => (p.isMobile ? "20px" : "100px")});
  height: calc(100% - 100px);
  padding: ${(p) => (p.isMobile ? "50px 10px" : "50px")};
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
