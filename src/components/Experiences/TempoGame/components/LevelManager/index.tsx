import { useEffect } from "react";
import useGame from "../../Stores/useGame";
import { Notes } from "../../Stores/types";
import { Vector3 } from "three";

export const LevelManager = () => {
  const setWorldTile = useGame((s) => s.setWorldTile);
  const worldTile = useGame((s) => s.worldTile);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);
  const nextWorldTile = useGame((s) => s.nextWorldTile);
  const setEnemies = useGame((s) => s.setEnemies);

  const patterns = useGame((s) => s.patterns);
  const setPatterns = useGame((s) => s.setPatterns);

  const updatePatterns = () => {
    const { patternId } = worldTile;
    const thisPattern = patterns[patternId];

    const updatedNotes: Notes = {};

    Object.keys(thisPattern.notes).forEach((key) => {
      const p = thisPattern.notes[key];
      let { position } = p;

      const trans = p.body?.current?.translation();
      if (trans) {
        position = new Vector3(trans.x, trans.y, trans.z);
      }

      updatedNotes[key] = {
        ...p,
        position,
      };
    });

    const patternsCopy = { ...patterns };
    patternsCopy[patternId].notes = updatedNotes;
    setPatterns(patternsCopy);
  };

  useEffect(() => {
    setEnemies({});
    updatePatterns();

    if (nextWorldTile?.worldTile) {
      setTimeout(() => {
        setWorldTile(nextWorldTile.worldTile);
        setNextWorldTile(null);
      }, 50);
    }
  }, [nextWorldTile]);

  return null;
};
