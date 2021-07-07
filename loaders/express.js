import express from 'express'
import cors from 'cors'
import routes from '../api/index.js'

export default function (app) {
	app.get('/status', (req, res) => {
		res.status(200).end()
	})
	app.head('/status', (req, res) => {
		res.status(200).end()
	})
	app.enable('trust proxy')
	// The magic package that prevents frontend developers going nuts
	// Alternate description:
	// Enable Cross Origin Resource Sharing to all origins by default
	app.use(cors())
	app.use(express.json({ limit: '50mb' }))
	app.use('/', routes())
	/// catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err = new Error('Not Found')
		err['status'] = 404
		next(err)
	})
	/// error handlers
	app.use((err, req, res, next) => {
		/**
     * Handle 401 thrown by express-jwt library
     */
		if (err.name === 'UnauthorizedError') {
			return res
				.status(err.status)
				.send({ message: err.message })
				.end()
		}
		return next(err)
	})
	app.use((err, req, res, next) => {
		res.status(err.status || 500)
		res.json({
			errors: {
				message: err.message,
			},
		})
	})
}
