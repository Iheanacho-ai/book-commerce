const cron = require('node-cron');

cron.schedule('0 9 * * *', () => {
    // Task logic goes here
    console.log('Cron job is running...');
  });
  