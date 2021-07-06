const config = require('../../config')
const twitterLookupEndpoint = 'https://api.twitter.com/2/tweets/'
const twitterBearerToken = config.twitter.bearer_token
const needle = require('needle')

function fetchTweetIdFromUrl(url) {
	let r = url.split('/')
	let c = r.findIndex(el => el == 'status')
	return r[c+1]
}

async function fetchFromTwitter(id, text, image) {
	const params = {
		'expansions': 'author_id',
		'user.fields': 'profile_image_url'
	}
	const r = await needle('get', twitterLookupEndpoint + id, params, {
		headers: {
			'User-Agent': 'v2TweetLookupJS',
			'authorization': `Bearer ${twitterBearerToken}`
		}
	})
	return {
		image: image? image : r['body']['includes']['users'][0]['profile_image_url'],
		author: r['body']['includes']['users'][0]['username'],
		text: text? text: r['body']['data']['text']
	}
}

module.exports = {
	fetchTweetIdFromUrl, fetchFromTwitter
}