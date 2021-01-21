import React, { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import Proton from '../Proton';
import styles from './PatternGraphic.module.scss';
import { colours, grayscale } from '../../engine/graphics/colours';

const SIDE = 300;
const RADIUS = 0.9 * SIDE;
const CIRCLE_GAP = 40;

const circleKeys = [...Array(5)].map(() => nanoid());
const protonKeys = [...Array(160)].map(() => nanoid());

const createCircles = (numPatterns, svg, keys, coloursArr) => {
  const { width, height, radiusBase } = svg;
  return [...Array(numPatterns)].map((_, i) => (
    <circle
      key={keys[i]}
      cx={width}
      cy={height}
      r={radiusBase - (i * CIRCLE_GAP)}
      stroke={coloursArr[i]}
      strokeWidth="1"
      fill="transparent"
    />
  ));
};

const createCircleProtons = (numProtons, circleIdx, loop, svg, keys, coloursArr) => {
  const { width, height, radiusBase } = svg;
  return [...Array(numProtons)].map((_, idx) => (
    <Proton
      key={keys[circleIdx * 32 + idx]}
      circleIdx={circleIdx}
      idx={idx}
      width={width}
      height={height}
      deg={(360 / numProtons) * idx}
      cy={(height - radiusBase) + (circleIdx * CIRCLE_GAP)}
      stroke={coloursArr[circleIdx]}
      on={!!loop[idx]}
    />
  ));
};

const createAllProtons = (patterns, svg, keys, coloursArr) => patterns.map((pattern, circleIdx) => {
  const { division, loop } = pattern;
  return createCircleProtons(division, circleIdx, loop, svg, keys, coloursArr);
});

export const PatternGraphic = ({ patterns }) => {
  const [state] = useState({
    viewbox: `0 0 ${2 * SIDE} ${2 * SIDE}`,
    svg: {
      width: SIDE,
      height: SIDE,
      radiusBase: RADIUS,
    },
  });

  const { viewbox, svg } = state;

  const circles = useMemo(() => (
    createCircles(patterns.length, svg, circleKeys, colours)
  ), [patterns.length, svg, colours]);

  const protons = useMemo(() => (
    createAllProtons(patterns, svg, protonKeys, colours)
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
