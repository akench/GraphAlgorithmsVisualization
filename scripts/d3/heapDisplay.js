function displayMinHeap(minHeapArr) {

    // remove the old heap svg
    d3.select("#heapSvg").remove()

    // don't show a min heap if there is nothing to show
    if(!minHeapArr) return;

    // set the dimensions and margins of the diagram
    var margin = { top: 40, right: 90, bottom: 50, left: 0 },
        // width = 500 - margin.left - margin.right,
        // height = 300 - margin.top - margin.bottom;
        width = $("#min-heap-container").width(),
        height = width / 2;

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var treeData = heapArrToNestedObject(minHeapArr, 0);
    if (!treeData) {
        return;
    }
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // readd a new heap svg
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var heapSvg = d3.select("#min-heap-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "heapSvg");

    // append the svg object to the body of the page

    var g = heapSvg
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    var link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.x + "," + d.y
                + "C" + d.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + d.parent.y;
        });

    // adds each node as a group
    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function (d) {
            return "node" +
                (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // adds the circle to the node
    node.append("circle")
        .attr("r", 13);

    // adds the text to the node
    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function (d) { return -32; })
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.name; });
}

/* [1,2,3,4,5,6]
        1
    2      3
 4   5    6

create node for cur
recursive call to 2n+1 and recursive call to 2n+2 indices
*/
function heapArrToNestedObject(heapArr, curIndex) {

    if (!heapArr[curIndex]) {
        return undefined;
    }

    var dict = {
        name: buildNodeName(heapArr[curIndex]),
        children: []
    };

    var child1 = 2 * curIndex + 1;
    var child2 = child1 + 1;

    if (child1 < heapArr.length) {
        dict.children.push(heapArrToNestedObject(heapArr, child1));
    }
    if (child2 < heapArr.length) {
        dict.children.push(heapArrToNestedObject(heapArr, child2));
    }

    return dict;
}

function buildNodeName(heapNode) {
    console.log(heapNode);
    var distance = (heapNode.distance == Number.MAX_VALUE) ? "∞" : heapNode.distance;
    return `(${heapNode.id}, ${distance})`;
}