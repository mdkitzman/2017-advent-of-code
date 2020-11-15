import { promises as fs } from 'fs';
import { sum } from './util';

const part1 = (phrases:string[]) => {

  const isValidPassphrase = (phrase:string): boolean => {
    const words = phrase.split(' ');
    const uniqueWords = new Set(words);
    return uniqueWords.size === words.length;
  }
  
  const countValid = phrases
    .map(isValidPassphrase)
    .map(valid => valid ? 1 : 0)
    .reduce(sum, 0);
  console.log(`Part 1 : There are ${countValid} vailid passphrases out of ${phrases.length}`);
};

const part2 = (phrases:string[]) => {
  const isValidPassphrase = (phrase:string): boolean => {
    const words = phrase.split(' ')
      .map(word => Array.from(word).sort().join(''))
    const uniqueWords = new Set(words);
    return uniqueWords.size === words.length;
  }

  const countValid = phrases
    .map(isValidPassphrase)
    .map(valid => valid ? 1 : 0)
    .reduce(sum, 0);
  console.log(`Part 2 : There are ${countValid} vailid passphrases out of ${phrases.length}`);
}

(async () => {

  const allPhrases = await fs.readFile('./days/4.input', { encoding: 'utf-8'});
  const phrases = allPhrases.split('\n');

  part1(phrases);
  part2(phrases);

})();