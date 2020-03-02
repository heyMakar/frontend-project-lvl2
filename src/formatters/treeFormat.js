/* eslint-disable no-multi-spaces */

import { keys, isObject, flatten } from 'lodash';

const indentPlacer = (repeats) => {
  const  tab = '  ';
  return tab.repeat(repeats);
};

const stringify = (obj, depth) => {
  if (isObject(obj)) {
    const key = keys(obj)[0];
    const currentDepth = depth === 0 ? 2 : depth;
    const breakLine = currentDepth === 0 ? '' : '\n';
    return `{${breakLine}${indentPlacer(currentDepth)}    ${key}: ${obj[key]}${breakLine}${indentPlacer(currentDepth)}}`;
  }
  return obj;
};

const renderObject = (obj, depth = 0) => {
  const {
    key, status, value, children,
  } = obj;
  const childs = flatten(children);
  const breakLine = depth === 0 ? '' : '\n';
  const currentValue = value[key];
  switch (status) {
    case 'added':
      return `${breakLine}${indentPlacer(depth)}  + ${key}: ${stringify(currentValue, depth * 2)}`;
    case 'removed':
      return `${breakLine}${indentPlacer(depth)}  - ${key}: ${stringify(currentValue, depth * 2)}`;
    case 'changed': {
      const { valueBefore, valueAfter } = value;
      const before = valueBefore[key];
      const after = valueAfter[key];
      const beforeToString = isObject(before) ? stringify(before, depth * 2) : before;
      const afterToString = isObject(after) ? stringify(after, depth * 2) : after;
      return `${breakLine}${indentPlacer(depth)}  - ${key}: ${beforeToString}\n${indentPlacer(depth)}  + ${key}: ${afterToString}`;
    }
    case 'unchanged':
      return `${breakLine}${indentPlacer(depth)}    ${key}: ${currentValue}`;
    case 'nested':
      return `${breakLine}${indentPlacer(depth)}    ${key}: {${childs.map((c) => renderObject(c, depth * 2)).join('')}${breakLine}${indentPlacer(depth)}    }`;
    default:
      return 'wrong status';
  }
};

const renderTree = (tree) => {
  const reducedTree = tree.reduce((acc, item) => {
    const childs = flatten(item.children);
    const depth = 1;
    const depthStep = 1;
    if (childs.length > 0) {
      const nestedDepth = depth + depthStep;
      const renderChilds = childs.map((c) => renderObject(c, nestedDepth));
      return [...acc, `${indentPlacer(depth)}  ${item.key}: {${renderChilds.join('')}\n${indentPlacer(depth)}  }`];
    }
    return [...acc, renderObject(item)];
  }, []);
  return `{\n${reducedTree.join('\n')}\n}`;
};

export default renderTree;
