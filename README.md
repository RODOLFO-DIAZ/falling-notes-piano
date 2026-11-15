# Falling Notes Piano

**Live demo:** https://rodolfo-diaz.github.io/falling-notes-piano/

A piano trainer that runs in the browser. Notes fall toward a hit line and you play them on your computer keyboard. When a note reaches the line, the song waits until you press the right key. Choose one of three built-in songs or switch to free play.

> Work in progress. The full guide (how to play, controls and credits) will be added as the features land.

## Run locally

The app uses ES modules, which browsers do not load from `file://`. Serve the folder with any static server, for example:

```
npx serve .
```

Then open the address it prints.

## Tech

HTML, CSS and JavaScript without frameworks or build tools. Sound is generated with the Web Audio API.

## License

[MIT](LICENSE)
