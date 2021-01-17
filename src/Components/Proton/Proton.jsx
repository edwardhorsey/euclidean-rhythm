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

  const updateLoop = () => {
    const rhythms = [...rhythmsContext.state];
    rhythms[circleIdx].loop[idx] = !rhythms[circleIdx].loop[idx];
    rhythmsContext.setState(rhythms);
  };

  const transform = `rotate(${deg}, ${width}, ${height})`;
  const ref = rhythmsContext.state[circleIdx].loopRefs[idx];
  return (
    <circle
      cx={width}
      cy={cy}
      r="5"
      transform={transform}
      key={`${deg}${cy}`}
      opacity="1"
      fill={on ? stroke : 'transparent'}
      stroke={stroke}
      onClick={() => updateLoop()}
      ref={ref}
    />
  );
};

export default Proton;
