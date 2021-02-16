const generateMidiUrl = require('./generateMidi');

const test = async () => {
  const exampleRhythmJSON = '[{"name":"A5","loop":[0,1,1,1,0,1,1,1,0,1,1,1,0,1,1]},{"name":"A3","loop":[0,1,1,1,0,1]},{"name":"D4","loop":[0,0,1,1,0,1,1]},{"name":"G3","loop":[0,0,1,1,1,1,1,0,1,1,1,1]},{"name":"G6","loop":[0,1,1,0,1,0,1,1,1,0]}]';

  const location = await generateMidiUrl(JSON.parse(exampleRhythmJSON));
  console.log('Returned URL', location);
};

test();