// Piano keyboard view: builds one element per key from KEY_TO_PITCH.

import { KEY_TO_PITCH, isSharp } from "./pitch.js";

const KEY_CODE_PREFIX = "Key";

// Keys whose label is not the letter in their code. Semicolon is "Ñ" on a
// Spanish layout and ";" on a US layout, so it shows both.
const LABEL_OVERRIDES = Object.freeze({
    Semicolon: { main: "Ñ", alt: ";" },
});

function labelOf(code) {
    return LABEL_OVERRIDES[code] ?? { main: code.replace(KEY_CODE_PREFIX, "") };
}

function createLabel(className, text) {
    const label = document.createElement("span");
    label.className = className;
    label.textContent = text;
    return label;
}

function createKey(code, pitch) {
    const label = labelOf(code);
    const key = document.createElement("button");
    key.type = "button";
    // The computer keyboard already plays every key, so tabbing through
    // 17 buttons would only get in the way.
    key.tabIndex = -1;
    key.className = isSharp(pitch) ? "key key-black" : "key key-white";
    key.dataset.pitch = pitch;
    key.setAttribute("aria-label", `${pitch}, tecla ${label.main}`);
    key.append(createLabel("key-label", label.main));
    if (label.alt) {
        key.append(createLabel("key-label-alt", label.alt));
    }
    return key;
}

// Fills the container with the 17 keys and returns pitch -> key element,
// so input handlers can light keys without searching the DOM.
export function renderKeyboard(container) {
    const keysByPitch = new Map();
    for (const [code, pitch] of Object.entries(KEY_TO_PITCH)) {
        const key = createKey(code, pitch);
        keysByPitch.set(pitch, key);
        container.append(key);
    }
    return keysByPitch;
}
