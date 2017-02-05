// Constants.
var noteDuration = 1.0;
var noteVolume = 1.0;
var defaultOctave = 5;

// Octave of the previous note.
var previousOctave = defaultOctave;

// Audio context for playing notes.
var audio = new (window.AudioContext || window.webkitAudioContext)()

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

	if (note[0] >= "a" && note[0] <= "z") {
		note[0] = note[0] + ("a" - "A");
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
		return letter - "A" + 5;
	}
	else return letter - "C";
}

// Converts the note to a frequency. Assumes letter is uppercase.
function noteToFrequency(note) {
	var pitchIndex = letterToPitchIndex(note[0]);
	var octave = (note.length == 2) ? note[1] - "0" : previousOctave;
	previousOctave = octave;
	var i = 7*octave + pitchIndex;
	return 16.35 * Math.pow (2, i/7);

}

function play() {
	var melody = document.getElementById("melody").value;
	var notes = melody.split(" ");

	// Validate all the notes.
	for (var i = 0; i < notes.length; i++) {
		if (!validateNote(notes[i])) {
			alert("Invalid note " + notes[i] + ". Try again!");
			return;
		}
	}

	// Play the notes.
	for (var i = 0; i < notes.length; i++) {
		playNote(noteToFrequency(notes[i]), noteVolume, noteDuration);
	}
}

function playWithHarmony() {
	alert("This should play with harmony.");
}