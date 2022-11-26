import { Application } from '../../common/engine/Application.js';

import { Renderer } from './Renderer.js';
import { Physics } from './Physics.js';
import { Camera } from './Camera.js';
import { SceneLoader } from './SceneLoader.js';
import { SceneBuilder } from './SceneBuilder.js';
import { Ghost } from './Ghost.js';

class App extends Application {

    async start() {
        const gl = this.gl;

        this.renderer = new Renderer(gl);
        this.time = performance.now();
        this.startTime = this.time;
        this.aspect = 1;
        this.kluc = 0;
        this.zaZbrisat1 = 0;
        this.zaZbrisat2 = 0;
        this.zbrisiEnkrat = 0;
        this.exitJumpscareWithoutKey = 1;

        // jers
        this.collisionGhost = 0;

        await this.load('scene.json');

        this.canvas.addEventListener('click', e => this.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (document.pointerLockElement === this.canvas) {
                this.camera.enable();
            } else {
                this.camera.disable();
            }
        });
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene(uri);
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        this.physics = new Physics(this.scene);

        // Find first camera.
        this.camera = null;
        this.ghost = []
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }
            if (node instanceof Ghost) {
                this.ghost.push(node)
            }
        });

        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.renderer.prepare(this.scene);

        for (let index = 0; index < this.scene.nodes.length; ++index) {
            if (this.scene.nodes[index].name == "key") {
                this.zaZbrisat1 = index;
            }
            if (this.scene.nodes[index].name == "collisonkluc") {
                this.zaZbrisat2 = index;
            }
        }
    }

    update() {
        const t = this.time = performance.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.camera) {
            this.camera.update(dt);
        }
        if (this.ghost) {
            this.ghost.forEach(min => {
                min.update(dt);
            });
        }
        if (this.physics) {
            this.physics.update(dt);
        }

        if (this.zbrisiEnkrat == 0) {
            if (this.physics.checkKljuc(dt) == 1) {
                this.kluc = 1;
            }
            if (this.kluc == 1) {
                this.scene.nodes.splice(this.zaZbrisat1, 1);
                this.scene.nodes.splice(this.zaZbrisat2 - 1, 1);
                this.zbrisiEnkrat = 1;
            }
        }

        if (this.physics.checkExit(dt) == 1) {
            if (this.kluc == 1) {
                console.log("victory");
            } else if (this.exitJumpscareWithoutKey == 1) {
                document.getElementById("jumpscare1").style.display = "block";
                document.getElementById("wazapzvok").play();
                setTimeout(function () {
                    document.getElementById("jumpscare1").style.display = "none";
                }, 2000)
                console.log("JUMPSCARE");
                this.exitJumpscareWithoutKey = 0;
            }
        }
        if (this.physics.checkGhost(dt) == 1) {
            if (this.kluc == 1) {
                console.log("wazaaaap");
            }
        }

    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.camera) {
            this.camera.aspect = this.aspect;
            this.camera.updateProjection();
        }
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();
