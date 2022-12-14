export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // calculate length of this vector with the euclidean norm
    length() {
        return sqrt(pow(this.x, 2) + pow(this.y, 2));
    }

    // scale the vector so that it has length 1 in the euclidean norm
    normalize() {
        let len = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }

    // scale the vector
    scale(scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    // scale the vector
    scale_individual(scale_x, scale_y) {
        this.x *= scale_x;
        this.y *= scale_y;
        return this;
    }

    // scale the vector so that it has the given length in the euclidean norm
    set_length(length) {
        this.normalize();
        this.scale(length);
        return this;
    }

    // get vector that is orthogonal to the original vector by rotating it clockwise
    orthogonal(clockwise) {
        if (clockwise) {
            return new Vector(this.y, -this.x);
        } else {
            return new Vector(-this.y, this.x);
        }
    }

    add(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    add_vector(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    coords() {
        return [
            this.x,
            this.y
        ];
    }
}

// calculates the sum of two vectors
export function vector_sum(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
}