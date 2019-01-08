import Knex, { MySqlConnectionConfig } from 'knex';

function connect(): Knex {
  const { SQL_USER, SQL_PASSWORD, SQL_DATABASE, NODE_ENV, INSTANCE_CONNECTION_NAME } = process.env;
  const config: MySqlConnectionConfig = {
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE
    // socketPath: ''
  };

  // GCP 偷偷改文档，这是以前的数据库连接方式
  // if (INSTANCE_CONNECTION_NAME && NODE_ENV === 'production') {
  //   config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  // }

  if (INSTANCE_CONNECTION_NAME && NODE_ENV === 'production') {
    config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }

  const knex: Knex = Knex({
    client: 'pg',
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
