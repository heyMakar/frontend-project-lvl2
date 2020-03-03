import {
  union, has, keys, isObject,
} from 'lodash';

const getStatus = (before, after, key) => {
  const value1 = before[key];
  const value2 = after[key];
  const checkBeforeProperty = has(before, key);
  const checkAfterProperty = has(after, key);
  if (checkBeforeProperty && !checkAfterProperty) {
    return 'removed';
  }
  if (!checkBeforeProperty && checkAfterProperty) {
    return 'added';
  }
  if (isObject(value1) && isObject(value2)) {
    return 'nested';
  }
  if (checkBeforeProperty && checkAfterProperty && value1 !== value2) {
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
  const astState = getAstState(before, after);
  return astState;
};

export default buildAST;
