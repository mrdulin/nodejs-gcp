import cp from 'child_process';

const functionName = 'reuseGlobalVars';
describe('reuseGlobalVars test suites', () => {
  it('should print count correctly', () => {
    const output: string = cp.execSync(`gcloud beta functions call ${functionName}`).toString();
    expect(output).toContain('count');
  });
});
