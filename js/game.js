// Game: the song being played and how a game starts.

import { prepareSong } from "./timeline.js";
import { renderNotes } from "./notes.js";
import { startLoop, stopLoop, resumeLoop, setStopBeat } from "./loop.js";
import { onKeyPress, markWrongKey } from "./piano.js";
import { STATES } from "./state.js";
import { getState, setState, onStateChange } from "./screens.js";

const FREE_PLAY_TITLE = "Juego libre";

let activeSong = null;
// Index in activeSong.notes of the note the player has to play next.
let nextNoteIndex = 0;
// Wrong keys pressed while the song waited, in this game.
let misses = 0;
let titleElement = null;
let highwayElement = null;
let statsElement = null;
let progressElement = null;
let missesElement = null;

// Notes played out of the song's total, and misses so far.
function renderStats() {
    progressElement.textContent = `${nextNoteIndex} / ${activeSong.notes.length}`;
    missesElement.textContent = misses;
}

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

// Only the key of the waiting note moves the song on; any other key is a
// miss and shows red while held. Keys pressed while the notes fall just
// sound: the player is not asked for a note yet.
function handleKeyPress(pitch) {
    if (getState() !== STATES.WAITING) {
        return;
    }
    if (pitch !== activeSong.notes[nextNoteIndex].pitch) {
        misses += 1;
        markWrongKey(pitch);
        renderStats();
        return;
    }
    nextNoteIndex += 1;
    renderStats();
    setStopBeat(nextStopBeat());
    setState(STATES.PLAYING);
}

export function initGame(gameTitleElement, highway, gameStats) {
    titleElement = gameTitleElement;
    highwayElement = highway;
    statsElement = gameStats;
    progressElement = gameStats.querySelector('[data-stat="progress"]');
    missesElement = gameStats.querySelector('[data-stat="misses"]');
    onStateChange(handleStateChange);
    onKeyPress(handleKeyPress);
}

// Note starts are worked out here, once per game, so the game loop only
// has to read them.
export function startSong(song) {
    activeSong = prepareSong(song);
    nextNoteIndex = 0;
    misses = 0;
    titleElement.textContent = activeSong.title;
    renderStats();
    renderNotes(activeSong.notes);
    highwayElement.hidden = false;
    statsElement.hidden = false;
    setState(STATES.PLAYING);
    startLoop(activeSong, nextStopBeat(), handleReachLine);
}

// Free play has no song: the keys just sound, with no notes to follow,
// so the empty lanes and the score are hidden too.
export function startFreePlay() {
    activeSong = null;
    titleElement.textContent = FREE_PLAY_TITLE;
    highwayElement.hidden = true;
    statsElement.hidden = true;
    setState(STATES.FREEPLAY);
}

export function getActiveSong() {
    return activeSong;
}
