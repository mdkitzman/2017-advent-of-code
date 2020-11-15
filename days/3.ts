import { sum } from './util';
/*
--- Day 3: Spiral Memory ---
You come across an experimental new kind of memory stored on an infinite two-dimensional grid.

Each square on the grid is allocated in a spiral pattern starting at a location marked 1 and 
then counting up while spiraling outward. For example, the first few squares are allocated 
like this:

17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...

While this is very space-efficient (no squares are skipped), requested data must be carried 
back to square 1 (the location of the only access port for this memory system) by programs that 
can only move up, down, left, or right. They always take the shortest path: 
the Manhattan Distance between the location of the data and square 1.

For example:

Data from square 1 is carried 0 steps, since it's at the access port.
Data from square 12 is carried 3 steps, such as: down, left, left.
Data from square 23 is carried only 2 steps: up twice.
Data from square 1024 must be carried 31 steps.
Data from square 83 must be carried 8 steps.
How many steps are required to carry the data from the square identified in your puzzle input all the way to the access port?
*/

/*
-------- Solution Approach -------

Thiking about the spiral of number in terms of the number of rotations from 1 in the cardinal directions, you
get a serires of numbers in each direction, starting with east since that is the first move after 1.

Rotations | 0 | 1 | 2  | 3  | 4  | ...
-----------------------------------
east      | 1 | 2 | 11 | 28 | 53 | ...
north     | 1 | 4 | 15 | 34 | 61 | ...
west      | 1 | 6 | 19 | 40 | 65 | ... 
south     | 1 | 8 | 23 | 46 | 77 | ...

Finding the shortest path to 1 means finding the shortest distance to one of these cardinal directions and
adding on the number of rotations away from 1 that cardinal number is.

Turns out you can represent the series of numbers to the east as
east(r) = (2r - 1)^2 + r
where r is the number of rotations, or the radius of the spiral

i.e. a radius of 1 gives a "square" like this

1 2

and a radius of 3 gives a "square" like this

17  16  15  14  13
18   5   4   3  12
19   6   1   2  11  28
20   7   8   9  10  27
21  22  23  24  25  26

*/
const east  = (radius:number):number => Math.pow(((radius * 2) - 1), 2) + radius;
const north = (radius:number):number => east(radius) + 2*radius;
const west  = (radius:number):number => east(radius) + 4*radius;
const south = (radius:number):number => east(radius) + 6*radius;

const maxRadius = (value:number):number => {
  let maxRadius = 0;
  let eastNum = 0;
  while((eastNum = east(maxRadius)) < value) {
    maxRadius++;
  } 
  return maxRadius;
}

const optimalDistanceTo1 = (fromValue:number):number => {
  const r = maxRadius(fromValue);

  const minDiffMinus1 = Math.min(...[north(r-1), south(r-1), east(r-1), west(r-1)].map(directionValue => Math.abs(directionValue - fromValue)));
  const minDiff = Math.min(...[north(r), south(r), east(r), west(r)].map(directionValue => Math.abs(directionValue - fromValue)));
  
  const optimalRadius = minDiff < minDiffMinus1 ? r : r - 1;
  
  const distanceTo1 = optimalRadius + Math.min(minDiffMinus1, minDiff);
  return distanceTo1;
}

/*--- Part Two ---
As a stress test on the system, the programs here clear the grid and then store the value 1 in square 1. 
Then, in the same allocation order as shown above, they store the sum of the values in all adjacent squares, 
including diagonals.

So, the first few squares' values are chosen as follows:

Square 1 starts with the value 1.
Square 2 has only one adjacent filled square (with value 1), so it also stores 1.
Square 3 has both of the above squares as neighbors and stores the sum of their values, 2.
Square 4 has all three of the aforementioned squares as neighbors and stores the sum of their values, 4.
Square 5 only has the first and fourth squares as neighbors, so it gets the value 5.
Once a square is written, its value does not change. Therefore, the first few squares would receive the following values:

147  142  133  122   59
304    5    4    2   57
330   10    1    1   54
351   11   23   25   26
362  747  806--->   ...
What is the first value written that is larger than your puzzle input?
*/

/*
Observations:
- Starting at position 0, the top-left and bottom-right diagonals are all squares.
100 .   .   .   .   .   .   .   .   .   .
.   64  .   .   .   .   .   .   .   .   .
.   .   36  .   .   .   .   .   .   .   .
.   .   .   16  .   .   .   .   .   .   .
.   .   .   .   4   .   .   .   .   .   .
.   .   .   .   .   0   1   .   .   .   .
.   .   .   .   .   .   .   9   .   .   .
.   .   .   .   .   .   .   .   25  .   .
.   .   .   .   .   .   .   .   .   49  .
.   .   .   .   .   .   .   .   .   .   81   
.   .   .   .   .   .   .   .   .   .   .   121

The other diagonal positions are floor(sqrt(i)) steps away from the previous square position.
100 .   .   .   .   .   .   .   .   .   90   
.   64  .   .   .   .   .   .   .   56  .   
.   .   36  .   .   .   .   .   30  .   .   
.   .   .   16  .   .   .   12  .   .   .   
.   .   .   .   4   .   2   .   .   .   .   
.   .   .   .   .   0   1   .   .   .   .   
.   .   .   .   6   .   .   9   .   .   .   
.   .   .   20  .   .   .   .   25  .   .   
.   .   42  .   .   .   .   .   .   49  .   
.   72  .   .   .   .   .   .   .   .   81   
110 .   .   .   .   .   .   .   .   .   .   121

i.e. pos 42 = 36 + 6
since sqrt(42) ~= 6.4807...
Floor this value and square it to find the previous square number, and add the steps away.
  stepsAway = Math.floor(Math.sqrt(42)) = 6
  prevRoot  = Math.pow(Math.floor(Math.sqrt(42)), 2) = 36

If this calculation equals our input, this is on the bottom-left or top-right diagonal.

This doesn't work for 41, since sqrt(41) ~= 6.40312...
Pluggig in 41 we get the same value
  stepsAway = Math.floor(Math.sqrt(42)) = 6
  prevRoot  = Math.pow(Math.floor(Math.sqrt(42)), 2) = 36
but prevRoot + stepsAway = 36 + 6 != 41
*/

const isCorner = (pos: number): boolean => {
  const root = Math.sqrt(pos);
  return Number.isInteger(root) || Math.pow(Math.floor(root),2) + Math.floor(root) === pos;
}

const previousSpiralRoot = (pos:number): number => {
  let prevRoot = Math.floor(Math.sqrt(pos)) - 2;
  if(prevRoot < 0)
    prevRoot = 0
  return Math.pow( prevRoot, 2);
}

const distToLastRoot = (pos:number): number => pos - Math.pow(Math.floor(Math.sqrt(pos)), 2);

const distToLastCorner = (pos:number): number => {
  // I think I have to walk back iteratively.
  let cornerPos = pos;
  while(!isCorner(cornerPos)) {
    cornerPos--;
  }
  return pos - cornerPos;
}

const previousSpiralCorner = (pos:number): number => {
  // pos must be a corner for this to work.
  const root = Math.sqrt(pos);
  if(Number.isInteger(root)) {
    // top-left or bottom-right diagonal
    return Math.pow(root - 2, 2);
  } else {
    // top-right or bottom-left diagonal
    const prevSteps = Math.floor(root) - 2;
    const prevRoot = Math.pow(prevSteps, 2);
    return prevRoot + prevSteps;
  }
}

const nearestNeighbors = (pos:number): number[] => {
  // initial positions
  if(pos === 0) return [];
  if(pos === 1) return [pos - 1];

  // Previous position is always a neighbor
  const neighbors:number[] = [pos - 1];
  
  /* corner positions only has two neighbors:
     - last position (pos - 1)
     - the next diagonal corner
     otherwise, the position should have a 
   */
  if(isCorner(pos)) {
    // there is no horizontal neighbor, only diagonal
    neighbors.push(previousSpiralCorner(pos));
  } else {
    if(isCorner(pos-1)) {
      // When the previous one was a corner, just round the corner
      neighbors.push(pos-2);
      // Horizontal neighbor is the last square position
      const horizontalNeighbor = previousSpiralCorner(pos-1);
      neighbors.push(horizontalNeighbor);
      if(!isCorner(pos+1)) {
        // we only have this forward diagonal neighbor if the next position is not a corner
        neighbors.push(horizontalNeighbor+1);
      }
    } else {
      // Otherwise, pull out some feaky math to find the diagonal neighbor in the square
      //let horizontalNeighbor = previousSpiralRoot(pos) + distToLastCorner(pos) - 1;
      const lastRootDist = distToLastRoot(pos);
      let horizontalNeighbor = previousSpiralRoot(pos) + lastRootDist
      horizontalNeighbor -= distToLastCorner(pos) != lastRootDist
        ? 3 // We've rounded a corner from the last square root corner, knock off a few extra.
        : 1;
      //early on this result is negative.  Lets keep it neutral!
      if(horizontalNeighbor < 0) {
        horizontalNeighbor = 0;
      }
      // These two neighbors should be in sequence with one another.
      neighbors.push(horizontalNeighbor);
      neighbors.push(horizontalNeighbor-1);
      if(!isCorner(pos+1)) {
        // we only have this forward diagonal neighbor if the next position is not a corner
        neighbors.push(horizontalNeighbor+1);
      }
    }
  }
  
  return neighbors;
};

const constructSquare = (limit:number): number[] => {
  const squareNumbers:number[] = [];
  let i = 0;
  do {
    const neighbors = nearestNeighbors(i);
    const total = neighbors.map(pos => squareNumbers[pos]).reduce(sum, 0) || 1;
    squareNumbers.push(total);
  } while (squareNumbers[i++] <= limit);
  return squareNumbers;
}

const day3 = () => {
  const input1: [number, number][] = [
    [ 1, 0 ],
    [ 12, 3 ],
    [23, 2],
    [1024, 31],
    [325489, -1]
  ];
  input1.forEach(([value, expectedDistance]) => {
    const minDistance = optimalDistanceTo1(value);
    if(expectedDistance >= 0) {
      const isEqual = minDistance === expectedDistance;
      console.log(`Input 1 '${value}' has an optimal distance of ${expectedDistance}: ${isEqual}`);
    } else {
      console.log(`Input 1 '${value}' has an optimal distance of ${minDistance}`);
    }
  });


  const input2: [number, number][] = [
    [1, 2],
    [134, 142],
    [620, 747],
    [325489, -1]
  ];
  input2.forEach(([limit, expectedValue]) => {
    const values = constructSquare(limit);
    const largestValue = values.pop();
    if(expectedValue >= 0) {
      const isEqual = expectedValue === largestValue;
      console.log(`Input 2 limit of '${limit}' wrote ${largestValue} as the largest value: ${isEqual}`);
    } else {
      console.log(`Input 2 limit of'${limit}' wrote ${largestValue} as the largest value`);
    }
  })
};

day3();