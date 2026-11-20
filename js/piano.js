// Piano key state. pressKey() is the single entry point for every input
// source (computer keyboard, mouse, touch), so they all behave the same.

import { audio } from "./audio.js";

const ACTIVE_CLASS = "is-active";
const WRONG_CLASS = "is-wrong";

let keysByPitch = new Map();
const pressedPitches = new Set();
let isEnabled = false;
const pressListeners = [];

export function initPiano(keyElements) {
    keysByPitch = keyElements;
}

// Off outside play, so the computer keyboard does not sound from a menu.
// Turning it off also lets go of held keys, which would otherwise stay
// lit when the player comes back.
export function setPianoEnabled(enabled) {
    isEnabled = enabled;
    if (!enabled) {
        releaseAllKeys();
    }
}

// Calls listener(pitch) after every key that sounds, so the game can
// check it against the song without knowing where the press came from.
export function onKeyPress(listener) {
    pressListeners.push(listener);
}

export function pressKey(pitch) {
    if (!isEnabled || pressedPitches.has(pitch)) {
        return;
    }
    pressedPitches.add(pitch);
    keysByPitch.get(pitch)?.classList.add(ACTIVE_CLASS);
    audio.play(pitch);
    for (const listener of pressListeners) {
        listener(pitch);
    }
}

// Shows a held key in red until it is released. Only a held key can be
// marked, so no key stays red with nothing pressing it.
export function markWrongKey(pitch) {
    if (pressedPitches.has(pitch)) {
        keysByPitch.get(pitch)?.classList.add(WRONG_CLASS);
    }
}

export function releaseKey(pitch) {
    if (!pressedPitches.delete(pitch)) {
        return;
    }
    keysByPitch.get(pitch)?.classList.remove(ACTIVE_CLASS, WRONG_CLASS);
}

export function releaseAllKeys() {
    for (const pitch of [...pressedPitches]) {
        releaseKey(pitch);
    }
}
