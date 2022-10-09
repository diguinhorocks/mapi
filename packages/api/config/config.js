module.exports = {
  endpoint: process.env.ENDPOINT,
  apikey: process.env.API_KEY,
  pkey: process.env.PKEY,
  redis: {
    uri: process.env.REDIS_ENDPOINT
  }
};
