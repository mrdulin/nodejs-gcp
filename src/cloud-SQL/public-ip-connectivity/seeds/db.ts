import * as Knex from 'knex';
import faker from 'faker';

exports.seed = async function(knex: Knex): Promise<any> {
  return knex('users')
    .del()
    .then(function() {
      return knex('users').insert([
        { user_id: 1, user_email: faker.internet.email(), user_age: faker.random.number(150) },
        { user_id: 2, user_email: faker.internet.email(), user_age: faker.random.number(150) },
        { user_id: 3, user_email: faker.internet.email(), user_age: faker.random.number(150) }
      ]);
    });
};
