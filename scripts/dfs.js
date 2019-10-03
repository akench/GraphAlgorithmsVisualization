
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
function dfs(adjacencyList, src, dst) {
    var states = [];
    _dfs(adjacencyList, src, dst, new Set(), states);
    return states;
}

function _dfs(adjacencyList, cur, dst, visited, states) {
    if(visited.has(cur)) return;

    states.push({"curNode": cur, "visited": new Set(visited)});

    if(dst === cur) {
        return;
    }

    visited.add(cur);
    for(var neighbor of adjacencyList[cur]) {
        _dfs(adjacencyList, neighbor, dst, visited, states);
    }
}