#!/usr/bin/env node

const util = require('util');
const inquirer = require('inquirer');
const exec = util.promisify(require('child_process').exec);
const GIT_HISTORY_CMD = `git reflog | egrep -io "moving from ([^[:space:]]+)" | awk '{ print $3 }' | awk ' !x[$0]++' | egrep -v '^[a-f0-9]{40}$' | head -n20 "$@"`;

async function gitCheckout(branch) {
    const { stdout, stderr } = await exec(`git checkout ${branch}`);
    console.log(stdout);
    console.log(stderr);
}

async function getBranchHistory() {
    const { stdout, stderr } = await exec(GIT_HISTORY_CMD);

    if (!stderr) {
        const list = stdout.split('\n').filter(branch => !!branch);

        return await inquirer.prompt([
            {
                type: 'list',
                name: 'branch',
                message: 'Witch branch do you want to checkout?',
                choices: list,
            }
        ]);
    }
}

async function main(){
    try{
        const answers = await getBranchHistory();

        if(answers && answers.branch){
            gitCheckout(answers.branch);
        }
    } catch (e) {
        console.error(e);
    }
}

main();
