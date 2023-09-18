import { MdArrowRight } from "react-icons/md";
import styled from "styled-components";
import useGame from "../../../Stores/useGame";

export const Browser = () => {
  const cameraPosition = useGame((s) => s.cameraPosition);
  const setCameraPosition = useGame((s) => s.setCameraPosition);

  return (
    <Button onClick={() => setCameraPosition(cameraPosition + 1)}>
      Next <MdArrowRight />
    </Button>
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
