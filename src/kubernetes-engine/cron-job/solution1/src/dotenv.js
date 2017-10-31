if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ debug: process.env.DOTENV_DEBUG === 'true' });
}
