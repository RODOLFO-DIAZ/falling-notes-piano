// Song data. Pure module: no DOM or browser APIs.
//
// A song is { id, title, composer, bpm, notes }: single notes played one
// after another, with no rests or chords. Each note is { pitch, beats }:
// - pitch: "C4" to "E5", sharps only (the 17 keys of the piano).
// - beats: length in quarter notes (1 quarter, 0.5 eighth, 0.25 sixteenth,
//   2 half, 1.5 dotted quarter). A short rest is added to the note before it.
// bpm is quarter notes per minute and sets how fast the blocks fall.
//
// Adding a song only means adding an entry here: the menu and the game
// read everything they need from this list.

// Frozen all the way down, so no screen can change a song by mistake.
function freezeSong(song) {
    song.notes.forEach(Object.freeze);
    Object.freeze(song.notes);
    return Object.freeze(song);
}

export const SONGS = Object.freeze([
    {
        id: "twinkle",
        title: "Twinkle, Twinkle, Little Star",
        composer: "Traditional",
        bpm: 90,
        notes: [
            { pitch: "C4", beats: 1 }, { pitch: "C4", beats: 1 }, { pitch: "G4", beats: 1 }, { pitch: "G4", beats: 1 },
            { pitch: "A4", beats: 1 }, { pitch: "A4", beats: 1 }, { pitch: "G4", beats: 2 },
            { pitch: "F4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "E4", beats: 1 },
            { pitch: "D4", beats: 1 }, { pitch: "D4", beats: 1 }, { pitch: "C4", beats: 2 },
            { pitch: "G4", beats: 1 }, { pitch: "G4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "F4", beats: 1 },
            { pitch: "E4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "D4", beats: 2 },
            { pitch: "G4", beats: 1 }, { pitch: "G4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "F4", beats: 1 },
            { pitch: "E4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "D4", beats: 2 },
            { pitch: "C4", beats: 1 }, { pitch: "C4", beats: 1 }, { pitch: "G4", beats: 1 }, { pitch: "G4", beats: 1 },
            { pitch: "A4", beats: 1 }, { pitch: "A4", beats: 1 }, { pitch: "G4", beats: 2 },
            { pitch: "F4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "E4", beats: 1 },
            { pitch: "D4", beats: 1 }, { pitch: "D4", beats: 1 }, { pitch: "C4", beats: 2 },
        ],
    },
    {
        id: "ode-to-joy",
        title: "Ode to Joy",
        composer: "Ludwig van Beethoven",
        bpm: 100,
        notes: [
            { pitch: "E4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "G4", beats: 1 },
            { pitch: "G4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "D4", beats: 1 },
            { pitch: "C4", beats: 1 }, { pitch: "C4", beats: 1 }, { pitch: "D4", beats: 1 }, { pitch: "E4", beats: 1 },
            { pitch: "E4", beats: 1.5 }, { pitch: "D4", beats: 0.5 }, { pitch: "D4", beats: 2 },
            { pitch: "E4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "G4", beats: 1 },
            { pitch: "G4", beats: 1 }, { pitch: "F4", beats: 1 }, { pitch: "E4", beats: 1 }, { pitch: "D4", beats: 1 },
            { pitch: "C4", beats: 1 }, { pitch: "C4", beats: 1 }, { pitch: "D4", beats: 1 }, { pitch: "E4", beats: 1 },
            { pitch: "D4", beats: 1.5 }, { pitch: "C4", beats: 0.5 }, { pitch: "C4", beats: 2 },
        ],
    },
    {
        id: "fur-elise",
        title: "Für Elise (opening theme)",
        composer: "Ludwig van Beethoven",
        bpm: 60,
        notes: [
            { pitch: "E5", beats: 0.25 }, { pitch: "D#5", beats: 0.25 },
            { pitch: "E5", beats: 0.25 }, { pitch: "D#5", beats: 0.25 }, { pitch: "E5", beats: 0.25 },
            { pitch: "B4", beats: 0.25 }, { pitch: "D5", beats: 0.25 }, { pitch: "C5", beats: 0.25 },
            { pitch: "A4", beats: 0.75 }, { pitch: "C4", beats: 0.25 }, { pitch: "E4", beats: 0.25 }, { pitch: "A4", beats: 0.25 },
            { pitch: "B4", beats: 0.75 }, { pitch: "E4", beats: 0.25 }, { pitch: "G#4", beats: 0.25 }, { pitch: "B4", beats: 0.25 },
            { pitch: "C5", beats: 0.75 }, { pitch: "E4", beats: 0.25 }, { pitch: "E5", beats: 0.25 }, { pitch: "D#5", beats: 0.25 },
            { pitch: "E5", beats: 0.25 }, { pitch: "D#5", beats: 0.25 }, { pitch: "E5", beats: 0.25 },
            { pitch: "B4", beats: 0.25 }, { pitch: "D5", beats: 0.25 }, { pitch: "C5", beats: 0.25 },
            { pitch: "A4", beats: 0.75 }, { pitch: "C4", beats: 0.25 }, { pitch: "E4", beats: 0.25 }, { pitch: "A4", beats: 0.25 },
            { pitch: "B4", beats: 0.75 }, { pitch: "E4", beats: 0.25 }, { pitch: "C5", beats: 0.25 }, { pitch: "B4", beats: 0.25 },
            { pitch: "A4", beats: 1.5 },
        ],
    },
].map(freezeSong));
