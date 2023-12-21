const fs = require("fs");

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/8

// Challenge 1

function prepareInput() {
    arrs = input.split("\n\n").map(block => block.split("\n").filter(line => line != ""));
    let map = {"program": arrs[0][0].split(""), "nodes": arrs[1]};
    map.nodes = map.nodes.map(node => {
                                        let name = node.split(" = ")[0];
                                        let leftChild = node.split(" = (")[1].split(", ")[0];
                                        let rightChild = node.split(", ")[1].split(")")[0];
                                        return {"name": name, "leftChild": leftChild, "rightChild": rightChild};
    });
    let nodeMap = new Map();
    let startNodes = new Set();
    map.nodes.forEach(n => {nodeMap.set(n.name, {"left": n.leftChild, "right": n.rightChild}); if(n.name.endsWith("A")){startNodes.add(n.name)}});
    map.nodes = nodeMap;
    return [map, startNodes];
}

function takeStep(pos, nodes, pc, program){
    switch(program[pc%program.length]){
        case "L": return nodes.get(pos).left;
        case "R": return nodes.get(pos).right;
        default:console.error("Something went wrong!! Wrong Instruction.");
    }
    return pos;
}

function arrived(positions){
    let arrived = true;
    positions.forEach(p => arrived = arrived && p.endsWith("Z"));
    return arrived;
}

function findZ(map, startNodes){
    let curr = startNodes;
    let nodes = map.nodes;
    let steps = 0;
    let pcounter = 0;
    while(!arrived(curr)){
        let newCurr = new Set();
        curr.forEach(pos => newCurr.add(takeStep(pos, nodes, pcounter, map.program)));
        curr = newCurr;
        //curr = takeStep(curr, nodes, pcounter, map.program);
        pcounter++;
        steps++;
        //console.log(newCurr);
        let same = true;
        newCurr.forEach(e => same = same && startNodes.has(e));
        if(same){
            console.log("PC: " + pc + ",  INSTRUCTION: " + map.program[pc%map.program.length] + ",  STEPS: " + steps + "\n");
        }
        if(steps % 10000000 == 0){
            console.log("Steps so far: " + steps);
            console.log("Current positions: ")
            console.log(curr);
        }
    }
    return steps;
}

function findRounds(map, startNode){
    let curr = startNode;
    let nodes = map.nodes;
    let steps = 0;
    let pcounter = 0;
    let lastSteps = 0;
    let difference = 0;
    let counter = 0
    let firstEncounter = 0;
    while(counter < 2){
        curr = takeStep(curr, nodes, pcounter, map.program);
        pcounter++;
        steps++;
        if(curr.endsWith("Z")){
            if(counter == 0){
                firstEncounter = steps;
            }
            //console.log("StartNode " + startNode + " after " + steps + " steps is at " + curr + " with command " + map.program[pcounter%map.program.length] + " while las time was " + lastSteps + "; difference: " + difference + " meaning " + difference/map.program.length + " rounds, rest: " + difference%map.program.length);
            difference = steps - lastSteps;
            lastSteps = steps;
            counter++;
        }
    }
    return firstEncounter;

}

function lcm(num1, num2, prev){
    let min = (num1 > num2) ? num1 : num2;
    while (true) {
        if (min % num1 == 0 && min % num2 == 0) {
            //console.log(`The LCM of ${num1} and ${num2} is ${min}`);
            return min;
        }
        min += prev;
    }
}

console.log("-------------------------------------Part 2-------------------------------------");

let map = prepareInput()[0];
let startNodes = prepareInput()[1];
//console.log(map);
//console.log(startNodes);
let firstZs = [];
startNodes.forEach(n => firstZs.push(findRounds(map, n)));
firstZs = firstZs.sort();
//console.log(firstZs.reduce((acc, e) => {return lcm(acc, e)}, firstZs[0]));
let prev = 1;
let LCM = firstZs[0];
for(i = 0; i<firstZs.length; i++){
    LCM = lcm(LCM, firstZs[i], prev);
    if(i > 0){
        prev = firstZs[i-1];
    }
}
console.log("Steps: " + LCM);


//let distance = findZ(map, startNodes);
//console.log("Distance from 'AAA' to 'ZZZ' is " + distance);
