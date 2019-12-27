import fs from 'fs';
import path from 'path';
import { union, has } from 'lodash';

export const parseFile = (fileName) => {
  const pathToFile = path.resolve(fileName);
  const read = fs.readFileSync(pathToFile);
  const parse = JSON.parse(read);
  return parse;
};

const genDiff = (firstFile, secondFile) => {
  const parseFirst = parseFile(firstFile);
  const parseSecond = parseFile(secondFile);
  const firstKeys = Object.keys(parseFirst);
  const secondKeys = Object.keys(parseSecond);
  const uniq = union(firstKeys, secondKeys);
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
    if (has(parseFirst, key) && !has(parseSecond, key)) {
      return [...acc, `- ${key}: ${firstValue}`];
    }
    return acc;
  }, []);
  mapped.unshift('{');
  mapped.push('}');
  return mapped.join('\n');
};

export default genDiff;
