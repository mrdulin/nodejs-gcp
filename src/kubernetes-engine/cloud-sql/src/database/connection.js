const Knex = require('knex');
const credentials = require('../credentials');

function connect() {
  const { SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_HOST, SQL_PORT } = credentials;

  const config = {
    client: 'pg',
    connection: {
      host: SQL_HOST,
      port: SQL_PORT,
      user: SQL_USER,
      password: SQL_PASSWORD,
      database: SQL_DATABASE
    }
  };
  return Knex(config);
}

const knex = connect();

module.exports = {
  knex
};
