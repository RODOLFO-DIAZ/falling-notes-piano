// Song clock: turns the time between two frames into beats. Pure module:
// no DOM or browser APIs.

const SECONDS_PER_MINUTE = 60;

// Longest step the song may take in one frame. The browser stops calling
// requestAnimationFrame while the tab is hidden; without a cap, the first
// frame back would carry the whole time away and the notes would jump.
export const MAX_STEP_SECONDS = 0.1;

// The song moves by the time that has passed, not by frames, so it falls
// at the same speed on a 60 Hz and a 120 Hz screen. bpm is quarter notes
// per minute, so one second is bpm / 60 beats.
export function advanceBeat(beat, elapsedSeconds, bpm) {
    const step = Math.min(Math.max(elapsedSeconds, 0), MAX_STEP_SECONDS);
    return beat + (step * bpm) / SECONDS_PER_MINUTE;
}
