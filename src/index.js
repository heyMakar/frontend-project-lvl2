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
  const result = [];
  const mapped = uniq.map((key) => {
    const firstValue = parseFirst[key];
    const secondValue = parseSecond[key];
    if (has(parseFirst, key) && has(parseSecond, key) && firstValue === secondValue) {
      result.push(`  ${key}: ${firstValue}`);
    }
    if (has(parseFirst, key) && has(parseSecond, key) && firstValue !== secondValue) {
      result.push(`+ ${key}: ${secondValue}`);
      result.push(`- ${key}: ${firstValue}`);
    }
    if (!has(parseFirst, key) && has(parseSecond, key)) {
      result.push(`+ ${key}: ${secondValue}`);
    }
    if (has(parseFirst, key) && !has(parseSecond, key)) {
      result.push(`- ${key}: ${firstValue}`);
    }
  });
  result.unshift('{');
  result.push('}');
  return result.join('\n');
};

export default genDiff;
