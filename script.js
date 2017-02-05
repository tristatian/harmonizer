// Constants.
var noteDuration = 1.0;
var noteVolume = 1.0;
var defaultOctave = 5;

// Octave of the previous note.
var previousOctave;

// Audio context for playing notes.
var audio = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, volume, duration)
{
    var halfPeriod = 1 / frequency / 2;
    if (duration > halfPeriod) {
        duration -= duration % halfPeriod;
    } else {
        duration = halfPeriod;
    }

    var g = audio.createGain();
    var o = audio.createOscillator();
    o.connect(g);
    g.connect(audio.destination);

    o.frequency.value = frequency;
    g.gain.value = volume;
    o.start(0);
    o.stop(audio.currentTime + duration);
}

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

// Returns 0 for C, 1 for D, ..., 5 for A, 6 for B.
function letterToPitchIndex(letter) {
	if (letter >= "A" && letter <= "B") {
		return letter.charCodeAt(0) - "A".charCodeAt(0) + 5;
	}
	else return letter.charCodeAt(0) - "C".charCodeAt(0);
}

// Converts the note to a frequency. Assumes letter is uppercase.
function noteToFrequency(note) {
	var pitchIndex = letterToPitchIndex(note[0]);
	var octave = (note.length == 2) ? note[1] - "0" : previousOctave;
	previousOctave = octave;
	var i = 7*octave + pitchIndex;
	return 16.35 * Math.pow (2, i/7);

}

// Validates and returns the notes from the text field.
function getNotes() {
	previousOctave = defaultOctave;
	var melody = document.getElementById("melody").value;
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

function play() {
	var notes = getNotes();
	if (notes == false) {
		return;
	}

	// Play the notes.
	var i = 0;
	var playNext = function() {
		playNote(noteToFrequency(notes[i]), noteVolume, noteDuration);
		i++;
		if (i < notes.length) {
			setTimeout(playNext, noteDuration * 1000);
		}
	}
	playNext();
}

// Returns a new frequency delta steps from the given one.
function moveNote(frequency, delta) {
	return frequency * Math.pow(2, delta / 7);
}

// Returns a chord (array of 3 frequency) given a melody frequency and the inversion number (0, 1, or 2).
function generateChord(frequency, inversion) {
	if(inversion == 0) {
		return [moveNote(frequency, 7), moveNote(frequency, 5), moveNote(frequency, 3)];
	}
	if (inversion ==1){
		return [moveNote(frequency, 7), moveNote(frequency, 4), moveNote(frequency, 2)];
    }
    if (inversion ==2) {
    	return [moveNote(frequency, 7), moveNote(frequency, 5), moveNote(frequency, 2)];
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
		var frequency = noteToFrequency(notes[i]);
		var inversion;
		do {
			inversion = randomInversion();
		} while(inversion == previousInversion);
		previousInversion = inversion;
		var chord = generateChord(frequency, inversion);

		playNote(frequency, noteVolume, noteDuration);
		playNote(chord[0], noteVolume, noteDuration);
		playNote(chord[1], noteVolume, noteDuration);
		playNote(chord[2], noteVolume, noteDuration);
		i++;
		if (i < notes.length) {
			setTimeout(playNext, noteDuration * 1000);
		}
	}
	playNext();
}