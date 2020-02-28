import path from 'path';
import fs from 'fs';
import {
  union, has, keys, isObject,
} from 'lodash';
import parser from './parsers';

const parseObject = (pathToObject) => parser(fs.readFileSync(pathToObject, 'utf-8'), path.extname(pathToObject));

const getStatus = (before, after, key) => {
  if (has(before, key) && !has(after, key)) {
    return 'removed';
  }
  if (!has(before, key) && has(after, key)) {
    return 'added';
  }
  if (isObject(before[key]) && isObject(after[key])) {
    return 'nested';
  }
  if (has(before, key) && has(after, key) && before[key] !== after[key]) {
    return 'changed';
  }
  return 'unchanged';
};

const getValueBasedOnStatus = (first, second, key) => {
  const status = getStatus(first, second, key);
  switch (status) {
    case 'removed':
      return { [key]: first[key] };
    case 'added':
      return { [key]: second[key] };
    case 'changed':
      return {
        valueBefore: { [key]: first[key] },
        valueAfter: { [key]: second[key] },
      };
    case 'unchanged':
      return { [key]: first[key] };
    default:
      return {};
  }
};

const buildAST = (before, after) => {
  const beforeFile = parseObject(before);
  const afterFile = parseObject(after);
  const getAstState = (first, second) => {
    const uniqKeys = union(keys(first), keys(second)).sort();
    return uniqKeys.reduce((acc, key) => {
      const status = getStatus(first, second, key);
      const processedChildrens = status === 'nested'
        ? getAstState(first[key], second[key]) : [];
      return [...acc,
        {
          key,
          status,
          value: getValueBasedOnStatus(first, second, key),
          children: [processedChildrens],
        }];
    }, []);
  };
  const astState = getAstState(beforeFile, afterFile);
  return astState;
};

export default buildAST;
