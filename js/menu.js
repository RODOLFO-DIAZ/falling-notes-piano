// Song menu: one button per song in SONGS, so a new song only needs a new
// entry in the data, never a change here or in the HTML.

function createSongButton(song, onSelect) {
    const title = document.createElement("span");
    title.className = "song-title";
    title.textContent = song.title;

    const composer = document.createElement("span");
    composer.className = "song-composer";
    composer.textContent = song.composer;

    const button = document.createElement("button");
    button.className = "song-button";
    button.type = "button";
    button.append(title, composer);
    button.addEventListener("click", () => onSelect(song));

    const item = document.createElement("li");
    item.append(button);
    return item;
}

export function renderSongMenu(listElement, songs, onSelect) {
    listElement.replaceChildren(...songs.map((song) => createSongButton(song, onSelect)));
}
