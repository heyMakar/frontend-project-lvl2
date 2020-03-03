import { trim, isObject, flatten } from 'lodash';

const complexValue = (value) => (isObject(value) ? '[complex value]' : value);

const renderPlain = (tree, path = '') => tree
  .filter((item) => item.status !== 'unchanged')
  .map(({
    key, value, status, children,
  }) => {
    const nestedPath = `${path}.${key}`;
    switch (status) {
      case 'added':
        return `Property ${trim(nestedPath, '.')} was added with value: ${complexValue(value[key])}`;
      case 'removed':
        return `Property ${trim(nestedPath, '.')} was removed`;
      case 'changed': {
        const { valueBefore, valueAfter } = value;
        const before = complexValue(valueBefore[key]);
        const after = complexValue(valueAfter[key]);
        return `Property ${trim(nestedPath, '.')} was changed from '${before}' to '${after}'`;
      }
      case 'nested':
        return renderPlain(flatten(children), nestedPath);
      default:
        return 'wrong status';
    }
  })
  .join('\n');

export default renderPlain;
