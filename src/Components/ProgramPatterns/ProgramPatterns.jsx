import React from 'react';
import { nanoid } from 'nanoid';
import PatternStats from '../PatternStats';
import PatternGraphic from '../PatternGraphic';
import styles from './ProgramPatterns.module.scss';

const keys = [...Array(5)].map(() => nanoid());

export const ProgramPatterns = ({ patterns }) => (
  <div className={styles.ProgramPatterns}>
    <div className={styles.graphic}>
      <PatternGraphic patterns={patterns} />
    </div>
    <div className={styles.sidebar}>
      {patterns.map((rhythm, i) => (
        <PatternStats key={keys[i]} rhythm={rhythm} patternIdx={i} />
      ))}
    </div>
  </div>
);

export default ProgramPatterns;
