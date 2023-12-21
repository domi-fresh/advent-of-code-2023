const { group, count, log } = require("console");
const fs = require("fs")

const input = fs.readFileSync('./input.txt').toString();

// https://adventofcode.com/2023/day/5

// Challenge 1
 function prepareInput(){
    almanac = {"seeds": [], "seedToSoil": [], "soilToFert": [], "fertToWat": [], "watToLight": [], "lightToTemp": [], "tempToHum": [], "humToLoc": []};
        
    input.split("\n\n").forEach((block, i) => {
        switch(i){
            case 0: {
                almanac.seeds = block.substring(7).split(" ").map(e => Number(e));
            }break;

            case 1: {
                almanac.seedToSoil = block.substring(18).split("\n").map(line => line.split(" ").map(e => Number(e)));
            }break;

            case 2: {
                almanac.soilToFert = block.substring(24).split("\n").map(line => line.split(" ").map(e => Number(e)));
            }break;

            case 3: {
                almanac.fertToWat = block.substring(25).split("\n").map(line => line.split(" ").map(e => Number(e)));
            }break;

            case 4: {
                almanac.watToLight = block.substring(20).split("\n").map(line => line.split(" ").map(e => Number(e)));
            }break;

            case 5: {
                almanac.lightToTemp = block.substring(26).split("\n").map(line => line.split(" ").map(e => Number(e)));
            }break;

            case 6: {
                almanac.tempToHum = block.substring(29).split("\n").map(line => line.split(" ").map(e => Number(e)));
            }break;

            case 7: {
                almanac.humToLoc = block.substring(26).split("\n").map(line => line.split(" ").map(e => Number(e)));
            }break;

            default:
        }
    });
    return almanac;
 }

function mapNumber(input, mappings){
    for(i = 0; i < mappings.length; i++){
        sourceStart = mappings[i][1];
        destinationStart = mappings[i][0];
        length = mappings[i][2];
        if(input >= sourceStart && input < sourceStart + length){
            return (destinationStart + input - sourceStart);
        }
    }
    return input;
}

function getLocation(almanac, seed, location){
    
    //return Math.min(location, mapNumber(mapNumber(mapNumber(mapNumber(mapNumber(mapNumber(mapNumber(seed, almanac.seedToSoil), almanac.soilToFert), almanac.fertToWat), almanac.watToLight), almanac.lightToTemp), almanac.tempToHum), almanac.humToLoc));           
    soil = mapNumber(seed, almanac.seedToSoil);
    fert = mapNumber(soil, almanac.soilToFert);
    water = mapNumber(fert, almanac.fertToWat);
    light = mapNumber(water, almanac.watToLight);
    temp = mapNumber(light, almanac.lightToTemp);
    humid  = mapNumber(temp, almanac.tempToHum);
    loc = mapNumber(humid, almanac.humToLoc);
    //console.log(Math.min(location, loc))
    return Math.min(location, loc);
}


var almanac = prepareInput();

var location = Number.MAX_SAFE_INTEGER;
location = almanac.seeds.map(seed => getLocation(almanac, seed, location)).reduce((acc, l) => {return Math.min(acc, l)}, Number.MAX_SAFE_INTEGER);


//console.log(almanac);
console.log("-------------------------------------Part 1-------------------------------------");
//console.log(locations);
console.log("Lowest location: " + location);
 
console.log("-------------------------------------Part 2-------------------------------------");

var almanac2 = prepareInput();

function findLocForSeedRange(seedStart, range, almanac){
    result = Number.MAX_SAFE_INTEGER;
    end = seedStart + range;
    console.log("Seed range: " + range);
    //console.log(almanac);
    while(seedStart < end){
        
        //console.log("Seed nr: " + seedStart);
        result = getLocation(almanac, seedStart, result);
        //console.log("Result for seed: " + result);
        
        seedStart++;
    }
    return result;
}

/*
location2 = Number.MAX_SAFE_INTEGER;
for(i = 0; i<almanac2.seeds.length; i += 2){
    console.log("Running seed set number: " + ((i+2)/2));
    location2 = Math.min(location2, findLocForSeedRange(almanac2.seeds[i], almanac2.seeds[i+1], almanac2));
    
}
console.log(location2);
*/
function transformNum(num, instructions){
    for(i = 0; i<instructions.length; i++){
        let instruction = instructions[i];
        dest = instruction[0];
        source = instruction[1];
        range = instruction[2];
        if(num >= dest && num < dest + range){
            num = num - (dest-source);
            return num;
        }
    }
    return num;
}

console.log(almanac2);

found = false;
for(l = 0; l < 10000000000; l++){
    if(l%1000000 == 0){
        console.log("Checking location " + l);
    }
    humid = transformNum(l, almanac2.humToLoc);
    temp = transformNum(humid, almanac2.tempToHum);
    light = transformNum(temp, almanac2.lightToTemp);
    water = transformNum(light, almanac2.watToLight);
    fert = transformNum(water, almanac2.fertToWat);
    soil = transformNum(fert, almanac2.soilToFert);
    seed = transformNum(soil, almanac2.seedToSoil);

    /*
    console.log("\nLoc " + l);
    console.log("humid " + humid);
    console.log("temp " + temp);
    console.log("light " + light);
    console.log("water " + water);
    console.log("fert " + fert);
    console.log("soil " + soil);
    console.log("seed " + seed); 
    */

    for(j = 0; j<almanac2.seeds.length; j = j+2){
        seedstart = almanac2.seeds[j];
        sRange = almanac2.seeds[j+1];
        if(seed >= seedstart && seed < seedstart + sRange){
            console.log("Found lowest location to be : " + l);
            found = true;
            break;
        }
    }
    if(found){
        break;
    }
}