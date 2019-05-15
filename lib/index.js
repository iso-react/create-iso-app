const path = require('path');
const {exec} = require('child_process');
const chalk = require('chalk');
const rimraf = require('rimraf');
const ora = require('ora');

function init(dir) {
  console.log(chalk.white('Creating project at ' + dir));
  return Promise.resolve();
}

function installDeps(dir) {
  const spinner = ora({
    text: chalk.gray(`Installing dependencies`),
    color: 'white',
  }).start();
  return new Promise((resolve, reject) => {
    exec(
      'npm install',
      {
        cwd: dir,
      },
      (err, stdout, stderr) => {
        if (err) {
          spinner.fail();
          return reject(err);
        }
        spinner.succeed();
        resolve(stdout);
      }
    );
  });
}

function cloneTemplate(dir, repo, branch) {
  const spinner = ora({
    text: chalk.gray(`Downloading '${branch}' from ${repo}`),
    color: 'white',
  }).start();
  return new Promise((resolve, reject) => {
    exec(
      `git clone --single-branch --depth 1 --branch ${branch} ${repo} ${dir}`,
      {},
      (err, stdout, stderr) => {
        if (err) {
          spinner.fail();
          return reject(err);
        }
        spinner.succeed();
        resolve(stdout);
      }
    );
  });
}

function clearHistory(dir) {
  const gitDir = path.resolve(dir, '.git');
  const spinner = ora({
    text: chalk.gray(`Setting up repository`),
    color: 'white',
  }).start();
  return new Promise(resolve => {
    rimraf(gitDir, {}, () => {
      resolve();
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      exec('git init', {cwd: dir}, (err, stdout) => {
        if (err) {
          spinner.fail();
          return reject(err);
        }
        spinner.succeed();
        resolve(stdout);
      });
    });
  });
}

function createProject(name, opts) {
  const cwd = process.cwd();
  const dir = path.resolve(cwd, name);
  const repo = opts.repository || 'https://github.com/iso-react/template.git';
  const branch = opts.template || 'master';
  return init(dir)
    .then(() => {
      return cloneTemplate(dir, repo, branch);
    })
    .then(() => {
      return clearHistory(dir);
    })
    .then(() => {
      return installDeps(dir);
    })
    .then(() => {
      ora({
        text: chalk.green('Success! Your project is ready to go!'),
        color: 'white',
      }).succeed();
    })
    .catch(err => {
      console.log(chalk.red('Something went wrong! ' + err.toString()));
      console.log(chalk.red(err.stack));
    });
}

module.exports = {
  createProject,
};
