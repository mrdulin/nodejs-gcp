import Datastore from '@google-cloud/datastore';

import { logger } from '../../utils';

const datastore = new Datastore({
  projectId: process.env.PROJECT_ID
});

function addTask(description: string) {
  const taskKey = datastore.key(['Task']);
  const entity = {
    key: taskKey,
    data: [
      {
        name: 'created',
        value: new Date().toJSON()
      },
      {
        name: 'description',
        value: description,
        excludeFromIndexes: true
      },
      {
        name: 'done',
        value: false
      }
    ]
  };

  datastore
    .save(entity)
    .then(() => {
      logger.info(`Task ${taskKey.id} created successfully.`);
    })
    .catch((err) => {
      logger.error(err);
    });
}

interface IEnvVars {
  [key: string]: string;
}

async function getEnvVars(): Promise<IEnvVars> {
  const query = datastore.createQuery('envVars');
  return datastore.runQuery(query).then((results: any[]) => {
    const envVars = results[0];
    return envVars[0];
  });
}

async function main() {
  const envVars: IEnvVars = await getEnvVars();
  logger.info(envVars);
}

main();
