Eloquent Javascript Terrarium
==========

###Terrarium

The terrarium uses the grid object as a datastore.


###StupidBug

Has a property called character
Has a method called act

###Dictionary

An instance of this object is called 'directions', which stores the directions in which travel is possible

Methods
* Each(action).  For each value (n, ne etc) perform an action(elem,index,list)

###Grid

Stores the current state of the terrarium in a one dimensional array of objects e.g. a wall or a stupidbug

* Any object that can act has a method called act
* Limited number of methods for changing grid data

Methods:
* valueAt(point)
* setValueAt(point)
* isInside(point)
* moveValue(from,to)
* each(action): for each element in grid array, converts to a point then runs action(point, valueatpoint)

###Points

point(x,y) means point (w,h) means point(c,r)

Point methods:
* Add(other): returns a ne point, adding the argument to the current point
* isEqualTo(other) 


###TDrawKit(terr, svgelem)

Contains a bunch of methods that will draw the terranium

