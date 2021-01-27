import React, { useState } from 'react';
import { useSequencer } from '../../engine/contexts/Sequencer';
import { useRhythms } from '../../engine/contexts/Rhythms';
import styles from './LandingPage.module.scss';
import ProgramPatterns from '../ProgramPatterns';
import TempoButton from '../TempoButton';
import getMidiFile from '../../engine/requests/getMidiFile';
import Button from '../Button/Button';

export const LandingPage = () => {
  const sequencerContext = useSequencer();
  const rhythmsContext = useRhythms();
  const { startSeq, stopSeq, toggleMetronome } = sequencerContext;
  const { metronome, tempo } = sequencerContext.state;
  const { createRhythm } = rhythmsContext;
  const rhythms = rhythmsContext.state;
  const [midiUrl, setMidiUrl] = useState('');

  const createMidiFile = async () => {
    await getMidiFile(rhythms)
      .then((data) => setMidiUrl(data.midiFile));
  };

  return (
    <main className={styles.LandingPage}>
      <section className={styles.navButtons}>
        <div className={styles.tempoButton}>
          <p>{`Tempo: ${tempo}`}</p>
          <TempoButton />
        </div>
        <div className={styles.seqButtonsRow}>
          <Button text="create rhythm" logic={createRhythm} />
          <Button text="start" logic={startSeq} />
          <Button text="stop" logic={stopSeq} />
        </div>
        <div className={styles.seqButtonsRow}>
          <Button text={`turn metronome ${metronome ? ' OFF' : ' ON'}`} logic={toggleMetronome} />
          <div className={styles.downloadButton}>
            <Button text="generate Midi File" logic={createMidiFile} />
            {midiUrl && (
              <a href={midiUrl} rel="noreferrer" target="_blank">Download</a>
            )}
          </div>
        </div>
      </section>
      <ProgramPatterns rhythms={rhythms} />
    </main>
  );
};

export default LandingPage;
