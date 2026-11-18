// Game: the song being played and how a game starts.

import { prepareSong } from "./timeline.js";
import { STATES } from "./state.js";
import { setState } from "./screens.js";

const FREE_PLAY_TITLE = "Juego libre";

let activeSong = null;
let titleElement = null;

export function initGame(gameTitleElement) {
    titleElement = gameTitleElement;
}

// Note starts are worked out here, once per game, so the game loop only
// has to read them.
export function startSong(song) {
    activeSong = prepareSong(song);
    titleElement.textContent = activeSong.title;
    setState(STATES.PLAYING);
}

// Free play has no song: the keys just sound, with no notes to follow.
export function startFreePlay() {
    activeSong = null;
    titleElement.textContent = FREE_PLAY_TITLE;
    setState(STATES.FREEPLAY);
}

export function getActiveSong() {
    return activeSong;
}
