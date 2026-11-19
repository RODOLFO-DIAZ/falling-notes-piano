// Game loop: moves the notes down on every frame the browser draws.
// There is only ever one loop: starting a song stops the last one first,
// so leaving and coming back never makes the notes fall faster.

import { advanceBeat } from "./clock.js";
import { placeNotes } from "./notes.js";

const MS_PER_SECOND = 1000;

// The song starts this many beats before its first note, so the first
// blocks come into view at the top and fall to the line instead of
// appearing on it. 4 beats x PX_PER_BEAT fills the 20rem highway.
const LEAD_IN_BEATS = 4;

let currentBeat = 0;
let bpm = 0;
// Time of the last frame. null until the first frame after a start or a
// resume, which only takes note of the time: measuring from the frame
// before the pause would count the whole pause as song time.
let lastTime = null;
// Id of the frame already asked for, or null when the loop is stopped.
let frameId = null;

// time is the frame timestamp requestAnimationFrame passes in, in ms.
function step(time) {
    if (lastTime !== null) {
        currentBeat = advanceBeat(currentBeat, (time - lastTime) / MS_PER_SECOND, bpm);
    }
    lastTime = time;
    placeNotes(currentBeat);
    frameId = requestAnimationFrame(step);
}

// Stops the notes where they are; resumeLoop() carries on from there.
export function stopLoop() {
    if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
    }
}

// Does nothing if the loop is already running, so it can never run twice.
export function resumeLoop() {
    if (frameId !== null) {
        return;
    }
    lastTime = null;
    frameId = requestAnimationFrame(step);
}

export function startLoop(song) {
    stopLoop();
    bpm = song.bpm;
    currentBeat = -LEAD_IN_BEATS;
    placeNotes(currentBeat);
    resumeLoop();
}
