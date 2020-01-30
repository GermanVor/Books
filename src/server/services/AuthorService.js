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
			return await database.author.count({});
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
			return await database.author.findAndCountAll({});
		} catch (error) {
			throw error;
		}
	}

	static async getSearchInfo(value) {
		try {
			return await database.author.findAll({
				where:{ 'name' : { [Op.iRegexp]: '^('+value+')' } },
				attributes: ['name', 'author_id']
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
			return await database.author.findAll({
				limit,
				offset: page*limit
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Adds the author to the database.
	 *
	 * @param {Object} data - author information
	 * @returns {Promise<*>}
	 */
	static async add(data) {
		try {
			return await database.author.create(data);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Updates the author with the given id with new information
	 *
	 * @param {String} author_id - author id
	 * @param {Object} data - author information
	 * @returns {Promise<*>}
	 */
	static async update(author_id, data) {
		try {
			const update = await database.author.findByPk(author_id);
			if (update) {
				await database.author.update(data, {where: {author_id}});
				return data;
			} else return null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests the author with the given id from the database
	 *
	 * @param {String} author_id - author id
	 * @returns {Promise<*>}
	 */
	static async get(author_id) {
		try {
			return await database.author.findByPk(author_id, {});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Removes the authors with the given id from the database
	 *
	 * @param {String} author_id - author id
	 * @returns {Promise<*>}
	 */
	static async remove(author_id) {
		try {
			const remove = await database.author.findByPk(author_id);
			if (remove) {
				return await database.author.destroy({where: {author_id}});
			} else return null;
		} catch (error) {
			throw error;
		}
	}
}

export default AuthorService;