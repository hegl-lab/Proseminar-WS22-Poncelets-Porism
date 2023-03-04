import {curves, redraw_cayley} from "./cayley.js";
import {WIDTH} from "./poncelet_porism.js";

// default values

export let alpha_1 = 2;
const alpha_1_min = 0.5;
const alpha_1_max = 5;

export let alpha_2 = 1;
const alpha_2_min = 0.5;
const alpha_2_max = 5;

export let beta_1 = 2;
const beta_1_min = 0.5;
const beta_1_max = 5;

export let beta_2 = 1;
const beta_2_min = 0.5;
const beta_2_max = 5;

export let corners = 10;
const corners_min = 1;
const corners_max = 100;

export let animate = false;

let settings;

function update_cayley() {
    curves[0].active = settings.getValue("Show Triangle function");
    curves[1].active = settings.getValue("Show Quadrilateral function");
    curves[2].active = settings.getValue("Show Pentagon function");
    curves[3].active = settings.getValue("Show Hexagon function");
    curves[4].active = settings.getValue("Show Heptagon function");
    curves[5].active = settings.getValue("Show Octagon function");
    curves[6].active = settings.getValue("Show Nonagon function");
}

function update_bars() {
    alpha_1 = settings.getValue('alpha_1');
    alpha_2 = settings.getValue('alpha_2');
    beta_1 = settings.getValue('beta_1');
    beta_2 = settings.getValue('beta_2');
    corners = settings.getValue('max_corners');
    animate = settings.getValue('animate');
}

export function createSettings() {
    settings = QuickSettings.create(2 * WIDTH + 20, 20, 'Settings');
    settings.addHTML("Ellipses",
        "Sets the values of the two ellipses, alpha referring to the width and beta to the height. " +
        "1: outer ellipse, 2: inner ellipse.");
    settings.addRange('alpha_1', alpha_1_min, alpha_1_max, alpha_1, 0.02, update_bars);
    settings.addRange('beta_1', beta_1_min, beta_1_max, beta_1, 0.02, update_bars);
    settings.addRange('alpha_2', alpha_2_min, alpha_2_max, alpha_2, 0.02, update_bars);
    settings.addRange('beta_2', beta_2_min, beta_2_max, beta_2, 0.02, update_bars);
    settings.addRange('max_corners', corners_min, corners_max, corners, 1, update_bars);
    settings.addBoolean('animate', false, update_bars);
    settings.addHTML("Cayley closure conditions", "Enable / disable functions of the cayley closure conditions.")
    settings.addBoolean("Show Triangle function", true, update_cayley);
    settings.addBoolean("Show Quadrilateral function", true, update_cayley);
    settings.addBoolean("Show Pentagon function", true, update_cayley);
    settings.addBoolean("Show Hexagon function", true, update_cayley);
    settings.addBoolean("Show Heptagon function", true, update_cayley);
    settings.addBoolean("Show Octagon function", true, update_cayley);
    settings.addBoolean("Show Nonagon function", true, update_cayley);
    settings.addButton("Update curves", redraw_cayley)
    update_bars();
}
