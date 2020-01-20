module.exports = (sequelize, DataTypes) => {
	/**
	 * Book model
	 */
	const book = sequelize.define('book', {
		book_id: {allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
		title: DataTypes.STRING,
		description: DataTypes.STRING,
		genre: DataTypes.STRING,
		rating: DataTypes.INTEGER
	}, {freezeTableName: true, timestamps: false});

	/**
	 * For associations
	 */
	book.associate = models =>
		book.belongsTo(models.author, {foreignKey: 'author_id'});

	return book;
};