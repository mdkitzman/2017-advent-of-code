import { promises as fs } from 'fs';
import { max } from '../util';

class Entity {
  patrolLength:number;
  iPos:number;
  forward: boolean;
  constructor(patrolLength:number){
    this.patrolLength = patrolLength
    this.iPos = 0;
    this.forward = true;
  }

  step() {
    if(this.iPos == this.patrolLength -1) {
      this.forward = false;
    } else if (this.iPos == 0) {
      this.forward = true;
    }
    this.iPos += this.forward ? 1 : -1;
  }

  reset(delay:number = 0) {
    const cycleLen = (this.patrolLength * 2) - 2;
    const offset = delay % cycleLen;
    this.forward = offset < this.patrolLength;
    this.iPos = this.forward
      ? offset
      : this.patrolLength - (offset % this.patrolLength) - 2
  }

  get position() { return this.iPos; }
}

class Player extends Entity{
  constructor(patrolLength:number){
    super(patrolLength);
    this.iPos = -1;
  }

  step() {
    this.iPos++;
  }

  reset(delay:number = 0) {
    this.iPos = -1;
  }

}

const part1 = (input:string) => {

  const layers = input.split('\n').map(line => line.split(': '));
  const maxLayer = layers.map(layer => layer[0]).map(v => parseInt(v, 10)).reduce(max);

  const scanners:{[k:string]:{depth:number,scanner:Entity}} = {};
  layers.forEach(layer => {
    scanners[layer[0]] = {
      depth: parseInt(layer[1]),
      scanner: new Entity(parseInt(layer[1]))
    };
  });

  let cost=0;
  const player = new Player(maxLayer);
  for(let iLayer = 0; iLayer <= maxLayer; iLayer++) {
    player.step();
    const scannedLayer = scanners[String(iLayer)] 
    if(scannedLayer && scannedLayer.scanner.position === 0){
      // we  landed on a scanner!
      cost += iLayer * scannedLayer.depth;
    }
    Object.entries(scanners).forEach(([_, scannedLayer]) => scannedLayer.scanner.step() );
  }

  console.log(`Part 1 : Total cost of the trip was ${cost}`);
};

const part2 = (input:string) => {
  const layers = input.split('\n').map(line => line.split(': '));
  const maxLayer = layers.map(layer => layer[0]).map(v => parseInt(v, 10)).reduce(max);

  const scanners:{[k:string]:{depth:number,scanner:Entity}} = {};
  layers.forEach(layer => {
    scanners[layer[0]] = {
      depth: parseInt(layer[1]),
      scanner: new Entity(parseInt(layer[1]))
    };
  });

  let caught = false;
  let delay = 0;
  const player = new Player(maxLayer);
  do {
    caught = false;
    for(let i = 0; player.position <= maxLayer; i++) {
      player.step();
      const scannedLayer = scanners[String(player.position)] 
      if(scannedLayer && scannedLayer.scanner.position === 0){
        // we  landed on a scanner!
        caught = true;
        break;
      }
      Object.entries(scanners).forEach(([_, scannedLayer]) => scannedLayer.scanner.step() );
    }
    if(caught) {
      delay++;
      player.reset(delay);
      Object.entries(scanners).forEach(([_, scannedLayer]) => scannedLayer.scanner.reset(delay) );
    }
  } while (caught)

  console.log(`Part 2 : Delay the packet by ${delay} picoseconds to not get caught` )
}

(async () => { 
  const allInput = await fs.readFile('./days/13/input', { encoding: 'utf-8'});
  const test = await fs.readFile('./days/13/test', { encoding: 'utf-8'});

  part1(allInput); // cost of 1728
  part2(allInput); // delay by 3,946,838 picoseconds
})();