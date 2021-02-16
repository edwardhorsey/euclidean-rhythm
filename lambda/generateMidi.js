const dataUriToBuffer = require('data-uri-to-buffer');
const MidiWriter = require('midi-writer-js');
const AWS = require('aws-sdk');
require('dotenv').config()

AWS.config.update({region: 'eu-west-1'});
s3 = new AWS.S3();
const BUCKET = process.env.S3_BUCKET;

const createTracks = (rhythmArray) => rhythmArray.map((rhythm, idx) => {
  const track = new MidiWriter.Track();
  track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: Number(idx + 1)}));

  rhythm.loop.forEach((step) => {
    const note = new MidiWriter.NoteEvent({pitch: rhythm.name, duration: 16, velocity: step === 0 ? 1 : 50});
    track.addEvent(note);
  });

  return track;
});

const createBufferFromMidi = (tracks) => {
  const write = new MidiWriter.Writer(tracks);

  return dataUriToBuffer(write.dataUri());
};

const getSignedUrl = (bucket, key) => (
  s3.getSignedUrl('getObject', { Bucket: bucket, Key: key })
);

const uploadS3Object = async (params) => {
  return await s3.upload(params)
    .promise()
    .then(({Bucket, Key}) => getSignedUrl(Bucket, Key))
    .catch(err => err);
};

const generateMidiUrl = async (rhythm) => {
  const midiTracks = createTracks(rhythm);
  const midiFileBuffer = createBufferFromMidi(midiTracks);
  const uploadParams = {
    Bucket: BUCKET,
    Key: `EuclideanRhythm${Date.now()}.mid`,
    Body: midiFileBuffer,
    ContentType: 'audio/midi',
  };

  return uploadS3Object(uploadParams);
};

module.exports = generateMidiUrl;