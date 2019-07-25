const credentials = {
  SQL_HOST: process.env.SQL_HOST || '127.0.0.1',
  SQL_PORT: process.env.SQL_PORT || '5432',
  SQL_DATABASE: process.env.SQL_DATABASE || 'postgres',
  SQL_USER: process.env.SQL_USER || 'postgres',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  SQL_SSL: process.env.SQL_SSL || false
};

export { credentials };
