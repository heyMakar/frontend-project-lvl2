import tree from './treeFormatter';
import plain from './plainFormatter';
import json from './jsonFormatter';

const formats = {
  plain,
  tree,
  json,
};

export default (format) => formats[format];
