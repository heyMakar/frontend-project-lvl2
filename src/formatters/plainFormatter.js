import { trim, isObject, flatten } from 'lodash';

const getComplexValue = (value) => (isObject(value) ? '[complex value]' : value);

const renderPlain = (items, path = '') => items
  .filter((item) => item.status !== 'unchanged')
  .map(({
    key, value, status, children,
  }) => {
    const nestedPath = `${path}.${key}`;
    switch (status) {
      case 'added':
        return `Property ${trim(nestedPath, '.')} was added with value: ${getComplexValue(value[key])}`;
      case 'removed':
        return `Property ${trim(nestedPath, '.')} was removed`;
      case 'changed': {
        const { valueBefore, valueAfter } = value;
        const processedValueBefore = getComplexValue(valueBefore[key]);
        const processedValueAfter = getComplexValue(valueAfter[key]);
        return `Property ${trim(nestedPath, '.')} was changed from '${processedValueBefore}' to '${processedValueAfter}'`;
      }
      case 'nested':
        return renderPlain(flatten(children), nestedPath);
      default:
        return 'wrong status';
    }
  })
  .join('\n');

export default renderPlain;
