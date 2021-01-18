import React from 'react';
import { useRhythms } from '../../engine/contexts/Rhythms';

export const Proton = ({
  width,
  height,
  deg,
  cy,
  stroke,
  on,
  circleIdx,
  idx,
}) => {
  const rhythmsContext = useRhythms();
  const { updateLoop } = rhythmsContext;

  const transform = `rotate(${deg}, ${width}, ${height})`;
  const ref = rhythmsContext.state[circleIdx].loopRefs[idx];
  return (
    <circle
      cx={width}
      cy={cy}
      r="10"
      transform={transform}
      key={`${deg}${cy}`}
      opacity="1"
      fill={on ? stroke : 'transparent'}
      stroke={stroke}
      onClick={() => updateLoop(circleIdx, idx)}
      ref={ref}
    />
  );
};

export default Proton;
