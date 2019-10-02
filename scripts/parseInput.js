String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};

function userInputToD3Json() {
    var input = document.getElementById("graph-input").value;
    input = input.replaceAll(" ", "");

    var curIndex = 0;
    var nameToId = {};

    var graphJson = { "nodes": [], "links": [] }

    input.split("\n").forEach(line => {
        var nodes = line.split("->");
        var src = nodes[0];
        var dst = nodes[1];

        var srcId, dstId;
        if (!nameToId.hasOwnProperty(src)) {
            graphJson["nodes"].push({ "name": src, "id": curIndex });
            nameToId[src] = curIndex;
            srcId = curIndex;
            curIndex++;
        } else {
            srcId = nameToId[src];
        }

        if (!nameToId.hasOwnProperty(dst)) {
            graphJson["nodes"].push({ "name": dst, "id": curIndex });
            nameToId[dst] = curIndex;
            dstId = curIndex;
            curIndex++;
        } else {
            dstId = nameToId[dst];
        }

        graphJson["links"].push(
            {
                "source": srcId,
                "target": dstId
            });
    });

    console.log("myjson")
    console.log(graphJson);
    return graphJson;

    // return JSON.parse('{"nodes": [{"name": "1","id": 1},{"name": "2","id": 2},{"name": "3","id": 3},{"name": "4","id": 4}],"links": [{"source": 1,"target": 2},{"source": 2,"target": 4},{"source": 4,"target": 2}]}')
}