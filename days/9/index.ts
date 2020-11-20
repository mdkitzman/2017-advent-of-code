import { promises as fs } from 'fs';
import {sum} from '../util';

const scoreRow = (line:string):number[] => {
  let wasBang = false;
  const removeBangs = (char:string):boolean => {
    if(wasBang) {
      wasBang = false;
      return false;
    }
  
    if(char === '!'){
      wasBang = true;
      return false;
    }
    return true;
  };
  
  let inGarbage = false;
  let garbageCount = 0;
  const removeGarbage = (char:string):boolean => {
    if(inGarbage) {
      if (char === '>') {
        inGarbage = false;
      } else {
        garbageCount++;
      }
      return false;
    } else if (char === '<') {
      inGarbage = true;
      return false;
    }
    return true;
  };
  
  const removeCommas = (char:string):boolean => char !== ',';
  
  const scoreClean = (line:string):number => {
    let score = 0;
    const curlyStack:string[] = [];
    line.split('').forEach(char => {
      if(char === '{') {
        curlyStack.push(char);
      } else {
        score += curlyStack.length;
        curlyStack.pop();
      }
    });
    return score;
  }

  const cleanLine = line.split('')
    .filter(removeBangs)
    .filter(removeGarbage)
    .filter(removeCommas)
    .reduce((prev, cur) => prev + cur, '');

  return [scoreClean(cleanLine), garbageCount];
}

const part1 = (input:string) => {
  const score = input.split('\n')
    .map(scoreRow)
    .map(scoreAndGarbage => scoreAndGarbage[0])
    .reduce(sum, 0);

  console.log(`Part 1 : score for all rows is ${score}`);
};

const part2 = (input) => {
  const gCount = input.split('\n')
    .map(scoreRow)
    .map(scoreAndGarbage => scoreAndGarbage[1])
    .reduce(sum, 0);

  console.log(`Part 2 : the count of all of the garbage is ${gCount}`)
}

(async () => {
  const allInput = await fs.readFile('./days/9/input', { encoding: 'utf-8'});
  const test = await fs.readFile('./days/9/test', { encoding: 'utf-8'});
  part1(allInput);
  part2(allInput);
})();