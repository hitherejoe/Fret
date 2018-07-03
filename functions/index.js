'use strict';

const { 
	BasicCard,
SimpleResponse,
	dialogflow } = require('actions-on-google');
const functions = require('firebase-functions');
const app = dialogflow({debug: true});
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

app.intent('', (conv, {input}) => {
	const chords = strings.chords;
	const chord = chords[input]
})
/*
const learnChord = app => {
  const chords = strings.chords;
  const input = app.getArgument(CHORD_ARGUMENT)
  const chord = chords[input]
  
  if (chord != undefined) {
  	if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
  		conv.ask(app.buildRichResponse()
			.addSimpleResponse(format(i18n.__('CHORD_DESC'), input, i18n.__('WHAT_NEXT')))
			.addBasicCard(app.buildBasicCard(buildString(chord))
			  .setTitle(format(i18n.__('CHORD_TITLE'), input))
			  .setImage('https://github.com/hitherejoe/Fret/blob/master/functions/images/' + input + '.png?raw=true', 'The ' + input + ' chord')));
  	} else {
 		//return app.ask(buildString(chord) + ". " + i18n.__('WHAT_NEXT'))

 		conv.ask(new SimpleResponse({
  			speech: buildString(chord) + ". " + i18n.__('WHAT_NEXT'),
  			text: buildString(chord) + ". " + i18n.__('WHAT_NEXT'),
			}));
 	}
  } else {
  	conv.close(i18n.__('ERROR_NOT_FOUND'))
  }
};
*/
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

//const actionMap = new Map();
//actionMap.set(Actions.LEARN_CHORD, learnChord);

app.intent('learn.chord', (conv, {chord}) => {
    const chords = strings.chords;
 // const input = app.getArgument(CHORD_ARGUMENT)
  const input = chords[chord]
console.log(input);
  console.log(chord);
  
  if (chord != undefined) {
  	if (conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
		conv.ask(new BasicCard({
		  text: format(i18n.__('CHORD_DESC'), chord, i18n.__('WHAT_NEXT')), // Note the two spaces before '\n' required for
		                               // a line break to be rendered in the card.
		  title: format(i18n.__('CHORD_TITLE'), chord),
		
		  image: new Image({
		    url: 'https://github.com/hitherejoe/Fret/blob/master/functions/images/' + chord + '.png?raw=true', ,
		    alt: 'The ' + chord + ' chord',
		  }),
		}));


  	} else {
  		conv.ask(new SimpleResponse({
		  speech: buildString(input) + ". " + i18n.__('WHAT_NEXT'),
		  text: buildString(input) + ". " + i18n.__('WHAT_NEXT'),
		}));
 	}
  } else {
  	conv.close(i18n.__('ERROR_NOT_FOUND'))
  }
});


exports.fret = functions.https.onRequest(app);