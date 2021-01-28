import React from 'react';
import styles from './Dropdown.module.scss';

export const Dropdown = ({
  title,
  patternIdx,
  defaultValue,
  logic,
  options,
}) => (
  <div className={styles.Dropdown}>
    <p>{title}</p>
    <select name={patternIdx} defaultValue={defaultValue} onChange={logic}>
      {options}
    </select>
  </div>
);

export default Dropdown;
