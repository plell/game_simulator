import {
  MdArrowCircleLeft,
  MdArrowCircleRight,
  MdArrowLeft,
  MdArrowRight,
  MdArrowRightAlt,
} from "react-icons/md";
import styled from "styled-components";
import useGame from "../../../Stores/useGame";
import { experienceProperties } from "../../../Stores/constants";

export const Browser = () => {
  const game = useGame((s) => s.game);
  const setGame = useGame((s) => s.setGame);

  return (
    <Overlay>
      <div style={{ position: "absolute", top: 0, left: 0, padding: 40 }}>
        {experienceProperties[game]?.gameTitle || "Under Construction"}
      </div>
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

const Button = styled.div`
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 70px;
  color: #fff;
  transition: color 0.2s;
  &:hover {
    color: #ea0a8e;
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
