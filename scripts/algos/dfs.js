
/*
Run DFS on the graph going from src to dst
will store every stage of graph in list of dictionaries

[
    {
        "curNode": ...
        "visited": Set(....)
    },
    {
        ...
    }
]
*/
function dfs(adjacencyList, src) {
    var states = [];
    _dfs(adjacencyList, src, new Set(), states);
    return states;
}

function _dfs(adjacencyList, cur, visited, states) {
    if(visited.has(cur)) return;

    states.push({"curNode": cur, "visited": new Set(visited)});

    visited.add(cur);
    // javascript will throw an error trying if the node has no neighbors
    if (adjacencyList.hasOwnProperty(cur)) {
        for(var neighborEdge of adjacencyList[cur]) {
            var neighbor = neighborEdge["node"];
            _dfs(adjacencyList, neighbor, visited, states);
        }
    }
}