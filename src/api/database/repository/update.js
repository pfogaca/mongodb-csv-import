const moment = require('moment')
const { safeAwait } = require('../../../utils/error')

module.exports = ({ database }) => {

	/**
   	 * @description Cria em uma collection
   	 * @param {object} values
   	 * @param {string} collectionName
   	 * @returns {object}
   	 */
	const createCollection = (collectionName) => safeAwait(
		async () => {
			const client = await database
			const db = client.db(process.env.DB_NAME)
			const create = await db.createCollection(collectionName)

			db.close

			return !create // Retorna true se criado com sucesso
		}
	)

	/**
   	 * @description Limpa dados em uma collection
   	 * @param {object} values
   	 * @param {string} collectionName
   	 * @returns bool
   	 */
	const dropCollection = (collectionName) => safeAwait(
		async () => {
			const client = await database
			const db = client.db(process.env.DB_NAME)

			const list = await db.listCollections({ name:collectionName }).toArray()

			if (list.length === 0) {
				db.close
				return true
			}

			const drop = await db.dropCollection(collectionName)

			db.close

			return !drop // Retorna true se drop com sucesso
		}
	)
	
	/**
   	 * @description Confere se collection existe
   	 * @param {object} values
   	 * @param {string} collectionName
   	 * @returns {object}
   	 */
	const checkCollection = (collectionName) => safeAwait(
		async () => {
			const client = await database
			const db = client.db(process.env.DB_NAME)
			const collections = db.listCollections().toArray().map(c => c.name)

			db.close

			return collections.includes(collectionName) // Retorna true se collection existe
		}
	)

	/**
   	 * @description Insere dados em uma collection
   	 * @param {object} values
   	 * @param {string} collectionName
   	 * @returns {object}
   	 */
	const updateCollection = (values, collectionName) => safeAwait(
		async () => {
			const client = await database
			const db = client.db(process.env.DB_NAME)
			const collection = db.collection(collectionName)

			const insert = await collection.insertMany(values)

			db.close

			return {
				error: false,
				data: insert.insertedCount
			}
		}
	)

	return {
		createCollection,
		dropCollection,
		checkCollection,
		updateCollection
	}
}