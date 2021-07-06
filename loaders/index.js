const expressLoader = require('./express')
const Logger = require('./logger')

module.exports = async (app) => {
	await expressLoader(app)
	Logger.info('✌️ Express loaded')
}
