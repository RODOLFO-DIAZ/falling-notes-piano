// Entry point: connects the modules and starts the app.
// Module scripts run after the document is parsed, so the DOM is ready here.

import { renderKeyboard } from "./keyboard.js";
import { initPiano } from "./piano.js";
import { bindKeyboardInput, bindPointerInput, bindFocusLoss } from "./input.js";
import { audio } from "./audio.js";
import { SONGS } from "./songs.js";
import { validateSongs } from "./validation.js";

// The click on Start is the user gesture the browser needs to allow sound.
function bindStartScreen() {
    const startScreen = document.getElementById("start-screen");
    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", () => {
        audio.unlock();
        startScreen.hidden = true;
    }, { once: true });
}

function createErrorItem(text) {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
}

// A broken song would fail halfway through a game, so it is reported
// before anyone can start: on screen for the player, in the console with
// the full list for whoever edits SONGS.
function showSongErrors(errors) {
    document.getElementById("song-error-list").replaceChildren(...errors.map(createErrorItem));
    document.getElementById("song-errors").hidden = false;
    document.getElementById("start-button").disabled = true;
    console.error(`Invalid song data:\n${errors.join("\n")}`);
}

function init() {
    const pianoElement = document.getElementById("piano");
    initPiano(renderKeyboard(pianoElement));
    bindKeyboardInput();
    bindPointerInput(pianoElement);
    bindFocusLoss();
    bindStartScreen();

    const songErrors = validateSongs(SONGS);
    if (songErrors.length > 0) {
        showSongErrors(songErrors);
    }
}

init();
