import { Environment } from "@react-three/drei";

export const EnvMap = () => {
  return (
    <Environment
      preset='city'
      // background
      // files={"./envmap.hdr"}
    />
  );
};
