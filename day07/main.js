const fs = require("fs");

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/5

// Challenge 1

function isFiveOfAKind(hand) {
    return [...new Set(hand)].length == 1;
}

function isFourOfAKind(hand) {
    let t = [...new Set(hand)];
    if (t.length == 2) {
        return hand.filter(e => e == t[0]).length == 4 || hand.filter(e => e == t[1]).length == 4;
    }
    return false;
}

function isFullHouse(hand) {
    return [...new Set(hand)].length == 2;
}

function isThreeOfAKind(hand) {
    return (hand.filter((e) => e != hand[0]).length == 2 || hand.filter((e) => e != hand[1]).length == 2 ||
        hand.filter((e) => e != hand[2]).length == 2 || hand.filter((e) => e != hand[3]).length == 2 || hand.filter((e) => e != hand[4]).length == 2);
}

function isTwoPairs(hand) {
    return [...new Set(hand)].length == 3;
}

function isOnePair(hand) {
    return [...new Set(hand)].length == 4;
}


function detectType(hand) {

    if (isFiveOfAKind(hand)) {
        return 7;
    }
    if (isFourOfAKind(hand)) {
        return 6;
    }
    if (isFullHouse(hand)) {
        return 5;
    }
    if (isThreeOfAKind(hand)) {
        return 4;
    }
    if (isTwoPairs(hand)) {
        return 3;
    }
    if (isOnePair(hand)) {
        return 2;
    }
    return 1;
}

function prepareInput() {
    arrs = input.split("\n").map(line => line.split(" "));
    hands = [];
    //console.log(arrs);
    for (i = 0; i < arrs.length; i++) {
        hands.push({ "cards": arrs[i][0].split(""), "bid": Number(arrs[i][1]), "type": detectType(arrs[i][0].split("")) });
    }
    return hands;
}

function newSort(e1, e2) {
    let n1 = 0;
    let n2 = 0;
    for (i = 0; i < 5; i++) {
        switch (e1.cards[i]) {
            case "T": n1 = 10; break;
            case "J": n1 = 11; break;
            case "Q": n1 = 12; break;
            case "K": n1 = 13; break;
            case "A": n1 = 14; break;
            default: n1 = Number(e1.cards[i]);
        }
        switch (e2.cards[i]) {
            case "T": n2 = 10; break;
            case "J": n2 = 11; break;
            case "Q": n2 = 12; break;
            case "K": n2 = 13; break;
            case "A": n2 = 14; break;
            default: n2 = Number(e2.cards[i]);
        }
        if (n1 - n2 != 0) {
            return n1 - n2;
        }
    }
    return n1 - n2;
}

function getRanking(hands) {
    let types = [[], [], [], [], [], [], []];
    hands.forEach(hand => types[hand.type - 1].push(hand));

    types.forEach(typeArray => typeArray.sort((a, b) => newSort(a, b)));

    ranking = [];
    types.forEach(type => type.forEach(hand => ranking.push(hand)));
    return ranking;
}

function getTotalWinnings(hands) {
    return getRanking(hands).reduce((acc, e, i) => { return acc + e.bid * (i + 1) }, 0);
}

console.log("-------------------------------------Part 1-------------------------------------");

hands = prepareInput();
//console.log(hands);

rank = getRanking(hands);
//console.log("RANKING: ");
//console.log(rank);

winnings = getTotalWinnings(hands);
console.log("Total winnings: " + winnings);

data = "";
rank.forEach(hand => data += hand.cards.toString() + ", type: " + hand.type + ", bid: " + hand.bid + "\n");

//fs.writeFile('file.txt', data, (err) => {if(err) { throw err}; console.log("Data has been written to file successfully."); });

// 252.018.853 is too low
console.log("-------------------------------------Part 2-------------------------------------");

function getStrongestCardType(hand) {
    let omitJ = hand.cards.filter(c => c != "J");
                // 2  3  4  5  6  7  8  9  T  Q  K  A
    let counter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (j = 0; j < omitJ.length; j++) {
        switch (omitJ[j]) {
            case "2": counter[0]++; break;
            case "3": counter[1]++; break;
            case "4": counter[2]++; break;
            case "5": counter[3]++; break;
            case "6": counter[4]++; break;
            case "7": counter[5]++; break;
            case "8": counter[6]++; break;
            case "9": counter[7]++; break;
            case "T": counter[8]++; break;
            case "Q": counter[9]++; break;
            case "K": counter[10]++; break;
            case "A": counter[11]++; break;
            default:
        }
    }
    let maxCount = 0;
    let index = -1;
    counter.forEach((c, ind) => {if(c>=maxCount){maxCount = c; index = ind}});

    let sign = "X";
    switch(index){
        case 0: sign = "2"; break;
        case 1: sign = "3"; break;
        case 2: sign = "4"; break;
        case 3: sign = "5"; break;
        case 4: sign = "6"; break;
        case 5: sign = "7"; break;
        case 6: sign = "8"; break;
        case 7: sign = "9"; break;
        case 8: sign = "T"; break;
        case 9: sign = "Q"; break;
        case 10: sign = "K"; break;
        case 11: sign = "A"; break;
        default:
    }
    return sign;
}

function switchJAndUpdateType(hand){
    let sign = getStrongestCardType(hand);
    let tempHand = {"cards": hand.cards.map(c => {if(c == "J"){return sign;} return c;}), "bid": hand.bid, "type": "unknown"};
    return {"cards": hand.cards, "bid": hand.bid, "type": detectType(tempHand.cards)};
}

function newSort2(e1, e2){
    let j1 = {"cards": e1.cards.map(c => {if(c == "J"){return "1";} return c;}), "bid": e1.bid, "type": e1.type};
    let j2 = {"cards": e2.cards.map(c => {if(c == "J"){return "1";} return c;}), "bid": e2.bid, "type": e2.type};
    return newSort(j1, j2);
}

function getRanking2(hands) {
    let types = [[], [], [], [], [], [], []];
    hands = hands.map(hand => switchJAndUpdateType(hand));
    hands.forEach(hand => types[hand.type - 1].push(hand));

    types.forEach(typeArray => typeArray.sort((a, b) => newSort2(a, b)));

    ranking = [];
    types.forEach(type => type.forEach(hand => ranking.push(hand)));
    return ranking;
}

function getTotalWinnings2(hands) {
    return getRanking2(hands).reduce((acc, e, i) => { return acc + e.bid * (i + 1) }, 0);
}

hands2 = prepareInput();
//console.log(hands2);

rank2 = getRanking2(hands2);
//console.log("RANKING2: ");
//console.log(rank2);

winnings2 = getTotalWinnings2(hands2);
console.log("Total winnings 2: " + winnings2);
