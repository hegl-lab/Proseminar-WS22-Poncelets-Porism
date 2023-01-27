import {WIDTH, HEIGHT, inner_x, inner_y} from "./poncelet_porism.js";
import {alpha_1, alpha_2, beta_1, beta_2} from "./settings.js";

let domain_x = [-0.03, 0.52];
let domain_y = [-0.02, 0.08];

let scale_x;
let scale_y;

function convert_point(point) {
    return [
        (point[0] - domain_x[0]) * scale_x,
        (domain_y[1] - point[1]) * scale_y
    ];
}

// number of functions to preload
let n = 7;
// data points of function & settings
export let curves = [];
for (let i = 0; i < n; ++i) curves.push({
    active: true, data: []
});
let redraw = true;
let colors;

// store current state, so we don't have to draw it every frame
let cache;

export function redraw_cayley() {
    redraw = true;
}

export function draw_cayley() {
    // only redraw if necessary
    if (redraw) {
        redraw = false;

        noFill();
        strokeWeight(1);
        for (let i = 0; i < n; ++i) {
            stroke(colors[i]);
            let curve = curves[i];
            if (curve.active) {
                for (let j = 0; j < curve.data.length - 1; ++j) {
                    if (curve.data[j][0] < -100 || curve.data[j + 1][0] < -100) continue;
                    let point_a = curve.data[j];
                    let point_b = curve.data[j + 1];
                    line(point_a[0], point_a[1], point_b[0], point_b[1]);
                }
            }
        }
        strokeWeight(1);

        for (let x = 0; x < WIDTH; ++x) {
            for (let y = 0; y < HEIGHT; ++y) {
                cache.set(x, y, get(x + WIDTH, y));
            }
        }
        cache.updatePixels();
    } else {
        image(cache, WIDTH, 0, WIDTH, HEIGHT);
    }

    // check if inner ellipse is center
    if (inner_x !== 0 || inner_y !== 0) {
        stroke(255);
        fill(255, 255, 255, 200);
        rect(WIDTH, 0, WIDTH, HEIGHT);
        stroke(0);
        fill(0);
        strokeWeight(1);
        textAlign(CENTER, CENTER);
        textSize(16);
        noFill();
        text("Cayley closure condition only works\nif inner ellipse is centered!\n\nClick here to center inner ellipse!", WIDTH, 0, WIDTH, HEIGHT);
    } else {
        let alpha = alpha_1 / alpha_2;
        let beta = beta_1 / beta_2;
        let r = 1;

        let x1 = 1.0 / (alpha * alpha);
        let x2 = 1.0 / (beta * beta);
        let x3 = 1.0 / (r * r);

        let e1 = x1 + x2 + x3;
        let e2 = x1 * x2 + x1 * x3 + x2 * x3;
        let e3 = x1 * x2 * x3;

        let x = e2 / (e1 * e1);
        let y = e3 / (e1 * e1 * e1);

        let point_coords = convert_point([x, y]);
        stroke(150, 0, 0);
        strokeWeight(10);
        point(point_coords[0] + WIDTH, point_coords[1]);
    }
}

export function setup_cayley() {
    scale_x = WIDTH / (domain_x[1] - domain_x[0])
    scale_y = HEIGHT / (domain_y[1] - domain_y[0])

    colors = [
        color('#7FC6A4'),
        color('#FF5964'),
        color('#41463D'),
        color('#C16E70'),
        color('#7A5FBF'),
        color('#151E3F'),
        color('#6F7C12')
    ];
    cache = createImage(WIDTH, HEIGHT);

    // load plots
    for (let i = 1; i <= n; ++i) {
        let id = i;
        fetch('data' + id + '.csv')
            .then(response => response.text())
            .then(text => {
                let result = [];
                for (let line of text.split('\n')) {
                    let parts = line.split(',');
                    let current_point = convert_point([parseFloat(parts[0]), parseFloat(parts[1])]);
                    result.push([
                        current_point[0] + WIDTH,
                        current_point[1]
                    ]);
                }
                return result;
            })
            .then(result => {
                curves[id - 1].data = result;
                redraw_cayley();
            });
    }
}