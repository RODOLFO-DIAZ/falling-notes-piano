// Note blocks: one element per note of the song, built once when a game
// starts and then only moved, so no element is created or measured while
// the notes fall.

import { noteHeight, noteOffset } from "./timeline.js";

let lanesByPitch = new Map();
let blocks = [];

export function initNotes(lanes) {
    lanesByPitch = lanes;
}

function createBlock(note) {
    const block = document.createElement("div");
    block.className = "note";
    block.style.height = `${noteHeight(note.beats)}px`;
    return block;
}

// Removes the blocks of the last song, so starting again never stacks a
// second copy of the notes in the lanes.
export function clearNotes() {
    for (const { element } of blocks) {
        element.remove();
    }
    blocks = [];
}

// Builds a block for each note of a prepared song (notes with start) in
// the lane of its pitch, and places them for the start of the song.
export function renderNotes(notes) {
    clearNotes();
    blocks = notes.map((note) => {
        const element = createBlock(note);
        lanesByPitch.get(note.pitch).append(element);
        return { start: note.start, element };
    });
    placeNotes(0);
}

// Moves every block to where it belongs at currentBeat. transform moves
// it without making the browser lay out the page again.
export function placeNotes(currentBeat) {
    for (const { start, element } of blocks) {
        element.style.transform = `translateY(${-noteOffset(start, currentBeat)}px)`;
    }
}
