import fs from 'fs';
import genDiff from '../src/index';

const flatBeforeJson = `${__dirname}/__fixtures__/flatBefore.json`;
const flatAfterJson = `${__dirname}/__fixtures__/flatAfter.json`;
const treeBeforeJson = `${__dirname}/__fixtures__/treeBefore.json`;
const treeAfterJson = `${__dirname}/__fixtures__/treeAfter.json`;
const treeBeforeYml = `${__dirname}/__fixtures__/treeBefore.yml`;
const treeAfterYml = `${__dirname}/__fixtures__/treeAfter.yml`;
const treeBeforeIni = `${__dirname}/__fixtures__/treeBefore.ini`;
const treeAfterIni = `${__dirname}/__fixtures__/treeAfter.ini`;

const pathToFlatResult = `${__dirname}/__fixtures__/flatJson.txt`;
const pathToTreeResult = `${__dirname}/__fixtures__/tree.txt`;
const pathToPlainResult = `${__dirname}/__fixtures__/plain.txt`;
const pathToJsonResult = `${__dirname}/__fixtures__/json.txt`;

const flatResult = fs.readFileSync(pathToFlatResult, 'utf-8');
const treeResult = fs.readFileSync(pathToTreeResult, 'utf-8');
const plainResult = fs.readFileSync(pathToPlainResult, 'utf-8');
const jsonResult = fs.readFileSync(pathToJsonResult, 'utf-8');

test('make flat format diff', () => {
  expect(genDiff(flatBeforeJson, flatAfterJson)).toEqual(flatResult);
});

test('make tree format diff', () => {
  expect(genDiff(treeBeforeJson, treeAfterJson)).toEqual(treeResult);
  expect(genDiff(treeBeforeYml, treeAfterYml)).toEqual(treeResult);
  expect(genDiff(treeBeforeIni, treeAfterIni)).toEqual(treeResult);
});

test('make plain format diff', () => {
  expect(genDiff(treeBeforeJson, treeAfterJson, 'plain')).toEqual(plainResult);
  expect(genDiff(treeBeforeYml, treeAfterYml, 'plain')).toEqual(plainResult);
  expect(genDiff(treeBeforeIni, treeAfterIni, 'plain')).toEqual(plainResult);
});

test('make json format diff', () => {
  expect(genDiff(treeBeforeJson, treeAfterJson, 'json')).toEqual(jsonResult);
});
