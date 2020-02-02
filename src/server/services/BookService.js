import database from '../src/models';

class BookService {
	
	/**
	 * Requests all available books from the database
	 *
	 * @returns {Promise<*>}
	 */
	static async getAll() {
		try {
			return await database.Book.findAll({include: [{all: true, nested: true}]});
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * Requests authors available books from the database
	 *
	 * @returns {Promise<*>}
	 */
	static async getByAuthor(id) {
		try {
			return await database.Book.findAll({
				where:{ 'id' : id },
				//attributes: ['name', 'id']
			});
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
			return await database.Book.findAll({
				limit,
				Offset: page*limit
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Adds the Book to the database.
	 *
	 * @param {Object} data - Book information
	 * @returns {Promise<*>}
	 */
	static async add(data) {
		try {
			let res = undefined;
			
			res = await database.Book.create(data)
				.then( Book => {
					data.authors.forEach( el => {
							database.Author.findOne({
								where: {
									id: el.id || '1a1111d1-e1d1-1bda-1111-1111b1111111'
								}
							})
						.then( author => {
							if(!author){
								database.Author.create(el)
								.then( author => {
									Book.addAuthor(author)
								})
							} else Book.addAuthor(author)
						})
					}) 
				})

			return res;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Updates the Book with the given id with new information
	 *
	 * @param {String} book_id - Book id
	 * @param {Object} data - Book information
	 * @returns {Promise<*>}
	 */
	static async update(book_id, data) {
		try {
			const update = await database.Book.findByPk(book_id);
			if (update) {
				await database.Book.update(data, {where: {book_id}});
				return data;
			} else return null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests the Book with the given id from the database
	 *
	 * @param {String} book_id - Book id
	 * @returns {Promise<*>}
	 */
	static async get(book_id) {
		try {
			return await database.Book.findByPk(book_id, {include: [{all: true, nested: true}]});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Removes the books with the given id from the database
	 *
	 * @param {String} book_id - Book id
	 * @returns {Promise<*>}
	 */
	static async remove(book_id) {
		try {
			const remove = await database.Book.findByPk(book_id);
			if (remove) {
				return await database.Book.destroy({where: {book_id}});
			} else return null;
		} catch (error) {
			throw error;
		}
	}
}

export default BookService;