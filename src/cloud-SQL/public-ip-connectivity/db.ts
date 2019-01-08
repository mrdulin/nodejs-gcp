import knex from 'knex';
import fs from 'fs';
import path from 'path';
import dotenv, { DotenvConfigOptions, DotenvConfigOutput } from 'dotenv';

const dotenvConfig: DotenvConfigOptions = {
  path: path.resolve(__dirname, '../../../.env')
};
const dotenvOutput: DotenvConfigOutput = dotenv.config(dotenvConfig);
console.log(dotenvOutput.error ? dotenvOutput.error : dotenvOutput.parsed);

const config: any = {
  client: 'pg',
  connection: {
    host: process.env.SQL_HOST,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    ssl: {
      ca: fs.readFileSync(path.resolve(__dirname, '../../../ssl/cloud-sql/server-ca.pem')),
      key: fs.readFileSync(path.resolve(__dirname, '../../../ssl/cloud-sql/client-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../../ssl/cloud-sql/client-cert.pem'))
    }
  }
};
console.log('db config: ', config);
const connection = knex(config);
export { connection };
