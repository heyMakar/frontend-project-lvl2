import flatten from 'lodash';

const renderJson = (tree) => JSON.stringify(flatten(tree), null, 2);

export default renderJson;
