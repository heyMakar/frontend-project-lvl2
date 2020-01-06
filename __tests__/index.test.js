import fs from 'fs';
import genDiff from '../src';

const beforeJson = '__fixtures__/before.json';
const afterJson = '__fixtures__/after.json';
const beforeYml = '__fixtures__/before.yml';
const afterYml = '__fixtures__/after.yml';

const pathToJsonResult = '__fixtures__/json.txt';
const readJsonResult = fs.readFileSync(pathToJsonResult, 'utf-8');

const pathToYmlResult = '__fixtures__/yml.txt';
const readYmlResult = fs.readFileSync(pathToYmlResult, 'utf-8');

test('make string', () => {
  expect(genDiff(beforeJson, afterJson)).toEqual(readJsonResult);
  expect(genDiff(beforeYml, afterYml)).toEqual(readYmlResult);
});
