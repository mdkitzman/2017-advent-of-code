import { knotNumbers, knotHash } from '../util';

const part1 = (input:number[]) => {
  const [numbers] = knotNumbers(input);
  const result = numbers[0] * numbers[1];
  console.log(`Part 1 : first two numbers multiplied is ${result}`);
};

const part2 = (input:string) => {
  const hash = knotHash(input);
  console.log(`Part 2 : Hash result is ${hash}`);
}

(async () => {
  const allInput = "31,2,85,1,80,109,35,63,98,255,0,13,105,254,128,33"; 
  
  part1(allInput.split(',').map(v => parseInt(v, 10))); // 6952
  part2(allInput); // 28e7c4360520718a5dc811d3942cf1fd
})();