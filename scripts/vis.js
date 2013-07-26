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

TDrawKit.prototype.drawFixedElements = function() {

	that = this;

	var fixedElements = this.svg.selectAll(".fixedElements").data(this.terr.grid.cells);

	fixedElements.enter()
		.append("rect")
		.attr("x", function(d,i) {
			var p = that.terr.grid.arrayIndexToPoint(i);
			return p.x*that.globals.squareSize;	
		})
		.attr("y", function(d,i) {
			var p = that.terr.grid.arrayIndexToPoint(i);
			return p.y*that.globals.squareSize;	
		})
		.attr("height",that.globals.squareSize)
		.attr("width", that.globals.squareSize)
		.attr("fill", function(d) {
			if (d && d.character == wall.character)  return "#000000";
			else return "#0EB8C0"		
		})
		.attr("opacity", function(d,i) {

			var p = that.terr.grid.arrayIndexToPoint(i);

			if (d && d.character == wall.character)  return 1;
			else return p.y*0.2 / that.terr.grid.height;		
		})
		.attr("stroke-width", 1)
		.attr("stroke", "black");

}



// Drawing can only be done after docready
$(function() {


terrDraw = new TDrawKit(myTerr,d3.select("#svgHolder"));

terrDraw.drawFixedElements();

})