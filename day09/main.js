const fs = require("fs");
// https://adventofcode.com/2023/day/9


function prepareInput(path) {
    let input = fs.readFileSync(path).toString();
    let sequences = input.split("\n").map(s => s.split(" ").map(num => Number(num)));
    return sequences;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 1

function getDiffSequence(seq){
    let newSeq = [];
    seq.forEach((element, index) => {
        if(index<seq.length-1){
            newSeq.push(seq[index+1] - element);
        }
    });
    return newSeq;
}


function predictNextElement(seq){
    let diffSeq = getDiffSequence(seq);
    let diffSet = new Set(diffSeq);

    if(diffSet.size == 1 && diffSet.has(0)){
        return seq[seq.length-1];
    }
    return seq[seq.length-1]+predictNextElement(diffSeq);
}


function predictAll(sequences, part){
    if(part == 2){
        sequences = sequences.map(seq => seq.reverse());
    }
    return sequences.map(seq => predictNextElement(seq));
}




console.log("-------------------------------------Part 1-------------------------------------");


let example_histories1 = prepareInput('./example.txt');
console.log("Example histories Part 1: ");
console.log(example_histories1);

let example_predictions1 = predictAll(example_histories1, 1);
console.log("Example predictions Part 1: ")
console.log(example_predictions1);

let example_result1 = example_predictions1.reduce((acc, e) => {return acc+e;}, 0);
console.log("Example result Part 1: " + example_result1);

console.log(".................................................................................");

let histories1 = prepareInput('./input.txt');
//console.log("Histories Part 1: ");
//console.log(histories1);

let predictions1 = predictAll(histories1, 1);
//console.log("Predictions Part 1: ")
//console.log(predictions1);

let result1 = predictions1.reduce((acc, e) => {return acc+e;}, 0);
console.log("Actual result Part 1: " + result1);


console.log("-------------------------------------Part 2-------------------------------------");

let example_histories2 = prepareInput('./example.txt');
console.log("Example histories Part 2: ");
console.log(example_histories2);

let example_predictions2 = predictAll(example_histories2, 2);
console.log("Example predictions Part 2: ")
console.log(example_predictions2);

let example_result2 = example_predictions2.reduce((acc, e) => {return acc+e;}, 0);
console.log("Example result Part 2: " + example_result2);

console.log(".................................................................................");


let histories2 = prepareInput('./input.txt');
//console.log("Histories Part 2: ");
//console.log(histories2);

let predictions2 = predictAll(histories2, 2);
//console.log("Predictions Part 2: ")
//console.log(predictions2);

let result2 = predictions2.reduce((acc, e) => {return acc+e;}, 0);
console.log("Actual result Part 2: " + result2);

