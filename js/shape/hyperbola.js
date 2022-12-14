import {Point} from "../vector.js";

export class Hyperbola {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    eval(x) {
        return -this.b * Math.sqrt(
            -1 * Math.pow(this.a, 2) + Math.pow(x, 2)
        ) / this.a;
    }

    plot(x_range) {
        let last = this.eval(Math.min(-this.a, x_range[1]));
        for (let x = Math.min(-this.a, x_range[1])-1; x >= x_range[0]; --x) {
            let val = this.eval(x);

            line(x + 1, last, x, val);
            line(x + 1, -last, x, -val);

            last = val;
        }

        last = this.eval(Math.max(this.a, x_range[0]));
        for (let x = Math.max(this.a, x_range[0])+1; x <= x_range[1]; ++x) {
            let val = this.eval(x);

            line(x - 1, last, x, val);
            line(x - 1, -last, x, -val);

            last = val;
        }
    }

    nearest_point_on_shape(pos_x, pos_y) {
        let x = -(this.a * Math.sqrt(Math.pow(this.b, 2) + Math.pow(pos_y, 2))) / this.b;
        if (pos_x > 0) {
            return new Point(-x, pos_y);
        } else {
            return new Point(x, pos_y);
        }
    }

    init_points(points, width) {
        let dx = this.a + (width / 2 - this.a) / 4;

        points.push(new Point(-dx - this.a, this.eval(-dx - this.a)));
        points.push(new Point(-this.a, this.eval(-this.a)));
        points.push(new Point(-dx - this.a, -this.eval(-dx - this.a)));

        points.push(new Point(dx + this.a, -this.eval(-dx - this.a)));
        points.push(new Point(this.a, this.eval(-this.a)));
        points.push(new Point(dx + this.a, this.eval(-dx - this.a)));
    }
}