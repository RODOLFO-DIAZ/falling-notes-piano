// Screens: shows the screen that belongs to the current game state.
// setState() is the only way to change state, so the state and what is
// on screen can never disagree.

import { STATES, canTransition } from "./state.js";

const SCREEN_SELECTOR = ".screen";
const SCREEN_TITLE_SELECTOR = ".screen-title";
const NEXT_STATE_SELECTOR = "[data-next-state]";

// Playing and waiting share a screen: waiting only stops the notes.
const SCREEN_BY_STATE = Object.freeze({
    [STATES.START]: "start-screen",
    [STATES.MENU]: "menu-screen",
    [STATES.PLAYING]: "game-screen",
    [STATES.WAITING]: "game-screen",
    [STATES.FINISHED]: "results-screen",
    [STATES.FREEPLAY]: "game-screen",
});

// The piano is only on screen while the player can play it.
const PIANO_STATES = new Set([STATES.PLAYING, STATES.WAITING, STATES.FREEPLAY]);

let currentState = STATES.START;
let screensById = new Map();
let pianoElement = null;

function showState(state) {
    const visibleId = SCREEN_BY_STATE[state];
    for (const [id, screen] of screensById) {
        screen.hidden = id !== visibleId;
    }
    pianoElement.hidden = !PIANO_STATES.has(state);
}

// Without this, keyboard and screen reader users stay on a button that
// has just been hidden.
function focusScreenTitle(state) {
    screensById.get(SCREEN_BY_STATE[state]).querySelector(SCREEN_TITLE_SELECTOR)?.focus();
}

// Buttons say where they lead with data-next-state="menu", so going back
// needs no code of its own.
function handleNextStateClick(event) {
    const button = event.target.closest(NEXT_STATE_SELECTOR);
    if (button) {
        setState(button.dataset.nextState);
    }
}

export function initScreens(appElement, piano) {
    const screens = appElement.querySelectorAll(SCREEN_SELECTOR);
    screensById = new Map([...screens].map((screen) => [screen.id, screen]));
    pianoElement = piano;
    appElement.addEventListener("click", handleNextStateClick);
    showState(currentState);
}

export function getState() {
    return currentState;
}

export function setState(nextState) {
    if (!canTransition(currentState, nextState)) {
        throw new Error(`Invalid state change: ${currentState} -> ${nextState}`);
    }
    const isNewScreen = SCREEN_BY_STATE[nextState] !== SCREEN_BY_STATE[currentState];
    currentState = nextState;
    showState(nextState);
    if (isNewScreen) {
        focusScreenTitle(nextState);
    }
}
