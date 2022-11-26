import { Node } from './Node.js';

export class Model extends Node {

    constructor(mesh, image, options, name) {
        super(options);
        this.mesh = mesh;
        this.image = image;
        this.name = name;
    }

}
