'use strict';
module.exports = (sequelize, DataTypes) => {

	/**
	 * Author model
	 */
	const Author = sequelize.define('Author', {
		id: {allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
		OrderId: { type: DataTypes.INTEGER,	autoIncrement: true, primaryKey: true	},
		name: DataTypes.STRING,
		description: DataTypes.STRING
	}, {freezeTableName: true, timestamps: false});

	/**
	 * For associations
	 */
	Author.associate = models => {
		Author.belongsToMany(models.Book, { through: 'Enrolment' });
  };

	return Author;
};