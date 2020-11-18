import { promises as fs } from 'fs';
import { sum } from '../util';
type inputLine = [string, number, string[]|undefined];

const lineMatcher = /([a-z]+) \((\d+)\)(?:$| -> (.*)$)/;
class Node {
  name:string;
  _weight:number;
  children:Node[];
  parent?:Node

  constructor(name:string, weight:number, children:Node[], parent?:Node){
    this.name = name;
    this._weight = weight;
    this.children = children;
    this.parent = parent;
  }

  addChild(node:Node) {
    this.children.push(node);
    node.parent = this;
  }

  find(name:string):Node|undefined {
    if(this.name === name)
      return this;
    for(let child of this.children) {
      const found = child.find(name);
      if(found)
        return found;
    }
  }

  get individualWeight():number {
    return this._weight;
  }

  get weight():number {
    return this._weight + this.children.map(c => c.weight).reduce(sum, 0);
  }

  get balanced():boolean {
    if(this.children.length === 0)
      return true;
    const totalWeights = this.children.map(c => c.weight).reduce(sum, 0) / this.children.length;
    return this.children.map(c => c.weight === totalWeights ? 0 : 1).reduce(sum, 0) === 0;
  }

}

const parseInput = (input:string): inputLine[] => 
  input.split('\n')
  .map(line => {
    const matches = lineMatcher.exec(line);
    return matches;
  })
  .map(matches => {
    if(matches)
      return [matches[1], parseInt(matches[2]), matches[3]?.split(', ')]
    else
      return ['', 0, undefined];
  });

const parseTree = (input:string): Node => {
  const inputLines = parseInput(input);
  const root:Node = new Node('__root__', -1, []);
  const allEntries:Node[] = inputLines
    .map(inputLine => new Node(inputLine[0], inputLine[1], [], root));
  root.children = allEntries;
    
  inputLines.filter(line => line[2] !== undefined)
    .forEach(lineWithChildren => {
      const parentNode = root.find(lineWithChildren[0]);
      if (!parentNode) {
        throw `Could not find node with name ${lineWithChildren[0]}`;
      }
      lineWithChildren[2]?.forEach(nodeName => {
        const childNode = root.find(nodeName);
        if (!childNode) {
          throw `Could not find node with name ${nodeName}`;
        }
        parentNode.addChild(childNode);
        
        const index = root.children.findIndex(node => node.name === nodeName);
        root.children.splice(index, 1);
      });
    });
  const realRoot = root.children[0];
  delete realRoot.parent;
  
  return realRoot;
}

const part1 = (input) => {
  const root = parseTree(input);
  
  console.log(`Part 1 : Root of the program is ${root.name}`);
};

const part2 = (input) => {
  const root = parseTree(input);
  
  const findUnbalanced = (node:Node):Node|undefined => {
    if(node.balanced)
      return;
    for(let child of node.children) {
      let found = findUnbalanced(child);
      if(found)
        return found;
    }
    return node;
  }
  
  const unbalancedNode = findUnbalanced(root);
  if(!unbalancedNode) throw "Puke!";

  const childrenWeights = unbalancedNode.children.map(c => c.weight);
  const weightCounts:{[k:string]: number} = childrenWeights.reduce(function (acc, curr) {
    acc[curr] ? acc[curr]++ : acc[curr] = 1;
    return acc;
  }, {});
  const uniqueWeight = Object.entries(weightCounts).filter(([_, count]) => count === 1).map(([weight, _]) => parseInt(weight, 10))[0]
  const problemNode = unbalancedNode.children.find(c => c.weight === uniqueWeight);
  if(!problemNode) throw "No Problem!";

  const nonUniqueWeight = childrenWeights.filter(w => w !== uniqueWeight)[0];

  const diff = nonUniqueWeight - uniqueWeight;
  
  console.log(`Part 2 : To balance the tree, add ${diff} to '${problemNode.name}' for an individual weight of ${problemNode.individualWeight + diff}`)
}

(async () => {
  const allInput = await fs.readFile('./days/7/input', { encoding: 'utf-8'});
  
  part1(allInput);
  part2(allInput);
})();