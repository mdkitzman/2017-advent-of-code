import { promises as fs } from 'fs';

enum HexDirection {
  // These map to the doubleheight_directions 
  se, ne, n, nw, sw, s
}

const doubleheight_directions:CartesianCoord[] = [
  { col:+1, row:+1 }, { col:+1, row:-1 }, { col:0, row: -2 }, 
  { col:-1, row:-1 }, { col:-1, row:+1 }, { col:0, row: +2 }, 
]

interface CartesianCoord {
  row:number,
  col:number
}

const addPoints = (a: CartesianCoord, b: CartesianCoord):CartesianCoord => {
  return {col: a.col + b.col, row: a.row + b.row };
}

const cartesianDistance = (a:CartesianCoord, b:CartesianCoord):number =>{
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return dx + Math.max(0, (dy - dx) / 2);
}

const part1 = (input:string) => {

  const path:HexDirection[] = input.split(',').map(dir => HexDirection[dir]);
  
  const start:CartesianCoord = {row:0, col:0};
  const end:CartesianCoord = path
                              .map(dir => doubleheight_directions[dir])
                              .reduce(addPoints, start);
  
  console.log(`Part 1 : End is ${JSON.stringify(end)} with a distance of ${cartesianDistance(start, end)}`);
};

const part2 = (input:string) => {
  const path:HexDirection[] = input.split(',').map(dir => HexDirection[dir]);
  
  let maxDistance = 0;
  const start:CartesianCoord = {row:0, col:0};
  let curPos:CartesianCoord = {row:0, col:0}
  path
    .map(dir => doubleheight_directions[dir])
    .forEach(neighbor => {
      curPos = addPoints(curPos, neighbor);
      const dist = cartesianDistance(start, curPos);
      maxDistance = Math.max(maxDistance, dist);
    });

  console.log(`Part 2 : Max distance of ${maxDistance}`);
}

(async () => {
  const allInput = await fs.readFile('./days/11/input', { encoding: 'utf-8'});
    
  part1(allInput); // distance of 685
  part2(allInput); // max distance of 1457
})();