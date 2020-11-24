import { promises as fs } from 'fs';

enum HexDirection {
  // These map to the doubleheight_directions 
  se, ne, n, nw, sw, s
}

const doubleheight_directions = [
  [+1, +1], [+1, -1], [ 0, -2], 
  [-1, -1], [-1, +1], [ 0, +2], 
]

interface CartesianCoord {
  row:number,
  col:number
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
                              .map(neighbor => ({col: neighbor[0], row: neighbor[1]}))
                              .reduce((prev, cur) => ({col:prev.col+cur.col, row:prev.row + cur.row}), start);
  
  console.log(`Part 1 : End is ${JSON.stringify(end)} with a distance of ${cartesianDistance(start, end)}`);
};

const part2 = (input:string) => {
  const path:HexDirection[] = input.split(',').map(dir => HexDirection[dir]);
  
  let maxDistance = 0;
  const start:CartesianCoord = {row:0, col:0};
  const curPos:CartesianCoord = {row:0, col:0}
  path
    .map(dir => doubleheight_directions[dir])
    .map(neighbor => ({col: neighbor[0], row: neighbor[1]}))
    .forEach(neighbor => {
      curPos.row += neighbor.row;
      curPos.col += neighbor.col;
      const dist = cartesianDistance(start, curPos);
      maxDistance = Math.max(maxDistance, dist);
    });

  console.log(`Part 2 : Max distance of ${maxDistance}`);
}

(async () => {
  const allInput = await fs.readFile('./days/11/input', { encoding: 'utf-8'});
    
  part1(allInput);
  part2(allInput);
})();