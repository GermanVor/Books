import AuthorService from '../services/AuthorService';
import Util from '../utils/Utils';
import {isUUID, isInt} from '../utils/validate';

const util = new Util();

class AuthorController {

	/**
	 * get all author control - validate and catch error
	 *
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async getAll(req, res) {
		try {
			const authors = await AuthorService.getAll();

			if (authors.length > 0)
				util.setSuccess(200, 'Authors Received', authors);
			else util.setSuccess(200, 'No Author found');

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
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
			const {count} = await AuthorService.getInfo();

			util.setSuccess(200, 'Authors Received',count);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
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
	static async getSearchInfo(req, res) {
		try {
			
			const arr = req.query.value? await AuthorService.getSearchInfo(req.query.value) : [];
			
			util.setSuccess(200, 'Authors Received', arr);
			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	/**
	 * get party of authors control - validate and catch error
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
			
			const authors = await AuthorService.getParty({limit, page});

			if (authors.length > 0)
				util.setSuccess(200, 'Authors Received', authors);
			else util.setSuccess(200, 'No Author found');

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}

	/**
	 * add author control - validate and catch error
	 *
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async add(req, res) {
		if (!req.body.name || !req.body.description) {
			util.setError(400, 'Incomplete information');
			return util.send(res);
		}
		try {
			const author = await AuthorService.add(req.body);
			util.setSuccess(201, 'Author Added', author);
			return util.send(res);
		} catch (error) {
			util.setError(400, error.message);
			return util.send(res);
		}
	}

	/**
	 * update author control - validate and catch error
	 *
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async update(req, res) {
		const data = req.body, {id} = req.params;

		if (!id || !isUUID(id)) {
			util.setError(400, 'Invalid UUID');
			return util.send(res);
		}

		try {
			const author = await AuthorService.update(id, data);

			if (!author)
				util.setError(404, `Author with the id ${id} cannot be found`);
			else util.setSuccess(200, 'Author updated', author);

			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
	}

	/**
	 * get author control - validate and catch error
	 *
	 * @param {Object} req - request
	 * @param {Object} res - response
	 * @returns {Promise<*>}
	 */
	static async get(req, res) {
		const {id} = req.params;
		console.log( id )
		if (!id || !isUUID(id)) {
			util.setError(400, 'Invalid UUID');
			return util.send(res);
		}

		try {
			const author = await AuthorService.get(id);

			if (!author)
				util.setError(404, `Author with the id ${id} cannot be found`);
			else util.setSuccess(200, 'Author Found', author);

			return util.send(res);
		} catch (error) {
			util.setError(404, error);
			return util.send(res);
		}
	}

	/**
	 * remove author control - validate and catch error
	 *
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
			const author = await AuthorService.remove(id);

			if (author)
				util.setSuccess(200, 'Author deleted');
			else util.setError(404, `Author with the id ${id} cannot be found`);

			return util.send(res);
		} catch (error) {
			util.setError(400, error);
			return util.send(res);
		}
	}
}

export default AuthorController;