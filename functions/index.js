'use strict';

const { ApiAiApp } = require('actions-on-google');
const functions = require('firebase-functions');
const strings = require('./strings');
const i18n = require('i18n');
const format = require('string-format');

i18n.configure({
  locales: ['en-US', 'it-IT'],
  directory: __dirname + '/locales',
  defaultLocale: 'en-US'
});

const Actions = {
  LEARN_CHORD: 'learn.chord',
};

const CHORD_ARGUMENT = 'chord';

const learnChord = app => {
  const chords = strings.chords;
  console.log(`chords ` + chords);
  const input = app.getArgument(CHORD_ARGUMENT)
  const chord = chords[input]
  
  if (chord != undefined) {
  	if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
		return app.ask(app.buildRichResponse()
			.addSimpleResponse(format(i18n.__('CHORD_DESC'), input, i18n.__('WHAT_NEXT')))
			.addBasicCard(app.buildBasicCard(buildString(chord))
			  .setTitle(format(i18n.__('CHORD_TITLE'), input))
			  .setImage('https://github.com/hitherejoe/Fret/blob/master/functions/images/' + input + '.png?raw=true', 'The ' + input + ' chord')));
  	} else {
 		return app.ask(buildString(chord) + ". " + i18n.__('WHAT_NEXT'))
 	}
  }
  return app.tell(i18n.__('ERROR_NOT_FOUND'))
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
		return i18n.__('STRING_MUTED')
	} else if (note == '0') {
		return i18n.__('STRING_OPEN')
	} else {
		return i18n.__('STRING_FRET')
	}
}

const actionMap = new Map();
actionMap.set(Actions.LEARN_CHORD, learnChord);

const fret = functions.https.onRequest((request, response) => {
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);
  const i18n = require('i18n');
  const app = new ApiAiApp({ request, response });
  console.log(`chordLOCAELLELEs ` + app.getUserLocale());
  i18n.setLocale(app.getUserLocale());
  app.handleRequest(actionMap);
});


module.exports = {
  fret
};