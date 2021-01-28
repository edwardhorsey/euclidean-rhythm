import React from 'react';
import { nanoid } from 'nanoid';
import styles from './PatternStats.module.scss';
import { useRhythms } from '../../engine/contexts/Rhythms';
import { findNoteName, pentatonicC } from '../../engine/scales/getFrequency';
import { colours } from '../../engine/graphics/colours';
import ControlsButton from '../ControlsButton';
import Dropdown from '../Dropdown';

const frequencyDropdownKey = [...Array(160)].map(() => nanoid());
const onsetKeys = [...Array(160)].map(() => nanoid());
const loopLengthKeys = [...Array(160)].map(() => nanoid());
const maxLoopLength = 32;

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

  const getPitchOptions = (pentatonic) => {
    console.log('running getPitchOptions');
    return pentatonic.map((note, idx) => (
      <option key={frequencyDropdownKey[patternIdx * 32 + idx]} id={idx}>
        {note.name}
      </option>
    ));
  };

  const getOnsetOptions = (division) => {
    console.log('running getOnsetOptions');
    return [...Array(division - 1).keys()].map((_, idx) => (
      <option key={onsetKeys[patternIdx * 32 + idx]}>
        {idx + 1}
      </option>
    ));
  };

  const getLoopOptions = (loopLength) => {
    console.log('running getLoopOptions');
    return [...Array(loopLength - 2).keys()].map((_, idx) => (
      <option key={loopLengthKeys[patternIdx * 32 + idx]}>
        {idx + 3}
      </option>
    ));
  };

  const pitchOptions = getPitchOptions(pentatonicC);
  const onsetOptions = getOnsetOptions(rhythm.division);
  const loopOptions = getLoopOptions(maxLoopLength);

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
        <Dropdown
          title="Pitch:"
          patternIdx={patternIdx}
          defaultValue={findNoteName(rhythm)}
          logic={(e) => updateFrequency(e.target.value, e.target.name)}
          options={pitchOptions}
        />
        <Dropdown
          title="Onsets:"
          patternIdx={patternIdx}
          defaultValue={rhythm.onset}
          logic={(e) => updateOnset(Number(e.target.value), e.target.name)}
          options={onsetOptions}
        />
        <Dropdown
          title="Loop length:"
          patternIdx={patternIdx}
          defaultValue={rhythm.division}
          logic={(e) => updateDivision(Number(e.target.value), e.target.name)}
          options={loopOptions}
        />
      </div>
    </article>
  );
};

export default PatternStats;
