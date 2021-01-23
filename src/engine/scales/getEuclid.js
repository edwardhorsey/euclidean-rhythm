export const bresenhamEuclidean = (onsets, totalPulses) => {
  let previous = 0;
  const pattern = [];

  for (let i = 0; i < totalPulses; i += 1) {
    const xVal = Math.floor(((onsets) / totalPulses) * i);
    pattern.push(xVal === previous ? 0 : 1);
    previous = xVal;
  }
  return pattern;
};

export default bresenhamEuclidean;
