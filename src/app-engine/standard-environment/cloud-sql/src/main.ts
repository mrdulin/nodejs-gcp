import { connect } from './db';
import { server } from './server';

async function main() {
  const knex = connect();
  await server({
    PORT: process.env.PORT || 3000,
    knex
  });
}

main();
