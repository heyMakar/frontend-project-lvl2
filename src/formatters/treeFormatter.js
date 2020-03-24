import { keys, isObject } from 'lodash';

const placeIndent = (repeats) => {
  const whiteSpace = ' ';
  return whiteSpace.repeat(repeats);
};

const stringify = (key, value, depth) => {
  const indent = placeIndent(depth);
  if (!isObject(value)) {
    return `\n${indent}${key}: ${value}`;
  }
  const openBracketIndent = placeIndent(depth + 4);
  const closeBracketIndent = placeIndent(depth + 2);
  const indentedValue = keys(value)
    .map((k) => (
      `{\n${openBracketIndent}  ${k}: ${value[k]}\n${closeBracketIndent}}`
    ));
  return `\n${indent}${key}: ${indentedValue}`;
};

const nodeActions = [
  {
    check: (status) => status === 'added',
    action: (node, depth) => stringify(`+ ${node.key}`, node.value, depth),
  },
  {
    check: (status) => status === 'removed',
    action: (node, depth) => stringify(`- ${node.key}`, node.value, depth),
  },
  {
    check: (status) => status === 'changed',
    action: (node, depth) => ([
      stringify(`- ${node.key}`, node.valueBefore, depth),
      stringify(`+ ${node.key}`, node.valueAfter, depth),
    ]).join(''),
  },
  {
    check: (status) => status === 'unchanged',
    action: (node, depth) => stringify(`  ${node.key}`, node.value, depth),
  },
  {
    check: (status) => status === 'nested',
    action: (node, depth, f) => {
      const closeBracketIndent = placeIndent(depth + 2);
      const value = `{${f(node.children, depth + 4)}\n${closeBracketIndent}}`;
      return stringify(`  ${node.key}`, value, depth);
    },
  },
];

const getNodeAction = (node) => nodeActions.find(({ check }) => check(node.status));

const buildIndents = (items, depth = 2) => {
  const tree = items.map((item) => {
    const { action } = getNodeAction(item);
    return action(item, depth, buildIndents);
  });
  return tree.join('');
};

const renderTree = (tree) => `{${buildIndents(tree)}\n}`;

export default renderTree;
