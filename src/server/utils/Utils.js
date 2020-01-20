export default class Util {
	constructor() {
		this.statusCode = null;
		this.type = null;
		this.data = null;
		this.message = null;
	}
	/**
	 * Create Success message with details
	 * @param {Number} statusCode - message status code
	 * @param {String} message - message
	 * @param {Object} data - message details
	 */
	setSuccess(statusCode, message, data) {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
		this.type = 'success';
	}

	/**
	 * Create Error message with details
	 * @param {Number} statusCode - message status code
	 * @param {String} message - message
	 */
	setError(statusCode, message) {
		this.statusCode = statusCode;
		this.message = message;
		this.type = 'error';
	}

	/**
	 * Send generated message to client
	 * @param {Object} res - response
	 */
	
	send(res) {
		const result = {status: this.type, message: this.message, data: this.data};

		return (this.type === 'success') ?
			res.status(this.statusCode).json(result) :
			res.status(this.statusCode).json({status: this.type, message: this.message});
	}
}