import yaml from 'js-yaml';
import ini from 'ini';

const types = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

export default (data, type) => types[type](data);
