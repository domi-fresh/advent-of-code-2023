const { match } = require("assert");
const fs = require("fs");
const { start } = require("repl");
// https://adventofcode.com/2023/day/10


function findDirS(maze, start){
    //console.log(maze);
    //console.log(start);
    let dirs = [];
    if(maze[start.y][Math.max(0, start.x-1)] == "-" || maze[start.y][Math.max(0, start.x-1)] == "F" || maze[start.y][Math.max(0, start.x-1)] == "L"){
        dirs.push("l");
    }
    if(maze[start.y][Math.min(maze[start.y].length-1, start.x+1)] == "-" || maze[start.y][Math.min(maze[start.y].length-1, start.x+1)] == "7" || maze[start.y][Math.min(maze[start.y].length-1, start.x+1)] == "J"){
        dirs.push("r");
    }
    if(maze[Math.max(0, start.y-1)][start.x] == "|" || maze[Math.max(0, start.y-1)][start.x] == "7" || maze[Math.max(0, start.y-1)][start.x] == "F"){
        dirs.push("u");
    }
    if(maze[Math.min(maze.length-1, start.y+1)][start.x] == "|" || maze[Math.min(maze.length-1, start.y+1)][start.x] == "L" || maze[Math.min(maze.length-1, start.y+1)][start.x] == "J"){
        dirs.push("d");
    }
    return dirs;
}

function initDistances(maze, start){
    let distances = [];
    maze.forEach(line => distances.push([]));
    maze.forEach((line, y) => line.forEach(cell => distances[y].push(-1)));
    distances[start.y][start.x] = 0;
    return distances;
}

function prepareInput(path) {
    let input = fs.readFileSync(path).toString();
    let start = {"x": null, "y": null};
    let maze = input.split("\n").map(s => s.split(""));
    maze.forEach((line, y) => line.forEach((char, x) => {if(char=="S"){start.x = x; start.y = y}}));
    return {"maze":maze, "start": start, "dirs": findDirS(maze, start), "distances": initDistances(maze, start)};
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Challenge 1

function findNewDir(sym, oldDir){
    switch(sym){
        case "|": if(oldDir=="u"){return "u";}else if(oldDir == "d"){return "d"}else{console.error("Something went wrong")}; break;
        case "-": if(oldDir=="l"){return "l";}else if(oldDir == "r"){return "r"}else{console.error("Something went wrong")}; break;
        case "F": if(oldDir=="u"){return "r";}else if(oldDir == "l"){return "d"}else{console.error("Something went wrong")}; break;
        case "7": if(oldDir=="u"){return "l";}else if(oldDir == "r"){return "d"}else{console.error("Something went wrong")}; break;
        case "L": if(oldDir=="d"){return "r";}else if(oldDir == "l"){return "u"}else{console.error("Something went wrong")}; break;
        case "J": if(oldDir=="r"){return "u";}else if(oldDir == "d"){return "l"}else{console.error("Something went wrong")}; break;
        default: console.error("Ooops, no symbol found here");
    }
}

function takeStep(maze, distances, cur1, dir1, cur2, dir2){
    let new1;
    let new2;

    switch(dir1){
        case "l": new1 = {"x": cur1.x-1, "y": cur1.y}; break;
        case "r": new1 = {"x": cur1.x+1, "y": cur1.y}; break;
        case "u": new1 = {"x": cur1.x, "y": cur1.y-1}; break;
        case "d": new1 = {"x": cur1.x, "y": cur1.y+1}; break;
        default:
    }
    switch(dir2){
        case "r": new2 = {"x": cur2.x+1, "y": cur2.y}; break;
        case "l": new2 = {"x": cur2.x-1, "y": cur2.y}; break;
        case "u": new2 = {"x": cur2.x, "y": cur2.y-1}; break;
        case "d": new2 = {"x": cur2.x, "y": cur2.y+1}; break;
        default:
    }

    let newDir1 = findNewDir(maze[new1.y][new1.x], dir1);
    let newDir2 = findNewDir(maze[new2.y][new2.x], dir2);

    distances[new1.y][new1.x] = distances[cur1.y][cur1.x]+1;
    distances[new2.y][new2.x] = distances[cur2.y][cur2.x]+1;
    

    return {"distances": distances,"new1": new1, "new2": new2, "newDir1": newDir1, "newDir2": newDir2};
}

function findDistances(map){
    let maze = map.maze;
    let distances = map.distances;
    let cur1 = {"x": map.start.x, "y": map.start.y};
    let cur2 = {"x": map.start.x, "y": map.start.y};
    let dir1 = map.dirs[0];
    let dir2 = map.dirs[1];

    while(cur1.x != cur2.x || cur1.y != cur2.y || cur1.x == map.start.x && cur1.y == map.start.y){
        let result = takeStep(maze, distances, cur1, dir1, cur2, dir2);
        cur1 = result.new1;
        cur2 = result.new2;
        distances = result.distances;
        dir1 = result.newDir1;
        dir2 = result.newDir2;
    }
    return {"distances": distances, "end": cur1};
}

function prettyDistances(distances){
    let pretty = distances.map(line => line.map(cell => {return cell>=0?cell.toString():"."}));
    return pretty.reduce((acc, line) => {return acc + line.reduce((acc2, sym) => {return acc2+sym + " "}, "") + "\n"}, "");
}

function prettyMaze(maze){
    return maze.reduce((acc, line) => {return acc + line.reduce((acc2, sym) => {return acc2+sym + " "}, "") + "\n"}, "");
}


console.log("-------------------------------------Part 1-------------------------------------");

let example_map1 = prepareInput('./example.txt');
console.log("Example map 1: ");
console.log(example_map1);

let example_result1 = findDistances(example_map1);
console.log("The furthest distance from the start in the main loop of the example is: ")
console.log(example_result1.distances[example_result1.end.y][example_result1.end.x]);
console.log("Distances: ");
console.log(prettyDistances(example_result1.distances));

console.log(".................................................................................");

let map1 = prepareInput('./input.txt');
//console.log("map 1: ");
//console.log(map1);

let result1 = findDistances(map1);
console.log("The furthest distance from the start in the main loop of part 1 is: ")
console.log(result1.distances[result1.end.y][result1.end.x]);
//console.log("Distances: ");
//console.log(prettyDistances(result1.distances));

console.log("-------------------------------------Part 2-------------------------------------");

function findEntryPoint(maze){
    let entry = [];
    maze[0].forEach((sym, x) => {if(sym == "."){entry.push({"x": x, "y": 0})}});
    maze[maze.length-1].forEach((sym, x) => {if(sym == "."){entry.push({"x": x, "y": maze.length-1})}});
    maze.forEach((row, y) => {if(row[0]=="."){entry.push({"x": 0, "y": y})}; if(row[maze[0].length-1] == "."){entry.push({"x": maze[0].length-1, "y": y})}});
    return entry;
}

function findAccessableDots(distances){
//console.log("################################################################################");
//console.log(distances);

    let maze = distances.map(line => line.map(sym => {if(sym == -1){return "."}else{return sym.toString()}}));
    let entry = findEntryPoint(maze);
    let width = maze[0].length;
    let height = maze.length;
    while(entry.length != 0){
        let cur = entry.pop();
        if(maze[cur.y][cur.x] == "."){
            maze[cur.y][cur.x] = "O";
            if(maze[Math.max(cur.y-1, 0)][Math.max(cur.x-1, 0)] == "."){
                entry.push({"x": Math.max(cur.x-1, 0), "y": Math.max(cur.y-1, 0)});
            }
            if(maze[Math.max(cur.y-1, 0)][cur.x] == "."){
                entry.push({"x": cur.x, "y": Math.max(cur.y-1, 0)});
            }
            if(maze[Math.max(cur.y-1, 0)][Math.min(cur.x+1, width-1)] == "."){
                entry.push({"x": Math.min(cur.x+1, width-1), "y": Math.max(cur.y-1, 0)});
            }
            if(maze[cur.y][Math.max(cur.x-1, 0)] == "."){
                entry.push({"x": Math.max(cur.x-1, 0), "y": cur.y});
            }
            if(maze[cur.y][cur.x] == "."){
                entry.push({"x": cur.x, "y": cur.y});
            }
            if(maze[cur.y][Math.min(cur.x+1, width-1)] == "."){
                entry.push({"x": Math.min(cur.x+1, width-1), "y": cur.y});
            }
            if(maze[Math.min(height-1, cur.y+1)][Math.max(cur.x-1, 0)] == "."){
                entry.push({"x": Math.max(cur.x-1, 0), "y": Math.min(height-1, cur.y+1)});
            }
            if(maze[Math.min(height-1, cur.y+1)][cur.x] == "."){
                entry.push({"x": cur.x, "y": Math.min(height-1, cur.y+1)});
            }
            if(maze[Math.min(height-1, cur.y+1)][Math.min(cur.x+1, width-1)] == "."){
                entry.push({"x": Math.min(cur.x+1, width-1), "y": Math.min(height-1, cur.y+1)});
            }
        }
    }
    return maze;
}

function findNonAccessableDots(distances){
    let accessable = findAccessableDots(distances);
    let count = 0;
    accessable.forEach(line => line.forEach(cell => {if(cell == "."){count++;}}));
    return count;
}


function x(maze, entryPoints, distances){
    let height = maze.length;
    let width = maze[0].length;
    let ep = entryPoints.pop();
    l
    while(distances[ep.y][ep.x] == -1 || ep.x <width){
        ep.x++;
    }
    let cur = {"x": ep.x, "y": cur.y, "outside":null, "dir": null};

    let start = cur;

    do{
        switch(maze[cur.y][cur.x]){
            case "|": if(cur.dir == "d"){cur.outside = "l"}else{cur.outside = "r"} break;
            case "-": if(cur.dir == "r"){cur.outside = "l"}else{cur.outside = "r"} break;
            
            case "F": cur.outside = "F"; cur.dir = "u"; break;
            case "L": cur.outside = "L"; cur.dir = "u"; break;
            case "L": cur.outside = "L"; cur.dir = "u"; break;
            case "L": cur.outside = "L"; cur.dir = "u"; break;
            case "L": cur.outside = "L"; cur.dir = "u"; break;
            case "L": cur.outside = "L"; cur.dir = "u"; break;
            default:
        }

        switch(cur.outside){
            case "l": distances = checkDot(distances, cur.x, cur.y); cur.y++; break;
            case "r":  break;
            case "F":  break;
            case "L":  break;
            case "7":  break;
            case "J":  break;
            default:
        }
    }while(start.x != cur.x && start.y != cur.y)



}


let example_map2 = prepareInput('./example2.txt');
console.log("Example map 2: ");
console.log(example_map2);

let temp_result_example2 = findDistances(example_map2);

let accessableDotsMaze = findAccessableDots(temp_result_example2.distances);
console.log(prettyMaze(accessableDotsMaze));
console.log("Non accessable points: " + findNonAccessableDots(temp_result_example2.distances));
console.log(".................................................................................");


