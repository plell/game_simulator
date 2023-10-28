import styled from "styled-components";
import { useRef, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { useIsMobile } from "../hooks";
import useGame from "../../../Stores/useGame";

export const AboutMe = () => {
  const ref = useRef(null);
  const setGame = useGame((s) => s.setGame);

  const [renderCafe, setRenderCafe] = useState(false);

  const isMobile = useIsMobile();

  return (
    <Overlay
      isMobile={isMobile}
      ref={ref}
      onScroll={(e) => {
        const scrollTop: number = ref?.current?.scrollTop;
        const scrollHeight: number = ref?.current?.scrollHeight;

        if (scrollTop > scrollHeight / 1.6 && !renderCafe) {
          setRenderCafe(true);
        }
      }}
    >
      <TopFlexRow>
        <FlexRowItem>
          <BigTitle isMobile={isMobile}>Modern Web Experiences</BigTitle>
        </FlexRowItem>
        <FlexRowItem>
          <TopDescription>by David Plell</TopDescription>
        </FlexRowItem>

        {/* <FlexRowItem style={{ marginTop: 80 }}>
          <MdArrowDownward color={"#fff"} size={50} />
        </FlexRowItem> */}
      </TopFlexRow>
      <Spacer />
      <FlexRow style={{ marginBottom: 60 }}>
        <FlexRowItem>
          <LinkTitle onClick={() => setGame(1)}>
            <MdArrowForward size={30} style={{ marginRight: 10 }} />
            Continue to demos
          </LinkTitle>
        </FlexRowItem>
      </FlexRow>
      <Spacer />
      <FlexRow>
        <FlexRowItem>
          <Title>Clean and Flexible UI</Title>
        </FlexRowItem>
        <FlexRowItem>
          <Description isMobile={isMobile}>
            <span>
              <Link href='https://community.sphinx.chat/p' target='_blank'>
                Sphinx Community
              </Link>
            </span>
            &nbsp;is a Web3 sidekick social media platform that I built from the
            ground up using React, Golang and PostgreSQL. Here you can meet
            Sphinx Chat users, join Sphinx tribes, earn badges, and claim coding
            bounties.
          </Description>
        </FlexRowItem>
        <MediaItem>
          <iframe
            seamless
            style={{ border: "none" }}
            src={"https://community.sphinx.chat/p"}
            height={700}
            width={"100%"}
          />
        </MediaItem>
      </FlexRow>
      <FlexRow>
        <FlexRowItem>
          <Title>Creative Solutions</Title>
        </FlexRowItem>
        <FlexRowItem>
          <Description isMobile={isMobile}>
            Second Brain is an application that collects data for an open source
            machine learning bank. I designed and built the UI using React Three
            Fiber. My goal was to encourage community participation by bringing
            the daily evolution of the knowledge graph to life.
          </Description>
        </FlexRowItem>
        <MediaItem>
          <Image src='/images/secondbrain2.jpg' />
        </MediaItem>
      </FlexRow>

      <FlexRow>
        <FlexRowItem>
          <Title>Immersive Experiences</Title>
        </FlexRowItem>
        <FlexRowItem>
          <Description isMobile={isMobile}>
            <span>
              <Link onClick={() => setGame(1)}>Try them out!</Link>
            </span>
            &nbsp;I build games and other 3D experiences with React and ThreeJS.
          </Description>
        </FlexRowItem>
      </FlexRow>
    </Overlay>
  );
};

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
  font-weight: 300;
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
  line-height: 39px;
  margin: 40px 0 60px;
  color: #f1f1f1;
  padding: 20px;
  background: #00000022;
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
  //   justify-content: flex-start;
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

  overflow: hidden;

  box-shadow: 0px 0px 4px 0px #ffffff77;
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
  width: 100%;
  height: auto;
`;
