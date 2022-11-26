import { Mesh } from './Mesh.js';

import { Node } from './Node.js';
import { Model } from './Model.js';
import { Camera } from './Camera.js';

import { Scene } from './Scene.js';

export class SceneBuilder {

    constructor(spec) {
        this.spec = spec;
    }

    createNode(spec) {
        switch (spec.type) {
            case 'camera': return new Camera(spec);

            case 'object': {
                const vertices1D = []
                const normals1D = []
                const texels1D = []
                const indices1D = []
                const mesh = this.spec.meshes[spec.mesh]
                //console.log(mesh)
                //console.log(mesh.objects[0].length)
                let counter = 0
                // handle vertices
                for (let index = 0; index < mesh.objects[0].length; index++) {
                    const triangle = mesh.objects[0][index]
                    const triangle_indeces_array = triangle.vertexIndices
                    for (let i = 0; i < 3; i++) {
                        const vertex_vector = mesh.vertices[triangle_indeces_array[i] - 1]
                        for (let j = 0; j < 3; j++) {
                            vertices1D.push(vertex_vector[j])

                        }
                        indices1D.push(counter)
                        counter++
                    }
                }
                console.log(indices1D)
                // handle normals
                for (let index = 0; index < mesh.objects[0].length; index++) {
                    const triangle = mesh.objects[0][index]
                    const triangle_indeces_array = triangle.normalIndices
                    for (let i = 0; i < 3; i++) {
                        const normal_vector = mesh.normals[triangle_indeces_array[i] - 1]
                        for (let j = 0; j < 3; j++) {
                            normals1D.push(normal_vector[j])
                        }
                    }
                }

                // handle texels
                for (let index = 0; index < mesh.objects[0].length; index++) {
                    const triangle = mesh.objects[0][index]
                    const triangle_indeces_array = triangle.texselIndices
                    for (let i = 0; i < 3; i++) {
                        const texel_vector = mesh.texsels[triangle_indeces_array[i] - 1]
                        for (let j = 0; j < 2; j++) {
                            texels1D.push(texel_vector[j])
                        }
                    }
                }


                const mesh1 = new Mesh({ vertices: vertices1D, texcoords: texels1D, normals: normals1D, indices: indices1D });
                console.log(mesh1)
                //console.log(spec)
                //console.log(this.spec.meshes[spec.mesh])
                const texture = this.spec.textures[spec.texture];
                return new Model(mesh1, texture, spec, spec.name);
            }
            default: return new Node(spec, spec.name);
        }
    }

    build() {
        let scene = new Scene();
        this.spec.nodes.forEach(spec => scene.addNode(this.createNode(spec)));
        return scene;
    }

}
