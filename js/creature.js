"use strict";

// get a random element from an array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function dirPlus(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
}

// create array of direction initials
// which correspond to the keys in our directions
// object
var directionNames = "n ne e se s sw w nw".split(" ");


/*
////////////////////////////////////
    DumbCreature
////////////////////////////////////
*/

// (o) establish a DumbCreature class which moves randomly
function DumbCreature() {
    this.direction = randomElement(directionNames);
}

// change direction if an obsticle is hit
// return object giving type and direction
DumbCreature.prototype.act = function(view) {
    if (view.look(this.direction) != " ")
        this.direction = view.find(" ") || "s";
    return {type: "move", direction: this.direction};
};


/*
////////////////////////////////////
    Wall
////////////////////////////////////
*/

// (#) establish a wall 'creature' that has no act method
function Wall() {}


/*
////////////////////////////////////
    WallClinger
////////////////////////////////////
*/

// (¥) establish a creature that only moves along walls
function WallClinger() {
    this.dir = "s";
}

WallClinger.prototype.act = function(view) {
    var start = this.dir;
    if (view.look(dirPlus(this.dir, -3)) != " ")
        start = this.dir = dirPlus(this.dir, -2);
    while (view.look(this.dir) != " ") {
        this.dir = dirPlus(this.dir, 1);
        if (this.dir == start) break;
    }
    return {type: "move", direction: this.dir}
}


/*
////////////////////////////////////
    Plant
////////////////////////////////////
*/

function Plant () {
    // plant starts with between 3 and 7 energy...
    this.energy = 3 + Math.random() * 4;
}

Plant.prototype.act = function (context) {
    if (this.energy > 35) {
        var space = context.find(" ");
        if (space)
            return {type: "reproduce", direction: space};
    }
    if (this.energy < 40)
        return {type: "grow"};
};



/*
////////////////////////////////////
    Herbivore
////////////////////////////////////
*/

function Herbivore () {
    this.energy = 20;
    this.direction = randomElement(directionNames);
}

Herbivore.prototype.act = function(context) {
    var plant = context.find("@");

    // reproduce
    var space = context.find(" ");
    if (this.energy >= 60 && space)
        return {type: "reproduce", direction: space};

    // bounce off of walls and creatures
    if (context.look(this.direction) != " ")
        this.direction = context.find(" ") || "s";
    // eat
    if (this.energy < 60 && plant)
        return {type: "eat", direction: plant};
    // move
    return {type: "move", direction: this.direction};
};

/*
////////////////////////////////////
    Carnivore
////////////////////////////////////
*/

function Carnivore () {
    this.energy = 200;
    this.direction = randomElement(directionNames);
}

Carnivore.prototype.act = function(context) {
    var herbivore = context.find("O");
    var omnivore = context.find("§");

    // reproduce
    var space = context.find(" ");
    if (this.energy >= 500 && space)
        return {type: "reproduce", direction: space};

    // bounce off of walls and creatures
    if (context.look(this.direction) != " ")
        this.direction = context.find(" ") || "s";
    // eat
    if (this.energy < 500 && herbivore)
        return {type: "eat", direction: herbivore};
    if (this.energy < 500 && omnivore)
        return {type: "eat", direction: omnivore};
    // move
    return {type: "move", direction: this.direction};
};

/*
////////////////////////////////////
    Omnivores
////////////////////////////////////
*/

function Omnivore () {
    this.energy = 100;
    this.direction = randomElement(directionNames);
}

Omnivore.prototype.act = function(context) {
    var herbivore = context.find("O");
    var plant = context.find("@");

    // reproduce
    var space = context.find(" ");
    if (this.energy >= 250 && space) {
        console.log(this.energy);
        return {type: "reproduce", direction: space};
    }

    // bounce off of walls and creatures
    if (context.look(this.direction) != " ")
        this.direction = context.find(" ") || "s";
    // eat
    if (this.energy < 250 && herbivore) {
        return {type: "eat", direction: herbivore};
    }
    if (this.energy < 250 && plant) {
        return {type: "eat", direction: plant};
    }
    // move
    return {type: "move", direction: this.direction};
};



/*
////////////////////////////////////
    Dead
////////////////////////////////////
*/

function Dead () {
    this.turn = 0;
}

Dead.prototype.act = function(context) {
    this.turn += 1;
    var space = context.find(" ");
    if (this.turn % 50 == 0)
        return {type: "seed", direction: space};
}


///////////////////////////////////
    // actionTypes
///////////////////////////////////

var actionTypes = Object.create(null);

actionTypes.move = function(creature, vector, action) {
    var dest = this.checkDestination(action, vector);
    if (dest == null ||
        creature.energy <= 1 ||
        this.grid.get(dest) != null) {

            if (creature.energy < 1) {
                var dead = elementFromChar(this.legend, "†");

                this.grid.set(vector, dead)

                return true;
            }
            this.grid.set(vector, null);
            return false;
    }
    creature.energy -= 1;


    // set space creature is leaving to null
    this.grid.set(vector, null);

    // set space creature is entering to creature
    this.grid.set(dest, creature);

    return true;
};

actionTypes.grow = function(creature, action) {
    creature.energy += 1;
    return true;
};

actionTypes.eat = function(creature, vector, action) {
    var dest = this.checkDestination(action, vector);
    // set atDest equal to object at dest location in world.grid if dest != null
    var atDest = dest != null && this.grid.get(dest);
    if (!atDest || atDest.energy == null)
        return false
    // add energy to creature
    creature.energy += atDest.energy;
    // remove plant from world
    this.grid.set(dest, null);
    return true;
};

actionTypes.reproduce = function(creature, vector, action) {
    var baby = elementFromChar(this.legend, creature.originChar);
    var dest = this.checkDestination(action, vector);
    if (creature.originChar == "§")
        console.log(dest);
    if (dest == null ||
        creature.energy <= 2 * baby.energy ||
        this.grid.get(dest) != null)
            return false;
    creature.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return false;
};

actionTypes.seed = function(creature, vector, action) {
    var plant = elementFromChar(this.legend, "@");
    var dest = this.checkDestination(action, vector);
    if (dest == null ||
        this.grid.get(dest) != null)
            return false;
    if (Math.random() < 0.5)
        this.grid.set(vector, plant);
    else
        this.grid.set(vector, null);

    return false;
};

