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
      { id: rhythm.id, currentStep: 0 }
    ));
  };

  const resetGraphicsRef = () => {
    rhythmsRef.current.forEach((rhythm, idx) => {
      rhythm.loop.forEach((_, stepNum) => {
        rhythmsContext.domRefs[rhythm.id][stepNum].current.style = '';
      });

      graphicsRef.current[idx] = { id: rhythm.id, queue: [], lastDrawn: 0 };
    });
  };

  const setTempo = (event) => setState({ ...state, tempo: event.target.value });

  useEffect(() => {
    rhythmsRef.current = rhythmsContext.state;
    sequencerRef.current.metronome.on = state.metronome;
    sequencerRef.current.tempo = state.tempo;

    if (sequencerRef.current.timerID === 'notplaying') {
      resetNextNoteTimes();
      resetGraphicsRef();
    }

    if (
      rhythmsRef.current.length > sequencerRef.current.nextNoteTimes.length
      || rhythmsRef.current.length > graphicsRef.current.length
    ) {
      rhythmsRef.current.forEach((rhythm, idx) => {
        sequencerRef.current.nextNoteTimes[idx] = (
          sequencerRef.current.nextNoteTimes[idx] ?? { id: rhythm.id, currentStep: 0 }
        );

        graphicsRef.current[idx] = (
          graphicsRef.current[idx] ?? { id: rhythm.id, queue: [], lastDrawn: 0 }
        );
      });
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
  });

  const generateNextNotes = () => {
    const secondsPerQuarterNote = 60.0 / sequencerRef.current.tempo;
    const single16thNote = secondsPerQuarterNote / 4;

    sequencerRef.current.metronome.current16th += 1;
    sequencerRef.current.metronome.nextNoteTime += single16thNote;

    if (sequencerRef.current.metronome.current16th === 16) {
      sequencerRef.current.metronome.current16th = 0;
    }

    sequencerRef.current.nextNoteTimes = sequencerRef.current.nextNoteTimes.map((nextNote, idx) => {
      let currentStep = nextNote.currentStep + 1;

      if (currentStep >= rhythmsRef.current[idx].division) {
        currentStep = 0;
      }

      return { ...nextNote, currentStep };
    });
  };

  const scheduleNotes = () => {
    /*
      Play rhythmns
    */
    rhythmsRef.current.forEach((rhythm, idx) => {
      /*
        Add scheduled note to graphics queue
      */
      if (typeof graphicsRef.current[idx] !== 'undefined') {
        graphicsRef.current[idx].queue.push({
          step: sequencerRef.current.nextNoteTimes[idx].currentStep,
          time: sequencerRef.current.metronome.nextNoteTime,
        });
      }

      /*
        Schedule note to Oscillator
      */
      if (
        !rhythm.mute
        && rhythm.loop[sequencerRef.current.nextNoteTimes[idx].currentStep]
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

        if (
          lastNote !== thisNote
          && rhythmsContext.domRefs[rhythm.id][lastNote].current
          && rhythmsContext.domRefs[rhythm.id][thisNote].current
        ) {
          const previousFill = rhythmsContext.domRefs[rhythm.id][thisNote].current.style.fill;
          const previousStroke = rhythmsContext.domRefs[rhythm.id][thisNote].current.style.stroke;
          rhythmsContext.domRefs[rhythm.id][lastNote].current.style.fill = previousFill;
          rhythmsContext.domRefs[rhythm.id][lastNote].current.style.stroke = previousStroke;

          if (rhythm.loop[thisNote] === 1) {
            rhythmsContext.domRefs[rhythm.id][thisNote].current.style.fill = 'white';
          } else {
            rhythmsContext.domRefs[rhythm.id][thisNote].current.style.stroke = 'white';
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
    if (
      !rhythmsRef.current.length
      || sequencerRef.current.timerID !== 'notplaying'
    ) {
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

    scheduler();
  };

  const stopSeq = () => {
    window.clearTimeout(sequencerRef.current.timerID);
    sequencerRef.current.timerID = 'notplaying';

    resetNextNoteTimes();
    resetGraphicsRef();

    sequencerRef.current.metronome = {
      current16th: 0,
      nextNoteTime: 0,
    };
  };

  const toggleMetronome = () => setState({ ...state, metronome: !state.metronome });

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
