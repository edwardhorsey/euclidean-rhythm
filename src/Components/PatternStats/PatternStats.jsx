import React from 'react';
import { nanoid } from 'nanoid';
import styles from './PatternStats.module.scss';
import { useRhythms } from '../../engine/contexts/Rhythms';
import { pentatonicC, findNoteName } from '../../engine/scales/getFrequency';

const createPitchesDropdown = (scale) => (
  scale.map((note, i) => <option key={nanoid()} id={i}>{note.name}</option>)
);

export const PatternStats = ({ rhythm, patternIdx }) => {
  const rhythmsContext = useRhythms();
  const { updateDivision, updateFrequency, removeRhythm } = rhythmsContext;

  const pitchesDropdown = createPitchesDropdown(pentatonicC);

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
        {pitchesDropdown}
      </select>

      <p>Division:</p>

      <select
        name={patternIdx}
        defaultValue={rhythm.division}
        onChange={(e) => updateDivision(e.target.value, e.target.name)}
      >
        {[...Array(15)].map((_, i) => <option key={nanoid()}>{i + 2}</option>)}
      </select>
    </article>
  );
};

export default PatternStats;
