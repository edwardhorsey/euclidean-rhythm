import React, { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import Proton from '../Proton';
import styles from './PatternGraphic.module.scss';
import colours from '../../engine/graphics/colours';

const createCircles = (numPatterns, svg, coloursArr) => {
  console.log('creating circles');
  const { width, height, radiusBase } = svg;
  return [...Array(numPatterns)].map((_, i) => (
    <circle
      key={nanoid()}
      cx={width}
      cy={height}
      r={radiusBase - (i * 15)}
      stroke={coloursArr[i]}
      strokeWidth="1"
      fill="transparent"
    />
  ));
};

const createCircleProtons = (numProtons, circleIdx, loop, svg, coloursArr) => {
  console.log('creating circle protons');
  const { width, height, radiusBase } = svg;
  return [...Array(numProtons)].map((_, idx) => (
    <Proton
      key={nanoid()}
      circleIdx={circleIdx}
      idx={idx}
      width={width}
      height={height}
      deg={(360 / numProtons) * idx}
      cy={(height - radiusBase) + (circleIdx * 15)}
      stroke={coloursArr[circleIdx]}
      on={!!loop[idx]}
    />
  ));
};

const createAllProtons = (patterns, svg, coloursArr) => patterns.map((pattern, circleIdx) => {
  console.log('creating all protons');
  const { division, loop } = pattern;
  return createCircleProtons(division, circleIdx, loop, svg, coloursArr);
});

export const PatternGraphic = ({ patterns }) => {
  const [state] = useState({
    viewbox: '0 0 200 200',
    svg: {
      width: 100,
      height: 100,
      radiusBase: 90,
    },
  });

  const { viewbox, svg } = state;

  const circles = useMemo(() => (
    createCircles(patterns.length, svg, colours)
  ), [patterns.length, svg, colours]);

  const protons = useMemo(() => (
    createAllProtons(patterns, svg, colours)
  ), [patterns, svg, colours]);

  return (
    <div className={styles.PatternGraphic}>
      <svg viewBox={viewbox}>
        {circles}
        {protons}
      </svg>
    </div>
  );
};

export default PatternGraphic;
