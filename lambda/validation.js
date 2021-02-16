const superStruct = require('superstruct');

const { string, object, number, array } = superStruct;

const RhythmType = array(
  object({
    name: string(),
    loop: array(number()),
  })
);

module.exports = RhythmType;
