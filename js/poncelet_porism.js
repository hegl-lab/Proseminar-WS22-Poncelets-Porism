import {
    scale_and_translate,
    mouse_position,
    scaled_stroke_weight
} from "./scroll_and_zoom.js";
import {Vector} from "./vector.js";

import {draw_cayley, setup_cayley} from "./cayley.js";
import {alpha_1, alpha_2, animate, beta_1, beta_2, corners, createSettings} from "./settings.js";

export const WIDTH = 600;
export const HEIGHT = 600;

// points on the ellipse
let points = [];

// true if something is being dragged at the moment
export let dragging = false;
export let dragging_inner = false;
export let dragging_start = false;
export let dragging_whole = false;

let ellipse_scale = 250;

// position of inner ellipse
export let inner_x = 0;
export let inner_y = 0;
// angle of starting point
let start_angle = 0;

function angle_to_position(angle) {
    return [
        ellipse_scale * alpha_1 * cos(angle) * 0.5,
        ellipse_scale * beta_1 * sin(angle) * 0.5
    ];
}

function distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

function isMouseInInnerEllipse() {
    let [x, y] = mouse_position();
    x -= inner_x;
    y -= inner_y;
    x /= ellipse_scale;
    y /= ellipse_scale;
    x /= alpha_2;
    y /= beta_2;
    return Math.pow(x, 2) + Math.pow(y, 2) < 0.25;
}

function isMouseOnPoint() {
    let [point_x, point_y] = angle_to_position(start_angle);
    let [x, y] = mouse_position();
    return distance(point_x, point_y, x, y) < 30;
}

function position_to_angle(x, y) {
    x /= alpha_1;
    y /= beta_1;

    return Math.atan2(y, x);
}

function is_near(x, y) {
    return Math.abs(x - y) <= 0.05;
}

function intersection(gradient, start) {
    let a = alpha_1;
    let b = beta_1;

    let c = gradient.x;
    let d = gradient.y;

    let g = start.x / (ellipse_scale * 0.5);
    let h = start.y / (ellipse_scale * 0.5);

    let root = Math.sqrt(a * a * b * b * (a * a * d * d + b * b * c * c - Math.pow(d * g - c * h, 2)));
    let outer = a * a * d * h + b * b * c * g;
    let div = a * a * d * d + b * b * c * c;

    let t1 = -(root + outer) / div;
    let t2 = (root - outer) / div;

    return (Math.abs(t1) > Math.abs(t2)) ?
        new Vector(c * t1 + g, d * t1 + h).scale(ellipse_scale * 0.5) :
        new Vector(c * t2 + g, d * t2 + h).scale(ellipse_scale * 0.5);
}

function next_point(angle) {
    let [point_x, point_y] = angle_to_position(angle);

    let a = alpha_2;
    let b = beta_2;

    let x = (point_x - inner_x) / (ellipse_scale * 0.5);
    let y = (point_y - inner_y) / (ellipse_scale * 0.5);

    let c = x;
    let d = y;

    let div1 = a * a - x * x;
    let div2 = b * b - d * d;

    if (Math.abs(div1) < Math.abs(div2)) {
        let sqrt = Math.sqrt(a * a * (d * d - b * b) + b * b * c * c);
        let outer = c * d;

        return [
            intersection(new Vector((sqrt - outer) / div2, 1), new Vector(point_x, point_y)),
            intersection(new Vector(-(sqrt + outer) / div2, 1), new Vector(point_x, point_y))
        ];
    } else {
        let root = Math.sqrt((a * a * (y * y - b * b) + b * b * x * x));
        let outer = x * y;

        return [
            intersection(new Vector(1, (-root - outer) / div1), new Vector(point_x, point_y)),
            intersection(new Vector(1, (root - outer) / div1), new Vector(point_x, point_y))
        ];
    }
}

function generate_angle(i) {
    let [point1, point2] = next_point(points[i]);

    let [src_x, src_y] = angle_to_position(points[i - 1]);
    let [x1, y1] = point1.coords();
    let [x2, y2] = point2.coords();

    return (distance(src_x, src_y, x1, y1) > distance(src_x, src_y, x2, y2)) ? position_to_angle(x1, y1) : position_to_angle(x2, y2);
}

function generate_points() {
    points.push(start_angle);
    let current_position = next_point(start_angle)[0];
    let current_angle = position_to_angle(current_position.x, current_position.y);
    points.push(current_angle);
    window.points = points;

    for (let i = 1; !is_near(start_angle, current_angle) && i < corners; ++i) {
        current_angle = generate_angle(i);
        points.push(current_angle);
    }
}

function setup() {
    createCanvas(2 * WIDTH, HEIGHT);
    strokeWeight(1);
    generate_points();
    setup_cayley();
    createSettings();
}

function draw() {
    push();
    fill(255);
    stroke(255);
    rect(0, 0, WIDTH, HEIGHT);

    if (animate) start_angle += 0.0025 % 2 * PI;

    translate(WIDTH / 2, HEIGHT / 2);
    scale_and_translate();

    // draw ellipses
    stroke(0);
    noFill();
    ellipse(0, 0, alpha_1 * ellipse_scale, beta_1 * ellipse_scale);
    ellipse(inner_x, inner_y, alpha_2 * ellipse_scale, beta_2 * ellipse_scale);

    // draw starting point
    fill(0);
    let [point_x, point_y] = angle_to_position(start_angle);
    circle(point_x, point_y, 10);

    // follow tangent points
    points = [];
    generate_points();

    //stroke(200);
    for (let i = 0; i < points.length - 1; ++i) {
        let [x0, y0] = angle_to_position(points[i]);
        let [x1, y1] = angle_to_position(points[i + 1]);
        line(x0, y0, x1, y1);
    }

    if (isMouseInInnerEllipse()) {
        scaled_stroke_weight(2);
        noFill();
        stroke('#4faa30');
        ellipse(inner_x, inner_y, alpha_2 * ellipse_scale, beta_2 * ellipse_scale);
    } else if (isMouseOnPoint()) {
        stroke('#4faa30');
        fill('#4faa30');
        circle(point_x, point_y, 15);
    }
    if (dragging_inner) {
        [inner_x, inner_y] = mouse_position();
    } else if (dragging_start) {
        let [x, y] = mouse_position();
        start_angle = position_to_angle(x, y);
    }
    pop();

    // draw cayley polynomials
    push();
    fill(255);
    stroke(255);
    rect(WIDTH, 0, WIDTH, HEIGHT);
    draw_cayley();
    pop();
}

// checks if a point is selected and switches it into "dragging-mode"
function mousePressed(event) {
    if (event.force || (event.target.className === 'p5Canvas' && event.button === 0)) {
        if (mouseX > WIDTH) {
            // clicked on cayley closure parts
            inner_x = 0;
            inner_y = 0;
        } else {
            if (isMouseInInnerEllipse()) {
                dragging = true;
                dragging_inner = true;
            } else if (isMouseOnPoint()) {
                dragging = true;
                dragging_start = true;
            } else {
                dragging = true;
                dragging_whole = true;
            }
        }
    }
}

// stops dragging points
function mouseReleased() {
    dragging = false;
    dragging_inner = false;
    dragging_start = false;
    dragging_whole = false;
}

// set window method so p5.js knows which methods to call
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;