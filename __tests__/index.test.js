import fs from 'fs';
import buildAst from '../src/ast';
import treeFormatRender from '../src/formatters/treeFormat';
import plainFormatRender from '../src/formatters/plainFormat';

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
const flatResult = fs.readFileSync(pathToFlatResult, 'utf-8');
const treeResult = fs.readFileSync(pathToTreeResult, 'utf-8');
const plainResult = fs.readFileSync(pathToPlainResult, 'utf-8');

const astJson = buildAst(treeBeforeJson, treeAfterJson);
const astYml = buildAst(treeBeforeYml, treeAfterYml);
const astIni = buildAst(treeBeforeIni, treeAfterIni);

test('make flat format diff', () => {
  const astFromFlatFiles = buildAst(flatBeforeJson, flatAfterJson);
  expect(treeFormatRender(astFromFlatFiles)).toEqual(flatResult);
});

test('make tree format diff', () => {
  expect(treeFormatRender(astJson)).toEqual(treeResult);
  expect(treeFormatRender(astYml)).toEqual(treeResult);
  expect(treeFormatRender(astIni)).toEqual(treeResult);
});

test('make plain format diff', () => {
  expect(plainFormatRender(astJson)).toEqual(plainResult);
  expect(plainFormatRender(astYml)).toEqual(plainResult);
  expect(plainFormatRender(astIni)).toEqual(plainResult);
});
