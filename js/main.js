// Entry point: connects the modules and starts the app.
// Module scripts run after the document is parsed, so the DOM is ready here.

import { renderKeyboard } from "./keyboard.js";

const READY_MESSAGE = "Proyecto en construcción: pronto podrás tocar aquí.";

function init() {
    const message = document.getElementById("status-message");
    message.textContent = READY_MESSAGE;
    renderKeyboard(document.getElementById("piano"));
}

init();
