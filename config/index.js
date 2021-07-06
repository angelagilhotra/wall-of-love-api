const conf = require('rc')('app')

module.exports = {
	port: process.env.PORT || 3000,
	...conf
}
