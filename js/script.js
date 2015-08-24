
var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(other_vector) {
    return new Vector(this.x + other_vector.x, this.y + other_vector.y);
};

var vec5 = new Vector(5,5);
var vec10 = new Vector(10, 10);

var vec15 = vec10.plus(vec5);

console.log(vec15);
























