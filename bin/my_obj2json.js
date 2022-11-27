const fs = require('fs');

const data = fs.readFileSync(process.argv[2], 'utf8');
const lines = data.split('\n');

const vertices = []
let vertexIx = 0

const normals = []
let normalIx = 0

const texsels = []
let texselIx = 0

const objects = []
let objectIx = -1

let object = []

const materialObstaja = []
const stevilkaMateriala = []

lines.forEach(function (line, lineIndex) {
    //console.log(item, index);
    //console.log(item[0])
    elements = line.split(/[ ]+/)
    // if(index == 3 || index == 4) {
    //     console.log(elements)
    // }
    if (elements[0] === "usemtl") {
        if (materialObstaja.includes(elements[1])) {
            let indexMateriala = -1
            for (let x = 0; x < materialObstaja.length; x++) {
                if (materialObstaja[x] == elements[1]) {
                    indexMateriala = x
                    break
                }
            }
            stevilkaMateriala.push(indexMateriala)
        } else {
            materialObstaja.push(elements[1])
            stevilkaMateriala.push(materialObstaja.length - 1)
        }
    }
    if (elements[0] === "v") {
        vertices.push([Number.parseFloat(elements[1]), Number.parseFloat(elements[2]), Number.parseFloat(elements[3])])
        vertexIx++
    }
    if (elements[0] === "vn") {
        normals.push([Number.parseFloat(elements[1]), Number.parseFloat(elements[2]), Number.parseFloat(elements[3])])
        normalIx++
    }
    if (elements[0] === "vt") {
        texsels.push([Number.parseFloat(elements[1]), Number.parseFloat(elements[2])/*, Number.parseFloat(elements[3])*/])
        texselIx++
    }
    if (elements[0] === "o") {
        if (objectIx != -1) {
            objects.push(object)
            //console.log(objects)
            object = object.map((x) => x);
            object.length = 0
            //console.log(objects)
        }
        objectIx++
    }
    if (elements[0] === "f") {  // lahko so 3, 4 ali vec ogljisc   +   lahko so podani indeksi brez texsel indeksa (takrat:  IndeXnumber//IndeXnumber)
        // console.log(elements[1].split(/[/]+/))
        // console.log(elements[2].split(/[/]+/))
        // console.log(elements[3].split(/[/]+/))
        const polygon = {}
        const vertexIndices = []
        const texselIndices = []
        const normalIndices = []
        elements.forEach(function (element, elementIndex) {
            if (elementIndex === 0) {
                // do nothing ("f")
            } else {
                indexTuple = element.split(/[/]+/)
                if (indexTuple.length == 2) {   // ni texsel informacije     vertex//normal
                    vertexIndices.push(Number.parseInt(indexTuple[0]))
                    normalIndices.push(Number.parseInt(indexTuple[1]))
                } else {                       // vse informacije    vertex/texsel/normal
                    vertexIndices.push(Number.parseInt(indexTuple[0]))
                    texselIndices.push(Number.parseInt(indexTuple[1]))
                    normalIndices.push(Number.parseInt(indexTuple[2]))
                }
            }
        });
        polygon.vertexIndices = vertexIndices
        if (texselIndices.length > 0) {
            polygon.texselIndices = texselIndices
        }
        polygon.normalIndices = normalIndices
        object.push(polygon)
        // console.log("vertexIX")
        // console.log(vertexIndices)
        // console.log("texselIX")
        // console.log(texselIndices)
        // console.log("normalIX")
        // console.log(normalIndices)
        //console.log(polygon)
    }
    if (lineIndex == lines.length - 1) {  // shranimo se zadnji objekt, ker ni vec "g" oznake
        objects.push(object)
        //console.log("zadnji objekt shranjen")
    }
});

map = { vertices: vertices, normals: normals, texsels: texsels, objects: objects }

// console.log(vertices)
// console.log(normals)
// console.log(texsels)
//console.log(objects)


const motherString = JSON.stringify(map)
//console.log(motherString)

fs.writeFileSync('table.json', motherString);
//fs.writeFileSync('hatersGonnaHatePotatosGonnaPotate.json', JSON.stringify({materiali:stevilkaMateriala}));