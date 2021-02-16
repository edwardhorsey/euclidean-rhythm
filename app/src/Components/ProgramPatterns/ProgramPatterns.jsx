import React from 'react';
import { nanoid } from 'nanoid';
import PatternStats from '../PatternStats';
import PatternGraphic from '../PatternGraphic';
import styles from './ProgramPatterns.module.scss';

export const ProgramPatterns = ({ rhythms }) => {
  const keys = rhythms.map(() => nanoid()) ?? [];

  return (
    <section className={styles.ProgramPatterns}>
      <PatternGraphic rhythms={rhythms} />
      <div className={styles.sidebar}>
        {rhythms.map((rhythm, i) => (
          <PatternStats key={keys[i]} rhythm={rhythm} patternIdx={i} />
        ))}
      </div>
    </section>
  );
};

export default ProgramPatterns;
