"use strict";

function elementFromChar(legend, char) {
    if (char == " ")
        return null;
    var element = new legend[char]();
    element.originChar = char;
    return element;
}

function charFromElement(element) {
    if (element == null)
        return " ";
    else
        return element.originChar;
}

// World object and its methods
function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    map.forEach(function(line, y) {
        for (var x = 0; x < line.length; x++) {
            grid.set(new Vector(x, y),elementFromChar(legend, line[x]));
        }
    });
}

World.prototype.toString = function() {
    var output = "";
    for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += "\n";
    }
    return output;
};

// move creatures on each World turn
World.prototype.turn = function() {
    // array of creatures that have already acted this turn
    var acted = [];
    this.grid.forEach(function(creature, vector) {
        // if creature has an act method
        // and it has NOT already acted this turn

            // this.css('color', 'green');
        if (creature.act && acted.indexOf(creature) == -1) {
            acted.push(creature);
            this.letAct(creature, vector);
        }
    }, this);
};

World.prototype.letAct = function(creature, vector) {
    var action = creature.act(new View(this, vector));
    if (action && action.type == "move") {
        var dest = this.checkDestination(action, vector);
        if (dest && this.grid.get(dest) == null) {
            this.grid.set(vector, null);
            this.grid.set(dest, creature);
        }
    }
};

World.prototype.checkDestination = function(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
        var dest = vector.plus(directions[action.direction]);
        if (this.grid.isInside(dest)) {
            return dest;
        }
    }
};


// View object hold info about the world to be passed
// to creatures' act methods
function View(world, vector) {
    this.world = world;
    this.vector = vector;
}

View.prototype.look = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.world.grid.isInside(target))
        return charFromElement(this.world.grid.get(target))
    else
        return "#";
};

View.prototype.findAll = function(char) {
    var found = [];
    for (var dir in directions)
        if (this.look(dir) == char)
            found.push(dir);
    return found;
};

View.prototype.find = function(char) {
    var found = this.findAll(char);
    if (found.length == 0)
        return null
    return randomElement(found);
};

////////////////////////////////////////////////
        // inherited world
////////////////////////////////////////////////

function InheritedWorld(map, legend) {
    World.call(this, map, legend);
}

InheritedWorld.prototype = Object.create(World.prototype);


InheritedWorld.prototype.letAct = function(creature, vector) {
    var action = creature.act(new View(this, vector));
    var handled = action &&
        action.type in actionTypes &&
        actionTypes[action.type].call(this, creature, vector, action);

    if (handled) {
        creature.energy -= 0.2;
    }
};

































