//The terrarium object will be responsible for storing its contents and for letting the bugs inside it move
//It lets them move, but does not make them move
//The bugs will be separate objects


function terrariumData(w,h) {
	var wallProbability = 0.1;
	var bugProbability = 0.05;

	var terrariumArray = [];
	for (var i = 0; i < h; i++) {
		terrariumArray[i] = [];
		for (var j = 0; j < w; j++) {	
			if (i===0||j===0||i===h-1||j===w-1)	terrariumArray[i][j] = "#";
			else (Math.random()<wallProbability)?terrariumArray[i][j] = "#":terrariumArray[i][j] = "";
		}
	}

	var flatTerrarium= [];

	_.each(terrariumArray, function(element1,index1, array1){
		_.each(element1, function(element2,index2,array2) {
			if (element2!=="#" && Math.random()<bugProbability) {
				array2[index2] = "o";
			}
			flatTerrarium.push(array2[index2]);
		});
	});

	return flatTerrarium;

};



function bind(func, object) {
  return function(){
    return func.apply(object, arguments);
  };
}

//*************
//Point class
//*************

//Point constructor
function Point(x,y) {
	this.x = x;
	this.y = y;
}

//functions which should be available for any point object, add them to the prototype so there's only one copy

Point.prototype.add = function(other) {
	return new Point(this.x + other.x, this.y + other.y);
};

Point.prototype.isEqualTo = function(other) {
	return this.x == other.x && this.y = other.y;
};


//*************
//Grid class
//*************


/*Whenever you find yourself about to mix data representation and specific problem code IN ONE object it's a good idea to try and put the data representation code in a separate type of object
*/

function Grid(width, height) {
	this.width = width;
	this.height = height;
	this.cells = new Array(width * height);
}

Grid.prototype.valueAt = function(point) {
	return this.cells[point.y * this.width + point.x]
}

Grid.prototype.setValueAt = function(point,value) {
	this.cells[point.y * this.width + point.x] = value;
}

Grid.prototype.isInside = function(point) {
	return point.x >= 0 && point.y>=0 &&
		point.x < this.width && point.y < this.height;
}

Grid.prototype.moveValue = function(from, to) {
	this.setValueAt(to, this.valueAt(from));
	this.setValueAt(from, undefined);
};


Grid.prototype.each = function(action) {
	for (var y = 0; y<this.height; y++) {
		for (var x = 0; x<this.width; x++) {
			var point = new Point(x,y);
			action(point, this.valueAt(point));
		}
	}
}

// RL added method

Grid.prototype.arrayIndexToPoint = function(num) {
	return new Point(num%this.width,Math.floor(num/this.width))
}


//*************
//Dictionary class
//*************


function Dictionary(startValues) {
	 this.values = startValues || {};
}

Dictionary.prototype.store = function(name, value) {
	this.values[name] = value;
}

Dictionary.prototype.lookup = function(name) {
	return this.values[name];
}

Dictionary.prototype.contains = function(name){
	return Object.prototype.hasOwnProperty.call(this.values,name) &&
		Object.prototype.propertyIsEnumerable.call(this.values,name);
};

Dictionary.prototype.each = function(action) {
	_.forEach(this.values,action)
};

Dictionary.prototype.random = function() {
	return _.shuffle(_.keys(this.values))[0]
}

var directions = new Dictionary(
  {"n":  new Point( 0, -1),
   "ne": new Point( 1, -1),
   "e":  new Point( 1,  0),
   "se": new Point( 1,  1),
   "s":  new Point( 0,  1),
   "sw": new Point(-1,  1),
   "w":  new Point(-1,  0),
   "nw": new Point(-1, -1)});



 


 //*************
//Terrarium class
//*************

function Terrarium(w,h) {

	var data = terrariumData(w,h);

	var grid = new Grid(w,h);

	for (var i = 0; i < h; i++) {
		for (var j = 0; j < w; j++) {
			grid.setValueAt(new Point(j,i), elementFromCharacter(data[i*w+j]))


		};
	};

	this.grid = grid;

}

function elementFromCharacter(character) {
	if (character == " ") return undefined;
	else if (character == "#") return wall;
	else if (character == "o") return new StupidBug();
}

Terrarium.prototype.listActingCreatures = function() {
	var found = [];

	this.grid.each(function(point, value){

		if (value!=undefined && value.act) {
			found.push({object:value, point:point})
		}
		
	})
	return found;
}

Terrarium.prototype.listSurroundings = function(center) {
	var result = {};
	var grid = this.grid;

	directions.each(function(direction,name) {
	
		var place = center.add(direction);
		if (grid.isInside(place)) {
			result[name] = characterFromElement(grid.valueAt(place));
		} else {
			result[name] = "#"
		}
	})

	return result;
}


Terrarium.prototype.processCreature = function(creature) {

	var surroundings = this.listSurroundings(creature.point);

	var action = creature.object.act(surroundings);

	if (action.type == "move" && directions.contains(action.direction)) {
		var to = creature.point.add(directions.lookup(action.direction));
		if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined) {
			this.grid.moveValue(creature.point,to);
		}
	} else {
		throw new Error("Unsupported action: " + action.type);
	}
}


Terrarium.prototype.step = function() {
	_.each(this.listActingCreatures(), bind(this.processCreature,this)) //take the funciton this.processCreature and apply it in the 'this' context of the terranium.  Binding needed because we're in _.each
}


var wall = {};
wall.character = "#";
function characterFromElement(element) {
  if (element == undefined)
    return " ";
  else
    return element.character;
}



 //*************
//Stupidbug class
//*************
var stupidBugCount = 0;
function StupidBug() {

	this.id = "sb"+stupidBugCount;
	stupidBugCount++;


};

 StupidBug.prototype.act = function(surroundings) {
 	
 	return {type: "move", direction: directions.random()}
 }

StupidBug.prototype.character = "o";


myTerr = new Terrarium(50,30)  //width 5 height 3
