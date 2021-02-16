export const bresenhamEuclidean = (onsets, totalPulses) => {
  const onsetsFixed = onsets + 1;
  let previous = 0;
  const pattern = [];

  for (let i = 0; i < totalPulses; i += 1) {
    const xVal = Math.floor(((onsetsFixed) / totalPulses) * i);
    pattern.push(xVal === previous ? 0 : 1);
    previous = xVal;
  }

  return pattern;
};

export default bresenhamEuclidean;
