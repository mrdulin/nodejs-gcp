import * as Knex from 'knex';

exports.up = function(knex: Knex): Promise<any> {
  return Promise.all([
    knex.schema.createTable('USER', (t: Knex.TableBuilder) => {
      t.increments('user_id');
      t.string('user_nme').notNullable();
      t.string('user_email')
        .notNullable()
        .unique();
    })
  ]);
};

exports.down = function(knex: Knex): Promise<any> {
  return Promise.all(['USER'].map((table: string) => knex.schema.dropTable(table)));
};
