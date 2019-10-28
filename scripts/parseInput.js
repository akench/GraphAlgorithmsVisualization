const defaultInput = "a -> b : 4\na -> c : 2\nc -> b : 1\nb -> d : 5\nc -> d : 8\nc -> e :10\nd -> e : 2\nd -> z : 6\ne -> z : 5";

/**
 * Parse the raw user input and build an adjacency list of the graph
 */
function userInputToAdjacencyList() {
    var input = document.getElementById("graph-input").value;
    input = input.replaceAll(" ", "");

    var adjacencyList = {}
    input.split("\n").forEach(line => {
        var nodeLink = lineToNodeLink(line);

        var src = nodeLink.src;
        var dst = nodeLink.dst;
        var weight = nodeLink.weight;

        var edge = {"node": dst, "weight": weight};
        // add the given edge
        if(adjacencyList.hasOwnProperty(src)) {
            adjacencyList[src].push(edge);
        } else {
            adjacencyList[src] = [edge];
        }

        // may have to add the destination to the dict if not exist
        if(!adjacencyList.hasOwnProperty(dst)) {
            adjacencyList[dst] = [];
        }
    });

    console.log(adjacencyList);
    return adjacencyList;
}

/**
 * Parses raw user input to generate a Json object that D3 uses to render the graph
 * The json object relies on each node having a numeric id instead of a string id
 */
function userInputToD3Json() {
    var input = document.getElementById("graph-input").value;
    input = input.replaceAll(" ", "");

    var curIndex = 0;
    var nameToId = {};

    var graphJson = { "nodes": [], "links": [] }

    input.split("\n").forEach(line => {
        var nodeLink = lineToNodeLink(line);

        var src = nodeLink.src;
        var dst = nodeLink.dst;
        var weight = nodeLink.weight;

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
                "target": dstId,
                "weight": weight
            });
    });

    console.log(graphJson);
    return graphJson;
}


String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};

// converts user input line to graph link
function lineToNodeLink(line) {
    var tokens = line.split(/->|:/) // split by arrow or colon
    return {
        "src": tokens[0],
        "dst": tokens[1],
        "weight": parseFloat(tokens[2])
    }
}