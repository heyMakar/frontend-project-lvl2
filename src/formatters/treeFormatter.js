/* eslint-disable no-multi-spaces */

import { keys, isObject } from 'lodash';

const placeIndent = (repeats) => {
  const  tab = '  ';
  return tab.repeat(repeats);
};

const stringify = (data, depth) => {
  if (isObject(data)) {
    const firstKey = keys(data)[0];
    const nestedDepth = 2;
    const currentDepth = depth === 0 ? nestedDepth : depth;
    const breakLine = currentDepth === 0 ? '' : '\n';
    return `{${breakLine}${placeIndent(currentDepth)}    ${firstKey}: ${data[firstKey]}${breakLine}${placeIndent(currentDepth)}}`;
  }
  return data;
};

const renderObject = (obj, depth = 0) => {
  const {
    key, status, value, children,
  } = obj;
  const breakLine = depth === 0 ? '' : '\n';
  switch (status) {
    case 'added':
      return `${breakLine}${placeIndent(depth)}  + ${key}: ${stringify(value, depth * 2)}`;
    case 'removed':
      return `${breakLine}${placeIndent(depth)}  - ${key}: ${stringify(value, depth * 2)}`;
    case 'changed': {
      const { valueBefore, valueAfter } = obj;
      const beforeDataToString = isObject(valueBefore)
        ? stringify(valueBefore, depth * 2) : valueBefore;
      const afterDataToString = isObject(valueAfter)
        ? stringify(valueAfter, depth * 2) : valueAfter;

      return `${breakLine}${placeIndent(depth)}  - ${key}: ${beforeDataToString}\n${placeIndent(depth)}  + ${key}: ${afterDataToString}`;
    }
    case 'unchanged':
      return `${breakLine}${placeIndent(depth)}    ${key}: ${value}`;
    case 'nested':
      return `${breakLine}${placeIndent(depth)}    ${key}: {${children.map((c) => renderObject(c, depth * 2)).join('')}${breakLine}${placeIndent(depth)}    }`;
    default:
      return 'wrong status';
  }
};

const renderTree = (items) => {
  const processedItems = items.reduce((acc, item) => {
    const { key, children } = item;
    const depth = 1;
    const depthStep = 1;
    if (children) {
      const nestedDepth = depth + depthStep;
      const renderedChilds = children.map((c) => renderObject(c, nestedDepth));
      return [...acc, `${placeIndent(depth)}  ${key}: {${renderedChilds.join('')}\n${placeIndent(depth)}  }`];
    }
    return [...acc, renderObject(item)];
  }, []);
  return `{\n${processedItems.join('\n')}\n}`;
};

export default renderTree;
