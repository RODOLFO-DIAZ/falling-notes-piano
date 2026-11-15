// Sound output. The rest of the app only calls audio.play(pitch), so the
// synth can be swapped for real piano samples without touching the callers.

import { frequencyOf } from "./pitch.js";

// Envelope, in seconds. A short attack instead of an instant jump to full
// volume avoids the click of a waveform starting mid-cycle, and the fade
// ends far below hearing so the note never cuts off abruptly either.
const ATTACK_TIME = 0.008;
const FADE_OUT_TIME = 1;
const SILENT_GAIN = 0.0001;

// Several notes can sound at once and their waves add up; a low peak per
// voice keeps a chord well below the 1.0 limit where the output distorts.
const VOICE_PEAK_GAIN = 0.2;

// Triangle is softer than square or sawtooth and fuller than sine.
const WAVEFORM = "triangle";

let context = null;

// Created on first use, not at import time: browsers keep an audio context
// made before any user gesture suspended.
function getContext() {
    context ??= new AudioContext();
    return context;
}

// One oscillator per note: Web Audio oscillators can only start once.
function playVoice(frequency) {
    const audioContext = getContext();
    const start = audioContext.currentTime;
    const end = start + ATTACK_TIME + FADE_OUT_TIME;

    const oscillator = new OscillatorNode(audioContext, { type: WAVEFORM, frequency });
    const envelope = new GainNode(audioContext, { gain: 0 });

    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(VOICE_PEAK_GAIN, start + ATTACK_TIME);
    // Exponential decay sounds even to the ear, like a struck string;
    // it cannot reach 0, hence the near-silent target.
    envelope.gain.exponentialRampToValueAtTime(SILENT_GAIN, end);

    oscillator.connect(envelope).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(end);
    // Free the nodes once the note is over, so long sessions do not pile them up.
    oscillator.addEventListener("ended", () => envelope.disconnect(), { once: true });
}

export const audio = Object.freeze({
    play(pitch) {
        playVoice(frequencyOf(pitch));
    },
});
