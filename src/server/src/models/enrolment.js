module.exports = (sequelize, DataTypes) => {
	/**
	 * Book model
	 */
	const Enrolment = sequelize.define('Enrolment', {
	}, {freezeTableName: true, timestamps: false});

	/**
	 * For associations
	 */
	
	return Enrolment;
};