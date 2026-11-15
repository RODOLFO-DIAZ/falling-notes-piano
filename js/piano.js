// Piano key state. pressKey() is the single entry point for every input
// source (computer keyboard, mouse, touch), so they all behave the same.

const ACTIVE_CLASS = "is-active";

let keysByPitch = new Map();
const pressedPitches = new Set();

export function initPiano(keyElements) {
    keysByPitch = keyElements;
}

export function pressKey(pitch) {
    if (pressedPitches.has(pitch)) {
        return;
    }
    pressedPitches.add(pitch);
    keysByPitch.get(pitch)?.classList.add(ACTIVE_CLASS);
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
