import React from 'react';
import { nanoid } from 'nanoid';
import styles from './PatternStats.module.scss';
import { useRhythms } from '../../engine/contexts/Rhythms';
import { findNoteName, pentatonicC } from '../../engine/scales/getFrequency';
import { colours } from '../../engine/graphics/colours';
import ControlsButton from '../ControlsButton';

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

  const patternColour = {
    backgroundColor: colours[rhythm.id],
  };

  return (
    <article className={styles.PatternStats}>
      <div className={styles.name}>
        <div className={styles.patternBadge} style={patternColour}>
          <span>Rhythm</span>
        </div>
        <ControlsButton text="clear" logic={() => fillLoop(patternIdx, false)} type="fillClearButton" />
        <ControlsButton text="fill" logic={() => fillLoop(patternIdx, true)} type="fillClearButton" />
        <ControlsButton text="mute" logic={() => muteRhythm(patternIdx)} type="muteButton" />
        <ControlsButton text="X" logic={() => removeRhythm(patternIdx)} type="removeButton" />
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
