 //*************
//Terrarium drawing kit
//*************

function TDrawKit(terr,svgelem) {

this.terr = terr;

this.globals ={
	svgMargin: {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20
	},
	squareSize: 30,
	svgHeight: function(){return terr.grid.height*this.squareSize+this.svgMargin.top+this.svgMargin.bottom;},
	svgWidth: function() {return terr.grid.width*this.squareSize+this.svgMargin.left+this.svgMargin.right;}
};


this.svg = svgelem.append("svg")
				.attr("width", this.globals.svgWidth())
				.attr("height", this.globals.svgHeight())
				.append("g")
				.attr("class","margingroup")
				.attr("transform", "translate(" + this.globals.svgMargin.left + "," + this.globals.svgMargin.top + ")");

}

TDrawKit.prototype.gridToD3Data = function() {

		returnArray = [];

	this.terr.grid.each(function(point,valueatpoint) {
		returnArray.push({point: point, object: valueatpoint})
	})

	return returnArray;
}

TDrawKit.prototype.drawFixedElements = function() {

	var that = this;
	var d3data = this.gridToD3Data();

	var fixedElements = this.svg.selectAll(".fixedElements").data(d3data);

	fixedElements.enter()
		.append("rect")
		.attr("x", function(d) {
			return d.point.x*that.globals.squareSize;	
		})
		.attr("y", function(d,i) {
			return d.point.y*that.globals.squareSize;	
		})
		.attr("height",that.globals.squareSize)
		.attr("width", that.globals.squareSize)
		.attr("fill", function(d) {
			if (characterFromElement(d.object) == wall.character)  return "#000000";
			else return "#0EB8C0"		
		})
		.attr("opacity", function(d,i) {
			if (characterFromElement(d.object) == wall.character)  return 1;
			else return d.point.y*0.2 / that.terr.grid.height;		
		})
		.attr("stroke-width", 1)
		.attr("stroke", "black");

}

TDrawKit.prototype.drawMovingElements = function() {

	var that = this;

	var d3data = this.terr.listActingCreatures();
	
	if (d3.select(".moveGroup").empty()) {
		var g = this.svg.append("g")
					.attr("class", "moveGroup")
	} else {
		var g = d3.select(".moveGroup")
	}


	var movingElements = g.selectAll(".movingElements")
							.data(d3data, function(d) {
								return d.object.id;
							});

	movingElements.enter()
		.append("circle")
		.attr("cx", function(d) {
			return d.point.x*that.globals.squareSize+that.globals.squareSize/2;	
		})
		.attr("cy", function(d,i) {
			return d.point.y*that.globals.squareSize+that.globals.squareSize/2;	
		})
		.attr("r",0)
		.attr("fill", "#31F015")
		.attr("opacity", 0.001)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.attr("class","movingElements");

	var lastElem = movingElements[0].length -1

	movingElements
		.transition()
		.duration(500)
		.ease("linear")
		.attr("cx", function(d) {
			return d.point.x*that.globals.squareSize+that.globals.squareSize/2;	
		})
		.attr("cy", function(d,i) {
			return d.point.y*that.globals.squareSize+that.globals.squareSize/2;	
		})
		.attr("r",that.globals.squareSize/3)
		.attr("fill", function(d,i) {
			debugger;
			return d.object.colour;
		})
		.attr("opacity", 0.3)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.each('end', function(d,i) {
		
			if (i == lastElem) {

				setTimeout(function() {
				
					that.terr.step();
					that.drawMovingElements()}, 
					0);

			}

		})

}


 
