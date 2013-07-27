// Drawing can only be done after docready
$(function() {


terrDraw = new TDrawKit(myTerr,d3.select("#svgHolder"));

terrDraw.drawFixedElements();

terrDraw.drawMovingElements();

setTimeout(function() {
   myTerr.step();
   terrDraw.drawMovingElements();
}, 1000)



})