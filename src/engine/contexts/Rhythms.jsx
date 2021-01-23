import React, { useState, useContext, createRef } from 'react';
import { pentatonicC } from '../scales/getFrequency';
import { bresenhamEuclidean } from '../scales/getEuclid';

export const RhythmsContext = React.createContext(null);

export const Rhythms = ({ children }) => {
  const [state, setState] = useState([]);
  const [refs] = useState([...Array(5)].map(() => ([...Array(32)].map(() => createRef()))));
  console.log(state);
  console.log(refs);

  const createRhythm = () => {
    if (state.length > 4) return;
    const randomDivision = Math.round(Math.random() * 31) + 2;
    const randomOnset = Math.round(Math.random() * randomDivision) + 1;
    const randomFreq = Math.round(Math.random() * pentatonicC.length - 1);
    const rhythms = [
      ...state,
      {
        id: state.length,
        freq: pentatonicC[randomFreq].frequency,
        loop: bresenhamEuclidean(randomOnset, randomDivision),
        loopRefs: refs[state.length],
        onset: randomOnset,
        division: randomDivision,
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

  const clearLoop = (circleIdx) => {
    const rhythms = [...state];
    const { length } = rhythms[circleIdx].loop;
    rhythms[circleIdx].loop = [...Array(length)].map(() => 0);
    setState(rhythms);
  };

  const fillLoop = (circleIdx) => {
    const rhythms = [...state];
    const { length } = rhythms[circleIdx].loop;
    rhythms[circleIdx].loop = [...Array(length)].map(() => 1);
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
      clearLoop,
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
