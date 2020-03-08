import path from 'path';
import fs from 'fs';
import getParser from './parsers';
import getRender from './formatters';
import astBuilder from './ast';

const getFileExtension = (filename) => path.extname(filename);
const readFile = (filename) => fs.readFileSync(filename, 'utf-8');

const genDiff = (beforeFilePath, afterFilePath, outputFormat = 'tree') => {
  const beforeFileExt = getFileExtension(beforeFilePath).slice(1);
  const afterFileExt = getFileExtension(afterFilePath).slice(1);
  const dataBefore = readFile(beforeFilePath);
  const dataAfter = readFile(afterFilePath);

  const parsedDataBefore = getParser(dataBefore, beforeFileExt);
  const parsedDataAfter = getParser(dataAfter, afterFileExt);

  const render = getRender(outputFormat);
  const ast = astBuilder(parsedDataBefore, parsedDataAfter);
  return render(ast);
};


export default genDiff;
