// Piano key state. pressKey() is the single entry point for every input
// source (computer keyboard, mouse, touch), so they all behave the same.

import { audio } from "./audio.js";

const ACTIVE_CLASS = "is-active";

let keysByPitch = new Map();
const pressedPitches = new Set();
let isEnabled = false;

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

export function pressKey(pitch) {
    if (!isEnabled || pressedPitches.has(pitch)) {
        return;
    }
    pressedPitches.add(pitch);
    keysByPitch.get(pitch)?.classList.add(ACTIVE_CLASS);
    audio.play(pitch);
}

export function releaseKey(pitch) {
    if (!pressedPitches.delete(pitch)) {
        return;
    }
    keysByPitch.get(pitch)?.classList.remove(ACTIVE_CLASS);
}

export function releaseAllKeys() {
    for (const pitch of [...pressedPitches]) {
        releaseKey(pitch);
    }
}
