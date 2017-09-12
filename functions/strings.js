const deepFreeze = require('deep-freeze');

const chords = {
    "C": "X32010",
    "D": "XX0232",
    "G": "320003",
    "E": "022100",
    "F": "033211",
    "A": "X02220"
  };

const guitarStrings = [
  "E-string",
  "A-string",
  "D-string",
  "G-string",
  "B-string",
  "E-string"
];

const notes = {
  "mutedString": "muted",
  "openString": "open",
  "frettedString": "fret"
};

const general = {
  "chordPattern": " can be played with ",
  "whatNext": "What would you like to do now?"
};

const error = {
  "chordNotFound": "Oops, I couldn't find that chord. Please try again!",
  "nothingToRepeat": "Oops, there's nothing to repeat!"
};

// Use deepFreeze to make the constant objects immutable so they are not unintentionally modified
module.exports = deepFreeze({
  chords,
  guitarStrings,
  notes,
  general
});