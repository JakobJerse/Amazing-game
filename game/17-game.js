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
        this.deathSound = Math.floor(Math.random() * 6.99);
        this.death = 1;
        this.backSound = Math.floor(Math.random() * 3.99);
        this.zeZaigral = 0;
        this.dvignjenTelefon = 0;
        this.datum = new Date();
        this.sekunde = this.datum.getSeconds();

        // jers
        this.collisionGhost = 0;

        await this.load('scene.json');

        this.canvas.addEventListener('click', e => this.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (this.backSound == 0 && this.zeZaigral == 0) {
                document.getElementById("back1").volume = 0.15;
                document.getElementById("back1").play();
                this.zeZaigral = 1;
            } else if (this.backSound == 1 && this.zeZaigral == 0) {
                document.getElementById("back2").volume = 0.15;
                document.getElementById("back2").play();
                this.zeZaigral = 1;
            } else if (this.backSound == 2 && this.zeZaigral == 0) {
                document.getElementById("back3").volume = 0.15;
                document.getElementById("back3").play();
                this.zeZaigral = 1;
            } else if (this.backSound == 3 && this.zeZaigral == 0) {
                document.getElementById("back4").volume = 0.15;
                document.getElementById("back4").play();
                this.zeZaigral = 1;
            }
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
                document.getElementById("kluci").volume = 0.7;
                document.getElementById("kluci").play();
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
                document.getElementById("odpri").volume = 0.7;
                document.getElementById("odpri").play();
                document.getElementById("victory").style.display = "flex";
            } else if (this.exitJumpscareWithoutKey == 1) {
                document.getElementById("jumpscare2").style.display = "block";
                document.getElementById("amogussound").volume = 1;
                document.getElementById("amogussound").play();
                setTimeout(function () {
                    document.getElementById("jumpscare2").style.display = "none";
                }, 2000)
                console.log("JUMPSCARE");
                this.exitJumpscareWithoutKey = 0;
            }
        }
        if (this.physics.checkGhost(dt) == 1) {
            if (this.backSound == 0) {
                document.getElementById("back1").pause();
            } else if (this.backSound == 1) {
                document.getElementById("back2").pause();
            } else if (this.backSound == 2) {
                document.getElementById("back3").pause();
            } else if (this.backSound == 3) {
                document.getElementById("back4").pause();
            }

            if (this.deathSound == 0 && this.death == 1) {
                document.getElementById("death1").volume = 1;
                document.getElementById("death1").play();
                this.death = 0;
            } else if (this.deathSound == 1 && this.death == 1) {
                document.getElementById("death2").volume = 1;
                document.getElementById("death2").play();
                this.death = 0;
            } else if (this.deathSound == 2 && this.death == 1) {
                document.getElementById("death3").volume = 1;
                document.getElementById("death3").play();
                this.death = 0;
            } else if (this.deathSound == 3 && this.death == 1) {
                document.getElementById("death4").volume = 1;
                document.getElementById("death4").play();
                this.death = 0;
            } else if (this.deathSound == 4 && this.death == 1) {
                document.getElementById("death5").volume = 1;
                document.getElementById("death5").play();
                this.death = 0;
            } else if (this.deathSound == 5 && this.death == 1) {
                document.getElementById("death6").volume = 1;
                document.getElementById("death6").play();
                this.death = 0;
            }
            else if (this.deathSound == 6 && this.death == 1) {
                document.getElementById("death7").volume = 1;
                document.getElementById("death7").play();
                this.death = 0;
            }
            document.getElementById("death").style.display = "flex";
        }

        if (this.physics.checkTelefon(dt) == 1) {
            if (this.dvignjenTelefon == 0) {
                document.getElementById("jumpscare1").style.display = "block";
                document.getElementById("wazapzvok").volume = 1;
                document.getElementById("wazapzvok").play();
                setTimeout(function () {
                    document.getElementById("jumpscare1").style.display = "none";
                }, 2000)
                this.dvignjenTelefon = 1;
            }
        }

        if (this.dvignjenTelefon == 0) {
            let novDatum = new Date();
            let noveSekunde = novDatum.getSeconds();
            if (Math.abs(this.sekunde - noveSekunde) >= 5) {
                let cameraX = this.camera.translation[0];
                let cameraY = this.camera.translation[2];
                let telefonX = -2.6;
                let telefonY = -5.75;
                let euclid = Math.sqrt(Math.pow(cameraX - telefonX, 2) + Math.pow(cameraY - telefonY, 2));
                let normaliziran = Math.abs(euclid / 34 - 1);
                document.getElementById("telefon").volume = normaliziran;
                document.getElementById("telefon").play();
                this.sekunde = noveSekunde;
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
