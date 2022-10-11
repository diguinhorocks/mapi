require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const redis = require('redis');
const config = require('./config/config');

const client = redis.createClient({
  url: config.redis.uri,
});

(async () => {
  await client.connect();
})();

const Comic = require('./resources/comic');

client.on('error', (error) => {
  throw new Error(error);
});

app.use(cors());

app.get('/comics', async (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 1;

  const getComicListResult = async (comics) => {
    await client.json.set(`/comics?${JSON.stringify(req.query)}`, '.', JSON.stringify(comics), 14400, 'EX');
    return res.json(comics);
  };

  const cacheResult = await client.json.get(`/comics?${JSON.stringify(req.query)}`);

  if (cacheResult) {
    return res.json(JSON.parse(cacheResult));
  }

  return Comic.get(limit, offset)
    .then(getComicListResult)
    .catch((err) => res.json(err));
});

app.get('/comics/:id', async (req, res) => {
  const getComicResult = async (comic) => {
    await client.setex(`/comics/${comic.id}`, 14400, JSON.stringify(comic));
    return res.json(comic);
  };

  const cacheResult = await client.get(`/comics/${req.params.id}`);

  if (cacheResult) {
    return res.json(JSON.parse(cacheResult));
  }

  return Comic.read(req.params.id)
    .then(getComicResult)
    .catch((err) => res.json(err));
});

app.get('/comics/:id/stories', (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 1;

  Comic.stories(req.params.id, limit, offset)
    .then((stories) => res.json(stories))
    .catch((err) => res.json(err));
});

export default app;
