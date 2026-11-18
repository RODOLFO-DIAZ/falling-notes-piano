// Game: the song being played and how a game starts.

import { prepareSong } from "./timeline.js";
import { STATES } from "./state.js";
import { setState } from "./screens.js";

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

export function getActiveSong() {
    return activeSong;
}
