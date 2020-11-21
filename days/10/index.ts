import { reverse } from 'lodash';

const knotNumbers = (lengths:number[], numbers = [...Array(256).keys()], curPos:number = 0, skip:number = 0):[number[], number, number] => {
  // Very much taken from https://www.reddit.com/r/adventofcode/comments/7irzg5/2017_day_10_solutions/
  for (const len of lengths) {
    if (len > 1) {
      numbers = [...numbers.slice(curPos), ...numbers.slice(0, curPos)];    // shift curPos to the beginning of the array.
      numbers = [...numbers.slice(0, len).reverse(), ...numbers.slice(len)];// reverse the requesite length of numbers
      numbers = [...numbers.slice(-curPos), ...numbers.slice(0, -curPos)];  // shift the beginning back to its original curPos
    }
    curPos = (curPos + len + skip++) % 256;
  }

  return [numbers, curPos, skip];
}

const part1 = (input:number[]) => {
  const [numbers] = knotNumbers(input);
  const result = numbers[0] * numbers[1];
  console.log(`Part 1 : first two numbers multiplied is ${result}`);
};

const part2 = (input:string) => {
  const bytes:number[] = input.split('').map(c => c.charCodeAt(0));
  bytes.push(17, 31, 73, 47, 23);

  let numbers: number[] = [...Array(256).keys()]
  let curPos = 0, len = 0;
  for(let iRound = 0; iRound < 64; iRound++) {
    [numbers, curPos, len] = knotNumbers(bytes, numbers, curPos, len);
  }
  
  const zeropad = (n:string) => ("0" + n).substr(-2);
  const hash = [...Array(16).keys()]
    .map(i => numbers.slice(i * 16, i * 16 + 16).reduce((a, b) => a ^ b))
    .map(n => zeropad(n.toString(16)))
    .join("")
  
  
  console.log(`Part 2 : Hash result is ${hash}`);
}

(async () => {
  const allInput = "31,2,85,1,80,109,35,63,98,255,0,13,105,254,128,33"; 
  
  part1(allInput.split(',').map(v => parseInt(v, 10))); // 6952
  part2(allInput); // 28e7c4360520718a5dc811d3942cf1fd
})();