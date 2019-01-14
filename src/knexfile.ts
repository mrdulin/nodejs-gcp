import dotenv, { DotenvConfigOptions, DotenvConfigOutput } from 'dotenv';
import path from 'path';
import fs from 'fs';

const dotenvConfig: DotenvConfigOptions = {
  path: path.resolve(__dirname, '../.env')
};
const dotenvOutput: DotenvConfigOutput = dotenv.config(dotenvConfig);
console.log(dotenvOutput.error ? dotenvOutput.error : dotenvOutput.parsed);

const config: any = {
  development: {
    client: 'pg',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      // host: `/cloudsql/${process.env.SQL_INSTANCE_CONNECTION_NAME}`,
      database: process.env.SQL_DATABASE,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};

if (process.env.SQL_SSL === 'true') {
  config.production.connection.ssl = {
    ca: fs.readFileSync(path.resolve(__dirname, '../ssl/cloud-sql/server-ca.pem')),
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/cloud-sql/client-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/cloud-sql/client-cert.pem'))
  };
}

console.log('knex config: ', config);

export default config;
