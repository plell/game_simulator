export const AudioPlayer = () => {
  return (
    <iframe
      style={{
        pointerEvents: "auto",
        border: 0,
        width: 360,
        height: 42,
      }}
      src='https://bandcamp.com/EmbeddedPlayer/track=511511107/size=small/bgcol=333333/linkcol=4ec5ec/transparent=true/'
      seamless
    >
      <a href='https://davidplell.bandcamp.com/track/frankie-moonlight'>
        FRANKIE MOONLIGHT by David Plell
      </a>
    </iframe>
  );
};
