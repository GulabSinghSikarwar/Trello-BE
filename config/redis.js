const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.error(`Redis connection error: ${err}`);
});

module.exports = client;
