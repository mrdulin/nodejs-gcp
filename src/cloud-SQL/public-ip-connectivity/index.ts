import { connection as knex } from './db';

async function findAllUsers() {
  return knex('users').select();
}

export { findAllUsers };
