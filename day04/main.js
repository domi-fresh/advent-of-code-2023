const { group, count, log } = require("console");
const fs = require("fs")

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/4

// Challenge 1
 function prepareInput(){
    return input.split("\n").map(line => { return line.split(":")[1].split("|").map(block => block.trim().split(" ").filter(e => e != "").map(num => Number(num)))})
                            .map((line, index) => {card = {"winners": line[0], "own": line[1], "worth": 0, "winCount": 0, "id": index +1, "cardCount": ""}; return card});

 }

const cards = prepareInput(); 
function computeWorth(card){
    card.own.forEach(num => {
        card.winners.forEach(winner => {
            if(num == winner){
                if(card.worth == 0){
                    card.worth = 1;
                }else{
                    card.worth *= 2;
                }
                card.winCount += 1;
            }
        })
    });
}

console.log("________________________________________Part 1: _______________________________________________");
cards.forEach(card => computeWorth(card));
sum1 = cards.reduce((acc, e) => {return acc + e.worth}, 0);
//console.log(cards);
console.log("Sum of cards worth is " + sum1 + "\n");

console.log("________________________________________Part 2: _______________________________________________");
const cards2 = prepareInput();
cards2.forEach(card => computeWorth(card));
//console.log(cards2);

for(i = cards2.length - 1; i >= 0; i--){
    if(cards2[i].winCount == 0){
        cards2[i].cardCount = 1;
    }
    var counter = 1;
    for(j = 1; j <= cards2[i].winCount; j++){
        counter += cards2[i + j].cardCount;
    }
    cards2[i].cardCount = counter;
}
//console.log(cards2);

sum = cards2.reduce((acc, e) => {return acc + e.cardCount}, 0);

console.log("Cards that need to be scratched: " + sum);