const { PrismaClient } = require('@prisma/client')
const Logger = require('../loaders/logger')
const prisma = new PrismaClient()

async function main() {
	// fetch all
	// const allUsers = await prisma.testimonials.findMany()
	// console.dir(allUsers, { depth: null })
	// write
	// await prisma.testimonials.create({
	// 	data: {
	// 		source: 'https://kernel-community.slack.com/archives/C01K23VM201/p1624819236375900',
	// 		text: 'ok',
	// 		author_image: 'image',
	// 		url: 'url'
	// 	},
	// })
}

main()
	.catch(e => {
		Logger.error(e)
		throw e
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
