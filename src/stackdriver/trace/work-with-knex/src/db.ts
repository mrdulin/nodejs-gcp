import knex from 'knex';
import { credentials } from './credentials';

const config: knex.Config = {
  client: 'pg',
  connection: {
    host: credentials.SQL_HOST,
    port: Number.parseInt(credentials.SQL_PORT, 10),
    database: credentials.SQL_DATABASE,
    user: credentials.SQL_USER,
    password: credentials.SQL_PASSWORD,
    ssl: credentials.SQL_SSL || false
  },
  pool: {
    min: 1,
    max: 1
  },
  debug: true
};
const connection = knex(config);

export { connection };
