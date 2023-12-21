const { group } = require("console");
const fs = require("fs")

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/2

// Challenge 1
const engine = input.split("\n").map(line => line.split(""));
engine2 = input.split("\n").map(line => line.split(""));
function findEngineParts(engine){
    coordinates = [];
    engine.forEach((line,y) => line.forEach((s, x) => {
        if(!(s == "." || s == "0" || s == "1" || s == "2" || s == "3" || s == "4" || s == "5" || s == "6" || s == "7" || s == "8" || s == "9")){
            coordinates = [...coordinates, {"x": x,"y": y}];
        }
    }));
    return coordinates;
}

function retrieveNum(engine, x, y){
    //console.log("x: " + x +"   y: " + y);
    number = 0;
    line = engine[y];
    while((line[x] == "0" || line[x] == "1" || line[x] == "2" || line[x] == "3" || line[x] == "4" || line[x] == "5" || 
    line[x] == "6" || line[x] == "7" || line[x] == "8" || line[x] == "9") && x >= 0){
        x--;
    }
    x++;
    while((engine[y][x] == "0" || engine[y][x] == "1" || engine[y][x] == "2" || engine[y][x] == "3" || engine[y][x] == "4" || engine[y][x] == "5" || 
    engine[y][x] == "6" || engine[y][x] == "7" || engine[y][x] == "8" || engine[y][x] == "9") && x < engine[y].length){
        number *= 10;
        number += Number(engine[y][x]);
        engine[y][x] = ".";
        x++;
    }
    
    return [number, engine];
}

function findNumbers(engine, coordinates){
    numbers = [];
    coordinates.forEach(c => {
        for(y = Math.max(0, c.y-1); y < Math.min(engine.length, c.y+2); y++){
            for(x = Math.max(0, c.x-1); x < Math.min(engine[y].length, c.x+2); x++){
                if(engine[y][x] == "0" || engine[y][x] == "1" || engine[y][x] == "2" || engine[y][x] == "3" || engine[y][x] == "4" || engine[y][x] == "5" || engine[y][x] == "6" || 
                engine[y][x] == "7" || engine[y][x] == "8" || engine[y][x] == "9"){
                    numberANDengine = retrieveNum(engine, x, y);
                    engine = numberANDengine[1];
                    numbers = [...numbers, numberANDengine[0]];   
                }
            }        
        }
    });
    return numbers;
}


coordinates = findEngineParts(engine);
numbers = findNumbers(engine, coordinates);
sum = numbers.reduce((acc, e) => {return acc + e}, 0);
//console.log(engine);
//console.log(coordinates);
//console.log(numbers);
console.log("________________________________________Part 1: _______________________________________________");
console.log("Sum = " +sum);

//---------------------Part 2--------------------
console.log("________________________________________Part 2: _______________________________________________");
//console.log(engine2);

function adjacentRatio(engine, x, y){
    numbers = [];
    for(j = Math.max(0, y-1); j < Math.min(engine.length, y+2); j++){
        for(i = Math.max(0, x-1); i < Math.min(engine[j].length, x+2); i++){
            if(engine[j][i] == "0" || engine[j][i] == "1" || engine[j][i] == "2" || engine[j][i] == "3" || engine[j][i] == "4" || engine[j][i] == "5" || engine[j][i] == "6" || 
            engine[j][i] == "7" || engine[j][i] == "8" || engine[j][i] == "9"){
                numberANDengine = retrieveNum(engine, i, j);
                engine = numberANDengine[1];
                numbers = [...numbers, numberANDengine[0]];   
            }
        }        
    }
    if(numbers.length != 2){
        return 0;
    }else{
        return numbers[0]*numbers[1];
    }
}

function findAsterisks(engine){
    ratio = 0;
    engine.forEach((line,y) => line.forEach((s, x) => {
        if(s == "*"){
            ratio += adjacentRatio(engine, x, y);
        }
    }));
    return ratio;
}

ratio = findAsterisks(engine2);
console.log("Ratio = " + ratio);
