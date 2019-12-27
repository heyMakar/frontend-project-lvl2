import fs from 'fs';
import path from 'path';
import { union, has, keys } from 'lodash';

const parseFile = (fileName) => {
  const pathToFile = path.resolve(fileName);
  const read = fs.readFileSync(pathToFile);
  const parse = JSON.parse(read);
  return parse;
};

const genDiff = (firstFile, secondFile) => {
  const parseFirst = parseFile(firstFile);
  const parseSecond = parseFile(secondFile);
  const uniq = union(keys(parseFirst), keys(parseSecond));
  const mapped = uniq.reduce((acc, key) => {
    const firstValue = parseFirst[key];
    const secondValue = parseSecond[key];
    if (has(parseFirst, key) && has(parseSecond, key) && firstValue === secondValue) {
      return [...acc, `  ${key}: ${firstValue}`];
    }
    if (has(parseFirst, key) && has(parseSecond, key) && firstValue !== secondValue) {
      return [...acc, `+ ${key}: ${secondValue}`, `- ${key}: ${firstValue}`];
    }
    if (!has(parseFirst, key) && has(parseSecond, key)) {
      return [...acc, `+ ${key}: ${secondValue}`];
    }
    return [...acc, `- ${key}: ${firstValue}`];
  }, []);
  mapped.unshift('{');
  mapped.push('}');
  return mapped.join('\n');
};

export default genDiff;
