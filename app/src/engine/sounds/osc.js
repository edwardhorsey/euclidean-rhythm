const makeDistortionCurve = (amount, sampleRate) => {
  const k = amount;
  const nSamples = typeof sampleRate === 'number' ? sampleRate : 44100;
  const curve = new Float32Array(nSamples);
  let x;
  for (let i = 0; i < nSamples; i += 1) {
    x = (i * 2) / nSamples - 1;
    curve[i] = (3 + k) * (Math.atan(Math.sinh(x * 0.25) * 5) / (Math.PI + k * Math.abs(x)));
  }
  return curve;
};

export const distortionCurve = makeDistortionCurve(20, 48000);

export const playOscillator = (audioContext, wave, frequency, time) => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = wave;
  oscillator.frequency.value = frequency;

  const gain = audioContext.createGain();
  gain.gain.value = 0.00001;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  gain.gain.exponentialRampToValueAtTime(0.2, time + 0.03);
  oscillator.start(time);
  gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.2);
  oscillator.stop(time + 0.25);
};
