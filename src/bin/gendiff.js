#!/usr/bin/env node

import commander from 'commander';

const program = commander;

program
  .version('1.0.0')
  .description('simple description')
  .parse(process.argv);

if (!program.args.length) program.help();