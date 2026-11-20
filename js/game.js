// Game: the song being played and how a game starts.

import { prepareSong } from "./timeline.js";
import { renderNotes } from "./notes.js";
import { startLoop, stopLoop, resumeLoop, setStopBeat } from "./loop.js";
import { onKeyPress } from "./piano.js";
import { STATES } from "./state.js";
import { getState, setState, onStateChange } from "./screens.js";

const FREE_PLAY_TITLE = "Juego libre";

let activeSong = null;
// Index in activeSong.notes of the note the player has to play next.
let nextNoteIndex = 0;
let titleElement = null;
let highwayElement = null;

// The notes only fall while playing. Leaving playing by any way (Escape,
// the menu button, waiting at the line, the end of the song) stops the
// loop, and coming back from waiting carries on from the same beat.
function handleStateChange(nextState, previousState) {
    if (nextState !== STATES.PLAYING) {
        stopLoop();
    } else if (previousState === STATES.WAITING) {
        resumeLoop();
    }
}

function isSongOver() {
    return nextNoteIndex === activeSong.notes.length;
}

// Beat where the song stops next: the start of the next note, or, once
// every note is played, the end of the last one, so it falls through the
// line before the song ends.
function nextStopBeat() {
    if (!isSongOver()) {
        return activeSong.notes[nextNoteIndex].start;
    }
    const lastNote = activeSong.notes.at(-1);
    return lastNote.start + lastNote.beats;
}

// The song has reached its stop: it waits there for the next note, or
// ends if there is none left.
function handleReachLine() {
    setState(isSongOver() ? STATES.FINISHED : STATES.WAITING);
}

// Only the key of the waiting note moves the song on. Any other key, or a
// key pressed while the notes fall, just sounds.
function handleKeyPress(pitch) {
    if (getState() !== STATES.WAITING || pitch !== activeSong.notes[nextNoteIndex].pitch) {
        return;
    }
    nextNoteIndex += 1;
    setStopBeat(nextStopBeat());
    setState(STATES.PLAYING);
}

export function initGame(gameTitleElement, highway) {
    titleElement = gameTitleElement;
    highwayElement = highway;
    onStateChange(handleStateChange);
    onKeyPress(handleKeyPress);
}

// Note starts are worked out here, once per game, so the game loop only
// has to read them.
export function startSong(song) {
    activeSong = prepareSong(song);
    nextNoteIndex = 0;
    titleElement.textContent = activeSong.title;
    renderNotes(activeSong.notes);
    highwayElement.hidden = false;
    setState(STATES.PLAYING);
    startLoop(activeSong, nextStopBeat(), handleReachLine);
}

// Free play has no song: the keys just sound, with no notes to follow,
// so the empty lanes are hidden too.
export function startFreePlay() {
    activeSong = null;
    titleElement.textContent = FREE_PLAY_TITLE;
    highwayElement.hidden = true;
    setState(STATES.FREEPLAY);
}

export function getActiveSong() {
    return activeSong;
}
