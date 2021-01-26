import React, { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import Proton from '../Proton';
import styles from './PatternGraphic.module.scss';
import { colours } from '../../engine/graphics/colours';
import { SIDE, RADIUS, CIRCLE_GAP } from '../../engine/graphics/constants';

const circleKeys = [...Array(5)].map(() => nanoid());
const protonKeys = [...Array(160)].map(() => nanoid());

const createCircles = (patterns, svg, keys, coloursArr) => {
  const {
    width, height, radiusBase, circleGap,
  } = svg;

  return patterns.map((pattern, idx) => (
    <circle
      key={keys[idx]}
      cx={width}
      cy={height}
      r={radiusBase - (idx * circleGap[patterns.length - 1])}
      stroke={coloursArr[pattern.id]}
      strokeWidth="1"
      fill="transparent"
    />
  ));
};

const createCircleProtons = (
  numPatterns,
  numProtons,
  circleIdx,
  loop,
  svg,
  keys,
  coloursArr,
  patternId,
) => {
  const {
    width, height, radiusBase, circleGap,
  } = svg;

  return [...Array(numProtons)].map((_, idx) => (
    <Proton
      key={keys[circleIdx * 32 + idx]}
      circleIdx={circleIdx}
      idx={idx}
      width={width}
      height={height}
      deg={(360 / numProtons) * idx}
      cy={(height - radiusBase) + (circleIdx * circleGap[numPatterns - 1])}
      stroke={coloursArr[patternId]}
      on={!!loop[idx]}
    />
  ));
};

const createAllProtons = (patterns, svg, keys, coloursArr) => patterns.map((pattern, circleIdx) => {
  const { division, loop, id } = pattern;

  return createCircleProtons(patterns.length, division, circleIdx, loop, svg, keys, coloursArr, id);
});

export const PatternGraphic = ({ patterns }) => {
  const [state] = useState({
    viewbox: `0 0 ${2 * SIDE} ${2 * SIDE}`,
    svg: {
      width: SIDE,
      height: SIDE,
      radiusBase: RADIUS,
      circleGap: CIRCLE_GAP,
    },
  });

  const { viewbox, svg } = state;

  const circles = useMemo(() => (
    createCircles(patterns, svg, circleKeys, colours)
  ), [patterns, svg, colours]);

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
