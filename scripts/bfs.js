function bfs(adjacencyList, src, dst) {

    const states = [];
    const queue = [];
    queue.push(src);
    const visited = new Set();
    while (queue.length > 0) {

        const node = queue.shift();
        visited.add(node);

        states.push({ "curNode": node, "visited": new Set(visited) });

        if(node === dst) {
            break;
        }

        // javascript will throw an error trying if the node has no neighbors
        if (adjacencyList.hasOwnProperty(node)) {
            for (var neighbor of adjacencyList[node]) {
                queue.push(neighbor);
            }
        }
    }

    return states;
}