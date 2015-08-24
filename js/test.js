"use strict";

var score = 0;
var timer = null;
var paused = false;

var plan = ["############################################################",
            "#       @@@@@                ∑                             #",
            "#@##                  @@ @@@@              § §         O   #",
            "#    O     @     @ @     @             §   §  §    #       #",
            "#     #                                      §             #",
            "#    ##   ##########################################       #",
            "#    ##   #                                       O#       #",
            "#         #     @@@       @                        #   @   #",
            "#   @     #     @@@     @@@@@@@@@                  #       #",
            "#         #∑           O   O                       #       #",
            "#  @@     #######                     §      #######       #",
            "#                           @                              #",
            "# ∑                       §                                #",
            "#   @ @ @       ##                    §                    #",
            "#                                                          #",
            "#@##                  @@ @@@@                  §       O   #",
            "#    O     @     @ @     @                         #       #",
            "#     #                                                    #",
            "#    ##   ##################   #####################       #",
            "#    ##   #                                       O#       #",
            "#         #                 @             @@@      #   @   #",
            "#   @     #               @@@@           @@@@@     #       #",
            "#         #∑           O   O                       #       #",
            "#  @@     ##########################################       #",
            "#                   §       @                           #  #",
            "# ∑                                §           @       ##  #",
            "#   @ @ @           OOO      O             OOO  @   #####  #",
            "#                                                          #",
            "############################################################"];

var legend = {  "#": Wall,
                "∑": Carnivore,
                "O": Herbivore,
                "§": Omnivore,
                "@": Plant,
                "†": Dead
            };

var world = new InheritedWorld(plan, legend);

function runWorld() {

    var regex_wall = new RegExp("#", 'g');
    var regex_carnivore = new RegExp("∑", 'g');
    var regex_herbivore = new RegExp("O", 'g');
    var regex_omnivore = new RegExp("§", 'g');
    var regex_plant = new RegExp("@", 'g');
    var regex_dead = new RegExp("†", 'g');


    timer = setInterval(function() {
        world.turn();
        score += 1;
        var num_plants = 0;
        var num_carnivores = 0;
        var num_herbivores = 0;
        var num_omnivores = 0;
        var extinctions = 0;

        var score_keeper = document.getElementById("score");
        score_keeper.innerHTML = score;

        var colored_world = world.toString()
            .replace(regex_wall, "<span style='color: #A6E22E; font-weight: 900; text-shadow: -2px 2px 4px rgba(0,0,0,0.3);'>#</span>")
            .replace(regex_dead, "<span style='color: #222; font-weight: 900; text-shadow: -3px 0px 5px rgba(0,0,0,0.9);'>†</span>")
            .replace(regex_carnivore, function() {
                num_carnivores += 1;
                return "<span style='color: #FD971F; font-weight: 900; text-shadow: -2px 2px 4px rgba(0,0,0,0.3);'>∑</span>";
            })
            .replace(regex_herbivore, function() {
                num_herbivores++;
                return "<span style='color: #66D9EF; font-weight: 900; text-shadow: -2px 2px 4px rgba(0,0,0,0.3);'>O</span>";
            })
            .replace(regex_omnivore, function() {
                num_omnivores++;
                return "<span style='color: #7441A5; font-weight: 900; text-shadow: -2px 2px 4px rgba(0,0,0,0.3);'>§</span>";
            })
            .replace(regex_plant, function() {
                num_plants++;
                return "<span style='color: #F92672; font-weight: 900; text-shadow: -2px 2px 4px rgba(0,0,0,0.3);'>@</span>";
            });

        if (num_plants <= 0 && num_herbivores <= 0 && num_omnivores <= 0) {
            win("Carnivores");
            pauseGame();
        }
        if (num_plants <= 0 && num_herbivores <= 0 && num_carnivores <= 0) {
            win("Omnivores");
            pauseGame();
        }
        if (num_plants <= 0 && num_carnivores <= 0 && num_omnivores <= 0) {
            win("Herbivores");
            pauseGame();
        }
        if (num_carnivores <= 0 && num_herbivores <= 0 && num_omnivores <= 0) {
            win("Plants");
            pauseGame();
        }

        document.getElementById("num_plants").innerHTML = num_plants;
        document.getElementById("num_herbivores").innerHTML = num_herbivores;
        document.getElementById("num_carnivores").innerHTML = num_carnivores;
        document.getElementById("num_omnivores").innerHTML = num_omnivores;

        document.getElementById('game').innerHTML = colored_world;


    },100);
}


function win(winner) {
    document.getElementById('winner').style.fontSize = '12em';
    document.getElementById('winner').innerHTML = winner + " Win";
}

function pauseGame() {

    if (!paused) {
        clearInterval(timer);
        paused = !paused;
    }
    else if (paused) {
        runWorld();
        paused = !paused;
    }
}

function newGame() {
    document.getElementById('winner').style.fontSize = '0em';
    score = 0;
    paused = false;
    clearInterval(timer);
    world = new InheritedWorld(plan, legend);
    runWorld();
}

runWorld();












