import React from 'react';
import { nanoid } from 'nanoid';
import styles from './PatternStats.module.scss';
import { useRhythms } from '../../engine/contexts/Rhythms';
import { findNoteName, pentatonicC } from '../../engine/scales/getFrequency';

const frequencyDropdownKey = [...Array(160)].map(() => nanoid());
const beatUnitKeys = [...Array(160)].map(() => nanoid());

export const PatternStats = ({ rhythm, patternIdx }) => {
  const rhythmsContext = useRhythms();
  const {
    updateDivision,
    updateFrequency,
    removeRhythm,
    fillLoop,
    muteRhythm,
    updateOnset,
  } = rhythmsContext;

  return (
    <article className={styles.PatternStats}>
      <div className={styles.name}>
        <h3>
          Rhythm
          {rhythm.id}
        </h3>
        <button type="button" className={styles.clearButton} onClick={() => fillLoop(patternIdx, false)}>
          clear
        </button>
        <button type="button" className={styles.fillButton} onClick={() => fillLoop(patternIdx, true)}>
          fill
        </button>
        <button type="button" className={styles.muteButton} onClick={() => muteRhythm(patternIdx)}>
          mute
        </button>
        <button type="button" className={styles.removeButton} onClick={() => removeRhythm(patternIdx)}>
          X
        </button>
      </div>

      <div className={styles.dropdowns}>
        <div>
          <p>
            Note:
          </p>
          <select
            name={patternIdx}
            defaultValue={findNoteName(rhythm)}
            onChange={(e) => updateFrequency(e.target.value, e.target.name)}
          >
            {pentatonicC.map((note, idx) => (
              <option key={frequencyDropdownKey[patternIdx * 32 + idx]} id={idx}>
                {note.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>Onsets:</p>
          <select
            name={patternIdx}
            defaultValue={rhythm.onset}
            onChange={(e) => updateOnset(Number(e.target.value), e.target.name)}
          >
            {[...Array(rhythm.division - 1).keys()].map((_, idx) => (
              <option key={beatUnitKeys[patternIdx * 32 + idx]}>
                {idx + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>Loop length:</p>
          <select
            name={patternIdx}
            defaultValue={rhythm.division}
            onChange={(e) => updateDivision(Number(e.target.value), e.target.name)}
          >
            {[...Array(30).keys()].map((_, idx) => (
              <option key={beatUnitKeys[patternIdx * 32 + idx]}>
                {idx + 3}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
};

export default PatternStats;
