// Input: turns browser events into pressKey() / releaseKey() calls.

import { KEY_TO_PITCH } from "./pitch.js";
import { pressKey, releaseKey, releaseAllKeys } from "./piano.js";

const PRIMARY_BUTTON = 0;
const KEY_SELECTOR = ".key";

// Pointer id -> pitch it pressed, so each pointer releases its own key
// wherever it is lifted (outside the key, or one finger of several).
const pitchesByPointer = new Map();

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

function handlePointerDown(event) {
    if (event.button !== PRIMARY_BUTTON) {
        return;
    }
    const key = event.target.closest(KEY_SELECTOR);
    if (!key) {
        return;
    }
    const pitch = key.dataset.pitch;
    // Capture keeps pointerup coming even if it is lifted outside the window.
    key.setPointerCapture(event.pointerId);
    pitchesByPointer.set(event.pointerId, pitch);
    pressKey(pitch);
}

// Listened on the document, not the key, so lifting the pointer outside
// the key still releases it.
function handlePointerUp(event) {
    const pitch = pitchesByPointer.get(event.pointerId);
    if (!pitch) {
        return;
    }
    pitchesByPointer.delete(event.pointerId);
    releaseKey(pitch);
}

// Keyup and pointerup never arrive once the window loses focus (Alt+Tab,
// another app), so every held key is released here.
function handleFocusLoss() {
    pitchesByPointer.clear();
    releaseAllKeys();
}

export function bindKeyboardInput() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
}

export function bindPointerInput(pianoElement) {
    pianoElement.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);
}

export function bindFocusLoss() {
    window.addEventListener("blur", handleFocusLoss);
}
