// Game: the song being played and how a game starts.

import { prepareSong } from "./timeline.js";
import { renderNotes } from "./notes.js";
import { startLoop } from "./loop.js";
import { STATES } from "./state.js";
import { setState } from "./screens.js";

const FREE_PLAY_TITLE = "Juego libre";

let activeSong = null;
let titleElement = null;
let highwayElement = null;

export function initGame(gameTitleElement, highway) {
    titleElement = gameTitleElement;
    highwayElement = highway;
}

// Note starts are worked out here, once per game, so the game loop only
// has to read them.
export function startSong(song) {
    activeSong = prepareSong(song);
    titleElement.textContent = activeSong.title;
    renderNotes(activeSong.notes);
    highwayElement.hidden = false;
    setState(STATES.PLAYING);
    startLoop(activeSong);
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
