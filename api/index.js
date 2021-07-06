const { Router } = require('express')
const wol = require('./routes/wol')

module.exports = () => {
	const app = Router()
	wol(app)
	return app
}
