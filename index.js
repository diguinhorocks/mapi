'use strict'

const app = require('express')()
const Comic = require('./dist/resources/comic')

app.get('/comics', (req, res) => {

  let limit = req.query.limit || 20
  let offset = req.query.offset || 1

  Comic.get(limit, offset)
      .then(comics => res.json(comics))
      .catch(err => res.json(err))
});

app.get('/comics/:id', (req, res) => {

  Comic.read(req.params.id)
      .then(comic => res.json(comic))
      .catch(err => res.json(err))

})

app.get('/comics/:id/stories', (req, res) => {

  let limit = req.query.limit || 20
  let offset = req.query.offset || 1

  Comic.stories(req.params.id, limit, offset)
      .then(stories => res.json(stories))
      .catch(err => res.json(err))

})

app.listen(3000, () => { console.log("ok to run") })