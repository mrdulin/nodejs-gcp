import * as Knex from 'knex';
import faker from 'faker';

exports.seed = async function(knex: Knex): Promise<any> {
  return knex('USER')
    .del()
    .then(function() {
      return knex('USER').insert([
        { user_id: 1, user_nme: faker.name.findName(), user_email: faker.internet.email() },
        { user_id: 2, user_nme: faker.name.findName(), user_email: faker.internet.email() },
        { user_id: 3, user_nme: faker.name.findName(), user_email: faker.internet.email() }
      ]);
    });
};
