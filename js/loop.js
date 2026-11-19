// Game loop: moves the notes down on every frame the browser draws.

import { advanceBeat } from "./clock.js";
import { placeNotes } from "./notes.js";

const MS_PER_SECOND = 1000;

// The song starts this many beats before its first note, so the first
// blocks come into view at the top and fall to the line instead of
// appearing on it. 4 beats x PX_PER_BEAT fills the 20rem highway.
const LEAD_IN_BEATS = 4;

let currentBeat = 0;
let bpm = 0;
// Time of the last frame. null until the first frame, which only takes
// note of the time: there is no earlier frame to measure from.
let lastTime = null;

// time is the frame timestamp requestAnimationFrame passes in, in ms.
function step(time) {
    if (lastTime !== null) {
        currentBeat = advanceBeat(currentBeat, (time - lastTime) / MS_PER_SECOND, bpm);
    }
    lastTime = time;
    placeNotes(currentBeat);
    requestAnimationFrame(step);
}

export function startLoop(song) {
    bpm = song.bpm;
    currentBeat = -LEAD_IN_BEATS;
    lastTime = null;
    placeNotes(currentBeat);
    requestAnimationFrame(step);
}
