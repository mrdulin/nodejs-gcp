import Knex, { TableBuilder } from 'knex';

import { connect } from './db';
// import './env';

function createTables(knex: Knex) {
  knex.schema
    .createTable('visits', (tableBuilder: TableBuilder) => {
      tableBuilder.increments();
      tableBuilder.timestamp('timestamp');
      tableBuilder.string('userIp');
    })
    .then(() => {
      console.log(`Successfully created 'visits' table.`);
      return knex.destroy();
    })
    .catch((err) => {
      console.error(`Failed to create 'visits' table: `, err);
      if (knex) {
        knex.destroy();
      }
    });
}

async function seed() {
  const knex: Knex = connect();
  await createTables(knex);
}

export { seed };
