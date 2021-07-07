// import dependencies
import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { LoggerInstance as Logger } from '../../loaders/logger.js'
import { parseAndUploadTestimonials, fetchTestimonialsRaw } from '../../controllers/TestimonialController.js'

const route = Router()

export function wol (app) {
	app.use('/wol', route)
	// test route
	route.get('/', (req, res) => {
		res.status(200).json({
			message: 'Connected to Wall of Love!'
		})
	})
	/**
	 * POST to upload testimonial to the Database
	 */
	route.post(
		'/new',
		body('data').isArray(),
		(req, res, next) => {
			if (!validationResult(req).isEmpty()) {
				Logger.error('validation error:\n', validationResult(req))
				return next({message: 'validation error'})
			}
			next()
		},
		parseAndUploadTestimonials
	)
	/**
	 * GET to fetch all testimonials, all columns
	 * @todo add pagination
	 */
	route.get('/raw', fetchTestimonialsRaw)
}
