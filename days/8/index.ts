import { promises as fs } from 'fs';

const forContext = (context:{[k:string]:number}) => (code:string) => {
  return Function('context', `with (context) { return ${code} }`)(context);
};

type Instruction = {
  operation: string;
  condition: string;
}

const parseInput = (input:string): Instruction[] => {
  return input
    .split('\n')
    .map(line => {
      const [op, condition] = line.split(' if ');
      return { 
        condition,
        operation: op.replace(/inc/, "+=").replace(/dec/, "-=")
      };
    });
};

const part1 = (input) => {
  const registers:{[k:string]:number} = {};

  const evaluator = forContext(registers);
  const instructions = parseInput(input);
  // initialze all registers
  new Set<string>(instructions.map(i => [i.condition.split(' ')[0], i.operation.split(' ')[0]]).flat())
    .forEach((value) => registers[value] = 0);
  
  instructions.forEach(({operation, condition}) => {
    if(evaluator(condition))
      evaluator(operation)
  })
  const [registerName, value] = Object.entries(registers).reduce((prev, curr) => prev[1] >= curr[1] ? prev : curr)
  
  console.log(`Part 1 : register ${registerName} has the highest value of ${value}`);
};

const part2 = (input) => {
  const registers:{[k:string]:number} = {};

  const evaluator = forContext(registers);
  const instructions = parseInput(input);
  // initialze all registers
  new Set<string>(instructions.map(i => [i.condition.split(' ')[0], i.operation.split(' ')[0]]).flat())
    .forEach((value) => registers[value] = 0);
  
  let maxValue = -Number.MAX_SAFE_INTEGER;
  instructions.forEach(({operation, condition}) => {
    if(evaluator(condition))
      evaluator(operation)
    const [registerName, value] = Object.entries(registers).reduce((prev, curr) => prev[1] >= curr[1] ? prev : curr);
    maxValue = Math.max(maxValue, value);
  });

  console.log(`Part 2 : The largest value held in a register is ${maxValue}`)
}

(async () => {
  const allInput = await fs.readFile('./days/8/input', { encoding: 'utf-8'});
  const test = await fs.readFile('./days/8/test', { encoding: 'utf-8'});

  part1(allInput);
  part2(allInput);
})();