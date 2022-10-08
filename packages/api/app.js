const app = require('express')();
const cors = require('cors');
const redis = require('promise-redis')();

const client = redis.createClient({
  url: 'redis://default:redispw@127.0.0.1:55000'
});
const Comic = require('./resources/comic');

client.on('error', (error) => {
  throw new Error(error);
});

app.use(cors());

app.get('/comics', async (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 1;

  const getComicListResult = async (comics) => {
    await client.setex(`/comics?${JSON.stringify(req.query)}`, 14400, JSON.stringify(comics));
    return res.json(comics);
  };

  const cacheResult = await client.get(`/comics?${JSON.stringify(req.query)}`);

  if (cacheResult) {
    return res.json(JSON.parse(cacheResult));
  }

  return Comic.get(limit, offset)
    .then(getComicListResult)
    .catch((err) => res.json(err));
});

app.get('/comics/:id', async (req, res) => {

  const getComicResult = async (comic) => {
    await client.setex(`/comics/${comic.id}`, 14400, JSON.stringify(comics));
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
