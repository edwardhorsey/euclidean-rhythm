// import React, { useState } from 'react';
import React from 'react';
import { nanoid } from 'nanoid';
import styles from './PatternStats.module.scss';
import { useRhythms } from '../../engine/contexts/Rhythms';
import { findNoteName, pentatonicC } from '../../engine/scales/getFrequency';

const frequencyDropdownKey = [...Array(80)].map(() => nanoid());
const beatUnitKeys = [...Array(80)].map(() => nanoid());

export const PatternStats = ({ rhythm, patternIdx }) => {
  const rhythmsContext = useRhythms();
  const { updateDivision, updateFrequency, removeRhythm } = rhythmsContext;

  return (
    <article className={styles.PatternStats}>
      <div className={styles.name}>
        <h3>
          Rhythm
          {patternIdx + 1}
        </h3>
        <button type="button" className={styles.removeButton} onClick={() => removeRhythm(patternIdx)}>
          X
        </button>
      </div>

      <p>
        Frequency:
        {rhythm.freq}
      </p>

      <select
        name={patternIdx}
        defaultValue={findNoteName(rhythm)}
        onChange={(e) => updateFrequency(e.target.value, e.target.name)}
      >
        {pentatonicC.map((note, idx) => (
          <option key={frequencyDropdownKey[patternIdx * 16 + idx]} id={idx}>{note.name}</option>
        ))}
      </select>

      <p>Loop length:</p>

      <select
        name={patternIdx}
        defaultValue={rhythm.division}
        onChange={(e) => updateDivision(e.target.value, e.target.name)}
      >
        {[...Array(16).keys()].map((_, idx) => (
          <option key={beatUnitKeys[patternIdx * 16 + idx]}>{idx + 1}</option>
        ))}
      </select>
    </article>
  );
};

export default PatternStats;
