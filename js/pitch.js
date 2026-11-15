// Pitch data and helpers. Pure module: no DOM or browser APIs, so Node can test it.

// Physical key (event.code) -> pitch, from C4 to E5. Insertion order is the
// keyboard order from left to right, so the piano can be built from this map.
export const KEY_TO_PITCH = Object.freeze({
    KeyA: "C4",
    KeyW: "C#4",
    KeyS: "D4",
    KeyE: "D#4",
    KeyD: "E4",
    KeyF: "F4",
    KeyT: "F#4",
    KeyG: "G4",
    KeyY: "G#4",
    KeyH: "A4",
    KeyU: "A#4",
    KeyJ: "B4",
    KeyK: "C5",
    KeyO: "C#5",
    KeyL: "D5",
    KeyP: "D#5",
    Semicolon: "E5",
});

// Note names within one octave, sharps only, starting at C.
export const PITCH_NAMES = Object.freeze([
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
]);

const SEMITONES_PER_OCTAVE = 12;
const SHARP_SIGN = "#";

// "C#4" -> 61. MIDI numbering starts at octave -1, so C4 is 60 and A4 is 69.
export function midiOf(pitch) {
    const octave = Number(pitch.slice(-1));
    const name = pitch.slice(0, -1);
    return (octave + 1) * SEMITONES_PER_OCTAVE + PITCH_NAMES.indexOf(name);
}

// Sharps are the black keys of the piano.
export function isSharp(pitch) {
    return pitch.includes(SHARP_SIGN);
}
