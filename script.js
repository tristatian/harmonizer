// Constants.
var noteDuration = 0.5;
var noteVolume = 1.0;
var defaultOctave = 5;

// Octave of the previous note.
var previousOctave;

/*
Synth.loadSoundProfile({
	name: 'better_piano',
	attack: function() { return 0.002; },
	dampen: function(sampleRate, frequency, volume) {
		return Math.pow(0.5*Math.log((frequency*volume)/sampleRate),2);
	},
	wave: function(i, sampleRate, frequency, volume) {
		var base = this.modulate[0];
		return this.modulate[1](
			i,
			sampleRate,
			frequency,
			Math.pow(base(i, sampleRate, frequency, 0), 2) +
				(0.75 * base(i, sampleRate, frequency, 0.25)) +
				(0.1 * base(i, sampleRate, frequency, 0.5))
		);
	}
});
*/

// Piano synthesizer.
var piano = Synth.createInstrument('piano');

// Returns true if the note is valid.
function validateNote(note) {
	if(note.length > 2 || note.length == 0) {
		return false;
	}

	if(note[0] < "A" || note[0] > "G") {
		return false;
	}

	if(note.length ==2 && (note[1] < "0" || note[1] > "8" )) {
		return false;
	}
	else return true;
}

// Returns the pair [letter, octave] for the given note, where octave is a number.
// Uses the previous octave if note doens't have one.
function getPair(note) {
	var octave = (note.length == 2) ? note[1] - "0" : previousOctave;
	previousOctave = octave;
	return [note[0], octave];
}

// Validates and returns the notes from the text field.
function getNotes() {
	previousOctave = defaultOctave;
	var melody = document.getElementById("melody").value.trim();
	if(melody==""){
		alert("Empty string! Try again.");
		return false;
	}

	var notes = melody.split(" ");

	// Validate all the notes.
	for (var i = 0; i < notes.length; i++) {
		notes[i] = notes[i].toUpperCase();
		if (!validateNote(notes[i])) {
			alert("Invalid note " + notes[i] + ". Try again!");
			return false;
		}
	}

	return notes;
}

function playPair(pair) {
	piano.play(pair[0], pair[1], 2);
}

function play() {
	var notes = getNotes();
	if (notes == false) {
		return;
	}

	// Play the notes.
	var i = 0;
	var playNext = function() {
		var pair = getPair(notes[i]);
		playPair(pair);
		i++;
		if (i < notes.length) {
			setTimeout(playNext, noteDuration * 1000);
		}
	}
	playNext();
}

// Returns a new note delta steps from the given note pair. Delta must be nonnegative.
function moveNote(pair, delta) {
	var letter = pair[0];
	var octave = pair[1];
	while (delta > 0) {
		if (letter=="B"){
			letter="C";
			octave++;
		} else if (letter=="G"){
			letter = "A";
		} else {
			letter = String.fromCharCode(letter.charCodeAt(0)+1);
		}
		delta--;
	}
	return [letter, octave];
}

// Returns a chord (array of 3 note pairs) given a melody note pair and the inversion number (0, 1, or 2).
function generateChord(pair, inversion) {
	if(inversion == 0) {
		return [moveNote(pair, 7), moveNote(pair, 5), moveNote(pair, 3)];
	}
	if (inversion ==1){
		return [moveNote(pair, 7), moveNote(pair, 4), moveNote(pair, 2)];
    }
    if (inversion ==2) {
    	return [moveNote(pair, 7), moveNote(pair, 5), moveNote(pair, 2)];
    }
}

// Returns a random number between 0 and 2 (inclusive).
function randomInversion() {
	return Math.floor(Math.random() * 3);  
}

function playWithHarmony() {
	var notes = getNotes();
	if (notes == false) {
		return;
	}

	// Play the notes with harmony.
	var i = 0;
	var previousInversion = randomInversion();
	var playNext = function() {
		var inversion;
		do {
			inversion = randomInversion();
		} while(inversion == previousInversion);
		previousInversion = inversion;

		var pair = getPair(notes[i]);
		var chord = generateChord(pair, inversion);

		playPair(pair);
		playPair(chord[0]);
		playPair(chord[1]);
		playPair(chord[2]);
		i++;
		if (i < notes.length) {
			setTimeout(playNext, noteDuration * 1000);
		}
	}
	playNext();
}

function Save (){

}

function Load (){

}
