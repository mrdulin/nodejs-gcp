import * as Knex from 'knex';

exports.up = function(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.createTable('users', (t) => {
      t.increments('user_id');
      t.string('user_email')
        .notNullable()
        .unique();
      t.integer('user_age').notNullable();
    })
  ]);
};

exports.down = function(knex: Knex): Promise<any> {
  return Promise.all(['users'].map((table) => knex.schema.dropTable(table)));
};
