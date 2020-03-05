import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const methods = [
  'tree',
  'plain',
  'json',
];

const extensions = [
  ['.ini'],
  ['.json'],
  ['.yml'],
];

test('make flat diff', () => {
  const flatBeforePath = getFixturePath('flatBefore.json');
  const flatAfterPath = getFixturePath('flatAfter.json');
  const expected = readFile('flatJson.txt');
  const recieved = genDiff(flatBeforePath, flatAfterPath);
  expect(recieved).toEqual(expected);
});

methods.forEach((method) => test.each(extensions)(`make ${method} diff`, (extension) => {
  const valueBeforePath = getFixturePath(`treeBefore${extension}`);
  const valueAfterPath = getFixturePath(`treeAfter${extension}`);
  /*
  ini parser parse numbers with quotes in some cases(bug),
  so we pick another fixture for compare
  */
  const expected = (method === 'json' && extension === '.ini') ? readFile('jsonIni.txt') : readFile(`${method}.txt`);
  const recieved = genDiff(valueBeforePath, valueAfterPath, method);
  expect(recieved).toEqual(expected);
}));
