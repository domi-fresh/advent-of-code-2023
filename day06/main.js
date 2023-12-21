const { group, count, log, time } = require("console");
const fs = require("fs")

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/5

// Challenge 1
function prepareInput(){
    arrs = input.split("\n").map(line => line.split(":")[1].trim().split(" ").filter(e => e!="").map(num => Number(num)));
    races = [];
    //console.log(arrs);
    for(i = 0; i<arrs[0].length; i++){
        races.push({"time": arrs[0][i], "distance": arrs[1][i]});
    }
    return races;
}

console.log("-------------------------------------Part 1-------------------------------------");


function wonRace(distanceToBeat, time, buttonDown){
    acceleration = buttonDown;
    distanceTravelled = acceleration*(time-buttonDown);
    return distanceTravelled > distanceToBeat;
}

function computeNumberOfWaysToWinRace(race){
    let time = race.time;
    distanceToBeat = race.distance;
    waysToWin = 0;
    for(k = 0; k<time; k++){
        if(wonRace(distanceToBeat, time, k)){
            waysToWin++;
        }
    }
    return waysToWin;
}

function computeNumberOfWaysToWinTournament(races){
    ways = [];
    for(i = 0; i<races.length; i++){
        ways.push(computeNumberOfWaysToWinRace(races[i]));
    }
    return ways.reduce((acc, num) => {return acc*num}, 1);
}

races = prepareInput();
console.log(races);
waysToWinTournament = computeNumberOfWaysToWinTournament(races);
console.log("Ways to win the tournament : " + waysToWinTournament);




console.log("-------------------------------------Part 2-------------------------------------");

