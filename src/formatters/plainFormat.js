import { trim, isObject, flatten } from 'lodash';

const complexValue = (value) => (isObject(value) ? '[complex value]' : `${value}`);

const renderPlain = (tree, path = '') => tree
  .filter((item) => item.status !== 'unchanged')
  .map((item) => {
    const nestedPath = `${path}.${item.key}`;
    switch (item.status) {
      case 'added':
        return `Property ${trim(nestedPath, '.')} was added with value: ${complexValue(item.value[item.key])}`;
      case 'removed':
        return `Property ${trim(nestedPath, '.')} was removed`;
      case 'changed': {
        const { valueBefore, valueAfter } = item.value;
        const before = complexValue(valueBefore[item.key]);
        const after = complexValue(valueAfter[item.key]);
        return `Property ${trim(nestedPath, '.')} was changed from '${before}' to '${after}'`;
      }
      case 'nested':
        return renderPlain(flatten(item.children), nestedPath);
      default:
        return 'wrong status';
    }
  })
  .join('\n');

export default renderPlain;
