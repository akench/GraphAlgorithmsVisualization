function bfs(adjacencyList, src) {
    const states = [];
    const queue = [];
    queue.push(src);
    // used for bfs algo
    const visited = new Set();

    // used to display which nodes were seen
    const seen = new Set();

    visited.add(src);
    while (queue.length > 0) {
        const node = queue.shift();
        seen.add(node);

        var log = [`Visited ${node}`];

        // javascript will throw an error trying if the node has no neighbors
        if (adjacencyList.hasOwnProperty(node)) {
            for (var neighborEdge of adjacencyList[node]) {
                var neighbor = neighborEdge["node"];

                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.add(neighbor);
                    log.push(`Added ${neighbor} to queue`);
                }
            }
        }

        // make sure we push the state after queue is updated
        states.push(
            {
                "curNode": node, 
                "visited": new Set(seen), 
                "queue": [...queue],
                "log": log
            });
    }

    return states;
}