const { group } = require("console");
const fs = require("fs")

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/2

// Challenge 1
const games = input.split("\n").map(line => line.split(": ")[1]);
const subgames = games.map(line => line.split(";"));
const sets = subgames.map(line => line.join(",").split(",").map(e => e.trim().split(" ")));

const bounds = [12, 13, 14]

function checkBounds(cube, bounds){
    switch(cube[1]){
        case "red": return Number(cube[0]) <= bounds[0];
        case "green": return Number(cube[0]) <= bounds[1];
        case "blue": return Number(cube[0]) <= bounds[2];
    }
}

function markLines(s){
    return s.map((line, index) => {val = true;
                            line.forEach(element => {
                                val &= checkBounds(element, bounds);
                            });
                            if(val){
                                return index+1;
                            }
                            return 0;})
}

markedLines = markLines(sets);

console.log(games);
console.log("Subgames: \n");
console.log(subgames);

console.log("Sets: \n");
console.log(sets);

console.log("Marked Lines \n");

console.log(markedLines);

sum = markedLines.reduce((acc, curr) => {return acc + curr}, 0);
console.log(sum);

// part 2

function findPower(game){
    red = 0;
    blue = 0;
    green = 0;
    game.forEach(e => {
        switch(e[1]){
            case "red": {if(Number(e[0] > red)){
                    red = Number(e[0]);
                }
            }break;
            case "green": {if(Number(e[0] > green)){
                    green = Number(e[0]);
                }
            }break;
            case "blue": {if(Number(e[0] > blue)){
                    blue = Number(e[0]);
                }
            }break;
        }
    });
    return red*green*blue;
}

powers = sets.map(line => findPower(line));

console.log("------------------Part 2----------------");
console.log(powers);
console.log("\nSum: ");
console.log(powers.reduce((acc, e) => {return acc + e}, 0));