// import { LoggerInstance as Logger } from '../loaders/logger.js'
import { fetchSlackConversationAndMessageId, fetchSlackMessage } from './helpers/slack.js'
import { fetchFromTwitter, fetchTweetIdFromUrl } from './helpers/twitter.js'
import Prisma from '@prisma/client'
import {LoggerInstance as Logger} from '../loaders/logger.js'
const { PrismaClient } = Prisma
const prisma = new PrismaClient()

const supportedFormats = ['twitter', 'slack', '{generic}']

export const parseAndUploadTestimonials = async (req, res, next) => {
	let data = []
	for (const obj of req.testimonials) {
		let testimonialObject = {
			id: '',
			link: '',
			override_text: '',
			override_image: '',
			source: ''
		}
		const keys = Object.keys(testimonialObject)
		for (const key of keys) {
			testimonialObject[key] = obj[key]
		}
		for (let source of supportedFormats) {
			if (obj['link'].includes(source)) testimonialObject['source'] = source
		}
		data.push(await parseSource(testimonialObject))
	}
	await upload(data)
	req.responsePayload = data
	next()
}
const parseSource = async (obj) => {
	let parsed
	// twitter
	if (obj['source'] == supportedFormats[0]) {
		let tweetId = fetchTweetIdFromUrl(obj['link'])
		parsed = await fetchFromTwitter({
			id: tweetId
		})
	}
	// slack
	if (obj['source'] == supportedFormats[1]) {
		let { conversationId, messageId } = fetchSlackConversationAndMessageId(obj['link'])
		parsed = await fetchSlackMessage({
			conversationId, messageId
		})
	}

	return {
		...obj,
		image: parsed['image'],
		author: parsed['author'],
		text: parsed['text']
	}
}
/**
 * find a testimonial in the local database
 * if found - update
 * if not found - create new
 * find happens via 'id'
 * @param {array} data array of testimonial objects
 */
const upload = async (data) => {
	for (const testimonial of data) {
		await prisma.testimonials.upsert ({
			where: {
				id: testimonial.id
			},
			create: {
				id: testimonial.id,
				source: testimonial.source,
				url: testimonial.link,
				author_name: testimonial.author,
				text: testimonial.text,
				author_image: testimonial.image
			},
			update: {
				source: testimonial.source,
				url: testimonial.link,
				author_name: testimonial.author,
				text: testimonial.text,
				author_image: testimonial.image
			}
		})
	}
}

export const fetchTestimonialsRaw = async (req, res, next) => {
	const data = await prisma.testimonials.findMany({
		orderBy:{
			id: 'asc'
		},
		where: {
			stale: false
		}
	})
	req.responsePayload = data
	next()
}

export const updateStale = async (req, res, next) => {
	// mark stale: true for all records
	await prisma.testimonials.updateMany({
		data: { stale: true }
	})
	// mark stale: false for given record Ids
	let data = []
	for (const recordId of req.testimonialRecordIds) {
		try {
			data.push(await prisma.testimonials.update({
				where: { id: recordId },
				data: { stale: false },
				select: { id: true }
			}))
		} catch (err) {
			Logger.error(err)
			Logger.error('error on update')
		}
	}
	req.responsePayload = data
	next()
}
