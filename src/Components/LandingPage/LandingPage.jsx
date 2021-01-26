import React, { useState } from 'react';
import { useSequencer } from '../../engine/contexts/Sequencer';
import { useRhythms } from '../../engine/contexts/Rhythms';
import styles from './LandingPage.module.scss';
import ProgramPatterns from '../ProgramPatterns';
import TempoButton from '../TempoButton';
import getMidiFile from '../../engine/requests/getMidiFile';

export const LandingPage = () => {
  const sequencerContext = useSequencer();
  const rhythmsContext = useRhythms();
  const { createRhythm } = rhythmsContext;
  const { startSeq, stopSeq, toggleMetronome } = sequencerContext;
  const { metronome, tempo } = sequencerContext.state;
  const [midiUrl, setMidiUrl] = useState('');

  const createMidiFile = async () => {
    await getMidiFile(rhythmsContext.state)
      .then((data) => setMidiUrl(data.midiFile));
  };

  return (
    <div className={styles.LandingPage}>
      <div className={styles.tempoButton}>
        <p>
          Tempo:
          {tempo}
        </p>
        <TempoButton />
      </div>
      <div className={styles.seqButtonsRow}>
        <button type="button" onClick={createRhythm}>create rhythm</button>
        <button type="button" onClick={startSeq}>start</button>
        <button type="button" onClick={stopSeq}>stop</button>
      </div>
      <div className={styles.seqButtonsRow}>
        <button type="button" onClick={toggleMetronome}>
          turn metronome
          {metronome ? ' OFF' : ' ON'}
        </button>
        <div className={styles.downloadButton}>
          <button type="button" onClick={createMidiFile}>generate Midi File</button>
          {midiUrl && (
            <a href={midiUrl}>
              <button type="button">Download</button>
            </a>
          )}
        </div>
      </div>
      <ProgramPatterns patterns={rhythmsContext.state} />
    </div>
  );
};

export default LandingPage;
