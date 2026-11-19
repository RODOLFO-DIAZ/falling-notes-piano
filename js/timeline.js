// Song timeline: where each note sits in time, and how that turns into
// pixels on the note highway. Pure module: no DOM or browser APIs.

// One beat of music takes this many pixels of highway, so a note's height
// shows how long it lasts and the song falls at the same speed from start
// to end.
export const PX_PER_BEAT = 80;

// Taken off the end of every note, so two notes in a row on the same key
// (C4 C4) show as two blocks instead of one long one.
export const NOTE_GAP_PX = 4;

export function noteHeight(beats) {
    return beats * PX_PER_BEAT - NOTE_GAP_PX;
}

// How far above the hit line a note's bottom edge is when the song is at
// currentBeat: 0 when the note is due, negative once it has gone past.
export function noteOffset(start, currentBeat) {
    return (start - currentBeat) * PX_PER_BEAT;
}

// Adds start (in beats) to every note: the sum of the beats before it.
// Starts are derived from the note lengths, never written by hand, so
// editing one note moves every note after it.
export function withStartBeats(notes) {
    let beat = 0;
    return notes.map((note) => {
        const timed = { ...note, start: beat };
        beat += note.beats;
        return timed;
    });
}

// Runs once, when the player picks a song, so the game loop only reads
// the starts and never adds up beats on every frame. Returns a new song;
// the one in SONGS stays as it was.
export function prepareSong(song) {
    return { ...song, notes: withStartBeats(song.notes) };
}
