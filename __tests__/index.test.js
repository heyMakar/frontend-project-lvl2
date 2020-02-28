import fs from 'fs';
import buildAst from '../src/ast';
import treeFormatRender from '../src/renderers/treeFormat';

const flatBeforeJson = '__tests__/__fixtures__/flatBefore.json';
const flatAfterJson = '__tests__/__fixtures__/flatAfter.json';
const treeBeforeJson = '__tests__/__fixtures__/treeBefore.json';
const treeAfterJson = '__tests__/__fixtures__/treeAfter.json';
const treeBeforeYml = '__tests__/__fixtures__/treeBefore.yml';
const treeAfterYml = '__tests__/__fixtures__/treeAfter.yml';
const treeBeforeIni = '__tests__/__fixtures__/treeBefore.ini';
const treeAfterIni = '__tests__/__fixtures__/treeAfter.ini';

const pathToFlatResult = '__tests__/__fixtures__/flatJson.txt';
const pathToTreeResult = '__tests__/__fixtures__/tree.txt';
const flatResult = fs.readFileSync(pathToFlatResult, 'utf-8');
const treeResult = fs.readFileSync(pathToTreeResult, 'utf-8');

test('make flat format diff', () => {
  const ast = buildAst(flatBeforeJson, flatAfterJson);
  expect(treeFormatRender(ast)).toEqual(flatResult);
});

test('make tree format diff', () => {
  const astJson = buildAst(treeBeforeJson, treeAfterJson);
  const astYml = buildAst(treeBeforeYml, treeAfterYml);
  const astIni = buildAst(treeBeforeIni, treeAfterIni);
  expect(treeFormatRender(astJson)).toEqual(treeResult);
  expect(treeFormatRender(astYml)).toEqual(treeResult);
  expect(treeFormatRender(astIni)).toEqual(treeResult);
});
