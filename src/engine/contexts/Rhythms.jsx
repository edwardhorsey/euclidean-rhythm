import React, { useState, useContext, createRef } from 'react';
import { pentatonicC } from '../scales/getFrequency';
import { bresenhamEuclidean } from '../scales/getEuclid';

export const RhythmsContext = React.createContext(null);

export const Rhythms = ({ children }) => {
  const [state, setState] = useState([]);
  const [refs] = useState({
    A: [...Array(32)].map(() => createRef()),
    B: [...Array(32)].map(() => createRef()),
    C: [...Array(32)].map(() => createRef()),
    D: [...Array(32)].map(() => createRef()),
    E: [...Array(32)].map(() => createRef()),
  });
  const [rhythmIds] = useState(['A', 'B', 'C', 'D', 'E']);

  const provideRhythmId = () => {
    if (state.length === 0) return rhythmIds[0];
    const existingIds = state.map((rhythm) => rhythm.id);
    const availableIds = rhythmIds.filter((id) => !existingIds.includes(id));
    return availableIds[0];
  };

  const createRhythm = () => {
    if (state.length > 4) return;
    const division = Math.round(Math.random() * 31) + 2;
    const onset = Math.round(Math.random() * division) + 1;
    const randomFreq = Math.round(Math.random() * (pentatonicC.length - 1));
    const id = provideRhythmId();

    const rhythms = [
      ...state,
      {
        id,
        freq: pentatonicC[randomFreq].frequency,
        loop: bresenhamEuclidean(onset, division),
        loopRefs: refs[id],
        onset,
        division,
        mute: false,
      },
    ];

    setState(rhythms);
  };

  const updateDivision = (division, patternIdx) => {
    const rhythms = [...state];
    const newRhythm = rhythms[patternIdx];
    newRhythm.division = division;
    newRhythm.loop = bresenhamEuclidean(newRhythm.onset, division);
    rhythms[patternIdx] = newRhythm;
    setState(rhythms);
  };

  const updateOnset = (onset, patternIdx) => {
    const rhythms = [...state];
    const loop = bresenhamEuclidean(onset, rhythms[patternIdx].division);
    rhythms[patternIdx].loop = loop;
    rhythms[patternIdx].onset = onset;
    setState(rhythms);
  };

  const updateFrequency = (name, patternIdx) => {
    const rhythms = [...state];
    const newRhythm = rhythms[patternIdx];
    newRhythm.freq = pentatonicC.find((note) => note.name === name).frequency;
    rhythms[patternIdx] = newRhythm;
    setState(rhythms);
  };

  const fillLoop = (circleIdx, on = true) => {
    const rhythms = [...state];
    const { length } = rhythms[circleIdx].loop;
    rhythms[circleIdx].loop = [...Array(length)].map(() => (on ? 1 : 0));
    setState(rhythms);
  };

  const muteRhythm = (circleIdx) => {
    const rhythms = [...state];
    rhythms[circleIdx].mute = !rhythms[circleIdx].mute;
    setState(rhythms);
  };

  const updateLoop = (circleIdx, idx) => {
    const rhythms = [...state];
    rhythms[circleIdx].loop[idx] = !rhythms[circleIdx].loop[idx];
    setState(rhythms);
  };

  const removeRhythm = (patternIdx) => {
    const rhythms = [...state];
    rhythms.splice(patternIdx, 1);
    setState(rhythms);
  };

  return (
    <RhythmsContext.Provider value={{
      state,
      setState,
      createRhythm,
      updateDivision,
      updateOnset,
      updateFrequency,
      fillLoop,
      muteRhythm,
      updateLoop,
      removeRhythm,
    }}
    >
      {children}
    </RhythmsContext.Provider>
  );
};

export const useRhythms = () => useContext(RhythmsContext);
