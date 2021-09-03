require('dotenv').config({ path: [__dirname, '/../.env'].join('') });
const req = require('request-promise');
const md5 = require('js-md5');
const config = require('../config/config');

const request = req.defaults({
  headers: {
    'Content-Type': 'application/json',
  },
  json: true,
});

const ts = String(Date.now());
const hash = md5(`${ts}${config.pkey}${config.apikey}`);

class Comic {
  async get(limit = 20, offset = 1) {
    this.comics = await request(`${config.endpoint}/comics?apikey=${config.apikey}&ts=${ts}&hash=${hash}&limit=${limit}&offset=${offset}`)
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));

    return this.comics;
  }

  async read(id) {
    this.comic = await request(`${config.endpoint}/comics/${id}?apikey=${config.apikey}&ts=${ts}&hash=${hash}`)
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));

    return this.comic;
  }

  async stories(comicId, limit = 20, offset = 1) {
    this.storyList = await request(`${config.endpoint}/comics/${comicId}/stories?apikey=${config.apikey}&ts=${ts}&hash=${hash}&limit=${limit}&offset=${offset}`)
      .then((res) => res)
      .catch((err) => Promise.reject(err.error));

    return this.storyList;
  }
}

module.exports = new Comic();
