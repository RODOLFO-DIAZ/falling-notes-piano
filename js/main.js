// Entry point: connects the modules and starts the app.
// Module scripts run after the document is parsed, so the DOM is ready here.

import { renderKeyboard } from "./keyboard.js";
import { initPiano } from "./piano.js";
import { bindKeyboardInput, bindPointerInput, bindFocusLoss } from "./input.js";
import { audio } from "./audio.js";

// The click on Start is the user gesture the browser needs to allow sound.
function bindStartScreen() {
    const startScreen = document.getElementById("start-screen");
    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", () => {
        audio.unlock();
        startScreen.hidden = true;
    }, { once: true });
}

function init() {
    const pianoElement = document.getElementById("piano");
    initPiano(renderKeyboard(pianoElement));
    bindKeyboardInput();
    bindPointerInput(pianoElement);
    bindFocusLoss();
    bindStartScreen();
}

init();
