import Knex, { MySqlConnectionConfig } from 'knex';

function connect(): Knex {
  const { SQL_USER, SQL_PASSWORD, SQL_DATABASE, NODE_ENV, INSTANCE_CONNECTION_NAME } = process.env;
  const config: MySqlConnectionConfig = {
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    socketPath: ''
  };

  if (INSTANCE_CONNECTION_NAME && NODE_ENV === 'production') {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }

  const knex: Knex = Knex({
    client: 'mysql',
    connection: config
  });
  return knex;
}

function insertVisit(knex: Knex, visit) {
  return knex('visits').insert(visit);
}

async function getVisits(knex: Knex) {
  return knex
    .select('timestamp', 'userIp')
    .from('visits')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .then((results) => {
      return results.map((visit) => `Time: ${visit.timestamp}, AddrHash: ${visit.userIp}`);
    });
}

export { connect, insertVisit, getVisits };
