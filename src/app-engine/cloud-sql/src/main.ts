import { connect } from './db';
import { server } from './server';
import { printenv } from './util';
import { seed } from './seed';

async function main() {
  const { NODE_ENV, PORT = 3000 } = process.env;
  if (NODE_ENV !== 'production') {
    await import('./env');
  }

  await seed();

  printenv(['NODE_ENV', 'SQL_USER', 'SQL_DATABASE']);
  const knex = connect();
  await server({
    PORT,
    knex
  });
}

main();
