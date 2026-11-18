// Game states and the changes allowed between them. Pure module: no DOM or browser APIs.

export const STATES = Object.freeze({
    START: "start",
    MENU: "menu",
    PLAYING: "playing",
    WAITING: "waiting",
    FINISHED: "finished",
    FREEPLAY: "freeplay",
});

// Where each state can go next. A change not listed here is a bug in the
// caller, so it is refused instead of showing the wrong screen.
const TRANSITIONS = Object.freeze({
    [STATES.START]: [STATES.MENU],
    [STATES.MENU]: [STATES.PLAYING, STATES.FREEPLAY],
    [STATES.PLAYING]: [STATES.WAITING, STATES.FINISHED, STATES.MENU],
    [STATES.WAITING]: [STATES.PLAYING, STATES.MENU],
    [STATES.FINISHED]: [STATES.MENU],
    [STATES.FREEPLAY]: [STATES.MENU],
});

export function canTransition(from, to) {
    return TRANSITIONS[from]?.includes(to) ?? false;
}
