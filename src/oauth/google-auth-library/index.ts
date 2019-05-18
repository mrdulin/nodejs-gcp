import { auth } from 'google-auth-library';

async function main() {
  const client = await auth.getClient({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
    clientOptions: {}
  });
  const projectId = await auth.getProjectId();
  const url = `https://www.googleapis.com/dns/v1/projects/${projectId}`;
  const res = await client.request({ url });
  console.log(res.data);
}

main().catch((error) => {
  console.error(JSON.stringify(error, null, 2));
});
