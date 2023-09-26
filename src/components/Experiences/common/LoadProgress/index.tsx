import { Text, useProgress } from "@react-three/drei";

export const LoadProgress = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();
  return <Text>{progress} % </Text>;
};
