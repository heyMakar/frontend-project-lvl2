import tree from './treeFormat';
import plain from './plainFormat';
import json from './jsonFormat';

const formats = {
  plain,
  tree,
  json,
};

export default (type) => formats[type];
