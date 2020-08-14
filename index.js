
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const GIT_HISTORY_CMD = `git reflog | egrep -io "moving from ([^[:space:]]+)" | awk '{ print $3 }' | awk ' !x[$0]++' | egrep -v '^[a-f0-9]{40}$' | head -n20 "$@"`;

async function getBranchHistory() {
  try {
    const { stdout, stderr } = await exec(GIT_HISTORY_CMD);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

async function main(){
    getBranchHistory();
}

main();
