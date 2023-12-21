const fs = require("fs")

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/1

// Challenge 1 + 2
const detectedWrittenDigits = input.split("\n").map(line => {
    newLine = ""
    for(i = 0; i < line.length;i++){
        found = false;
        sub = line.substring(i, i+3);
        if(sub.match("one")){
            newLine += "1";
            i+=2;
            found = true;
            continue;
        }else if(sub.match("two")){
            newLine += "2";
            i+=2;
            found = true;
            continue;
        }else if(sub.match("six")){
            newLine += "6";
            i+=2;
            found = true;
            continue;
        }
        if(!found){
            sub = line.substring(i, i+4);
            if(sub.match("four")){
                newLine += "4";
                i+=3;
                found = true;
                continue;
            }else if(sub.match("five")){
                newLine += "5";
                i+=3;
                found = true;
                continue;
            }else if(sub.match("nine")){
                newLine += "9";
                i+=3;
                found = true;
                continue;
            }
        }
            if(!found){
            sub = line.substring(i, i+5);
            if(sub.match("three")){
                newLine += "3";
                i+=4;
                found = true;
                continue;
            }else if(sub.match("seven")){
                newLine += "7";
                i+=4;
                found = true;
                continue;
            }else if(sub.match("eight")){
                newLine += "8";
                i+=4;
                found = true;
                continue;
            }
        }
        if(!found){
            newLine += line.at(i);
        }
    }
    return newLine;
});
console.log(detectedWrittenDigits);
const containedNumbers = detectedWrittenDigits.map(line => line.split("")
    .filter(sign => (sign.match('0') || sign.match('1') || sign.match('2') || sign.match('3') || sign.match('4') || sign.match('5') || 
         sign.match('6') || sign.match('7') || sign.match('8') || sign.match('9'))));

console.log(containedNumbers);

neededNumbers = containedNumbers.map(line => {return Number(line.at(0) + line.at(-1))});
sum = neededNumbers.reduce((acc, num) => {return acc + num}, 0);
console.log(neededNumbers);
console.log(sum);

// Part 2

function findNumber(line){
    number = 0;
    for(i = 0; i < line.length; i++){
        digit = line.substring(i, i+1);
        if(digit.match("0") || digit.match("1") || digit.match("2") || digit.match("3") || digit.match("4") || digit.match("5") || digit.match("6") || 
                            digit.match("7") || digit.match("8") || digit.match("9")){
            number += 10 * Number(digit);
            break;
        }
        digit = line.substring(i, i+3);
        switch(digit){
            case "one": {
                    digit = 1;
                    break;
                }
            case "two": {
                    digit = 2;
                    break;
                }
            case "six": {
                    digit = 6;
                    break;
                }
            default: break;
        }
        if(!Number.isInteger(digit)){
            digit = line.substring(i, i+4);
            switch(digit){
                case "four": {
                        digit = 4;
                        break;
                    }
                case "five": {
                        digit = 5;
                        break;
                    }
                case "nine": {
                        digit = 9;
                        break;
                    }
                default: break;
            }
        }
        if(!Number.isInteger(digit)){
            digit = line.substring(i, i+5);
            switch(digit){
                case "three": {
                        digit = 3;
                        break;
                    }
                case "seven": {
                        digit = 7;
                        break;
                    }
                case "eight": {
                        digit = 8;
                        break;
                    }
                default: break;
            }
        }
        if(Number.isInteger(digit)){
            number += (10 * digit);
            break;
        }
        
    }
    for(i = 0; i < line.length; i++){
        digit = line.substring(line.length-1-i, line.length-i);
        if(digit.match("0") || digit.match("1") || digit.match("2") || digit.match("3") || digit.match("4") || digit.match("5") || digit.match("6") || 
                            digit.match("7") || digit.match("8") || digit.match("9")){
            number += Number(digit);
            break;
        }
        digit = line.substring(line.length-1-i, line.length-i+2);
        switch(digit){
            case "one": {
                    digit = 1;
                    break;
                }
            case "two": {
                    digit = 2;
                    break;
                }
            case "six": {
                    digit = 6;
                    break;
                }
            default: break;
        }
        if(!Number.isInteger(digit)){
            digit = line.substring(line.length-1-i, line.length-i+3);
            switch(digit){
                case "four": {
                        digit = 4;
                        break;
                    }
                case "five": {
                        digit = 5;
                        break;
                    }
                case "nine": {
                        digit = 9;
                        break;
                    }
                default: break;
            }
        }
        if(!Number.isInteger(digit)){
            digit = line.substring(line.length-1-i, line.length-i+4);
            switch(digit){
                case "three": {
                        digit = 3;
                        break;
                    }
                case "seven": {
                        digit = 7;
                        break;
                    }
                case "eight": {
                        digit = 8;
                        break;
                    }
                default: break;
            }
        }
        if(Number.isInteger(digit)){
            number += digit;
            break;
        }
    }
    return number;
}

numbers = fs.readFileSync("./input.txt").toString().split("\n").map(line => findNumber(line));
console.log("\nPart two: \n")
console.log(numbers);
console.log(numbers.reduce((acc, curr)=>{return acc+curr}, 0));