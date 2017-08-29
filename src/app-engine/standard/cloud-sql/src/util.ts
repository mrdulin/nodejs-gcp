import cp from 'child_process';

function printenv(envNames: string[]): string[] {
  return envNames.map((env) => {
    const msg = `process.env.${env}: ${process.env[env]}`;
    console.log(msg);
    return msg;
  });
}

function listNpmPkgs() {
  const command = 'npm list --depth=0';
  return cp.execSync(command).toString();
}

export { printenv, listNpmPkgs };
