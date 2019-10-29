const minNumNodes = 3;
const maxNumNodes = 8;
const edgeFrequency = 0.25;
const maxWeight = 10;

function getRandomGraphInput() {
    const nodesList = getRandomNodesList();
    return getRandomEdges(nodesList).join("\n");
}

function getRandomNodesList() {
    const numNodes = Math.round(Math.random() * (maxNumNodes - minNumNodes)) + minNumNodes;

    const nodes = [];
    const aCode = 'a'.charCodeAt(0);
    for(var i = 0; i < numNodes; i++) {
        nodes.push(String.fromCharCode(aCode + i));
    }

    return nodes;
}

function getRandomEdges(nodes) {
    const edges = [];

    for(var src of nodes) {
        for(var dst of nodes) {
            if(src === dst) continue;

            // some chance that we have an edge here
            if(Math.random() < edgeFrequency) {
                const weight = Math.ceil(Math.random() * maxWeight);
                edges.push(`${src} -> ${dst} : ${weight}`);
            }
        }
    }

    return edges;
}