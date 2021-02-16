import React from 'react';
import styles from './Button.module.scss';

export const Button = ({ text, logic }) => (
  <button type="button" className={styles.Button} onClick={logic}>{text}</button>
);

export default Button;
