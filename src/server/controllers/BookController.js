import BookService from '../services/BookService';
import Util from '../utils/Utils';
import {isUUID, isInt, isBook} from '../utils/validate';

const util = new Util();

class BookController {
	/**
	 * get all book control - validate and catch error
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async getAll(req, res) {
		try {
			const books = await BookService.getAll();
			if (books.length > 0)
				util.setSuccess(200, 'Books Received', books);
			else util.setSuccess(200, 'No Book found');
			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	/**
	 * get party of books control - validate and catch error
	 *
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async getParty(req, res) {
		try {
			const limit = Number(req.query.limit),
						page = Number(req.query.page)
			
			if( !(limit >= 1 && page >= 0) ) {
				util.setError(400, 'Invalid req.query');
				return util.send(res);
			}
			
			const books = await BookService.getParty({limit, page});

			if (books.length > 0)
				util.setSuccess(200, 'Books Received', books);
			else util.setSuccess(200, 'No Books found');

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	/**
	 * get author books control - validate and catch error
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async getByAuthor(req, res) {
		try {
			const {id} = req.params;

			if (!id || !isUUID(id)) {
				util.setError(400, 'Invalid UUID');
				return util.send(res);
			}
			
			const books = await BookService.getByAuthor(id) || [];
			util.setSuccess(200, 'Books Received', books);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	static async getTopByAuthor(req, res) {
		try {
			const top = Number(req.query.top),
						id = req.query.id
						
			if (!id || !isUUID(id) || !isInt(top)) {
				util.setError(400, 'Invalid UUID');
				return util.send(res);
			}
			const books = await BookService.getTopByAuthor(top, id) || [];
			util.setSuccess(200, 'Books Received', books);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	/**
	 * getTopByAuthor
	 * get info of db 
	 *
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async getSearchInfo(req, res) {
		try {
			const arr = req.query.value? await BookService.getSearchInfo(req.query.value) : [];
			util.setSuccess(200, 'Books Received', arr);
			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}
	/**
	 * get author books control - validate and catch error
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async getAuthors(req, res) {
		try {
			const {id} = req.params;

			if (!id || !isUUID(id)) {
				util.setError(400, 'Invalid UUID');
				return util.send(res);
			}
			
			const authors = await BookService.getAuthors(id) || [];
			util.setSuccess(200, 'Authors Received', authors);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	/**
	 * add book control - validate and catch error
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async add(req, res) {
		if( !isBook(req.body) ) {
			util.setError(400, 'Incomplete information');
			return util.send(res);
		}
	
		try {
			const book = await BookService.add(req.body);
			
			util.setSuccess(201, 'Book Added', book);
			return util.send(res);
		} catch (error) {
			util.setError(400, error.message);
			return util.send(res);
		}
	}

		/**
	 * get info of db 
	 *
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async getInfo(req, res) {
		try {
			const {count} = await BookService.getInfo();

			util.setSuccess(200, 'Books Received',count);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	/**
	 * update book control - validate and catch error
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async update(req, res) {
		const data = req.body, {id} = req.params;
		if(!id || !isUUID(id)) {
			util.setError(400, 'Invalid UUID');
			return util.send(res);
		} else if(data.rating && !isInt(data.rating)) {
			util.setError(400, 'Invalid rating value');
			return util.send(res);
		} 

		try {
			const Book = await BookService.update(id, data);
			if (!Book)
				util.setError(404, `Book with the id ${id} cannot be found`);
			else util.setSuccess(200, 'Book updated', Book );
			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
	}

	/**
	 * get book control - validate and catch error
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async get(req, res) {
		const {id} = req.params;

		if (!id || !isUUID(id)) {
			util.setError(400, 'Invalid UUID');
			return util.send(res);
		}

		try {
			const book = await BookService.get(id);
			if (!book)
				util.setError(404, `Book with the id ${id} cannot be found`);
			else util.setSuccess(200, 'Book Found', book);
			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
	}

	/**
	 * remove book control - validate and catch error
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async remove(req, res) {
		const {id} = req.params;

		if (!id || !isUUID(id)) {
			util.setError(400, 'Invalid UUID');
			return util.send(res);
		}

		try {
			const book = await BookService.remove(id);

			if (book)
				util.setSuccess(200, 'Book deleted');
			else util.setError(404, `Book with the id ${id} cannot be found`);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}
}

export default BookController;