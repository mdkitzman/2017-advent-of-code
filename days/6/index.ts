import { promises as fs } from 'fs';
import crypto from 'crypto';


const hash = (input:number[]):string => crypto.createHash('sha256').update(Buffer.from(input)).digest('hex');

const maxPos = (input:number[]):[number, number] => {
  const max = Math.max(...input);
  const index = input.findIndex(val => val === max);
  return [index, max];
}

const redistribute = (input:number[]) => {
  const [iMaxVal, value] = maxPos(input);
  input[iMaxVal] = 0;
  for(
    let iDist = 0, iPos = (iMaxVal+1) % input.length;
    iDist < value;
    iDist++, iPos = (iPos + 1) % input.length
  ) {
    input[iPos] = input[iPos] + 1;
  }
};

const part1 = (input:number[]) => {
  const seen = new Set();
  seen.add(hash(input));

  while (true) {
    redistribute(input);
    const stateHash = hash(input);
    if(seen.has(stateHash))
      break;
    seen.add(stateHash);
  } 

  console.log(`Part 1 : Infinite loop detected after ${seen.size} iterations`);
};

const part2 = (input:number[]) => {
  let repeatIndex = -1;
  const seen:string[] = []
  seen.push(hash(input));

  while (true) {
    redistribute(input);
    const stateHash = hash(input);
    if((repeatIndex = seen.findIndex(hash => hash === stateHash)) !== -1 )
      break;
    seen.push(stateHash);
  } 
  const cycleLength = seen.length - repeatIndex;
  console.log(`Part 2 : Infinite loop cycle length : ${cycleLength}`);
}

(async () => {
  const input = [14,0,15,12,11,11,3,5,1,6,8,4,9,1,8,4];
  
  part1([...input]);
  part2([...input]);
})();