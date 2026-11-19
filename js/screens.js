// Screens: shows the screen that belongs to the current game state.
// setState() is the only way to change state, so the state and what is
// on screen can never disagree.

import { STATES, canTransition } from "./state.js";
import { setPianoEnabled } from "./piano.js";

const SCREEN_SELECTOR = ".screen";
const BACK_TO_MENU_KEY = "Escape";
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

// The piano and its note lanes are only on screen, and the piano only
// plays, while the player can play it.
const PIANO_STATES = new Set([STATES.PLAYING, STATES.WAITING, STATES.FREEPLAY]);

let currentState = STATES.START;
let screensById = new Map();
let stageElement = null;

function showState(state) {
    const visibleId = SCREEN_BY_STATE[state];
    for (const [id, screen] of screensById) {
        screen.hidden = id !== visibleId;
    }
    const isPianoState = PIANO_STATES.has(state);
    stageElement.hidden = !isPianoState;
    setPianoEnabled(isPianoState);
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

// Escape works from every screen that has a way back to the menu.
function handleBackToMenuKey(event) {
    if (event.code === BACK_TO_MENU_KEY && canTransition(currentState, STATES.MENU)) {
        setState(STATES.MENU);
    }
}

export function initScreens(appElement, stage) {
    const screens = appElement.querySelectorAll(SCREEN_SELECTOR);
    screensById = new Map([...screens].map((screen) => [screen.id, screen]));
    stageElement = stage;
    appElement.addEventListener("click", handleNextStateClick);
    document.addEventListener("keydown", handleBackToMenuKey);
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
