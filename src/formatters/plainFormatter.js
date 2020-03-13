import { trim, isObject } from 'lodash';

const getComplexValue = (value) => (isObject(value) ? '[complex value]' : value);

const renderPlain = (items, path = '') => items
  .filter((item) => item.status !== 'unchanged')
  .map(({
    key, value, status, children, valueBefore, valueAfter,
  }) => {
    const nestedPath = `${path}.${key}`;
    switch (status) {
      case 'added':
        return `Property ${trim(nestedPath, '.')} was added with value: ${getComplexValue(value)}`;
      case 'removed':
        return `Property ${trim(nestedPath, '.')} was removed`;
      case 'changed': {
        const processedValueBefore = getComplexValue(valueBefore);
        const processedValueAfter = getComplexValue(valueAfter);
        return `Property ${trim(nestedPath, '.')} was changed from '${processedValueBefore}' to '${processedValueAfter}'`;
      }
      case 'nested':
        return renderPlain(children, nestedPath);
      default:
        return 'wrong status';
    }
  })
  .join('\n');

export default renderPlain;
