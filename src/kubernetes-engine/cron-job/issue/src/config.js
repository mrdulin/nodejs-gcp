const config = {
  DAILY_REPORT_SCHEDULE: process.env.DAILY_REPORT_SCHEDULE || '*/1 * * * *',
  PORT: process.env.PORT || 8080
};

module.exports = config;
