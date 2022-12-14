import {Point} from "../vector.js";

export class Parabola {
    constructor(a) {
        this.a = a;
    }

    eval(x) {
        return Math.pow(x, 2) / this.a;
    }

    plot(x_range) {
        let last = this.eval(x_range[0]);
        for (let x = x_range[0] + 1; x <= x_range[1]; x += 1) {
            let val = this.eval(x);
            line(x - 1, last, x, val);
            last = val;
        }
    }

    nearest_point_on_shape(pos_x) {
        return new Point(pos_x, this.eval(pos_x));
    }

    init_points(points, width) {
        for (let i = 0; i < 6; ++i) {
            let x = (width / 9) * i - (width / 9 * 2.5);
            points.push(new Point(x, this.eval(x)));
        }
    }
}