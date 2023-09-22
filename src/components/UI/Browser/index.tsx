import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdArrowLeft,
  MdArrowRight,
  MdArrowRightAlt,
  MdInfoOutline,
} from "react-icons/md";
import styled from "styled-components";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

export const Browser = () => {
  const game = useGame((s) => s.game);
  const setGame = useGame((s) => s.setGame);

  return (
    <Overlay>
      <Title>
        <div>{experienceProperties[game]?.title || "Under Construction"}</div>
        <Description>{experienceProperties[game]?.description}</Description>
      </Title>
      {/* 
      <Info>
        <Button>
          <MdInfoOutline />
        </Button>
      </Info> */}

      {game > 0 ? (
        <Button onPointerDown={() => setGame(game - 1)}>
          <MdArrowCircleLeft />
        </Button>
      ) : (
        <div />
      )}
      <Button onPointerDown={() => setGame(game + 1)}>
        <MdArrowCircleRight />
      </Button>
    </Overlay>
  );
};

const Info = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 40px;
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
