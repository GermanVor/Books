import database from '../src/models';
import Sequelize from 'sequelize';
const Op = Sequelize.Op

class AuthorService {

	/**
	 * Requests all available authors from the database
	 *
	 * @returns {Promise<*>}
	 */
	static async getAll() {
		try {
			return await database.Author.count({});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests info database
	 *
	 * @returns {Promise<*>}
	 */
	static async getInfo() {
		try {
			return await database.Author.findAndCountAll({});
		} catch (error) {
			throw error;
		}
	}

	static async getSearchInfo(value) {
		try {
			return await database.Author.findAll({
				where:{ 'name' : { [Op.iRegexp]: '^('+value+')' } },
				// attributes: ['name', 'id']
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests party of available authors from the database
	 *
	 * @returns {Promise<*>}
	 */
	static async getParty({limit, page}) {
		try {
			return await database.Author.findAll({
				limit,
				offset: page*limit
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Adds the Author to the database.
	 * Если объект содержит books , то предполагается , что у эти книг только один автор
	 * @param {Object} data - Author information
	 * @returns {Promise<*>}
	 */
	static async add(data) {
		try {
			return await database.Author.create(data)
				.then( Author =>{
					if( Array.isArray(data.books) ) data.books.forEach( el => {
						database.Book.create(el)
						.then( book => Author.addBook(book) )
					});
					return Author;
				})				
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Updates the Author with the given id with new information
	 *
	 * @param {String} id - Author id
	 * @param {Object} data - Author information
	 * @returns {Promise<*>}
	 */
	static async update(id, data) {
		try {
			const update = await database.Author.findByPk(id);
			if (update) {
				await database.Author.update(data, {where: {id}});
				return data;
			} else return null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests the Author with the given id from the database
	 *
	 * @param {String} id - Author id
	 * @returns {Promise<*>}
	 */
	static async get(id) {
		try {
			return await database.Author.findByPk(id, {});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Removes the authors with the given id from the database
	 *
	 * @param {String} id - Author id
	 * @returns {Promise<*>}
	 */
	static async remove(id) {
		try {
			const remove = await database.Author.findByPk(id);
			if (remove) {
				return await database.Author.destroy({where: {id}});
			} else return null;
		} catch (error) {
			throw error;
		}
	}
}

export default AuthorService;