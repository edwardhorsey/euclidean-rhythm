import React from 'react';
import { WebAudio } from './engine/contexts/WebAudio';
import LandingPage from './Components/LandingPage';
import { Sequencer } from './engine/contexts/Sequencer';
import { Rhythms } from './engine/contexts/Rhythms';
import styles from './App.module.scss';

const App = () => (
  <main className={styles.App}>
    <WebAudio>
      <Rhythms>
        <Sequencer>
          <h1>Euclidean Midi Generator</h1>
          <LandingPage />
        </Sequencer>
      </Rhythms>
    </WebAudio>
  </main>
);

export default App;
