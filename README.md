# Falling Notes Piano

**Live demo:** https://rodolfo-diaz.github.io/falling-notes-piano/

A piano trainer that runs in the browser. Notes fall toward a hit line and you play them on your computer keyboard. When a note reaches the line, the song waits until you press the right key. Choose one of three built-in songs or switch to free play.

## How to play

1. Open the live demo and press **Empezar**. Browsers only allow sound after a click, so this first click turns it on.
2. Pick a song from the menu, or **Juego libre** to play without notes.
3. Colored blocks fall down the lane above each key: light green for white keys, dark green for black keys. A block's height shows how long the note lasts.
4. When a block reaches the line, the song stops and waits. Press the key under it to carry on.
   - The status under the song title tells you whether the notes are falling or waiting for you.
   - A wrong key still sounds, turns red while you hold it and counts as a miss.
   - Keys you press while the notes are falling just sound; nothing is counted.
   - For the same note twice in a row, release the key and press it again.
5. Progress (`notes played / total`) and misses are shown above the lanes. After the last note, the results screen shows your score and a few words of encouragement that depend on your misses, with **Jugar de nuevo** to play the same song again and **Volver al menú** to pick another one.

Press **Esc** at any time during a song, in free play or on the results screen to go back to the menu.

The interface is in Spanish.

### Songs

| Song | Composer | Tempo |
|---|---|---|
| Twinkle, Twinkle, Little Star | Traditional | 90 bpm |
| Ode to Joy | Ludwig van Beethoven | 100 bpm |
| Für Elise (opening theme) | Ludwig van Beethoven | 60 bpm |

## Controls

The piano has 17 keys, from C4 to E5. They follow the layout of a piano on two rows of the computer keyboard: the middle row plays the white keys and the row above plays the black keys.

| Computer key | A | W | S | E | D | F | T | G | Y | H | U | J | K | O | L | P | Ñ / ; |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Note | C4 | C#4 | D4 | D#4 | E4 | F4 | F#4 | G4 | G#4 | A4 | A#4 | B4 | C5 | C#5 | D5 | D#5 | E5 |

- Each key on screen shows its note name in Spanish solfège (Do, Re, Mi… with no octave), and under it, smaller, the computer key that plays it.
- Keys are read by their position, so the layout works the same on Spanish, US and other keyboards. The last key is **Ñ** on a Spanish keyboard and **;** on a US one.
- You can also click or tap the keys on screen, with several fingers at once on a touch screen.
- Shortcuts with Ctrl, Alt or Cmd are left to the browser and never play a note.
- The keys only sound during a song or in free play, not in the menus.

## Accessibility

- Every button shows a visible focus ring when you move with **Tab**, and each new screen moves the focus to its title.
- The waiting status is announced to screen readers.
- With *reduce motion* turned on in your system settings, buttons change color at once and the hit line no longer pulses. The notes still fall, since following them is the game itself.

## Project structure

```
index.html        Page and the four screens (start, menu, game, results)
css/styles.css    All styles, with design tokens at the top
js/
  main.js         Entry point: connects the modules and starts the app
  state.js        Game states and the changes allowed between them
  screens.js      Shows the screen for the current state (setState)
  menu.js         Builds the song menu from the song list
  game.js         The song being played: waiting, misses, progress, results
  loop.js         The requestAnimationFrame loop that moves the notes
  clock.js        Turns elapsed time into beats
  timeline.js     Note start times and their position in pixels
  notes.js        Creates and places the falling note blocks
  highway.js      The note lanes and the hit line
  keyboard.js     Builds the on-screen piano
  piano.js        Key state: pressed, released, wrong
  input.js        Computer keyboard, mouse and touch input
  pitch.js        Key-to-note map and note frequencies
  audio.js        Synthesized sound with the Web Audio API
  songs.js        The song data
  validation.js   Checks the song data on startup
```

`state.js`, `pitch.js`, `timeline.js`, `clock.js`, `songs.js` and `validation.js` use no DOM or browser APIs.

## Adding a song

Add an entry to `SONGS` in `js/songs.js`. The menu and the game read everything from that list, so nothing else needs to change.

```js
{
    id: "my-song",
    title: "My Song",
    composer: "Traditional",
    bpm: 100,
    notes: [
        { pitch: "C4", beats: 1 },
        { pitch: "E4", beats: 0.5 },
        { pitch: "G4", beats: 2 },
    ],
},
```

- `pitch`: from `C4` to `E5`, written with sharps (`C#4`, not `Db4`).
- `beats`: length in quarter notes: `1` quarter, `0.5` eighth, `0.25` sixteenth, `2` half, `1.5` dotted quarter.
- `bpm`: quarter notes per minute; it sets how fast the notes fall.
- Single notes only, one after another: no chords or rests. Add a short rest to the length of the note before it.

The song data is checked on startup. If a song has a note outside the piano, a length or tempo that is not a positive number, or no notes, the start screen lists every problem and the game does not start.

## Run locally

The app uses ES modules, which browsers do not load from `file://`. Serve the folder with any static server, for example:

```
npx serve .
```

Then open the address it prints.

## Tech

HTML, CSS and JavaScript without frameworks, libraries or build tools. Animation uses `requestAnimationFrame` and moves by elapsed time, so the notes fall at the same speed on any screen refresh rate.

## Credits

- **Sound:** synthesized in the browser with the Web Audio API (a triangle wave per note). No audio files or sound libraries are used.
- **Music:** *Twinkle, Twinkle, Little Star* (traditional) and Ludwig van Beethoven's *Ode to Joy* and *Für Elise*, all in the public domain, arranged here as single-note melodies.
- **Libraries:** none.

## License

[MIT](LICENSE)
