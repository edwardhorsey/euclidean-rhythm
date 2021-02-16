'use strict';

const generateMidiUrl = require('./generateMidi');
const RhythmType = require('./validation');
const superStruct = require('superstruct');
const { assert } = superStruct;

module.exports.createMidiFile = async event => {
  const parsedRhythm = JSON.parse(event.body);
  assert(parsedRhythm, RhythmType);
  const location = await generateMidiUrl(parsedRhythm);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(
      {
        message: 'Success',
        midiFile: location,
      },
      null,
      2
    ),
  };
  return response;
};