import React, { useState, useContext, createRef } from 'react';
import { pentatonicC } from '../scales/getFrequency';

export const RhythmsContext = React.createContext(null);

export const Rhythms = ({ children }) => {
  const [state, setState] = useState([]);
  const [refs] = useState([...Array(80)].map(() => createRef()));

  const createRhythm = () => {
    if (state.length > 4) return;
    const randomDivision = Math.round(Math.random() * 15) + 2;
    const rhythms = [
      ...state,
      {
        id: state.length,
        freq: pentatonicC[Math.round(Math.random() * pentatonicC.length)].frequency,
        loop: [...Array(randomDivision)].map(() => {
          const playing = Math.round(Math.random() * 1);
          return playing ? 1 : 0;
        }),
        loopRefs: refs.slice(state.length * 16, (state.length * 16) + 16),
        division: randomDivision,
      },
    ];
    setState(rhythms);
  };

  const updateDivision = (division, patternIdx) => {
    const rhythms = [...state];
    const newRhythm = rhythms[patternIdx];
    newRhythm.division = Number(division);

    if (newRhythm.loop.length > division) {
      newRhythm.loop.splice(division);
    } else if (newRhythm.loop.length < division) {
      while (newRhythm.loop.length < division) {
        newRhythm.loop.push(1);
        newRhythm.loopRefs.push(createRef());
      }
    }

    rhythms[patternIdx] = newRhythm;
    setState(rhythms);
  };

  const updateFrequency = (name, patternIdx) => {
    const rhythms = [...state];
    const newRhythm = rhythms[patternIdx];
    newRhythm.freq = pentatonicC.find((note) => note.name === name).frequency;

    rhythms[patternIdx] = newRhythm;
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
      updateFrequency,
      removeRhythm,
    }}
    >
      {children}
    </RhythmsContext.Provider>
  );
};

export const useRhythms = () => useContext(RhythmsContext);
