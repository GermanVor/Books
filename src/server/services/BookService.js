import database from '../src/models';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;


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

	static async getTopByAuthor(top, id) {
		try {
			return await database.Author.findOne({
				where:{ 'id' : id }
			})
			.then( author => {
				if(author) return author.getBooks({ order: [['rating', 'DESC']], limit: top })
			})
		} catch (error) {
			throw error;
		}
	}
	
	/**
	 * return Arr author by books id
	 * @returns {Promise<*>}
	 */
	static async getAuthors(id){
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
					if( Array.isArray(data.authors) ) data.authors.forEach( el => {
						if( el.id ) {
							database.Author.findOne({
								where: {
									id: el.id 
								}
							})
							.then( author => {
								if(author) Book.addAuthor(author)
							})
						} else {
							database.Author.create(el)
							.then( author => { if(author) Book.addAuthor(author) })
						}
					});
					return Book
				})
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
			const update = await database.Book.findByPk(book_id)
			if (update) {

				await database.Book.update(data, {where: {id: book_id}});

				const Book = update;
				if( Array.isArray(data.authors) ) data.authors.forEach( el => {
					if( el.id ) {
						database.Author.findOne({
							where: {
								id: el.id 
							}
						})
						.then( author => {
							if(author){
								if( el.isDel) database.Enrolment.destroy({ where: { AuthorId: el.id, BookId: book_id } })
								else Book.addAuthor(author)
							}
						})
					} else {
						database.Author.create(el)
						.then( author => { if(author) Book.addAuthor(author) })
					}
				})

				return Book;
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
			const remove = await database.Book.findByPk(book_id)
				.then( book => {
					if(book){
						database.Enrolment.findAll({where: {BookId: book_id } })
						.then( elements => {
							elements.forEach( el => el.destroy() )
						})
					}
					return book
				});
			if (remove) {
				return await remove.destroy();
			} else return null;

		} catch (error) {
			throw error;
		}
	}
}

export default BookService;