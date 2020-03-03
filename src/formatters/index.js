import tree from './treeFormat';
import plain from './plainFormat';

const formats = {
  plain,
  tree,
};

export default (type) => formats[type];
