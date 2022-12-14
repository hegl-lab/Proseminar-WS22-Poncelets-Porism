import {WIDTH, HEIGHT, dragging} from "./poncelet_porism.js";

export let SCALE_FACTOR = 1.0;
let window_move = [0, 0];

export function scale_and_translate() {
    scale(SCALE_FACTOR, SCALE_FACTOR);
    translate(window_move[0], window_move[1]);
    scaled_stroke_weight(1);
}

export function mouse_position() {
    return [
        (mouseX - WIDTH / 2) / SCALE_FACTOR - window_move[0],
        (mouseY - HEIGHT / 2) / SCALE_FACTOR - window_move[1]
    ];
}

export function position_range() {
    return [
        [-WIDTH / SCALE_FACTOR / 2 - window_move[0], WIDTH / SCALE_FACTOR / 2 - window_move[0]], // x_range
        [-HEIGHT / SCALE_FACTOR / 2 - window_move[1], HEIGHT / SCALE_FACTOR / 2 - window_move[1]] // y_range
    ];
}

export function scaled_stroke_weight(weight) {
    strokeWeight(weight / SCALE_FACTOR);
}

function mouseWheel(event) {
    let delta = event.delta;
    if (delta < 0) {
        SCALE_FACTOR *= 1.1;
    } else {
        SCALE_FACTOR /= 1.1;
    }
    return false;
}

function mouseDragged(event) {
    if (event.buttons === 4 || !dragging) {
        window_move[0] += event.movementX / SCALE_FACTOR;
        window_move[1] += event.movementY / SCALE_FACTOR;
    }

}

let touch_position;

function touchStarted() {
    touch_position = [mouseX, mouseY];

    window.mousePressed({force: true});

    return false;
}

function touchMoved() {
    if (dragging === null) {
        window_move[0] += (mouseX - touch_position[0]) / SCALE_FACTOR;
        window_move[1] += (mouseY - touch_position[1]) / SCALE_FACTOR;

        touch_position = [mouseX, mouseY];
    }

    return false;
}

function touchEnded() {
    window.mouseReleased();
}

window.mouseWheel = mouseWheel;
window.mouseDragged = mouseDragged;
window.touchMoved = touchMoved;
window.touchStarted = touchStarted;
window.touchEnded = touchEnded;