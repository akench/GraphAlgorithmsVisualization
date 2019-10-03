var svg;
const width = 960, height = 600;
const nodePrefix = "node_"
var node;
var link;
var adjacencyList;
var d3Json;

var states;
var stateIndex;


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(150).strength(1))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(60));

function renderGraph() {
    // reset variables kept in state
    states = [];
    stateIndex = 0;

    d3Json = userInputToD3Json();
    adjacencyList = userInputToAdjacencyList();
    update(d3Json.links, d3Json.nodes);
}

function update(links, nodes) {
    // remove the old graph
    d3.select("svg").remove()

    // readd a new graph
    svg = d3.select("#graph-column").append("svg")
        .attr("width", width)
        .attr("height", height);


    svg.append('defs').append('marker')
        .attrs({
            'id': 'arrowhead',
            'viewBox': '-0 -5 10 10',
            'refX': 26,
            'refY': 0,
            'orient': 'auto',
            'markerWidth': 13,
            'markerHeight': 13,
            'xoverflow': 'visible'
        })
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');

    link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end', 'url(#arrowhead)')

    link.append("title")
        .text(function (d) { return d.type; });

    edgepaths = svg.selectAll(".edgepath")
        .data(links)
        .enter()
        .append('path')
        .attrs({
            'class': 'edgepath',
            'fill-opacity': 0,
            'stroke-opacity': 0,
            'id': function (d, i) { return 'edgepath' + i }
        })
        .style("pointer-events", "none");

    node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("id", function (d, i) { return nodePrefix + d.name; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

    node.append("circle")
        .attr("r", 21)
        .style("fill", function (d, i) { return "black" })

    node.append("title")
        .text(function (d) { return d.id; });

    node.append("text")
        .attr("dx", -2)
        .attr("dy", -30)
        .text(function (d) { return d.name });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    simulation.alpha(1).restart();
}

function ticked() {
    link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

    node
        .attr("transform", function (d) { return "translate(" + d.x + ", " + d.y + ")"; });

    edgepaths.attr('d', function (d) {
        return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = undefined;
    d.fy = undefined;
}



function runDFS() {
    var start = document.getElementById("start_node").value;
    var end = document.getElementById("end_node").value;

    states = dfs(adjacencyList, start, end);
    stateIndex = 0
    updateGraphState();
}

function updateGraphState() {
    curState = states[stateIndex];
    // reset all nodes to black
    for (const node of d3Json.nodes) {
        const name = node["name"];
        // #node_nodename is a unique id for each node
        // initially just make the node black
        d3.select("#" + nodePrefix + name).select("circle").style("fill", "black");

        // update visited node colors to blue
        if (curState.visited.has(name)) {
            d3.select("#" + nodePrefix + name).select("circle").style("fill", "blue");
        }

        // update current node to green
        if (curState.curNode === name) {
            d3.select("#" + nodePrefix + name).select("circle").style("fill", "green");
        }
    }
}

// increment state index. 
function nextState() {
    // If go out of bounds, keep it at the last state
    stateIndex = Math.min(states.length - 1, stateIndex + 1);
    updateGraphState();
}

function prevState() {
    // if go out of bounds, keep at first state
    stateIndex = Math.max(0, stateIndex - 1);
    updateGraphState();
}


function main() {
    document.getElementById("graph-input").value = defaultInput;
    // render the graph with the default input
    renderGraph();
}

main();