import path from 'path';
import fs from 'fs';
import getParser from './parsers';
import render from './formatters';
import buildAST from './ast';

const genDiff = (firstFile, secondFile, outputFormat = 'tree') => {
  const extFirstFile = path.extname(firstFile);
  const extSecondFile = path.extname(secondFile);

  const dataBefore = fs.readFileSync(firstFile, 'utf-8');
  const dataAfter = fs.readFileSync(secondFile, 'utf-8');

  const parseBefore = getParser(dataBefore, extFirstFile);
  const parseAfter = getParser(dataAfter, extSecondFile);

  const getRender = render(outputFormat);
  const ast = buildAST(parseBefore, parseAfter);
  return getRender(ast);
};


export default genDiff;
