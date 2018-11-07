import Knex, { MySqlConnectionConfig } from 'knex';

function connect(): Knex {
  const config: MySqlConnectionConfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    socketPath: ''
  };

  if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
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
