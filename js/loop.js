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
// Beat where the song stops by itself: the start of the next note to
// play. The song never moves past it, so a note can never fall through
// the line before it is played.
let stopBeat = Infinity;
// Called once when the song reaches stopBeat.
let onReachStop = null;
// Time of the last frame. null until the first frame after a start or a
// resume, which only takes note of the time: measuring from the frame
// before the pause would count the whole pause as song time.
let lastTime = null;
// Id of the frame already asked for, or null when the loop is stopped.
let frameId = null;

// time is the frame timestamp requestAnimationFrame passes in, in ms.
function step(time) {
    if (lastTime !== null) {
        const nextBeat = advanceBeat(currentBeat, (time - lastTime) / MS_PER_SECOND, bpm);
        currentBeat = Math.min(nextBeat, stopBeat);
    }
    lastTime = time;
    placeNotes(currentBeat);
    // The note sits exactly on the line: no more frames until the song is
    // told to carry on.
    if (currentBeat >= stopBeat) {
        frameId = null;
        onReachStop?.();
        return;
    }
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

// firstStop is the start of the first note; reachStop runs each time the
// song stops there or at a later stop.
export function startLoop(song, firstStop, reachStop) {
    stopLoop();
    bpm = song.bpm;
    stopBeat = firstStop;
    onReachStop = reachStop;
    currentBeat = -LEAD_IN_BEATS;
    placeNotes(currentBeat);
    resumeLoop();
}
