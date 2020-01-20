module.exports = {

	/**
	 * UUID structure validator
	 *
	 * @param {String} value - uuid
	 * @returns {boolean}
	 */
	isUUID: value => {
		let s = `${value}`;
		s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
		return s !== null;
	},

	/**
	 * Integer validator
	 *
	 * @param {String || Number} value - value
	 * @returns {boolean}
	 */
	isInt: value => {
		return !isNaN(value) && parseInt(Number(value)) === value;
	}
};