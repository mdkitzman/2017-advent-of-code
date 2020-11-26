import { promises as fs } from 'fs';
import Graph from 'graphology';
import {bfsFromNode} from 'graphology-traversal'

const getGraph = (input:string):Graph => {
  const graph = new Graph();

  const lines = input.split('\n');
  lines.forEach((_, index) => graph.addNode(String(index)));
  lines
    .map(line => line.split(' <-> ')[1].split(', '))
    .forEach((connections:string[], index) => {
      const from = String(index);
      connections.forEach(to => graph.addEdge(from, to));
    });
  return graph;
}

const part1 = (input:string) => {
  const graph = getGraph(input);
  
  let counter = 0;
  bfsFromNode(graph, '0', () => counter++);

  console.log(`Part 1 : from 0 - ${counter}`);
};

const part2 = (input:string) => {
  const graph = getGraph(input);

  const visitedNodes = [...Array(graph.order).keys()].map(val => String(val));

  let counter = 0;
  while (visitedNodes.length > 0) {
    const start:string = visitedNodes.shift()!;
    bfsFromNode(graph, start, (node) => {
      const index = visitedNodes.indexOf(node as string);
      if(index >= 0)
        visitedNodes.splice(index, 1);
    });
    counter++;
  }

  console.log(`Part 2 : Therea are ${counter} graphs found`)
}

(async () => {
  const allInput = await fs.readFile('./days/12/input', { encoding: 'utf-8'});
  const test = await fs.readFile('./days/12/test', { encoding: 'utf-8'});
  
  part1(allInput); // 145
  part2(allInput); // 207
})();