import React from 'react';
import { useRhythms } from '../../engine/contexts/Rhythms';
import { PROTON_SIZE } from '../../engine/graphics/constants';

export const Proton = ({
  width,
  height,
  deg,
  cy,
  stroke,
  on,
  circleIdx,
  idx,
  rhythmId,
}) => {
  const rhythmsContext = useRhythms();
  const { updateLoop, domRefs } = rhythmsContext;
  const transform = `rotate(${deg}, ${width}, ${height})`;
  const ref = domRefs[rhythmId][idx];

  return (
    <circle
      cx={width}
      cy={cy}
      r={PROTON_SIZE}
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
