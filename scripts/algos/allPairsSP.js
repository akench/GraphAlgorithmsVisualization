function allPairsSP(adjacencyList) {
    var nodes = Object.keys(adjacencyList);
    var n = nodes.length;
    const dp = initDpArray(adjacencyList);

    const states = [{
        "matrix": copy2dArray(dp),
        "log": []
    }];

    for (var interIndex = 0; interIndex < n; interIndex++) {
        // for each src and dst, see if going thru the intermediate gives a better distance
        for (var srcIndex = 0; srcIndex < n; srcIndex++) {
            for (var dstIndex = 0; dstIndex < n; dstIndex++) {

                // if src or dst is the intermediate, not valid, so skip
                if (srcIndex === interIndex || dstIndex === interIndex) {
                    continue;
                }

                // if found a better path, update the stored path
                const intermediateDistance = dp[srcIndex][interIndex] + dp[interIndex][dstIndex];
                if (intermediateDistance < dp[srcIndex][dstIndex]) {
                    dp[srcIndex][dstIndex] = intermediateDistance;
                    states.push({
                        "matrix": copy2dArray(dp),
                        "log": [
                            `Found better path from ${nodes[srcIndex]} to ${nodes[dstIndex]} that goes through ${nodes[interIndex]}`,
                            `Updated distance to ${intermediateDistance}`
                        ]
                    });
                }

            }
        }
    }

    return states;
}

function initDpArray(adjacencyList) {
    const n = Object.keys(adjacencyList).length;
    // init 2D dp matix
    const dp = new Array(n);
    for (var i = 0; i < dp.length; i++) {
        dp[i] = new Array(n);
        dp[i].fill(Number.MAX_VALUE);
    }

    // fill diagonal with 0s
    for (var r = 0; r < dp.length; r++) {
        for (var c = 0; c < dp[r].length; c++) {
            if (r === c) {
                dp[r][c] = 0;
            }
        }
    }

    const nodeToNum = getNodeToNum(adjacencyList);

    // add the initial distances into matrix
    Object.keys(adjacencyList).forEach(src => {
        for (var edge of adjacencyList[src]) {
            const srcIndex = nodeToNum[src];
            const dstIndex = nodeToNum[edge.node];

            dp[srcIndex][dstIndex] = edge.weight;
        }
    });

    return dp;
}

function getNodeToNum(adjacencyList) {
    const nodeToNum = {};
    var num = 0;
    Object.keys(adjacencyList).forEach(node => {
        nodeToNum[node] = num;
        num++;
    })

    return nodeToNum;
}

function copy2dArray(arr) {
    return JSON.parse(JSON.stringify(arr));
}