function bfs(adjacencyList, src, dst) {

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
        states.push({ "curNode": node, "visited": new Set(seen) });

        if(node === dst) {
            break;
        }

        // javascript will throw an error trying if the node has no neighbors
        if (adjacencyList.hasOwnProperty(node)) {
            for (var neighbor of adjacencyList[node]) {
                if(!visited.has(neighbor)) {
                    queue.push(neighbor);
                    visited.add(neighbor);
                }
            }
        }
    }

    return states;
}