import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import styled from "styled-components";
import useGame from "../../../Stores/useGame";

export const Browser = () => {
  const game = useGame((s) => s.game);
  const setGame = useGame((s) => s.setGame);

  return (
    <Overlay>
      {game > 0 ? (
        <Button onClick={() => setGame(game - 1)}>
          <MdArrowLeft /> Prev
        </Button>
      ) : (
        <div />
      )}
      <Button onClick={() => setGame(game + 1)}>
        Next <MdArrowRight />
      </Button>
    </Overlay>
  );
};

export default Browser;

const Button = styled.div`
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 400;
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
