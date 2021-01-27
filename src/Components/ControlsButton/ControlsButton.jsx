import React from 'react';
import styles from './ControlsButton.module.scss';

export const Button = ({ text, type, logic }) => (
  <button type="button" className={`${styles.ControlsButton} ${styles[type]}`} onClick={logic}>{text}</button>
);

export default Button;
