import { google } from 'googleapis';
import { cloudfunctions_v1 } from 'googleapis/build/src/apis/cloudfunctions/v1';
import { GaxiosResponse } from 'gaxios';

const cloudfunctions = google.cloudfunctions('v1');

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloudfunctions']
  });
  const authClient = await auth.getClient();
  const project: string = await auth.getProjectId();
  return { authClient, project };
}

async function listOperations() {
  const { project, authClient } = await getAuthClient();
  const res: GaxiosResponse<cloudfunctions_v1.Schema$ListOperationsResponse> = await cloudfunctions.operations.list({
    auth: authClient,
    filter: `project:${project},latest:true`
  });
  console.log(JSON.stringify(res.data, null, 2));
}

async function listFunctions() {
  const { project, authClient } = await getAuthClient();
  const res = await cloudfunctions.projects.locations.functions.list({
    auth: authClient,
    parent: `projects/${project}/locations/us-central1`,
    pageSize: 1
  });
  console.log(JSON.stringify(res.data, null, 2));
}

async function callFunction() {
  const { project, authClient } = await getAuthClient();
  const res = await cloudfunctions.projects.locations.functions.call({
    auth: authClient,
    name: `projects/${project}/locations/us-central1/functions/http`
  });
  console.log(JSON.stringify(res.data, null, 2));
}

async function main() {
  // await listOperations();
  await listFunctions();
  // await callFunction();
}

main().catch(console.error);
