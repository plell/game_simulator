import styled from "styled-components";
import { useRef } from "react";
import { MdArrowForward } from "react-icons/md";
import { useIsMobile } from "../hooks";
import useGame from "../../../Stores/useGame";
import { Cued } from "../Cued";

const speed = 0.8;

const drift = 20;

export const AboutMe = () => {
  const ref = useRef(null);

  const setGame = useGame((s) => s.setGame);

  const isMobile = useIsMobile();

  return (
    <Overlay isMobile={isMobile} ref={ref}>
      <Wrap>
        <TopFlexRow>
          <FlexRowItem>
            <BigTitle isMobile={isMobile}>Modern Web Experiences</BigTitle>
          </FlexRowItem>
          <FlexRowItem>
            <Description style={{ margin: "10px 0 0 0" }}>
              by David Plell
            </Description>
          </FlexRowItem>
        </TopFlexRow>

        <FlexRow style={{ margin: "140px 0 70px" }}>
          <FlexRowItem>
            <LinkTitle onClick={() => setGame(1)}>
              <MdArrowForward size={30} style={{ marginRight: 10 }} />
              Continue to demos
            </LinkTitle>
          </FlexRowItem>
        </FlexRow>
        <Spacer />

        <Cued speed={speed} drift={drift}>
          <FlexRow>
            <FlexRowItem>
              <Title>Intuitive UI</Title>
            </FlexRowItem>

            <FlexRowItem>
              <Description isMobile={isMobile}>
                <span>
                  <Link href='https://community.sphinx.chat/p' target='_blank'>
                    Sphinx Community
                  </Link>
                </span>
                &nbsp;is a Web3 sidekick social media platform that I built from
                the ground up using React, Typescript, Golang and PostgreSQL.
                Here you can meet Sphinx Chat users, join Sphinx tribes, earn
                badges, and claim coding bounties.
              </Description>
            </FlexRowItem>

            <MediaItem>
              <Image src='/images/sphinxCommunity.jpg' />
            </MediaItem>
          </FlexRow>
        </Cued>
        {/* <FlexRow>
        <Cued>
          <FlexRowItem>
            <Title>Creative Designs</Title>
          </FlexRowItem>
        </Cued>
        <Cued speed={speed}>
          <FlexRowItem>
            <Description isMobile={isMobile}>
              <TextRevealer>
                Second Brain is an application that collects and displays data
                for an open source machine learning model. I designed and built
                the UI with React, Typescript, and R3F. My main goal was to
                present data in a way that invites more community contributions.
                I brought the story of each data node to the UI: details on who
                contributed the data, and how much they contribute to the
                platform.
              </TextRevealer>
            </Description>
          </FlexRowItem>
        </Cued>
        <Cued speed={speed}>
          <MediaItem>
            <Image src='/images/secondbrain2.jpg' />
          </MediaItem>
        </Cued>
      </FlexRow> */}

        <Cued speed={speed} drift={drift}>
          <FlexRow>
            <FlexRowItem>
              <Title>3D Modeling</Title>
            </FlexRowItem>

            <FlexRowItem>
              <Description isMobile={isMobile}>
                I started using Blender to create 3D models in January of 2023.
                An elegant 3D model with some interactions can really level up
                the scrolling experience. I love it!
              </Description>
            </FlexRowItem>

            <MediaItem>
              <Image src='/images/donut.png' />
            </MediaItem>
          </FlexRow>
        </Cued>

        <Cued speed={speed} drift={drift}>
          <FlexRow>
            <FlexRowItem>
              <Title>Professional Audio</Title>
            </FlexRowItem>

            <FlexRowItem>
              <Description isMobile={isMobile}>
                Here's my&nbsp;
                <span>
                  <Link href='https://davidplell.bandcamp.com/' target='_blank'>
                    music portfolio.
                  </Link>
                </span>
                &nbsp;I started writing music and forming bands in 2007. Since
                becoming an engineer, I really enjoy putting my knowledge of
                audio production (eq, compression, etc.) to work when I use
                audio libraries like the Web Audio API. Using audio analysis to
                drive WebGL visuals is where it all comes together for me.
              </Description>
            </FlexRowItem>

            <MediaItem>
              <Image src='/images/ableton.png' />
            </MediaItem>
          </FlexRow>
        </Cued>

        <Cued speed={speed} drift={drift}>
          <FlexRow>
            <FlexRowItem>
              <Title>Immersive Experiences</Title>
            </FlexRowItem>

            <FlexRowItem>
              <Description isMobile={isMobile}>
                <span>
                  <Link onClick={() => setGame(1)}>Try them out!</Link>
                </span>
                &nbsp;I build games and other 3D experiences with React and
                ThreeJS.
              </Description>
            </FlexRowItem>
          </FlexRow>
        </Cued>
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
      </Wrap>
    </Overlay>
  );
};

const Wrap = styled.div`
  max-width: 1400px;
`;

const Spacer = styled.div`
  min-height: 60px;
`;

type BTProps = {
  isMobile?: boolean;
};
const BigTitle = styled.div<BTProps>`
  font-size: ${(p) => (p.isMobile ? "50px" : "60px")};
  font-weight: 200;
`;

const TopDescription = styled.div`
  font-size: 28px;

  margin-top: 10px;
`;

const Title = styled.div`
  font-size: 50px;
  font-weight: 200;
`;

const LinkTitle = styled.a`
  font-size: 28px;
  font-weight: 300;
  color: skyblue;
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
`;

type DescriptionProps = {
  isMobile?: boolean;
};

const Link = styled.a`
  font-size: 28px;

  color: skyblue;

  cursor: pointer;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }
`;
const Description = styled.div<DescriptionProps>`
  font-size: 28px;
  font-weight: 300;
  line-height: 46px;
  margin: 50px 0 70px 0;
  width: 100%;
  color: #f1f1f1;
`;

type OverlayProps = {
  isMobile: boolean;
};

const Overlay = styled.div<OverlayProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: ${(p) => (!p.isMobile ? "80px 200px" : "80px 50px")};
  width: ${(p) => (!p.isMobile ? "calc(100% - 400px)" : "calc(100% - 100px)")};
  max-height: calc(100% - 160px);

  user-select: auto;
  pointer-events: auto;

  display: flex;
  flex-direction: column;

  align-items: center;

  color: #fff;
  z-index: 9;
  overflow: auto;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 120px;
`;

const TopFlexRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 20px 0 60px;
  color: #f1f1f1;
`;

const FlexRowItem = styled.div`
  display: flex;
`;

const MediaItem = styled.div`
  display: flex;
  opacity: 0.9;
  width: 100%;
  justify-content: center;

  overflow: hidden;
`;

type ImageProps = {
  src: string;
  width?: number;
  height?: number;
};

const Image = styled.img<ImageProps>`
  background-image: ${({ src }) => `url(${src})`};
  background-size: contain;
  background-repeat: no-repeat;
  width: calc(100% - 10px);
  max-width: 1000px;
  height: auto;
  border-radius: 5px;
  border: 5px solid #ffffff33;
`;
