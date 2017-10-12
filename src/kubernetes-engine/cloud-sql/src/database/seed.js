const faker = require('faker');

const { knex } = require('./connection');

async function seed() {
  const userTableName = 'users';
  try {
    if (await knex.schema.hasTable(userTableName)) {
      return;
    }
    await knex.schema.createTable(userTableName, (t) => {
      t.increments('user_id');
      t.string('user_email')
        .notNullable()
        .unique();
      t.string('user_nme').notNullable();
    });

    await knex(userTableName).del();
    await knex(userTableName).insert([
      { user_id: 1, user_email: faker.internet.email(), user_nme: faker.name.findName() },
      { user_id: 2, user_email: faker.internet.email(), user_nme: faker.name.findName() },
      { user_id: 3, user_email: faker.internet.email(), user_nme: faker.name.findName() }
    ]);
  } catch (error) {
    console.error('seed failed');
    console.error(error);
  }
}

exports.seed = seed;
