import { findNoteName } from '../scales/getFrequency';

const getMidiFile = async (rhythms) => {
  const url = process.env.REACT_APP_API_URL;
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
