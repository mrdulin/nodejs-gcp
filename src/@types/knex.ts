import { Config } from 'knex';

interface IKnexfileSettings {
  development?: Config;
  staging?: Config;
  production?: Config;
}

export { IKnexfileSettings };
