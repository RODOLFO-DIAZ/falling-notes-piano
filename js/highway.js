// Note highway: one lane above each piano key, and the hit line at the
// bottom where the notes meet the keys.

import { KEY_LAYOUT, WHITE_KEY_COUNT, isSharp } from "./pitch.js";

function createLane(pitch, whiteIndex) {
    const lane = document.createElement("div");
    lane.className = isSharp(pitch) ? "lane lane-black" : "lane lane-white";
    lane.dataset.pitch = pitch;
    if (isSharp(pitch)) {
        lane.style.setProperty("--white-index", whiteIndex);
    }
    return lane;
}

function createHitLine() {
    const line = document.createElement("div");
    line.className = "hit-line";
    return line;
}

// Fills the container with the 17 lanes and the hit line, and returns
// pitch -> lane element, so notes can be dropped into their lane without
// searching the DOM. Lanes use the same --white-index and --white-count
// as the keys, so each lane sits right above its key.
export function renderHighway(container) {
    const lanesByPitch = new Map();
    for (const { pitch, whiteIndex } of KEY_LAYOUT) {
        const lane = createLane(pitch, whiteIndex);
        lanesByPitch.set(pitch, lane);
        container.append(lane);
    }
    container.append(createHitLine());
    container.style.setProperty("--white-count", WHITE_KEY_COUNT);
    return lanesByPitch;
}
