const helmet = require('helmet')
const express = require('express')
const cors = require('cors')
const conf = require('rc')('app', {
	port: process.env.PORT || 3000
})

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(helmet())

app.listen(conf.port, () => {
	console.log(`app listening on port: ${conf.port}`)
})
console.log (conf)
