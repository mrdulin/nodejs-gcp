const config = {
  DAILY_REPORT_SCHEDULE: process.env.DAILY_REPORT_SCHEDULE || '0 2 * * *',
  SQL_SSL: process.env.SQL_SSL || false,
  REGION: process.env.REGION || 'us-central1',
  PORT: process.env.PORT || 8080
};

module.exports = config;
