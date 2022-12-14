import {Point} from "../vector.js";

export class Ellipse {
    constructor(a, width, height) {
        this.a = a;
        this.size_scale = 0.8 * Math.min(width / this.a, height);
    }

    plot() {
        ellipse(0, 0, this.a * this.size_scale, this.size_scale);
    }

    nearest_point_on_shape(pos_x, pos_y) {
        // scale x so that (x,y) lay on a circle that is centered on (0,0)
        pos_x /= this.a;
        // calculate the angle of (x,y) on a circle with r=||(x,y)|| centered on (0,0)
        let angle = Math.atan2(pos_y, pos_x);
        // finally convert the angle back to a position on the ellipse
        return this.angle_to_point(angle);
    }

    angle_to_point(angle) {
        return new Point(
            this.size_scale * this.a * Math.cos(angle) * 0.5,
            this.size_scale * Math.sin(angle) * 0.5
        );
    }

    init_points(points) {
        for (let i = 0; i < 6; ++i) {
            points.push(this.angle_to_point(i / 3.0 * Math.PI - 5 / 6 * Math.PI));
        }
    }
}