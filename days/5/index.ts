import { promises as fs } from 'fs';

const part1 = (instructions:number[]) => {
  let stepCount = 0;
  for(
    let iPos = 0, jmp = 0;
    iPos < instructions.length;
    iPos += jmp, stepCount++
  ) {
    jmp = instructions[iPos];
    instructions[iPos] = jmp+1;
  }
  console.log(`Part 1 : took ${stepCount} steps to exit`);
};

const part2 = (instructions:number[]) => {
  let stepCount = 0;
  for(
    let iPos = 0, jmp = 0;
    iPos < instructions.length;
    iPos += jmp, stepCount++
  ) {
    jmp = instructions[iPos];
    instructions[iPos] = jmp >= 3 ? jmp - 1 : jmp + 1;
  }
  console.log(`Part 2 : took ${stepCount} steps to exit`)
}

(async () => {

  const allInstructions = await fs.readFile('./days/5/input', { encoding: 'utf-8'});
  const initialList = allInstructions.split('\n').map(val => parseInt(val, 10));
  
  part1([...initialList]);
  part2([...initialList]);
})();