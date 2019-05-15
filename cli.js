#!/usr/bin/env node
const chalk = require('chalk');
const commander = require('commander');

const {createProject} = require('./lib');

commander
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('-t, --template [template]', 'project template', 'master')
  .option(
    '-r, --repository [repository]',
    'template repository',
    'https://github.com/iso-react/template.git'
  )
  .action((name, args) => {
    createProject(name, args);
  })
  .parse(process.argv);