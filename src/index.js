import { union, has, keys } from 'lodash';
import path from 'path';
import parseFile from './parsers';

const genDiff = (firstFile, secondFile) => {
  const getTypeFirst = path.extname(firstFile);
  const getTypeSecond = path.extname(secondFile);
  const parseFirst = parseFile(firstFile, getTypeFirst);
  const parseSecond = parseFile(secondFile, getTypeSecond);
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
