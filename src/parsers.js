import yaml from 'js-yaml';
import ini from 'ini';

const extensions = {
  'json': JSON.parse,
  'yml': yaml.safeLoad,
  'ini': ini.parse,
};

const getParser = (pathToFile, type) => extensions[type](pathToFile);

export default getParser;
