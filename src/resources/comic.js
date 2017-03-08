const config = require('../config/config')
const request = require('request-promise')
const md5 = require('js-md5')

request = request.defaults({
	headers: {
		"Content-Type": "application/json"
	},
	json: true
})

const ts = String(Date.now())
const hash = md5(`${ts}${config.pkey}${config.apikey}`)

class Comic {

	constructor() {}

	async get(limit = 20, offset = 1) {

		let comics = await request(`${config.endpoint}/comics?apikey=${config.apikey}&ts=${ts}&hash=${hash}&limit=${limit}&offset=${offset}`)
					.then((res) => res)
					.catch(err => Promise.reject(err.error))

		return comics
	}

	async read(id) {

		let comic = await request(`${config.endpoint}/comics/${id}?apikey=${config.apikey}&ts=${ts}&hash=${hash}`)
					.then((res) => res)
					.catch(err => Promise.reject(err.error))

		return comic
	}

	async stories(comicId, limit = 20, offset = 1) {

		let stories = await request(`${config.endpoint}/comics/${comicId}/stories?apikey=${config.apikey}&ts=${ts}&hash=${hash}&limit=${limit}&offset=${offset}`)
					.then((res) => res)
					.catch(err => Promise.reject(err.error))

		return stories

	}
}

module.exports = new Comic()