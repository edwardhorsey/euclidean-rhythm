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
  const { createRhythm, resetRhythms } = rhythmsContext;
  const rhythms = rhythmsContext.state;
  const [midiUrl, setMidiUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const createMidiFile = () => {
    setMidiUrl('');
    setLoading(true);
    getMidiFile(rhythms)
      .then((data) => setMidiUrl(data.midiFile))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <main className={styles.LandingPage}>
        <section className={styles.navButtons}>
          <div className={styles.tempoButton}>
            <p>{`Tempo: ${tempo}`}</p>
            <TempoButton />
          </div>
          <div className={styles.seqButtonsRow}>
            <Button text="Create rhythm" logic={createRhythm} />
            <Button text="Start" logic={startSeq} />
            <Button text="Stop" logic={stopSeq} />
            <Button text="Clear" logic={resetRhythms} />
          </div>
          <div className={styles.seqButtonsRow}>
            <Button text={metronome ? 'Metronome ON' : 'Metronome OFF'} logic={toggleMetronome} />
            <div className={styles.downloadButton}>
              <Button text="Generate MIDI file" logic={createMidiFile} />
            </div>
          </div>
          <div className={styles.seqButtonsRow}>
            {loading && <p>Loading...</p>}
            {!loading && midiUrl && (
              <a
                className={styles.downloadLink}
                href={midiUrl}
                rel="noreferrer"
                target="_blank"
              >
                Download
              </a>
            )}
          </div>
        </section>
        <ProgramPatterns rhythms={rhythms} aa={5} bb={10} />
      </main>
      <footer className={styles.Footer}>
        Built by{' '}
        <a href="https://github.com/edwardhorsey" rel="no-referrer" target="_blank">
          Edward Horsey
        </a>{' '}
        © {new Date().getFullYear()}
      </footer>
    </>
  );
};

export default LandingPage;
