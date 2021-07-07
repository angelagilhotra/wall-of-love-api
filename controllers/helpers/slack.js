// import config
import { config } from '../../config/index.js'

// initialise constants
import { WebClient } from '@slack/web-api'
const slackBotToken = config.slack.bot_token
const slackClient = new WebClient(slackBotToken)

/**
 * fetch a slack message details (image, author, message) given channel and message id
 * @param {string} conversationId slack channel id
 * @param {string} messageId timestamp of the message
 * @param {string} o_text overridden text
 * @param {string} o_image overriden image
 * @returns { image: image of author, author: author name, text: text of the message }
 */
export async function fetchSlackMessage({
	conversationId, messageId, o_text, o_image
}) {
	let r = await slackClient.conversations.history({
		channel: conversationId,
		inclusive: true,
		limit: 1,
		latest: messageId,
		oldest: messageId
	})
	let _text = r['messages'][0]['text']
	let text = await replaceMentionedUsers (_text)
	let _author = await slackClient.users.info({
		'user': r['messages'][0]['user']
	})
	let author = _author['user']['real_name']
	let image = _author['user']['profile']['image_72']

	if (o_text) {
		text = o_text
	}
	if (o_image) {
		image = o_image
	}

	if (r.ok) {
		return {image, author, text}
	} else return 'error'
}

/**
 *
 * @param {string} url url of a message from slack
 * @returns {conversationid: channel id, messageId: timestamp}
 */
export function fetchSlackConversationAndMessageId (url) {
	let r = url.split('/')
	let c = r.findIndex(el => el == 'archives')
	let messageId = (r[c+2].replace('p', '') * 0.000001).toFixed(6)
	return { conversationId: r[c+1], messageId }
}

async function replaceMentionedUsers(text) {
	let t = text
	const matches = text.matchAll('\<([^>]*)\>')
	const mentionedUsers = []
	for (const match of matches) {
		if (match[1].substring(1)[0] == 'U') {
			mentionedUsers.push(match[1].substring(1))
		}
	}
	for (let user of mentionedUsers) {
		let name = (await slackClient.users.info({ user }))['user']['real_name']
		t = t.replace('<@' + user + '>', name)
	}
	return t
}
