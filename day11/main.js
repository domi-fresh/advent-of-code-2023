const { match } = require("assert");
const fs = require("fs");
const { start } = require("repl");
// https://adventofcode.com/2023/day/11


function prepareInput(path) {
    let input = fs.readFileSync(path).toString();
    let universe = input.split("\n").map(line => line.split(""));

    return universe;
}

function isEmpty(line){
    let contents = new Set(line);
    if(contents.size == 1 && contents.has(".")){
        return true;
    }
    return false;
}

function expand(universe){
    let expandedUni = [];
    let tempUniverse = [];

    universe.forEach(line => tempUniverse.push([]));

    for(let col = 0; col<universe[0].length; col++){
        let tempCol = [];
        for(let row = 0; row<universe.length; row++){
            tempCol.push(universe[row][col]);
        }
        
        for(let r = 0; r<universe.length; r++){
            tempUniverse[r].push(tempCol[r]);
            if(isEmpty(tempCol)){
                tempUniverse[r].push(tempCol[r]);
            }
        }
    }

    for(let i = 0; i<universe.length; i++){

        expandedUni.push(tempUniverse[i]);
        if(isEmpty(tempUniverse[i])){
            expandedUni.push(tempUniverse[i]);
        }
    }
    return expandedUni;
}

function getGalaxies(universe){
    let galaxies = [];
    let counter = 0;
    universe.forEach((line, y) => line.forEach((symbol, x) => {if(symbol == "#"){galaxies.push({"id": counter, "x": x, "y": y}); counter++;}}));
    return galaxies;
}

function getPairs(universe){
    let galaxies = getGalaxies(universe);
    let pairs = [];
    for(let i = 0; i<galaxies.length; i++){
        for(let j = i+1; j<galaxies.length; j++){
            pairs.push({"start": galaxies[i], "end": galaxies[j]});
        }
    }
    return pairs;
}

function getExpansionMatrix(universe, expansionFactor){
    let tempUniverse = [];

    universe.forEach(line => tempUniverse.push([]));

    for(let col = 0; col<universe[0].length; col++){
        let tempCol = [];
        for(let row = 0; row<universe.length; row++){
            tempCol.push(universe[row][col]);
        }
        
        for(let r = 0; r<universe.length; r++){
            if(isEmpty(tempCol)){
                tempUniverse[r].push(expansionFactor);
            }else{
                tempUniverse[r].push(1);
            }
        }
    }

    for(let i = 0; i<universe.length; i++){
        
        if(isEmpty(universe[i])){
            tempUniverse[i] = tempUniverse[i].map(element => element * expansionFactor);
        }
        
    }
    return tempUniverse;
}

function findPath(universe, startGalaxy, endGalaxy, pairNr, pairs, expansionMatrix){
    console.log("Computing distance for pair " + (pairNr+1) + " out of " + pairs + " pairs.");
    let distances = [];
    universe.forEach(line => distances.push(Array(line.length).fill(Number.MAX_SAFE_INTEGER)));
    //console.log(distances);
    distances[startGalaxy.y][startGalaxy.x] = 0;
    let queue = [{"x": startGalaxy.x, "y": startGalaxy.y, "distance": 0}];
    while(queue.length != 0){
        let cur = queue.shift();
        let x = cur.x;
        let y = cur.y;
        let dist = cur.distance;
        
        let next ={"x": x-1, "y": y, "distance": null};
        if(next.x >= 0 && next.y >= 0 && next.x < distances[0].length && next.y < distances.length ){
            next.distance = dist + expansionMatrix[next.y][next.x];
            if(next.distance < distances[next.y][next.x]){
                distances[next.y][next.x] = next.distance;
                queue.push(next);
            }
        }
        next ={"x": x, "y": y-1, "distance": null};
        if(next.x >= 0 && next.y >= 0 && next.x < distances[0].length && next.y < distances.length ){
            next.distance = dist + expansionMatrix[next.y][next.x];
            if(next.distance < distances[next.y][next.x]){
                distances[next.y][next.x] = next.distance;
                queue.push(next);
            }
        }
        next ={"x": x+1, "y": y, "distance": null};
        if(next.x >= 0 && next.y >= 0 && next.x < distances[0].length && next.y < distances.length ){
            next.distance = dist + expansionMatrix[next.y][next.x];
            if(next.distance < distances[next.y][next.x]){
                distances[next.y][next.x] = next.distance;
                queue.push(next);
            }
        }
        next ={"x": x, "y": y+1, "distance": null};
        if(next.x >= 0 && next.y >= 0 && next.x < distances[0].length && next.y < distances.length ){
            next.distance = dist + expansionMatrix[next.y][next.x];
            if(next.distance < distances[next.y][next.x]){
                distances[next.y][next.x] = next.distance;
                queue.push(next);
            }
        }
    }
    //console.log("Distances : ");
    //printPrettyUniverse(distances);
    return distances[endGalaxy.y][endGalaxy.x];

}

function findShortestDistances(universe, expansionFactor){
    let pairs = getPairs(universe);
    let expansionMatrix = getExpansionMatrix(universe, expansionFactor);
    //printPrettyUniverse(expansionMatrix);
    let distances = pairs.map((pair, index) => findPath(universe, pair.start, pair.end, index, pairs.length, expansionMatrix));
    return distances;
}


function printPrettyUniverse(universe){
    //console.log(universe)
    let prettyUniverse = universe.reduce((acc, line) => {return acc + line.reduce((acc2, sym) => {return acc2 + sym + "\t"}, "") + "\n"}, "");
    console.log(prettyUniverse);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 1



console.log("-------------------------------------Part 1-------------------------------------");

let exampleUniverse1 = prepareInput("./example.txt");
console.log("Example universe 1:");
printPrettyUniverse(exampleUniverse1);

//let expandedExampleUniverse1 = expand(exampleUniverse1);
//console.log("Expanded example universe 1:");
//printPrettyUniverse(expandedExampleUniverse1);
let exampleExpFactor1 = 100;
console.log(findShortestDistances(exampleUniverse1, exampleExpFactor1).reduce((acc, e) => {return acc + e}, 0));


console.log(".................................................................................");

/*  unkomment to run Part 1

let universe1 = prepareInput("./input.txt");
//console.log("universe 1:");
//printPrettyUniverse(universe1);

let expandedUniverse1 = expand(universe1);
console.log("Expanded universe 1:");
printPrettyUniverse(expandedUniverse1);
console.log(findShortestDistances(expandedUniverse1).reduce((acc, e) => {return acc + e}, 0));

*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 2



console.log("-------------------------------------Part 2-------------------------------------");

let universe2 = prepareInput("./input.txt");
let expFactor2 = 1000000
console.log(findShortestDistances(universe2, expFactor2).reduce((acc, e) => {return acc + e}, 0));