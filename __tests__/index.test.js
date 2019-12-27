import genDiff from '../src';

const after = 'after.json';
const before = 'before.json';

const result = ['{', '  host: hexlet.io', '+ timeout: 20', '- timeout: 50', '- proxy: 123.234.53.22', '- follow: false', '+ verbose: true', '}'].join('\n');

test('make string', () => {
  expect(genDiff(before, after)).toEqual(result);
});
