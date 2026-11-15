// Input: turns browser events into pressKey() / releaseKey() calls.

import { KEY_TO_PITCH } from "./pitch.js";
import { pressKey, releaseKey } from "./piano.js";

// Shortcuts such as Ctrl+S or Alt+Tab belong to the browser or the system,
// so they must not play a note.
function hasModifier(event) {
    return event.ctrlKey || event.altKey || event.metaKey;
}

function handleKeyDown(event) {
    // Holding a key fires keydown again and again; only the first one plays.
    if (event.repeat || hasModifier(event)) {
        return;
    }
    const pitch = KEY_TO_PITCH[event.code];
    if (pitch) {
        pressKey(pitch);
    }
}

// Released even when a modifier is held, so no key stays lit.
function handleKeyUp(event) {
    const pitch = KEY_TO_PITCH[event.code];
    if (pitch) {
        releaseKey(pitch);
    }
}

export function bindKeyboardInput() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
}
