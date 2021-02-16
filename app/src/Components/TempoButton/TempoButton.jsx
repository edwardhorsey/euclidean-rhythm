import React from 'react';
import { useSequencer } from '../../engine/contexts/Sequencer';
import styles from './TempoButton.module.scss';

export const TempoButton = () => {
  const sequencerContext = useSequencer();
  const { setTempo } = sequencerContext;
  const { tempo } = sequencerContext.state;

  return (
    <div className={styles.TempoButton}>
      <input
        type="range"
        value={tempo}
        onChange={setTempo}
        min={30}
        max={200}
      />
    </div>
  );
};

export default TempoButton;
