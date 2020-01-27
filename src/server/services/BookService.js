import database from '../src/models';

class BookService {
	
	/**
	 * Requests all available books from the database
	 *
	 * @returns {Promise<*>}
	 */
	static async getAll() {
		try {
			return await database.book.findAll({include: [{all: true, nested: true}]});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests party of available books from the database
	 *
	 * @returns {Promise<*>}
	 */
	static async getParty({limit, page}) {
		try {
			return await database.book.findAll({
				limit,
				Offset: page*limit
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Adds the book to the database.
	 *
	 * @param {Object} data - book information
	 * @returns {Promise<*>}
	 */
	static async add(data) {
		try {
			return await database.book.create(data);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Updates the book with the given id with new information
	 *
	 * @param {String} book_id - book id
	 * @param {Object} data - book information
	 * @returns {Promise<*>}
	 */
	static async update(book_id, data) {
		try {
			const update = await database.book.findByPk(book_id);
			if (update) {
				await database.book.update(data, {where: {book_id}});
				return data;
			} else return null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests the book with the given id from the database
	 *
	 * @param {String} book_id - book id
	 * @returns {Promise<*>}
	 */
	static async get(book_id) {
		try {
			return await database.book.findByPk(book_id, {include: [{all: true, nested: true}]});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Removes the books with the given id from the database
	 *
	 * @param {String} book_id - book id
	 * @returns {Promise<*>}
	 */
	static async remove(book_id) {
		try {
			const remove = await database.book.findByPk(book_id);
			if (remove) {
				return await database.book.destroy({where: {book_id}});
			} else return null;
		} catch (error) {
			throw error;
		}
	}
}

export default BookService;