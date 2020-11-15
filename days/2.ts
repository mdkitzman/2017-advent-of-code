import { sum } from './util';
/*
--- Day 2: Corruption Checksum ---

-- Part 1 --
As you walk through the door, a glowing humanoid shape yells in your direction. 
"You there! Your state appears to be idle. Come help us repair the corruption in this spreadsheet 
- if we take another millisecond, we'll have to display an hourglass cursor!"

The spreadsheet consists of rows of apparently-random numbers. 
To make sure the recovery process is on the right track, they need you to calculate the spreadsheet's checksum. 
For each row, determine the difference between the largest value and the smallest value; the checksum is the sum of all of these differences.

For example, given the following spreadsheet:

5 1 9 5
7 5 3
2 4 6 8
The first row's largest and smallest values are 9 and 1, and their difference is 8.
The second row's largest and smallest values are 7 and 3, and their difference is 4.
The third row's difference is 6.
In this example, the spreadsheet's checksum would be 8 + 4 + 6 = 18.

What is the checksum for the spreadsheet in your puzzle input?

--- Part Two ---
"Great work; looks like we're on the right track after all. Here's a star for your effort." 
However, the program seems a little worried. Can programs be worried?

"Based on what we're seeing, it looks like all the User wanted is some information about the 
evenly divisible values in the spreadsheet. Unfortunately, none of us are equipped for that kind 
of calculation - most of us specialize in bitwise operations."

It sounds like the goal is to find the only two numbers in each row where one evenly divides the other 
- that is, where the result of the division operation is a whole number. 
They would like you to find those numbers on each line, divide them, and add up each line's result.

For example, given the following spreadsheet:

5 9 2 8
9 4 7 3
3 8 6 5
In the first row, the only two numbers that evenly divide are 8 and 2; the result of this division is 4.
In the second row, the two numbers are 9 and 3; the result is 3.
In the third row, the result is 2.
In this example, the sum of the results would be 4 + 3 + 2 = 9.

What is the sum of each row's result in your puzzle input?
*/
type Spreadsheet = number[][];
const sheet1:Spreadsheet = [[5,1,9,5],[7,5,3],[2,4,6,8]];
const sheet2:Spreadsheet = [[5,9,2,8],[9,4,7,3],[3,8,6,5]];
const questionSheet:Spreadsheet = [
  [104,240,147,246,123,175,372,71,116,230,260,118,202,270,277,292],
  [740,755,135,205,429,822,844,90,828,115,440,805,526,91,519,373],
  [1630,991,1471,1294,52,1566,50,1508,1367,1489,55,547,342,512,323,51],
  [1356,178,1705,119,1609,1409,245,292,1434,694,405,1692,247,193,1482,1407],
  [2235,3321,3647,212,1402,3711,3641,1287,2725,692,1235,3100,123,144,104,101],
  [1306,1224,1238,186,751,734,1204,1275,366,149,1114,166,1118,239,153,943],
  [132,1547,1564,512,2643,2376,2324,2159,1658,107,1604,145,2407,131,2073,1878],
  [1845,91,1662,108,92,1706,1815,1797,1728,1150,1576,83,97,547,1267,261],
  [78,558,419,435,565,107,638,173,93,580,338,52,633,256,377,73],
  [1143,3516,4205,3523,148,401,3996,3588,300,1117,2915,1649,135,134,182,267],
  [156,2760,1816,2442,2985,990,2598,1273,167,821,138,141,2761,2399,1330,1276],
  [3746,3979,2989,161,4554,156,3359,173,3319,192,3707,264,762,2672,4423,2924],
  [3098,4309,4971,5439,131,171,5544,595,154,571,4399,4294,160,6201,4329,5244],
  [728,249,1728,305,2407,239,691,2241,2545,1543,55,2303,1020,753,193,1638],
  [260,352,190,877,118,77,1065,1105,1085,1032,71,87,851,56,1161,667],
  [1763,464,182,1932,1209,640,545,931,1979,197,1774,174,2074,1800,939,161],
]

const findRowMinMax = (rowData:number[]): number[] => rowData
  .map(val => [val, val])
  .reduce((prev, cur) => [Math.min(prev[0], cur[0]), Math.max(prev[1], cur[1])]);

const findRowDivisors = (rowData:number[]): number[] => rowData
  .map((val1, index1) => {
    const factorsOfVal1 = rowData.filter((val2, index2) => index1 != index2 && val1 % val2 === 0);
    return [val1, ...factorsOfVal1];
  })
  .filter(entries => entries.length > 1)
  .flat();

const subtractMinMax = ([min, max]: number[]): number => Math.abs(max - min);
const divide = ([val1, val2]: number[]):number => val1 / val2;

const calcChecksum = (data: Spreadsheet): number => data
  .map(findRowMinMax)
  .map(subtractMinMax)
  .reduce(sum, 0); 

const calcDivsorSum = (data: Spreadsheet): number => data
  .map(findRowDivisors)
  .map(divide)
  .reduce(sum, 0);


const day2 = () => {
  const input1: [Spreadsheet, number][] = [
    [ sheet1, 18 ],
    [ questionSheet, -1 ]
  ];
  
  input1.forEach(([spreadsheet, expectedChecksum]) => {
    const checksum = calcChecksum(spreadsheet);
    if(expectedChecksum > 0) {
      const isEqual = checksum === expectedChecksum;
      console.log(`Input 1 '${spreadsheet}' produces the expected result of ${expectedChecksum}: ${isEqual}`);
    } else {
      console.log(`Input 1 produced the result ${checksum}`);
    }
  });

  const input2: [Spreadsheet, number][] = [
    [ sheet2, 9],
    [ questionSheet, -1]
  ];

  input2.forEach(([spreadsheet, expectedChecksum]) => {
    const checksum = calcDivsorSum(spreadsheet);
    if(expectedChecksum > 0) {
      const isEqual = checksum === expectedChecksum;
      console.log(`Input 2 '${spreadsheet}' produces the expected result of ${expectedChecksum}: ${isEqual}`);
    } else {
      console.log(`Input 2 produced the result ${checksum}`);
    }
  });
}

day2();