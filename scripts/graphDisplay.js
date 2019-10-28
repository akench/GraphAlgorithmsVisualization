const width = $("#graph-column").width();
const height = width;
const nodePrefix = "node_"
var node, link, edgepaths, edgelabels;

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(150).strength(.2))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(80));


function update(links, nodes) {
    // remove the old graph
    d3.select("#graphSvg").remove()

    console.log($("#graph-column").width())
    console.log($("#graph-column").height())
    // readd a new graph
    var graphSvg = d3.select("#graph-column").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "graphSvg");


    graphSvg.append('defs').append('marker')
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

    link = graphSvg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end', 'url(#arrowhead)')

    // return the link weight as the title
    link.append("title")
        .text(function (d) { return d.weight; });

    edgepaths = graphSvg.selectAll(".edgepath")
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

    edgelabels = graphSvg.selectAll(".edgelabel")
        .data(links)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attrs({
            'class': 'edgelabel',
            'id': function (d, i) { return 'edgelabel' + i },
            'font-size': 20,
            'fill': '#aaa'
        });

    edgelabels.append('textPath')
        .attr('xlink:href', function (d, i) { return '#edgepath' + i })
        .style("text-anchor", "middle")
        .style("text-decoration", "underline")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text(function (d) { return d.weight });


    node = graphSvg.selectAll(".node")
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
        .attr("r", nodeRadius)
        .style("fill", defaultNodeColor)

    node.append("title")
        .text(function (d) { return d.id; });

    node.append("text")
        .attr("dx", -4)
        .attr("dy", 3)
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

    edgelabels.attr('transform', function (d) {
        if (d.target.x < d.source.x) {
            var bbox = this.getBBox();

            rx = bbox.x + bbox.width / 2;
            ry = bbox.y + bbox.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        }
        else {
            return 'rotate(0)';
        }
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