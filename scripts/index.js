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



// run the DFS algorithm with the specified input
function runDFS() {
    var start = document.getElementById("start_node_dfs").value;
    var end = document.getElementById("end_node_dfs").value;

    states = dfs(adjacencyList, start, end);
    stateIndex = 0
    updateGraphState();
}

function runBFS() {
    var start = document.getElementById("start_node_bfs").value;
    var end = document.getElementById("end_node_bfs").value;

    states = bfs(adjacencyList, start, end);
    stateIndex = 0;
    updateGraphState();
}

function runDijkstra() {
    var start = document.getElementById("start_node_dijkstra").value;

    states = dijkstra(adjacencyList, start);
    console.log(states);
    stateIndex = 0;
    updateGraphState();
}

// update the entire UI with the new graph state
function updateGraphState() {
    var curState = states[stateIndex];

    // show the queue, if applicable
    showQueue(curState.queue);

    // update distances, if applicable
    showDistances(curState.distancesMap);

    // show heap, if applicable
    showMinHeap(curState.heap);

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
        if (curState.visited.has(name)) {
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
        $("#queue").text(queueStr);
    }
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
            tr.append("<td>" + distancesMap[node] + "</td>");
            table.append(tr);
        }
    }

    container.append(table);
}

function showMinHeap(minHeap) {
    if(minHeap) {
        displayMinHeap(minHeap);
    }
}

// view the algorithm's next state
function nextState() {
    // If go out of bounds, keep it at the last state
    stateIndex = Math.min(states.length - 1, stateIndex + 1);
    console.log(stateIndex)
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