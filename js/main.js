// Entry point: connects the modules and starts the app.
// Module scripts run after the document is parsed, so the DOM is ready here.

import { renderKeyboard } from "./keyboard.js";
import { initPiano } from "./piano.js";
import { bindKeyboardInput } from "./input.js";

const READY_MESSAGE = "Proyecto en construcción: pronto podrás tocar aquí.";

function init() {
    const message = document.getElementById("status-message");
    message.textContent = READY_MESSAGE;
    initPiano(renderKeyboard(document.getElementById("piano")));
    bindKeyboardInput();
}

init();
