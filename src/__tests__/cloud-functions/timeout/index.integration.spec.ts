import cp from 'child_process';

describe('cloud-functions timeout test suites', () => {
  const functionName = 'afterTimeout';

  it('should print timed out log', () => {
    const output: string = cp.execSync(`gcloud beta functions call ${functionName}`).toString();
    expect(output).toContain('Error: function execution attempt timed out.');
  });
});
