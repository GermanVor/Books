module.exports = (sequelize, DataTypes) => {
	/**
	 * Book model
	 */
	const Book = sequelize.define('Book', {
		id: {allowNull: false, primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
		title: DataTypes.STRING,
		description: DataTypes.STRING,
		genre: DataTypes.STRING,
		rating: DataTypes.INTEGER
	}, {freezeTableName: true, timestamps: false});

	/**
	 * For associations
	 */
	// Book.associate = models =>
	// 	Book.belongsTo(models.author, {foreignKey: 'author_id'});
	Book.associate = models => {
		Book.belongsToMany(models.Author, { through: 'Enrolment' });
  };

	return Book;
};