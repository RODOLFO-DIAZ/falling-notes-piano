// Game: the song being played and how a game starts.

import { prepareSong } from "./timeline.js";
import { renderNotes } from "./notes.js";
import { startLoop, stopLoop, resumeLoop, setStopBeat } from "./loop.js";
import { onKeyPress, markWrongKey } from "./piano.js";
import { STATES } from "./state.js";
import { getState, setState, onStateChange } from "./screens.js";

const FREE_PLAY_TITLE = "Juego libre";

// What the player is expected to do, under the song title. Waiting is the
// one that matters most: the notes have stopped and it says why.
const STATUS_BY_STATE = Object.freeze({
    [STATES.PLAYING]: "Las notas caen hacia la línea",
    [STATES.WAITING]: "Pulsa la tecla de la nota en la línea",
    [STATES.FREEPLAY]: "Toca libremente, sin notas que seguir",
});

let activeSong = null;
// Index in activeSong.notes of the note the player has to play next.
let nextNoteIndex = 0;
// Wrong keys pressed while the song waited, in this game.
let misses = 0;
let titleElement = null;
let statusElement = null;
let highwayElement = null;
let statsElement = null;
let resultsSongElement = null;
// The score under the song title and the one on the results screen: both
// show the same numbers, so they are filled by the same code.
let statLists = [];

// Notes played out of the song's total, and misses so far.
function renderStats() {
    for (const list of statLists) {
        list.querySelector('[data-stat="progress"]').textContent = `${nextNoteIndex} / ${activeSong.notes.length}`;
        list.querySelector('[data-stat="misses"]').textContent = misses;
    }
}

// The notes only fall while playing. Leaving playing by any way (Escape,
// the menu button, waiting at the line, the end of the song) stops the
// loop, and coming back from waiting carries on from the same beat.
function handleStateChange(nextState, previousState) {
    if (nextState in STATUS_BY_STATE) {
        statusElement.textContent = STATUS_BY_STATE[nextState];
    }
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
    if (!isSongOver()) {
        setState(STATES.WAITING);
        return;
    }
    resultsSongElement.textContent = activeSong.title;
    setState(STATES.FINISHED);
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

// elements: { title, status, highway, stats, resultsSong, resultsStats }.
export function initGame(elements) {
    titleElement = elements.title;
    statusElement = elements.status;
    highwayElement = elements.highway;
    statsElement = elements.stats;
    resultsSongElement = elements.resultsSong;
    statLists = [elements.stats, elements.resultsStats];
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

// "Jugar de nuevo": the same song again from the start, with the score
// back at zero. activeSong already has its starts; startSong works them
// out again from the beats, which gives the same ones.
export function restartSong() {
    startSong(activeSong);
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
