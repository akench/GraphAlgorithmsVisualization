var width = 960,
    height = 500;

var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-250)
    .size([width, height]);

renderGraph()


function renderGraph() {

    // remove the old graph
    d3.select("svg").remove()

    // readd a new graph
    var svg = d3.select("#graph-column").append("svg")
        .attr("width", width)
        .attr("height", height);

    // parse user input into JSON
    var jsonString = document.getElementById("graph-input").value;
    var json = JSON.parse(jsonString);

    force.nodes(json.nodes)
        .links(json.links)
        .start();

    var link = svg.selectAll(".link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", 5);

    var node = svg.selectAll(".node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.append("circle")
        .attr("r", "25");

    node.append("text")
        .attr("dx", 35)
        .attr("dy", 0)
        .text(function (d) { return d.name });

    force.on("tick", function () {
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("transform",
            function (d) { return "translate(" + d.x + "," + d.y + ")"; }
        );
    });
}
