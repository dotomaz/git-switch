#!/usr/bin/env node

const chalk = require('chalk');
const util = require('util');
const inquirer = require('inquirer');
const exec = util.promisify(require('child_process').exec);
const config = require('../package.json');

const GIT_HISTORY_CMD = `git reflog | egrep -io "moving from ([^[:space:]]+)" | awk '{ print $3 }' | awk ' !x[$0]++' | egrep -v '^[a-f0-9]{40}$' | head -n20 "$@"`;
const argList = process.argv.splice(2);

let exclude = [];
let limit = 10;

if (argList && !!argList.length) {
    argList
        .map((arg) => {
            const [name, value] = arg.split('=');
            return { name, value };
        })
        .forEach((arg) => {
            switch (arg.name.toLowerCase()) {
                case '--help':
                case '-h':
                    showHelp();
                    process.exit();
                    break;
                case '--version':
                case '-v':
                    console.log(config.version);
                    process.exit();
                    break;
                case '--exclude':
                    exclude = arg.value
                        .split(',')
                        .map((val) => val.trim())
                        .filter((val) => !!val);
                    break;
                case '--limit':
                    if (arg.value && !isNaN(+arg.value)) {
                        limit = +arg.value;
                    }
                    break;
            }
        });
}

function showHelp() {
    console.log('Usage:');
    console.log(chalk.green('   npx @dotomaz/git-switch [options]'));
    console.log();
    console.log(chalk.green('   npm install -g @dotomaz/git-switch'));
    console.log(chalk.green('   git switch [options]'));
    console.log();
    console.log('Options:');
    console.log(chalk.green('   -v, --version                 ') + ': Display installed version');
    console.log(chalk.green('   -h, --help                    ') + ': Display this information');
    console.log(chalk.green('   --exclude=branch1,branch2,... ') + ': List of branches to exclude');
    console.log(chalk.green('   --limit=n                     ') + ': Return [n] last used branches');
}

async function gitCheckout(branch) {
    try {
        const { stdout, stderr } = await exec(`git checkout ${branch}`);
        console.log(stdout);
        console.log(stderr);
    } catch (e) {
        console.error(e.stderr);
    }
}

async function getBranchHistory() {
    const { stdout, stderr } = await exec(GIT_HISTORY_CMD);

    if (!stderr) {
        let list = stdout.split('\n').filter((branch) => !!branch);

        if (exclude && !!exclude.length) {
            list = list.filter((branch) => !exclude.filter((ex) => branch.startsWith(ex)).length);
        }

        if (limit > 0 && list.length > limit) {
            list = list.splice(0, limit);
        }

        return await inquirer.prompt([
            {
                type: 'list',
                name: 'branch',
                loop: false,
                message: 'Witch branch do you want to checkout?',
                choices: list,
            },
        ]);
    }
}

async function gitSwitch() {
    try {
        const answers = await getBranchHistory();

        if (answers && answers.branch) {
            gitCheckout(answers.branch);
        }
    } catch (e) {
        console.error(e);
    }
}

gitSwitch();
