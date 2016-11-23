/*
 * Adapted and repurposed for use in this software by Tony Niven 1/11/2016
 */


function setHover(d,stats,color) {
	
	var removalTip = d3.selectAll(".charttooltip")
		.remove();
	
	if (d != null) {
		tooltip = d3.select("body").append("div").attr("class", "charttooltip")
				.style("opacity", 0);
		

		tooltip
		.html("<h4 id=\"optionName\">"+"</h4>" +
				"<b>Count: </b>" + d["count"] +
				"<br>Chosen by <b>"+ ((d["count"] / stats.totalRespondants) * 100).toFixed(2) +"%</b> of respondants")
		.style('left',(d3.event.pageX - 20)+ 'px') //position of the tooltip
		.style('top',(d3.event.pageY + 25) + 'px')
		
		tooltip
			.select("#optionName")
			.style("color", color)
			.text(d["name"]);
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,"optionName"]);
		MathJax.Hub.Queue(showTooltip);
	}
}


function showTooltip()
{
	tooltip.transition()
	.style("opacity", .9);
}

function clearHover() {
	setHover(null);
}

//hovers related data line from the answer detail if it exists
function hoverRelatedData(d,i)
{
	
	if(d!=null)
	{
		//tempcolor 
		var relatedID = d['rowid'];
		//var relatedID = i;
		selectedRow = d3.select("tr[rowid='" + relatedID + "']")
			.style("background-color", '#ddd');
		//console.log(selectedRow);
	}
	else if(typeof selectedRow !== 'undefined')
	{
		selectedRow
		.style("background-color", '#fcfcfc');
	}
}

function showRelatedResults(d,i)
{
	if(d!=null)
	{
		//tempcolor 
		var relatedID = d['rowid'];
		var correct = d["correct"]
		//var relatedID = i;
		encaseUsersAndMakeTheTable(inquisition(relatedID),d["name"],correct);
		//console.log(selectedRow);
	}
}

function VisHistogram( _parentPane, _data)
{
	var self = this; //ensures the self variable points to the instance of the class object
	
	self.parentPane = _parentPane;	//The ID of the container with the svg canvas in it on which we are drawing
	self.svgCanvas = d3.select(self.parentPane).select("svg")
	self.data = _data;				//The categorical data for making a histogram
}

VisHistogram.prototype.SetBounds = function()
{
	var self = this;
	//Determine critical attributes of the canvas
	var rawWidthCandidate = self.svgCanvas.attr("width");
		
	self.RawWidth = rawWidthCandidate
	self.RawHeight = self.svgCanvas.attr("height");
	
	//Set margin attributes for the chart
	self.margin = { top:10, bottom:100, left: 35, right:10 };
	
	//Set the actual useable width and height of the canvas
	self.width = self.RawWidth - self.margin.left - self.margin.right;
	self.height = self.RawHeight - self.margin.top - self.margin.bottom;
}

//Draws the visualization to the targetted canvas
VisHistogram.prototype.SetupVisualization = function()
{
		var self = this;
		
		//Resize if needed
		this.SetBounds();
		
		if(self.data["results"].length > 0)
		{		//Set color scale
			self.categoricalColor = d3.scale.category20();
		
			// Create scales
		 	self.xScale = d3.scale.ordinal().rangeBands([0, self.width], 0.1).domain(d3.range(0, self.data["results"].length));
		    self.yScale = d3.scale.linear().range([self.height, 0]);
	
		    //Create Axis
		    self.xAxis = d3.svg.axis().scale(self.xScale);
		    self.yAxis = d3.svg.axis().scale(self.yScale).orient("left");
		    self.yAxis.tickFormat(d3.format("d"));
	
		    self.DrawVisualization();
		}
		else
		{
			self.drawPlaceholder();
			console.log("drawing empty box 1")
		}

}

VisHistogram.prototype.DrawVisualization = function()
{
	var self = this;
	
	//Clear old crap after resize
	var deleted = d3.selectAll(".barGroup").remove();
	deleted = d3.selectAll(".axis").remove()
	deleted = d3.selectAll(".chartOffsetGroup").remove();
	
	// visual elements for axis etc
    self.visualGroup = self.svgCanvas.append("g")
    	.attr({
        "transform": "translate(" + self.margin.left + "," + self.margin.top + ")"
		})
		.attr("class","chartOffsetGroup");

    // xScale and xAxis stays constant:
    // copied from http://bl.ocks.org/mbostock/4403522
    self.visualGroup.append("g")
        .attr("class", "xAxis axis")
        .attr("transform", "translate(0," + self.height + ")")
        .call(self.xAxis)
        .selectAll("text")
        .attr("y", 3) // magic number
        .attr("x", 10) // magic number
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .text(function (d,i) {
        	var candidateText = self.data["results"][i]["name"];
        	
        	//possible ... manip here if need
        	
            return candidateText;
        });

    self.visualGroup.append("g").attr("class", "yAxis axis");
	

	//Draw bars
	var maxCount = d3.max(self.data["results"], function(d) { return d.count; })
	var horizontalTicks = maxCount;
	if(horizontalTicks > 10);
		horizontalTicks = horizontalTicks % 10;
	
	var responseTotal;
	for (var i = 0; i < self.data["results"].length; i++) {
			responseTotal += getResultCount(self.data["results"][i]["id"],self.data)
		}
	var stats = {maxCount: maxCount, totalRespondants:self.data["respondants"]}
	//stats.maxCount = maxCount;
	//stats.totalRespondants = self.data["respondants"];
	
	//Adjust y scale for data
    self.yScale.domain([0,maxCount]);
    self.yAxis.scale(self.yScale);
    
    // draw the scale
    self.visualGroup.select(".yAxis").call(self.yAxis);
    
    // draw the bars
    var bars = self.visualGroup.selectAll(".barGroup").data(self.data["results"]);
    bars.exit().remove();
    bars.enter().append("g")
    
    	.attr("class","barGroup")
    	.attr("rowid",function(d){ return d["rowid"]; } )
    	.append("rect")
        .attr({
            "class": "bar",
            "width": self.xScale.rangeBand(),
            "x": function (d, i) {
                return self.xScale(i);
            },
            "height": function (d)
            {
                var h = self.height - self.yScale(d.count) - 1;
                if( h >0 )
                    return h
                else
                    return 0
            },
            "y": function (d) {
                return self.yScale(d.count);
            }
        }).style({
            "fill": function (d) {
                return self.categoricalColor(d.name);
            }
        })
        
        .on("mouseover", function(d)
		{
        	d3.select(this)
        		.transition()
        		.style('fill','lightgrey')
        		.style('opacity',.5)
        		
        	setHover(d,stats,self.categoricalColor(d.name));
        	hoverRelatedData(d,i);
		})
		.on("mouseout", function(d)
		{
			d3.select(this)
				.transition()
				.style('opacity',1)
				.style('fill',self.categoricalColor(d.name))
			
			clearHover();
			hoverRelatedData(null,i);
		})
		.on("click",function(d)
		{
			showRelatedResults(d,i);
		})
		
    
    //idea from http://stackoverflow.com/questions/15580300/proper-way-to-draw-gridlines
    self.visualGroup.selectAll("line.horizontalGrid").data(self.yScale.ticks(horizontalTicks)).enter()
    .append("line")
        .attr(
        {
            "class":"horizontalGrid",
            "x1" : 0,
            "x2" : self.width,
            "y1" : function(d){ return self.yScale(d);},
            "y2" : function(d){ return self.yScale(d);},

        });

}

VisHistogram.prototype.drawPlaceholder = function()
{
	var deleted = d3.selectAll(".barGroup").remove();
	deleted = d3.selectAll(".axis").remove()
	//<rect x="50" y="20" rx="20" ry="20" width="150" height="150"
	//".barGroup"
	var self = this;
	console.log("drawing empty box")
	
	self.visualGroup = self.svgCanvas.append("g")
		.attr("class","barGroup")
		
	self.visualGroup.append("rect")
        .attr({
            "class": "noStatsBox",
            "width": self.RawWidth*(2/3),
            "x": self.RawWidth/6,
            "height": self.RawHeight*(2/3),
            "y": self.RawHeight/6,
            "rx": 20,
            "ry": 20
        })
        .style({
        	"opacity": 0.3
        });
	
	self.visualGroup.append("text")
			.text("No Recorded Responses")
			.attr({
				"x": self.RawWidth/6 + 10,
				"y": self.RawHeight/4,
			})
}
