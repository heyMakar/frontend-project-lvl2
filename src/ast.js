import {
  union, has, keys, isObject,
} from 'lodash';

const nodeActions = [
  {
    check: (dataBefore, dataAfter, key) => isObject(dataBefore[key]) && isObject(dataAfter[key]),
    action: (dataBefore, dataAfter, key, f) => ({
      key,
      status: 'nested',
      value: {},
      children: [f(dataBefore, dataAfter)],
    }),
  },
  {
    check: (dataBefore, _dataAfter, key) => !has(dataBefore, key),
    action: (_dataBefore, dataAfter, key) => ({
      key,
      status: 'added',
      value: { [key]: dataAfter },
      children: [],
    }),
  },
  {
    check: (_dataBefore, dataAfter, key) => !has(dataAfter, key),
    action: (dataBefore, _dataAfter, key) => ({
      key,
      status: 'removed',
      value: { [key]: dataBefore },
      children: [],
    }),
  },
  {
    check: (dataBefore, dataAfter, key) => dataBefore[key] === dataAfter[key],
    action: (dataBefore, _dataAfter, key) => ({
      key,
      status: 'unchanged',
      value: { [key]: dataBefore },
      children: [],
    }),
  },
  {
    check: (dataBefore, dataAfter, key) => dataBefore[key] !== dataAfter[key],
    action: (dataBefore, dataAfter, key) => ({
      key,
      status: 'changed',
      value: {
        valueBefore: { [key]: dataBefore },
        valueAfter: { [key]: dataAfter },
      },
      children: [],
    }),
  },
];

const getNodeAction = (dataBefore, dataAfter, key) => nodeActions.find(
  ({ check }) => check(dataBefore, dataAfter, key),
);

const astBuilder = (dataBefore, dataAfter) => {
  const uniqKeys = union(keys(dataBefore), keys(dataAfter)).sort();
  const ast = uniqKeys.map((key) => {
    const { action } = getNodeAction(dataBefore, dataAfter, key);
    return action(dataBefore[key], dataAfter[key], key, astBuilder);
  });
  return ast;
};

export default astBuilder;
