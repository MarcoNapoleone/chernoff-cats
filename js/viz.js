/**
 * Created by vdidonato on 3/24/14.
 * Updated to v5 by titto on 4/22/20.
 */

var delayTime = 2000, // time between the picture of one year and the next
    updateTime = 500; // time for transitions

var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins

// screen is 800 x 300
// actual drawing leaves a margin around
// width and height are the size of the actual drawing
//
var width = 800 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

// x is the scale for x-axis
// domain is not given here but it is updated by updateXScaleDomain()
// 
var xScale = d3.scaleBand()         // ordinal scale
               .rangeRound([10, width])    // leaves 10 pixels for the y-axis
               .padding(.1);               // between the bands
                                    // xScale.bandwidth() will give the width of each band
                                    // xScale(value) will give the x-coordinate for that value

// y is the scale for y-axis
// domain is not given here but it is updated by updateYScaleDomain()
//
var yScale = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(xScale);  		// Bottom = ticks below
var yAxis = d3.axisLeft(yScale).ticks(10);   // Left = ticks on the left 

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again 
    .attr("height", height + margin.top + margin.bottom)   // i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");                                                    

// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and  
// d.population (a number)
//
function updateXScaleDomain(data) {
    var values = data["ageGroups"];
    xScale.domain(values.map(function(d) { return d.ageGroup}));
    // for example x.domain is initialized with ["0-4", "5-9", "10-14", ... ] 
}

function updateYScaleDomain(data){
    var values = data["ageGroups"];
    yScale.domain([0, d3.max(values, function(d) { return d.population; })]);
}

function updateAxes(){
    // ".y.axis" selects elements that have both classes "y" and "axis", that is: class="y axis"
    svg.select(".y.axis").transition().duration(updateTime).call(yAxis);
    svg.select(".x.axis").transition().duration(updateTime).call(xAxis);
}

function drawAxes(){

    // draw the x-axis
    //
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // draw the y-axis
    //
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // add a label along the y-axis
    //
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 15)
       .attr("font-size","15px")
       .style("text-anchor", "end")
       .text("Population (thousands)");
}

// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and  
// d.population (a number)
//
function updateDrawing(data){

    var year = data["year"];
    var values = data["ageGroups"];

    // Data join: function(d) is the key to recognize the right bar
    var bars = svg.selectAll(".bar").data(values, function(d){return d.ageGroup});

    // Exit clause: Remove elements
    bars.exit().remove();

    // Enter clause: add new elements
    //
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.ageGroup); })
        .attr("y", function(d) { return yScale(d.population); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.population); });

    // Enter + Update clause: update y and height
    //
    bars.transition().duration(updateTime)
        .attr("x", function(d) { return xScale(d.ageGroup); })
        .attr("y", function(d) { return yScale(d.population); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.population); });

    // Data join for year
    // ".year" selects all elements with class="year"
    //
    var yearNode = svg.selectAll(".year").data([year]);

    // Enter year
    // Merge with update selection so text is set even on the first draw
    yearNode.enter()
        .append("text")
        .attr("class", "year")
        .attr("x", width - margin.right)
        .attr("y", margin.top)
        .merge(yearNode)
        .text(function(d){ return d });

}

function redraw(data) {
    updateXScaleDomain(data);
    updateYScaleDomain(data);
    updateAxes();
    updateDrawing(data);
}

// Old bar chart example left here for reference. It is not executed in the
// current project but kept to document how the d3 update pattern works.
/*
d3.json("data/dataset.json")
        .then(function(data) {

        // Drawing axes and initial drawing
        //
        updateYScaleDomain(data[0]);
        updateXScaleDomain(data[0]);
        drawAxes();
        updateDrawing(data[0]);

        var counter = 0;
        setInterval(function(){
                if (data[counter+1]){
                        counter++;
                        redraw(data[counter]);
                }
        }, delayTime)
        })
        .catch(function(error) {
                console.log(error); // Some error handling here
        });
*/


window.initViz = function(cats, italy) {
    var width = 800,
        height = 600;

    var svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);

    var projection = d3.geoMercator()
        .fitSize([width, height], italy);

    var path = d3.geoPath().projection(projection);

    svg.append('g')
        .selectAll('path')
        .data(italy.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#eeeeee')
        .attr('stroke', '#333');

    var earScale = d3.scaleLinear()
        .domain(d3.extent(cats, d => d.earLength))
        .range([5, 20]);

    var eyeScale = d3.scaleLinear()
        .domain(d3.extent(cats, d => d.eyeWidth))
        .range([2, 8]);

    var headScale = d3.scaleLinear()
        .domain(d3.extent(cats, d => d.headSize))
        .range([10, 30]);

    var tailScale = d3.scaleLinear()
        .domain(d3.extent(cats, d => d.tailLength))
        .range([10, 40]);

    var catGroups = svg.selectAll('.cat')
        .data(cats)
        .enter()
        .append('g')
        .attr('class', 'cat')
        .attr('transform', d => {
            var p = projection([d.lon, d.lat]);
            return 'translate(' + p[0] + ',' + p[1] + ')';
        });

    catGroups.append('circle')
        .attr('class', 'head')
        .attr('r', d => headScale(d.headSize))
        .on('click', () => sortCats('headSize'));

    catGroups.append('line')
        .attr('class', 'ear left')
        .attr('x1', d => -headScale(d.headSize)/2)
        .attr('y1', d => -headScale(d.headSize))
        .attr('x2', d => -headScale(d.headSize)/2)
        .attr('y2', d => -headScale(d.headSize) - earScale(d.earLength))
        .on('click', () => sortCats('earLength'));

    catGroups.append('line')
        .attr('class', 'ear right')
        .attr('x1', d => headScale(d.headSize)/2)
        .attr('y1', d => -headScale(d.headSize))
        .attr('x2', d => headScale(d.headSize)/2)
        .attr('y2', d => -headScale(d.headSize) - earScale(d.earLength))
        .on('click', () => sortCats('earLength'));

    catGroups.append('circle')
        .attr('class', 'eye left')
        .attr('cx', d => -headScale(d.headSize)/3)
        .attr('cy', d => -headScale(d.headSize)/4)
        .attr('r', d => eyeScale(d.eyeWidth))
        .on('click', () => sortCats('eyeWidth'));

    catGroups.append('circle')
        .attr('class', 'eye right')
        .attr('cx', d => headScale(d.headSize)/3)
        .attr('cy', d => -headScale(d.headSize)/4)
        .attr('r', d => eyeScale(d.eyeWidth))
        .on('click', () => sortCats('eyeWidth'));

    catGroups.append('line')
        .attr('class', 'tail')
        .attr('x1', 0)
        .attr('y1', d => headScale(d.headSize))
        .attr('x2', 0)
        .attr('y2', d => headScale(d.headSize) + tailScale(d.tailLength))
        .on('click', () => sortCats('tailLength'));

    function sortCats(key) {
        var sorted = cats.slice().sort((a, b) => d3.ascending(a[key], b[key]));
        var step = width / (cats.length + 1);
        sorted.forEach((d, i) => {
            d.sortX = step * (i + 1);
            d.sortY = height - 40;
        });

        svg.selectAll('.cat')
            .transition()
            .duration(1000)
            .attr('transform', d => {
                if (d.sortX !== undefined) {
                    return 'translate(' + d.sortX + ',' + d.sortY + ')';
                }
                var p = projection([d.lon, d.lat]);
                return 'translate(' + p[0] + ',' + p[1] + ')';
            });
    }
};
