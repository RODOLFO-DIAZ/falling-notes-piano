// Song timeline: where each note sits in time. Pure module: no DOM or browser APIs.

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
