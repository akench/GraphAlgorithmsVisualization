var adjacencyList;
var d3Json;

var states;
var stateIndex;
var isPlaying;
var playingTimer;


function renderGraph() {
    // reset variables kept in state
    states = [];
    stateIndex = 0;
    isPlaying = false;

    d3Json = userInputToD3Json();
    adjacencyList = userInputToAdjacencyList();
    update(d3Json.links, d3Json.nodes);
}

function showRandomGraph() {
    const input = getRandomGraphInput();
    document.getElementById("graph-input").value = input;
    renderGraph();
}


// run the DFS algorithm with the specified input
function runDFS() {
    var start = document.getElementById("start_node_dfs").value;

    states = dfs(adjacencyList, start);
    stateIndex = 0
    updateGraphState();
}

function runBFS() {
    var start = document.getElementById("start_node_bfs").value;

    states = bfs(adjacencyList, start);
    stateIndex = 0;
    updateGraphState();
}

function runDijkstra() {
    var start = document.getElementById("start_node_dijkstra").value;

    states = dijkstra(adjacencyList, start);
    stateIndex = 0;
    updateGraphState();
}

function runAllPairsSP() {
    states = allPairsSP(adjacencyList);
    stateIndex = 0;
    updateGraphState();
}

// update the entire UI with the new graph state
function updateGraphState() {
    var curState = states[stateIndex];

    // show the queue, if applicable
    showQueue(curState.queue);

    // show distance matrix, if applicable
    showMatrix(curState.matrix);

    // update distances, if applicable
    showDistances(curState.distancesMap);

    // show heap, if applicable
    displayMinHeap(curState.heap);

    // show log, if applicable
    showLog(curState.log);

    // update node colors (visited and cur nodes)
    updateNodeColors(curState);
}

function updateNodeColors(curState) {
    // reset all nodes to black
    for (const node of d3Json.nodes) {
        const name = node["name"];
        // #node_nodename is a unique id for each node
        // initially just make the node default color
        d3.select("#" + nodePrefix + name).select("circle").style("fill", defaultNodeColor);

        // update visited node colors 
        if (curState.visited && curState.visited.has(name)) {
            d3.select("#" + nodePrefix + name).select("circle").style("fill", visitedNodeColor);
        }

        // update current node color
        if (curState.curNode === name) {
            d3.select("#" + nodePrefix + name).select("circle").style("fill", currentNodeColor);
        }
    }
}

function showQueue(queue) {
    // reset shown queue
    $("#queue").text("");

    // show new queue
    if (queue) {
        // convert queue to string
        var queueStr = queue.join();

        $("#queue").text(`Queue: [${queueStr}]`);
    }
}

function showMatrix(mat) {
    var container = $("#matrix-container");
    container.empty();

    if(!mat) {
        return;
    }

    var nodesList = Object.keys(adjacencyList);

    var table = $("<table>");

    // add header
    var header = $("<tr>");
    header.append("<td></td>")
    for(var node of nodesList) {
        header.append(`<td><strong>${node}</strong></td>`)
    }
    table.append(header);


    for(var r = 0; r < mat.length; r++) {
        var tr = $("<tr>");
        tr.append(`<td><strong>${nodesList[r]}</strong></td>`)
        for(var c = 0; c < mat[r].length; c++) {
            const val = mat[r][c] === Number.MAX_VALUE ? "∞" : mat[r][c];
            tr.append(`<td>${val}</td>`);
        }

        table.append(tr);
    }

    container.append(table);
}

function showDistances(distancesMap) {
    var container = $("#distances-table-container");
    container.empty(); // empty the old table

    // don't do anything if there's no distances map
    if (!distancesMap) {
        return;
    }

    var table = $("<table>");

    // create the header
    var header = $("<tr>");
    header.append("<td>node</td>");
    header.append("<td>shortest distance</td>");
    table.append(header);

    // loop through the distancesMap and add row for each entry.
    for (var node in distancesMap) {
        if (distancesMap.hasOwnProperty(node)) {
            var tr = $("<tr>");
            tr.append("<td>" + node + "</td>");
            var distance = (distancesMap[node] == Number.MAX_VALUE) ? "∞" : distancesMap[node];
            tr.append("<td>" + distance + "</td>");
            table.append(tr);
        }
    }

    container.append(table);
}

function showLog(log) {
    $("#log").text("");
    if (log) {
        var logString = log.join("\n");
        $("#log").text(logString);
    }
}


// view the algorithm's next state
function nextState() {
    // If go out of bounds, keep it at the last state
    stateIndex = Math.min(states.length - 1, stateIndex + 1);
    updateGraphState();
}

// view the algorithm's previous state
function prevState() {
    // if go out of bounds, keep at first state
    stateIndex = Math.max(0, stateIndex - 1);
    updateGraphState();
}

function playOrPause() {
    // if already playing, clear interval
    if (isPlaying) {
        pauseAnimation();
    } else {
        isPlaying = true;
        playingTimer = setInterval(nextState, 1000);
    }
}

function pauseAnimation() {
    isPlaying = false;
    clearInterval(playingTimer);
}


// runs on page load
$(function () {
    document.getElementById("graph-input").value = defaultInput;
    // render the graph with the default input
    renderGraph();

    // display the input form for the selected algorithm
    $("#algo-selector").change(() => {
        $(".algo-input").hide();
        var id = "#" + $("#algo-selector").val();
        $(id).show();
    })
});