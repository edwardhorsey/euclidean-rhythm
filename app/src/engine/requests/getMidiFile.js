import { findNoteName } from '../scales/getFrequency';

const getMidiFile = async (rhythms) => {
  const url = 'https://zksgo0swz3.execute-api.eu-west-1.amazonaws.com/dev/createMidiFile';
  const postBody = rhythms.map((rhythm) => ({
    name: findNoteName(rhythm),
    loop: rhythm.loop,
  }));
  const requestMetadata = {
    method: 'POST',
    body: JSON.stringify(postBody),
  };

  return fetch(url, requestMetadata)
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => err);
};

export default getMidiFile;
