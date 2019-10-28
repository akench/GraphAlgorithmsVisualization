function dijkstra(adjacencyList, src) {
    var distancesMap = initDistancesMap(adjacencyList);
    // init src distance to 0
    distancesMap[src] = 0;

    // fill min heap with all node distances
    var openNodes = initMinHeap(distancesMap);
    var closedNodes = new Set();

    var states = [];

    while (openNodes.size() > 0) {
        // visit node with lowest distance
        var node = openNodes.pop();

        console.log("content " + JSON.stringify(openNodes.content));
        states.push(
            { 
                'curNode': node.id, 
                'visited': new Set(closedNodes), 
                'heap': clone(openNodes.content), 
                'distancesMap': clone(distancesMap) 
            }
        )

        closedNodes.add(node.id);

        // calculate distance to all neighbors
        if (adjacencyList.hasOwnProperty(node.id)) {
            for (var neighborEdge of adjacencyList[node.id]) {

                var neighborId = neighborEdge.node;
                if (!closedNodes.has(neighborId)) {
                    var neighborCost = distancesMap[node.id] + neighborEdge.weight;
                    // if we found a better path to the neighbor, update best distance in dict and heap
                    if (neighborCost < distancesMap[neighborId]) {
                        distancesMap[neighborId] = neighborCost;
                        openNodes.decreaseKey(neighborId, neighborCost);
                    }
                }
            }
        }
    }

    // add the final state when we are done
    states.push(
        { 
            'curNode': undefined, 
            'visited': new Set(closedNodes), 
            'heap': clone(openNodes.content), 
            'distancesMap': clone(distancesMap) 
        }
    )
    return states;
}

/*
    Initializes a dictionary from nodeId -> distances
    All distances are initially set to infinity
*/
function initDistancesMap(adjacencyList) {
    var distancesMap = {};

    for (var node in adjacencyList) {
        if (adjacencyList.hasOwnProperty(node)) {
            distancesMap[node] = Number.MAX_VALUE;
        }
    }

    return distancesMap;
}

/*
    Initialized a min heap with the given map from nodeId -> distance
*/
function initMinHeap(distancesMap) {
    var minHeap = new BinaryHeap(
        node => node.distance, // attr to sort by
        node => node.id,       // unique id for nodes
        'distance'             // attr to modify when decrease key
    );

    for (var node in distancesMap) {
        if (distancesMap.hasOwnProperty(node)) {
            minHeap.push({ 'distance': distancesMap[node], 'id': node });
        }
    }

    return minHeap;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}