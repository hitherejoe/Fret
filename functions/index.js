'use strict';

const { ApiAiApp } = require('actions-on-google');
const functions = require('firebase-functions');
const strings = require('./strings');

const Actions = {
  LEARN_CHORD: 'learn.chord',
};

const CHORD_ARGUMENT = 'chord';

const learnChord = app => {
  const chords = strings.chords;
  const input = app.getArgument(CHORD_ARGUMENT)
  const chord = chords[input]
  
  if (chord != undefined) {
  	if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
		return app.ask(app.buildRichResponse()
			.addSimpleResponse('The ' + input + ' chord can be played like this. ' + strings.general.whatNext)
			.addBasicCard(app.buildBasicCard(buildString(chord))
			  .setTitle('The ' + input + ' chord')
			  .setImage('https://github.com/hitherejoe/Fret/blob/master/functions/images/' + input + '.png?raw=true', 'The ' + input + ' chord')));
  	} else {
 		return app.ask(buildString(chord) + ". " + strings.general.whatNext)
 	}
  }
  return app.tell(strings.error.chordNotFound)
};

function buildString(sequence) {
	var chordSequence = "";
	const guitarStrings = strings.guitarStrings;

	for (var i = 0, len = sequence.length; i < len; i++) {
		var note = guitarStrings[i] + " " + buildNote(sequence[i])
		if (sequence[i] != 'X' && sequence[i] != '0') note += " " + sequence[i]
		if (i < len - 1) note += ", "
		chordSequence += note
	}
	return chordSequence;
}

function buildNote(note) {
	const notes = strings.notes;
	if (note == 'X') {
		return notes.mutedString
	} else if (note == '0') {
		return notes.openString
	} else {
		return notes.frettedString
	}
}

const actionMap = new Map();
actionMap.set(Actions.LEARN_CHORD, learnChord);

const fret = functions.https.onRequest((request, response) => {
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);
  const app = new ApiAiApp({ request, response });
  app.handleRequest(actionMap);
});

module.exports = {
  fret
};