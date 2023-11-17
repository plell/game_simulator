import * as Tone from "tone";
import { postDebounce } from "../../../Stores/constants";

const tomSynth0 = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.02,
    sustain: 0.4,
    release: 0.7,
  },
});

tomSynth0.volume.value = -10;

const tomSynth1 = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.02,
    sustain: 0,
    release: 0,
  },
});

tomSynth1.volume.value = -10;

const tomSynth2 = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.1,
    sustain: 0,
    release: 0,
  },
});

tomSynth2.volume.value = -18;

const highPassFilter = new Tone.Filter(1200, "highpass");

const effectsBus = new Tone.Volume(0);

effectsBus.chain(highPassFilter, Tone.Destination);

const reverb = new Tone.Reverb(0).connect(effectsBus);

const monoSynth2 = new Tone.MonoSynth({
  envelope: {
    attack: 0.1,
    decay: 0.9,
    sustain: 0.7,
    release: 0.6,
  },
}).connect(reverb);

monoSynth2.oscillator.type = "square";
monoSynth2.chain(highPassFilter);

const synthCount = 6;
const synths: Tone.PolySynth[] = [];

for (let i = 0; i < synthCount; i++) {
  const polysynth = new Tone.PolySynth().connect(reverb);
  polysynth.volume.value = 1;
  synths.push(polysynth);
}

const init = async () => {
  // start if not started
  if (!toneStarted) {
    await Tone.start();
    toneStarted = true;
  }
};

let toneStarted = false;

let mute = false;

export const playSound = async (note = "A3") => {
  if (mute) {
    return;
  }

  try {
    await init();

    postDebounce(
      "tone",
      () => {
        let triggered = false;
        synths.forEach((s) => {
          if (!triggered && s.activeVoices < 10) {
            s.triggerAttackRelease(note, 0.001);
            triggered = true;
          }
        });
      },
      50
    );
  } catch (e) {
    console.warn(e);
  }
};

export const dieSound = async (note = "A1") => {
  if (mute) {
    return;
  }

  try {
    await init();

    monoSynth2.triggerAttackRelease(note, 0.2);
  } catch (e) {
    console.warn(e);
  }
};

export const kick = async (note = "A1") => {
  if (mute) {
    return;
  }

  try {
    await init();
    postDebounce("kick", () => {
      tomSynth0.triggerAttackRelease(note, 0.02);
    });
  } catch (e) {
    console.warn(e);
  }
};

export const snare = async (note = "D1") => {
  if (mute) {
    return;
  }

  try {
    await init();
    postDebounce("snare", () => {
      tomSynth1.triggerAttackRelease(note, 0.02);
    });
  } catch (e) {
    console.warn(e);
  }
};

export const hihat = async (note = "D2") => {
  if (mute) {
    return;
  }

  try {
    await init();
    postDebounce("hihat", () => {
      tomSynth2.triggerAttackRelease(note, 0.1);
    });
  } catch (e) {
    console.warn(e);
  }
};

export const mount = () => {
  mute = false;
  tomSynth0.toDestination();
  tomSynth1.toDestination();
  tomSynth2.toDestination();
  synths.forEach((s) => s.toDestination());
  monoSynth2.toDestination();
};

export const dismount = () => {
  mute = true;
  tomSynth0.disconnect();
  tomSynth1.disconnect();
  tomSynth2.disconnect();
  synths.forEach((s) => s.disconnect());
  monoSynth2.disconnect();
};
