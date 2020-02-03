import database from '../src/models';
import Sequelize from 'sequelize';
const Op = Sequelize.Op

class BookService {
	
	/**
	 * Requests all available books from the database
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
	 * return Arr books by author id
	 * @returns {Promise<*>}
	 */
	static async getByAuthor(id) {
		try {
			return await database.Author.findOne({
				where:{ 'id' : id }
			})
			.then( author => {
				if(author) return author.getBooks()
			})
		} catch (error) {
			throw error;
		}
	}

	
	/**
	 * return Arr author by books id
	 * @returns {Promise<*>}
	 */
	static async getAuthors(id) {
		try {
			return await database.Book.findOne({
				where:{ 'id' : id }
			})
			.then( book => {
				if(book) return book.getAuthors()
			})
		} catch (error) {
			throw error;
		}
	}

	static async getSearchInfo(value) {
		try {
			return await database.Book.findAll({
				where:{ 'title' : { [Op.iRegexp]: '^('+value+')' } },
			});
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
			return await database.Book.findAndCountAll({});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Requests party of available books from the database
	 * @returns {Promise<*>}
	 */
	static async getParty({limit, page}) {
		try {
			console.log(limit, page)
			return await database.Book.findAll({
				limit,
				offset: page*limit
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Adds the Book to the database.
	 * если не указан id автора , то автор будет создан автоматически 
	 * @param {Object} data - Book information
	 * @returns {Promise<*>}
	 */
	static async add(data) {
		try {
			return await database.Book.create(data)
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
						});
					});
					return Book
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