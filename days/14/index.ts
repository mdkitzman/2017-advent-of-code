import Graph from 'graphology';
import { knotHash, dec2bin, sum, subGraphCount } from '../util';

const hexHash2bin = (hash:string):string[] => hash.split('')
    .map(hex => parseInt(hex, 16))
    .map(num => dec2bin(num, 4))
    .map(binStr => binStr.split(''))
    .flat();

const part1 = (input:string) => {
  let count = 0;
  for(let i = 0; i < 128; i++) {
    const hash = knotHash(`${input}-${i}`);
    const binary = hexHash2bin(hash);
    count += binary
      .map(num => parseInt(num, 10))
      .reduce(sum, 0)
  }

  console.log(`Part 1 : The number of used squares is ${count}`);
};

const part2 = (input:string) => {
  const grid:string[][] = [];
  const graph = new Graph();

  const key = (iRow:number, iCol:number) => `[${iRow}][${iCol}]`;

  // populate the grid with binary and graph with nodes.
  for(let iRow = 0; iRow < 128; iRow++) {
    const hash = knotHash(`${input}-${iRow}`);
    const binary = hexHash2bin(hash);
    grid.push(binary);
    binary.forEach((b, iColumn) => {
      if(b === "1") {
        graph.addNode(key(iRow, iColumn));
      }
    });
  }
  
  // Build up the graph edges
  for(let iRow = 0; iRow < 128; iRow++) {
    for(let iColumn = 0; iColumn < 128; iColumn++) {
      if(grid[iRow][iColumn] !== "1") {
        continue;
      }
      graph.addUndirectedEdge(key(iRow, iColumn), key(iRow, iColumn));
      //check next neighbor
      if(iColumn < 127 && grid[iRow][iColumn+1] === "1") {
        graph.addUndirectedEdge(key(iRow, iColumn), key(iRow, iColumn+1));
      }
      //check below neighbor
      if(iRow < 127 && grid[iRow+1][iColumn] === "1") {
        graph.addUndirectedEdge(key(iRow, iColumn), key(iRow+1, iColumn));
      }
    }
  }

  // count the number of graphs
  const count = subGraphCount(graph);

  console.log(`Part 2 : There are ${count} regions present`)
}

(async () => {
  const allInput = 'wenycdww';
  const test = 'flqrgnkx';

  part1(allInput); // 8226
  part2(allInput); // 1128
})();