#!/usr/bin/env node

import program from 'commander';
import genDiff from '..';

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', `output format: default tree;
  'tree' set output to show a tree difference (unchanges include),
  'plain' set output to show a plain difference (unchanges exclude)`)
  .arguments('<firstConfig> <secondConfig>')
  .action((path1, path2) => {
    console.log(genDiff(path1, path2, program.format));
  });

program.parse(process.argv);
