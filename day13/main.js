const { match } = require("assert");
const { group } = require("console");
const fs = require("fs");
const { start } = require("repl");
// https://adventofcode.com/2023/day/11


function prepareInput(path) {
  let input = fs.readFileSync(path).toString();
  let patterns = input.split("\n\n").map(block => block.split("\n").map(line => line.split("")));

  return patterns;
}

function convertToCount(arr) {
  let length = arr.length;
  let newArr = [];
  let sign = arr[0];
  let counter = 0;
  arr.forEach(s => {
    if (s == sign) {
      counter++;
    } else {
      newArr.push({ "sign": sign, "count": counter });
      counter = 1;
      sign = s;
    }
  });
  newArr.push({ "sign": sign, "count": counter });
  return newArr;
}

function areMirrored(arr1, arr2) {
  return arr1.length == arr2.length && arr1.reduce((acc, e, index) => acc && arr2[index].sign == e.sign && arr2[index].count == e.count, true);
}

function findMirror(plainPattern) {
  let result = Number.MIN_SAFE_INTEGER;
  //console.table(pattern);
  let pattern = plainPattern.map(line => convertToCount(line));
  for (let i = 1; i < pattern.length; i++) {
    let iIsMirror = true;
    for (let d = 1; d < pattern.length; d++) {
      let a = i - d;
      let b = i + d - 1;
      if (a < 0 || b > pattern.length - 1) {
        if (d == 1) {
          iIsMirror = false;
        }
        break;
      }
      iIsMirror &= areMirrored(pattern[a], pattern[b]);
    }
    if (iIsMirror) {
      console.log("found a mirror at i = " + i);
      return i;
    }
  }
  console.log("no mirror was found");
  return Number.MIN_SAFE_INTEGER;
}

function transpose(arr) {
  let newArr = [];
  arr[0].forEach(e => newArr.push([]));

  for (let col = 0; col < arr[0].length; col++) {
    for (let row = 0; row < arr.length; row++) {
      newArr[col].push(arr[row][col]);
    }
  }
  return newArr;
}

function findAllMirrors(patterns) {
  let horizontal = patterns.map(p => findMirror(p));
  let vertPatterns = patterns.map(p => transpose(p));
  let vertical = vertPatterns.map(p => findMirror(p));

  let sumHorizontal = horizontal.reduce((acc, e) => { if (e != Number.MIN_SAFE_INTEGER) { return acc + 100 * e; } else { return acc } }, 0);
  let sumVertical = vertical.reduce((acc, e) => { if (e != Number.MIN_SAFE_INTEGER) { return acc + e; } else { return acc } }, 0);

  //console.log(sumHorizontal);
  //console.log(sumVertical);
  return sumHorizontal + sumVertical;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 1



console.log("-------------------------------------Part 1-------------------------------------");

let examplePattern1 = prepareInput("./example.txt");
console.log("Example pattern 1:");
console.log(examplePattern1);

console.log("solution example patterns 1: ")
console.log(findAllMirrors(examplePattern1));

console.log(".................................................................................");

console.time('Execution Time');

let Pattern1 = prepareInput("./input.txt");
//console.log("pattern 1:");
//console.log(Pattern1);

console.log("solution patterns 1: ")
console.log(findAllMirrors(Pattern1));

console.timeEnd('Execution Time');

console.log(".................................................................................");



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 2

function findMirror2(plainPattern) {


  for (let i = 1; i < plainPattern.length; i++) {
    for (let r = 0; r < plainPattern.length; r++) {
      for (let c = 0; c < plainPattern[r].length; c++) {
        let newPattern = plainPattern.map(line => [...line]);
        newPattern[r][c] = plainPattern[r][c] == "." ? "#" : ".";
        let pattern = newPattern.map(line => convertToCount(line));

       
    let iIsMirror = true;
        for (let d = 1; d < plainPattern.length; d++) {
          let a = i - d;
          let b = i + d - 1;
          if (a < 0 || b > plainPattern.length - 1) {
            if (d == 1) {
              iIsMirror = false;
            }
            break;
          }
          iIsMirror &= areMirrored(pattern[a], pattern[b]);
          if(i == 1 && r == 0 && c == 4){
          
            console.log("i = 1")
            console.log(newPattern.reduce((acc, line) => { return acc + line.reduce((acc2, symbol) => acc2 + symbol, "") + "\n" }, ""));
            console.log(" a "+ a);
            console.log(pattern[a]);

            console.log(" b " +b);
            console.log(pattern[b])
            console.log(iIsMirror);

          }
        }
        if (iIsMirror) {
          console.log("found a mirror at i = " + i + " by changing position row " + r + " col " + c + " from " + plainPattern[r][c] + " to " + newPattern[r][c]);
          console.log(newPattern.reduce((acc, line) => { return acc + line.reduce((acc2, symbol) => acc2 + symbol, "") + "\n" }, ""));
          return i;
        }
      }
    }
  }
  console.log("no mirror was found");
  return Number.MIN_SAFE_INTEGER;
}

function findAllMirrors2(patterns) {
  let horizontal = patterns.map(p => findMirror2(p));
  let vertPatterns = patterns.map(p => transpose(p));
  let vertical = vertPatterns.map(p => findMirror2(p));
  console.log(horizontal);
  console.log(vertical);
  let sumHorizontal = horizontal.reduce((acc, e, index) => { if (e != Number.MIN_SAFE_INTEGER && vertical[index] > e ) {vertical[index] = Number.MIN_SAFE_INTEGER; return acc + 100 * e; } else { return acc } }, 0);
  let sumVertical = vertical.reduce((acc, e) => { if (e != Number.MIN_SAFE_INTEGER) { return acc + e; } else { return acc } }, 0);

  //console.log(sumHorizontal);
  //console.log(sumVertical);
  return sumHorizontal + sumVertical;
}


let examplePattern2 = prepareInput("./example.txt");
console.log("Example pattern 2:");
console.log(examplePattern2);

console.log("solution example patterns 2: ")
console.log(findAllMirrors2(examplePattern2));

console.log("-------------------------------------Part 2-------------------------------------");

console.time('Execution Time');

let pattern2 = prepareInput("./input.txt");
//console.log("pattern 1:");
//console.log(Pattern1);

console.log("solution patterns 2: ")
console.log(findAllMirrors2(pattern2));

console.timeEnd('Execution Time');

//35975 is too high
//11543 is too low