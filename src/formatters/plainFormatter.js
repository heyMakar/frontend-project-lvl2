import { trim, isObject } from 'lodash';

const stringify = (value) => (isObject(value) ? '[complex value]' : value);

const renderPlain = (items, path = '') => items
  .filter((item) => item.status !== 'unchanged')
  .map(({
    key, value, status, children, valueBefore, valueAfter,
  }) => {
    const nestedPath = `${path}.${key}`;
    switch (status) {
      case 'added':
        return `Property ${trim(nestedPath, '.')} was added with value: ${stringify(value)}`;
      case 'removed':
        return `Property ${trim(nestedPath, '.')} was removed`;
      case 'changed': {
        const stringValueBefore = stringify(valueBefore);
        const stringValueAfter = stringify(valueAfter);
        return `Property ${trim(nestedPath, '.')} was changed from '${stringValueBefore}' to '${stringValueAfter}'`;
      }
      case 'nested':
        return renderPlain(children, nestedPath);
      default:
        throw new Error(`Unknown status: '${status}'`);
    }
  })
  .join('\n');

export default renderPlain;
