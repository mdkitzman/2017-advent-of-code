import { promises as fs } from 'fs';

const makeGen = (initialVal:number, multiplicand:number) => {
  return function* generator() {
    let prev = initialVal;
    while (true) {
      const product = prev * multiplicand;
      prev = product % 2147483647;
      yield prev;
    }
  };
};

const multipleGen = (initialVal:number, multiplicand:number, multipleOf: number) => {
  const gen = makeGen(initialVal, multiplicand)();
  return function* multGenerator() {
    while (true) {
      let val:number;
      do {
        val = gen.next().value;
      } while(val % multipleOf !== 0)
      yield val;
    }
  };
};

const part1 = (aStart:number, bStart:number) => {
  const genA = makeGen(aStart, 16807)();
  const genB = makeGen(bStart, 48271)();
  
  let judge = 0;
  for(let i = 0; i < 40000000; i++) {
    const [a, b] = [genA.next().value, genB.next().value];
    if((a & 0xffff) === (b & 0xffff))
      judge++;
  }

  console.log(`Part 1 : Found ${judge} matches`);
};

const part2 = (aStart:number, bStart:number) => {
  const genA = multipleGen(aStart, 16807, 4)();
  const genB = multipleGen(bStart, 48271, 8)();
  
  let judge = 0;
  for(let i = 0; i < 5000000; i++) {
    const [a, b] = [genA.next().value, genB.next().value];
    if((a & 0xffff) === (b & 0xffff))
      judge++;
  }
  console.log(`Part 2 : Found ${judge} matches`)
}

(async () => {
  const allInput = await fs.readFile('./days/15/input', { encoding: 'utf-8'});
  const test = await fs.readFile('./days/15/test', { encoding: 'utf-8'});
  
  const [aStart, bStart] = allInput.split('\n').map(val => parseInt(val, 10))
  const [aTest, bTest] = test.split('\n').map(val => parseInt(val, 10))

  part1(aStart, bStart); // 612
  part2(aStart, bStart); // 285
})();