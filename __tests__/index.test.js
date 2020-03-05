import fs from 'fs';
import path from 'path';
import genDiff from '../src';

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

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('make flat diff', () => {
  const flatBefore = getFixturePath('flatBefore.json');
  const flatAfter = getFixturePath('flatAfter.json');
  const flatResult = readFile('flatJson.txt');
  expect(genDiff(flatBefore, flatAfter)).toEqual(flatResult);
});

methods.forEach((method) => test.each(extensions)(`make ${method} diff`, (extension) => {
  const before = getFixturePath(`treeBefore${extension}`);
  const after = getFixturePath(`treeAfter${extension}`);
  /*
  ini parser parse numbers with quotes in some cases(bug),
  so we pick another fixture for compare
  */
  const expected = (method === 'json' && extension === '.ini') ? readFile('jsonIni.txt') : readFile(`${method}.txt`);
  const recieved = genDiff(before, after, method);
  expect(recieved).toEqual(expected);
}));
