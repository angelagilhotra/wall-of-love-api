import Config from 'rc'
const conf = Config('app')
// import conf from ('rc')('app')

export const config = {
	port: process.env.PORT || 3000,
	...conf
}
