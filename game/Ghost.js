import { Node } from './Node.js';

const vec3 = glMatrix.vec3;

export class Ghost extends Node {

    constructor(mesh, image, name, distance, axis, options) {
        super(options);
        this.mesh = mesh;
        this.image = image;
        this.name = name;
        this.options = options;
        this.start = options.translation;
        this.x = options.translation[0];
        this.y = options.translation[1];
        this.z = options.translation[2];
        this.distance = distance
        this.axis = axis; // 0 = x, 1 = z
        this.velocity = [0, 0, 2];
    }

    update(dt) {
        //console.log("ghost update called");
        const g = this;
        //console.log(g.z);

        // z axis
        if (g.axis) {
            if (g.translation[2] >= g.z + g.distance) {
                g.velocity = vec3.scale(g.velocity, g.velocity, -1);
            }
            if (g.translation[2] < g.z) {
                g.velocity = vec3.scale(g.velocity, g.velocity, -1);
            }
        }
        // x axis
        else {
            if (g.translation[0] > g.x + g.distance) {
                g.velocity = -g.velocity;
            }
            if (g.translation[0] < g.x) {
                g.velocity = -g.velocity;
            }
        }
    }

}

Ghost.defaults = {
    velocity: [0, 0, 0],
    scale: [0.5, 0.5, 0.5],
    acceleration: 15
};
