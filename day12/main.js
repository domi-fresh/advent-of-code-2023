const { match } = require("assert");
const { group } = require("console");
const fs = require("fs");
const { start } = require("repl");
// https://adventofcode.com/2023/day/11


function prepareInput(path) {
    let input = fs.readFileSync(path).toString();
    let records = input.split("\n").map(line => {let springs = line.split(" ")[0].split(""); let damGroups = line.split(" ")[1].split(",").map(num => Number(num)); return {"springs": springs, "damGroups": damGroups, "damaged": damGroups.reduce((acc, e) => {return acc+e}, 0), "intact": springs.length - damGroups.reduce((acc, e) => {return acc+e}, 0), "unknown": springs.filter(e => e == "?").length, "possiblyDam": damGroups.reduce((acc, e) => {return acc+e}, 0) - springs.filter(e => e == "#").length, "possiblyIntact": springs.length - damGroups.reduce((acc, e) => {return acc+e}, 0) - springs.filter(e => e == ".").length}});

    return records;
}


function printPrettyArray(array){
    //console.log(universe)
    let prettyArray = array.reduce((acc, line) => {return acc + line.reduce((acc2, sym) => {return acc2 + sym + "\t"}, "") + "\n"}, "");
    console.log(prettyArray);
}


function createConfigs(springs, unknown, possiblyIntact, possiblyDam, damGroups){
    if(unknown < 0){
        return [];
    }
    if(unknown == 0){
        return [springs];
    }

    let springsSoFar = springs.slice(0, springs.findIndex(e => e =="?"));
    springsSoFar = springsSoFar.reduce((acc, e) => {return acc+e}, "").split(".").filter(e => e != "");
    springsSoFar.pop();
    if(!springsSoFar.reduce((acc, group, index) => {return acc && group.length == damGroups[index]}, true)){
        return [];
    }

    let possibleConfigs = [];

    let newSprings1 = [...springs];
    let newSprings2 = [...springs];
    newSprings1[newSprings1.findIndex(e => e == "?")] = ".";
    newSprings2[newSprings2.findIndex(e => e == "?")] = "#";


    if(possiblyIntact-1 >= 0){
        possibleConfigs = possibleConfigs.concat(createConfigs(newSprings1, unknown-1, possiblyIntact-1, possiblyDam, damGroups));
    }
    if(possiblyDam -1 >= 0){
        possibleConfigs = possibleConfigs.concat(createConfigs(newSprings2, unknown-1, possiblyIntact, possiblyDam-1, damGroups));
    }
    return possibleConfigs;    
}
/////////////////////////
function createConfigsTailRec(
    springs,
    unknown,
    possiblyIntact,
    possiblyDam,
    damGroups,
    accumulator = []
  ) {
    //console.log(damGroups);
    if (unknown < 0) {
      return accumulator;
    }
    if (unknown === 0) {
      accumulator.push(springs);
      return accumulator;
    }
  
    let springsSoFar = springs.slice(0, springs.findIndex((e) => e === "?"));
    springsSoFar = springsSoFar.reduce((acc, e) => acc + e, "").split(".").filter((e) => e !== "");
    springsSoFar.pop();
    if (!springsSoFar.reduce((acc, group, index) => acc && group.length === damGroups[index], true)) {
      return accumulator;
    }
  
    let newSprings1 = [...springs];
    let newSprings2 = [...springs];
    newSprings1[newSprings1.findIndex((e) => e === "?")] = ".";
    newSprings2[newSprings2.findIndex((e) => e === "?")] = "#";
  
    if (possiblyIntact - 1 >= 0) {
      accumulator = createConfigsTailRec(newSprings1, unknown - 1, possiblyIntact - 1, possiblyDam, damGroups, accumulator);
    }
    if (possiblyDam - 1 >= 0) {
      accumulator = createConfigsTailRec(newSprings2, unknown - 1, possiblyIntact, possiblyDam - 1, damGroups, accumulator);
    }
    return accumulator;
  }
///////////////////////////////////////////////////////  

function filterConfigs(rec){
    //let possibleConfigs = createConfigs(rec.springs, rec.unknown, rec.possiblyIntact, rec.possiblyDam, rec.damGroups)
    let possibleConfigs = createConfigsTailRec(rec.springs, rec.unknown, rec.possiblyIntact, rec.possiblyDam, rec.damGroups, [])
                            .map(r => r.reduce((acc, e)=> {return acc+e}, "").split(".").filter(str => str != ""))
                            .filter(group => group.length == rec.damGroups.length && rec.damGroups.reduce((acc, damGroup, index) => {return acc && damGroup == group[index].length}, true));
    return possibleConfigs.length;
}

function getNumberOfPossibleRecords(records){
    let possibleRecords = records.map( (rec, index) => {console.log("Computing for rec " + (index+1) + " out of " + records.length); return filterConfigs(rec)});
    return possibleRecords.reduce((acc, e) => {return acc + e}, 0);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 1



console.log("-------------------------------------Part 1-------------------------------------");

let exampleRecords1 = prepareInput("./example.txt");
console.log("Example records 1:");
console.log(exampleRecords1);

console.log("Number of possible example1 records: ")
console.log(getNumberOfPossibleRecords(exampleRecords1));

console.log(".................................................................................");

console.time('Execution Time');

let records1 = prepareInput("./input.txt");
//console.log("records 1:");
//console.log(records1);

console.log("Number of possible records: ")
console.log(getNumberOfPossibleRecords(records1));

console.timeEnd('Execution Time');

console.log(".................................................................................");



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 2

function prepareInput2(path){
    let input = fs.readFileSync(path).toString();
    let newInput = input.split("\n").map(line => {let baseLine = line.split(" "); let springs = baseLine[0] + "?" + baseLine[0] + "?" + baseLine[0] + "?" + baseLine[0] + "?" + baseLine[0]; let gr = baseLine[1] + "," + baseLine[1] + "," + baseLine[1] + "," + baseLine[1] + "," + baseLine[1]; return springs+" "+gr;});
    let records =  newInput.map(line => {let springs = line.split(" ")[0].split(""); let damGroups = line.split(" ")[1].split(",").map(num => Number(num)); return {"springs": springs, "damGroups": damGroups, "damaged": damGroups.reduce((acc, e) => {return acc+e}, 0), "intact": springs.length - damGroups.reduce((acc, e) => {return acc+e}, 0), "unknown": springs.filter(e => e == "?").length, "possiblyDam": damGroups.reduce((acc, e) => {return acc+e}, 0) - springs.filter(e => e == "#").length, "possiblyIntact": springs.length - damGroups.reduce((acc, e) => {return acc+e}, 0) - springs.filter(e => e == ".").length}});

    return records;
}


/*
let example2 = prepareInput2("./example.txt");
console.log(example2);

console.log("Number of possible example2 records: ")
console.log(getNumberOfPossibleRecords(example2));
*/


console.log("-------------------------------------Part 2-------------------------------------");


let records2 = prepareInput2("./input.txt");
//console.log("records 2:");
//console.log(records2);

console.time('Execution Time 2');

console.log("Number of possible records: ")
console.log(getNumberOfPossibleRecords(records2));

console.timeEnd('Execution Time 2');