String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};

function userInputToD3Json() {
    var input = document.getElementById("graph-input").value;
    input = input.replaceAll(" ", "");

    var curIndex = 0;
    var idToIndex = {};

    var graphJson = { "nodes": [], "links": [] }

    input.split("\n").forEach(line => {
        var nodes = line.split("->");
        var src = nodes[0];
        var dst = nodes[1];

        var srcIndex, dstIndex;
        if (!idToIndex.hasOwnProperty(src)) {
            graphJson["nodes"].push({ "name": src });
            idToIndex[src] = curIndex;
            srcIndex = curIndex;
            curIndex++;
        } else {
            srcIndex = idToIndex[src];
        }

        if (!idToIndex.hasOwnProperty(dst)) {
            graphJson["nodes"].push({ "name": dst });
            idToIndex[dst] = curIndex;
            dstIndex = curIndex;
            curIndex++;
        } else {
            dstIndex = idToIndex[dst];
        }

        graphJson["links"].push(
            {
                "source": srcIndex,
                "target": dstIndex
            });
    });

    console.log(graphJson);
    return graphJson;
}