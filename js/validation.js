// Song data checks, run once on startup. Pure module: no DOM or browser APIs.
// Messages are shown on screen, so they are in Spanish like the rest of the UI.

import { KEY_TO_PITCH } from "./pitch.js";

const PLAYABLE_PITCHES = Object.values(KEY_TO_PITCH);
const PLAYABLE_PITCH_SET = new Set(PLAYABLE_PITCHES);
const LOWEST_PITCH = PLAYABLE_PITCHES[0];
const HIGHEST_PITCH = PLAYABLE_PITCHES.at(-1);

// Rejects 0, negatives, NaN, Infinity and anything that is not a number.
function isPositiveNumber(value) {
    return Number.isFinite(value) && value > 0;
}

function songName(song, index) {
    return song.title ?? song.id ?? `Canción ${index + 1}`;
}

// position counts from 1, as a person reading the song would.
function noteErrors(note, position) {
    const errors = [];
    if (!PLAYABLE_PITCH_SET.has(note.pitch)) {
        errors.push(`nota ${position}: "${note.pitch}" no está entre ${LOWEST_PITCH} y ${HIGHEST_PITCH}`);
    }
    if (!isPositiveNumber(note.beats)) {
        errors.push(`nota ${position}: la duración debe ser mayor que 0 (es ${note.beats})`);
    }
    return errors;
}

function songErrors(song) {
    const errors = [];
    if (!isPositiveNumber(song.bpm)) {
        errors.push(`el tempo (bpm) debe ser mayor que 0 (es ${song.bpm})`);
    }
    if (!Array.isArray(song.notes) || song.notes.length === 0) {
        errors.push("no tiene notas");
        return errors;
    }
    song.notes.forEach((note, index) => errors.push(...noteErrors(note, index + 1)));
    return errors;
}

// Returns one readable message per problem, e.g.
// 'Ode to Joy: nota 5: "H4" no está entre C4 y E5'. Empty when all is valid.
export function validateSongs(songs) {
    return songs.flatMap((song, index) =>
        songErrors(song).map((error) => `${songName(song, index)}: ${error}`));
}
