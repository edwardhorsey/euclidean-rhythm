import React, { useState } from 'react';
import { WebAudio } from './engine/contexts/WebAudio';
import styles from './App.module.scss';
import LandingPage from './Components/LandingPage';
import { Sequencer } from './engine/contexts/Sequencer';
import { Rhythms } from './engine/contexts/Rhythms';

function App() {
  const [dark, toggleDark] = useState(true);

  const appStyle = `${styles.App} ${dark ? styles.dark : styles.light}`;
  const darkModeButton = (
    <button
      className={styles.darkModeButton}
      type="button"
      onClick={() => toggleDark(!dark)}
    >
      darkmode
      {dark ? ' OFF' : ' ON'}
    </button>
  );

  return (
    <div className={appStyle}>
      <WebAudio>
        <Rhythms>
          <Sequencer>
            <h2>Euclidean Midi Generator</h2>
            {darkModeButton}
            <LandingPage />
          </Sequencer>
        </Rhythms>
      </WebAudio>
    </div>
  );
}

export default App;
