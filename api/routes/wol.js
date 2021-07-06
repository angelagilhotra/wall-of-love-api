// import dependencies
const route = require('express').Router()
const { body, validationResult } = require('express-validator')
const Logger = require('../../loaders/logger')

// import helper functions
const { fetchSlackMessage, fetchSlackConversationAndMessageId } = require('../helpers/slack')
const { fetchTweetIdFromUrl, fetchFromTwitter } = require('../helpers/twitter')

// supported formats to parse testimonials
const supportedFormats = ['twitter', 'slack']

module.exports = async function wol (app) {
	app.use('/wol', route)
	// test route
	route.get('/', (req, res) => {
		res.status(200).json({
			message: 'Connected to Wall of Love!'
		})
	})
	route.post('/new',
		body('data').isArray(),
		async (req, res, next) => {
			if (!validationResult(req).isEmpty()) {
				Logger.error('validation error')
				return next(validationResult(req))
			}

			let allDataToStore = []
			for (let obj of req.body['data']) {
				let toStore = {}
				const { link, override_text, override_image } = {...obj}

				for (let source of supportedFormats) {
					if (link.includes(source)) toStore['source'] = source
				}
				toStore['url'] = link

				// parse and store tweet
				if (toStore['source'] == supportedFormats[0]) {
					let tweetId = fetchTweetIdFromUrl (link)
					toStore[supportedFormats[0]] = await fetchFromTwitter(tweetId, override_text, override_image)
				}

				// parse and store slack message
				if (toStore['source'] == supportedFormats[1]) {
					let { conversationId, messageId } = fetchSlackConversationAndMessageId(link)
					let data = await fetchSlackMessage(conversationId, messageId, override_text, override_image)
					toStore[supportedFormats[1]] = {...data}
				}
				allDataToStore.push(toStore)
			}
			// @todo store `allDataToStore` in local database
			// [{source: slack/twitter, url, slack/twitter: {image, author, text}},{}]
			// table = source | url | image | author | text
			res.status(200).json({
				data: allDataToStore
			})
		}
	)
}
