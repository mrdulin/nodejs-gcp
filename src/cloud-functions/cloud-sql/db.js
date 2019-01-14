const knex = require('knex');

const connectionName = process.env.SQL_INSTANCE_CONNECTION_NAME || '<YOUR INSTANCE CONNECTION NAME>';
const dbUser = process.env.SQL_USER || '<YOUR DB USER>';
const dbPassword = process.env.SQL_PASSWORD || '<YOUR DB PASSWORD>';
const dbName = process.env.SQL_DATABASE || '<YOUR DB NAME>';

const config = {
  client: 'pg',
  connection: {
    host: `/cloudsql/${connectionName}`,
    user: dbUser,
    password: dbPassword,
    database: dbName
  },
  pool: {
    min: 1,
    max: 1
  }
};

console.log('knex config: ', config);
const connection = knex(config);

exports.connection = connection;
