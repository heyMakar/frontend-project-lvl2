import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const types = {
  '.json': 'json',
  '.yml': 'yaml',
};

const choseParser = (type) => {
  switch (type) {
    case 'json':
      return (file) => JSON.parse(file);
    case 'yaml':
      return (file) => yaml.safeLoad(file);
    default:
      return 'wrong type!';
  }
};

const parseFile = (filePath, fileType) => {
  const getType = types[fileType];
  const pathToFile = path.resolve(filePath);
  const readFile = choseParser(getType)(fs.readFileSync(pathToFile));
  return readFile;
};

export default (pathToFile, type) => parseFile(pathToFile, type);
