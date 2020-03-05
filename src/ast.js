import {
  union, has, keys, isObject,
} from 'lodash';

const getStatus = (dataBefore, dataAfter, key) => {
  const valueBefore = dataBefore[key];
  const valueAfter = dataAfter[key];
  const isValueBeforeExist = has(dataBefore, key);
  const isValueAfterExist = has(dataAfter, key);
  if (isValueBeforeExist && !isValueAfterExist) {
    return 'removed';
  }
  if (!isValueBeforeExist && isValueAfterExist) {
    return 'added';
  }
  if (isObject(valueBefore) && isObject(valueAfter)) {
    return 'nested';
  }
  if (isValueBeforeExist && isValueAfterExist && valueBefore !== valueAfter) {
    return 'changed';
  }
  return 'unchanged';
};

const getValueBasedOnStatus = (data1, data2, key) => {
  const status = getStatus(data1, data2, key);
  switch (status) {
    case 'removed':
      return { [key]: data1[key] };
    case 'added':
      return { [key]: data2[key] };
    case 'changed':
      return {
        valueBefore: { [key]: data1[key] },
        valueAfter: { [key]: data2[key] },
      };
    case 'unchanged':
      return { [key]: data1[key] };
    default:
      return {};
  }
};

const astBuilder = (dataBefore, dataAfter) => {
  const astBuild = (data1, data2) => {
    const uniqKeys = union(keys(data1), keys(data2)).sort();
    return uniqKeys.reduce((acc, key) => {
      const status = getStatus(data1, data2, key);
      const processedChildrens = status === 'nested'
        ? astBuild(data1[key], data2[key]) : [];
      return [...acc,
        {
          key,
          status,
          value: getValueBasedOnStatus(data1, data2, key),
          children: [processedChildrens],
        }];
    }, []);
  };
  const ast = astBuild(dataBefore, dataAfter);
  return ast;
};

export default astBuilder;
