import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import { useWebAudio } from './WebAudio';
import { playOscillator } from '../sounds/osc';
import { useRhythms } from './Rhythms';

export const SequencerContext = React.createContext(null);

export const Sequencer = ({ children }) => {
  const audioContext = useWebAudio();
  const rhythmsContext = useRhythms();
  const [state, setState] = useState({
    unlocked: false,
    metronome: false,
    tempo: 90,
    scheduleAheadTime: 0.2,
    lookahead: 50,
  });

  const rhythmsRef = useRef(rhythmsContext.state);
  const graphicsRef = useRef([]);
  const sequencerRef = useRef({
    metronome: {
      current16th: 0,
      nextNoteTime: 0,
    },
    nextNoteTimes: [],
    timerID: 'notplaying',
    tempo: state.tempo,
  });

  const resetNextNoteTimes = () => {
    sequencerRef.current.nextNoteTimes = rhythmsRef.current.map((rhythm) => (
      {
        id: rhythm.id,
        currentStep: 0,
        playedStep: false,
        time: 0,
      }
    ));
  };

  const resetGraphics = () => {
    graphicsRef.current = rhythmsRef.current.map(() => (
      { queue: [], lastDrawn: 0 }
    ));
  };

  const setTempo = (event) => setState({ ...state, tempo: event.target.value });

  useEffect(() => {
    rhythmsRef.current = rhythmsContext.state;
    sequencerRef.current.metronome.on = state.metronome;
    sequencerRef.current.tempo = state.tempo;

    console.log(graphicsRef.current);

    if (sequencerRef.current.timerID === 'notplaying') {
      resetNextNoteTimes();
      resetGraphics();
    }

    if (rhythmsRef.current.length > sequencerRef.current.nextNoteTimes.length) {
      sequencerRef.current.nextNoteTimes = rhythmsRef.current.map((_, idx) => (
        sequencerRef.current.nextNoteTimes[idx] ?? { currentStep: 0, playedStep: false }
      ));
    }

    if (rhythmsRef.current.length < sequencerRef.current.nextNoteTimes.length) {
      const ids = rhythmsRef.current.map((rhythm) => rhythm.id);
      sequencerRef.current.nextNoteTimes = sequencerRef.current.nextNoteTimes
        .filter((nextNote) => ids.includes(nextNote.id));
    }

    if (rhythmsRef.current.length < graphicsRef.current.length) {
      const ids = rhythmsRef.current.map((rhythm) => rhythm.id);
      graphicsRef.current = graphicsRef.current
        .filter((circle) => ids.includes(circle.id));
    }

    console.log(rhythmsRef.current);
    console.log(sequencerRef.current);
  });

  const generateNextNotes = () => {
    const secondsPerBeat = 60.0 / sequencerRef.current.tempo;
    const wholeBar = secondsPerBeat * 4;
    const single16thNote = wholeBar / 16;

    sequencerRef.current.metronome.current16th += 1;
    sequencerRef.current.metronome.nextNoteTime += single16thNote;

    if (sequencerRef.current.metronome.current16th === 16) {
      sequencerRef.current.metronome.current16th = 0;
    }

    sequencerRef.current.nextNoteTimes = sequencerRef.current.nextNoteTimes.map((nextNote, idx) => {
      const time = nextNote.time + single16thNote;
      let currentStep = nextNote.currentStep + 1;

      if (currentStep >= rhythmsRef.current[idx].division) {
        currentStep = 0;
      }

      return {
        time, currentStep,
      };
    });
  };

  const scheduleNotes = () => {
    console.log(rhythmsRef.current.length);
    console.log(sequencerRef.current.nextNoteTimes.length);
    console.log(sequencerRef.current.nextNoteTimes);

    rhythmsRef.current.forEach((rhythm, idx) => {
      /*
        Add scheduled note to graphics queue
      */
      if (typeof graphicsRef.current[idx] !== 'undefined') {
        graphicsRef.current[idx].queue.push({
          step: sequencerRef.current.nextNoteTimes[idx].currentStep,
          time: sequencerRef.current.nextNoteTimes[idx].time,
        });
      }

      /*
        Schedule note to Oscillator
      */
      if (rhythm.loop[sequencerRef.current.nextNoteTimes[idx].currentStep]
      ) {
        playOscillator(audioContext, 'sine', rhythm.freq, sequencerRef.current.metronome.nextNoteTime);
      }
    });

    /*
    Play metronome
    */
    if (
      sequencerRef.current.metronome.on
      && [0, 4, 8, 12].includes(sequencerRef.current.metronome.current16th)
    ) {
      playOscillator(audioContext, 'square', 9000, sequencerRef.current.metronome.nextNoteTime);
    }
  };

  const draw = () => {
    rhythmsRef.current.forEach((rhythm, idx) => {
      if (typeof graphicsRef.current[idx] !== 'undefined') {
        const lastNote = graphicsRef.current[idx].lastDrawn;
        let thisNote = lastNote;

        while (
          graphicsRef.current[idx].queue.length
          && graphicsRef.current[idx].queue[0].time < audioContext.currentTime
        ) {
          thisNote = graphicsRef.current[idx].queue[0].step;
          graphicsRef.current[idx].queue.splice(0, 1);
        }
        if (lastNote !== thisNote
            && rhythm.loopRefs[lastNote].current
            && rhythm.loopRefs[thisNote].current
        ) {
          const previousFill = rhythm.loopRefs[thisNote].current.style.fill;
          const previousStroke = rhythm.loopRefs[thisNote].current.style.stroke;
          rhythm.loopRefs[lastNote].current.style.fill = previousFill;
          rhythm.loopRefs[lastNote].current.style.stroke = previousStroke;

          if (rhythm.loop[thisNote]) {
            rhythm.loopRefs[thisNote].current.style.fill = 'white';
          } else {
            rhythm.loopRefs[thisNote].current.style.stroke = 'white';
          }

          graphicsRef.current[idx].lastDrawn = thisNote;
        }
      }
    });
    requestAnimationFrame(draw);
  };

  const scheduler = () => {
    /*
      Scheduling lookahead loop governed by metronome (master clock)
    */
    while (
      sequencerRef.current.metronome.nextNoteTime < (
        audioContext.currentTime + state.scheduleAheadTime
      )
    ) {
      scheduleNotes();
      generateNextNotes();
      requestAnimationFrame(draw);
    }

    sequencerRef.current.timerID = window.setTimeout(scheduler, state.lookahead);
  };

  const startSeq = () => {
    if (!rhythmsRef.current.length || sequencerRef.current.timerID !== 'notplaying') {
      return;
    }

    if (!state.unlocked) {
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      setState({ ...state, unlocked: true });
    }

    const currentTime = parseFloat(audioContext.currentTime);

    sequencerRef.current.metronome.nextNoteTime = currentTime;
    sequencerRef.current.nextNoteTimes = sequencerRef.current.nextNoteTimes.map(() => (
      {
        currentStep: 0,
        playedStep: false,
        time: currentTime,
      }
    ));

    scheduler();
  };

  const stopSeq = () => {
    window.clearTimeout(sequencerRef.current.timerID);
    sequencerRef.current.timerID = 'notplaying';

    resetNextNoteTimes();
    resetGraphics();

    sequencerRef.current.metronome = {
      current16th: 0,
      nextNoteTime: 0,
    };
  };

  const toggleMetronome = () => setState({
    ...state,
    metronome: !state.metronome,
  });

  return (
    <SequencerContext.Provider value={{
      state, setState, startSeq, stopSeq, toggleMetronome, setTempo,
    }}
    >
      {children}
    </SequencerContext.Provider>
  );
};

export const useSequencer = () => useContext(SequencerContext);
