import { union, has, keys } from 'lodash';
import path from 'path';
import fs from 'fs';
import parse from './parsers';

const parseObject = (toObjectPath) => parse(fs.readFileSync(toObjectPath, 'utf-8'), path.extname(toObjectPath));

const genDiff = (firstFile, secondFile) => {
  const parseFirst = parseObject(firstFile);
  const parseSecond = parseObject(secondFile);
  const uniq = union(keys(parseFirst), keys(parseSecond));
  const mapped = uniq.reduce((acc, key) => {
    const firstValue = parseFirst[key];
    const secondValue = parseSecond[key];
    if (has(parseFirst, key) && has(parseSecond, key) && firstValue === secondValue) {
      return [...acc, `    ${key}: ${firstValue}`];
    }
    if (has(parseFirst, key) && has(parseSecond, key) && firstValue !== secondValue) {
      return [...acc, `  + ${key}: ${secondValue}`, `  - ${key}: ${firstValue}`];
    }
    if (!has(parseFirst, key) && has(parseSecond, key)) {
      return [...acc, `  + ${key}: ${secondValue}`];
    }
    return [...acc, `  - ${key}: ${firstValue}`];
  }, []);
  mapped.unshift('{');
  mapped.push('}');
  return mapped.join('\n');
};


export default genDiff;
