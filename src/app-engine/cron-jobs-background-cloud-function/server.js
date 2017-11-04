const express = require('express');

const { getMessages, processMessages } = require('./cron-executor');

const app = express();

app.get('/', (req, res) => {
  res.send('GAE Cron Service test');
});

app.get('/cron/events/createEmailRetry', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.get('X-Appengine-Cron') !== 'true') {
      return res.status(403);
    }
  }

  try {
    const msgs = await getMessages();
    if (msgs.length) {
      await processMessages(msgs);
    }
  } catch (error) {
    console.log('error happened', error);
  } finally {
    res.status(200);
  }
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
