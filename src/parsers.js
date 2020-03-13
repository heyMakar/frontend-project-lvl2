import yaml from 'js-yaml';
import ini from 'ini';

const types = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

const getParser = (data, type) => types[type](data);

export default getParser;
