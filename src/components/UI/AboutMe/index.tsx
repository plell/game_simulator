import styled, { IStyledComponent } from "styled-components";

import { useRef, useState } from "react";
import { MdArrowDownward, MdArrowForward } from "react-icons/md";
import { useIsMobile } from "../hooks";
import useGame from "../../../Stores/useGame";

export const AboutMe = () => {
  const ref = useRef(null);
  const cafeRef = useRef(null);
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

        if (scrollTop > scrollHeight / 2 && !renderCafe) {
          setRenderCafe(true);
        }
      }}
    >
      <TopFlexRow>
        <FlexRowItem>
          <BigTitle>Modern Web Experiences</BigTitle>
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
            Continue to games
          </LinkTitle>
        </FlexRowItem>
      </FlexRow>
      <Spacer />
      <FlexRow>
        <FlexRowItem>
          <Title>Social Media Platform</Title>
        </FlexRowItem>
        <FlexRowItem>
          <Description>
            Sphinx Community is a Web3 sidekick social media platform that I
            built from the ground up using React, Golang and PostgreSQL. Here
            you can meet other Sphinx Chat app users, join Sphinx Chat tribes,
            earn badges, and claim coding bounties. What you see below is the
            live site - try it out!
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
          <Title>Machine Learning Model Visualization</Title>
        </FlexRowItem>
        <FlexRowItem>
          <Description>
            Second Brain is an application that collects data for an open source
            machine learning bank. I designed and built the UI using React Three
            Fiber. My goal was to encourage community data contributions by
            indicating the daily growth of the knowledge graph.
          </Description>
        </FlexRowItem>
        <MediaItem>
          <Image src='/images/secondbrain2.jpg' />
        </MediaItem>
      </FlexRow>
      <FlexRow>
        <FlexRowItem>
          <Title>Online Payment and Order Management</Title>
        </FlexRowItem>
        <FlexRowItem>
          <Description>
            I built this dynamic white label e-commerce template with React,
            Golang, SQL backend, dockerized and served from DigitalOcean.
            Payments are powered by the Stripe API. Communications powered by
            Gmail and Google calendar APIs.
          </Description>
        </FlexRowItem>
        <MediaItem>
          {renderCafe && (
            <iframe
              style={{ border: "none" }}
              src={"https://www.lazycow.cafe"}
              height={670}
              width={"100%"}
              onLoad={() => {
                window.scrollTo(0, 0);

                setTimeout(() => {
                  window.scrollTo(0, 0);
                }, 100);

                setTimeout(() => {
                  window.scrollTo(0, 0);
                }, 200);
              }}
            />
          )}
        </MediaItem>
      </FlexRow>
    </Overlay>
  );
};

const Spacer = styled.div`
  min-height: 60px;
`;
const BigTitle = styled.div`
  font-size: 60px;
  font-weight: 200;
`;

const TopDescription = styled.div`
  font-size: 28px;
  font-weight: 300;
  margin-top: 10px;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: 900;
`;

const LinkTitle = styled.div`
  font-size: 28px;
  font-weight: 300;
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`;

const Description = styled.div`
  font-size: 28px;
  font-weight: 300;
  line-height: 39px;
  margin: 30px 0px 60px 40px;
  color: #f1f1f1;
  padding: 12px;
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

  box-shadow: 15px 15px 14px 0px #ffffff44;
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
