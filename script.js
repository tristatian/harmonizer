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

function play() {
	var melody = document.getElementById("melody").value;
	//alert("The melody is " + melody + "!");
	playNote(440, 1, 1);
}

function playWithHarmony() {
	alert("This should play with harmony.");
}