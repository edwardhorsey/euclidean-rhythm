import React, { useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import Proton from '../Proton';
import styles from './PatternGraphic.module.scss';
import { colours } from '../../engine/graphics/colours';
import { SIDE, RADIUS, CIRCLE_GAP } from '../../engine/graphics/constants';

const circleKeys = [...Array(5)].map(() => nanoid());
const protonKeys = [...Array(160)].map(() => nanoid());

const createCircles = (rhythms, svg, keys, coloursArr) => {
  const {
    width, height, radiusBase, circleGap,
  } = svg;

  return rhythms.map((rhythm, idx) => (
    <circle
      key={keys[idx]}
      cx={width}
      cy={height}
      r={radiusBase - (idx * circleGap[rhythms.length - 1])}
      stroke={coloursArr[rhythm.id]}
      strokeWidth="1"
      fill="transparent"
    />
  ));
};

const createCircleProtons = (
  numRhythms,
  numProtons,
  circleIdx,
  loop,
  svg,
  keys,
  coloursArr,
  rhythmId,
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
      cy={(height - radiusBase) + (circleIdx * circleGap[numRhythms - 1])}
      stroke={coloursArr[rhythmId]}
      on={!!loop[idx]}
    />
  ));
};

const createAllProtons = (rhythms, svg, keys, coloursArr) => rhythms.map((rhythm, circleIdx) => {
  const { division, loop, id } = rhythm;

  return createCircleProtons(rhythms.length, division, circleIdx, loop, svg, keys, coloursArr, id);
});

export const patternGraphic = ({ rhythms }) => {
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
    createCircles(rhythms, svg, circleKeys, colours)
  ), [rhythms, svg, colours]);

  const protons = useMemo(() => (
    createAllProtons(rhythms, svg, protonKeys, colours)
  ), [rhythms, svg, colours]);

  return (
    <div className={styles.PatternGraphic}>
      <svg viewBox={viewbox}>
        {circles}
        {protons}
      </svg>
    </div>
  );
};

export default patternGraphic;
