import {
  union, has, keys, isObject,
} from 'lodash';

const nodeActions = [
  {
    check: (dataBefore, dataAfter, key) => isObject(dataBefore[key]) && isObject(dataAfter[key]),
    action: (dataBefore, dataAfter, key, f) => ({
      key,
      status: 'nested',
      children: f(dataBefore, dataAfter),
    }),
  },
  {
    check: (dataBefore, _dataAfter, key) => !has(dataBefore, key),
    action: (_dataBefore, dataAfter, key) => ({
      key,
      status: 'added',
      value: dataAfter,
    }),
  },
  {
    check: (_dataBefore, dataAfter, key) => !has(dataAfter, key),
    action: (dataBefore, _dataAfter, key) => ({
      key,
      status: 'removed',
      value: dataBefore,
    }),
  },
  {
    check: (dataBefore, dataAfter, key) => dataBefore[key] === dataAfter[key],
    action: (dataBefore, _dataAfter, key) => ({
      key,
      status: 'unchanged',
      value: dataBefore,
    }),
  },
  {
    check: (dataBefore, dataAfter, key) => dataBefore[key] !== dataAfter[key],
    action: (dataBefore, dataAfter, key) => ({
      key,
      status: 'changed',
      valueBefore: dataBefore,
      valueAfter: dataAfter,
    }),
  },
];

const getNodeAction = (dataBefore, dataAfter, key) => nodeActions.find(
  ({ check }) => check(dataBefore, dataAfter, key),
);

const buildAst = (dataBefore, dataAfter) => {
  const uniqKeys = union(keys(dataBefore), keys(dataAfter)).sort();
  const ast = uniqKeys.map((key) => {
    const { action } = getNodeAction(dataBefore, dataAfter, key);
    return action(dataBefore[key], dataAfter[key], key, buildAst);
  });
  return ast;
};

export default buildAst;
