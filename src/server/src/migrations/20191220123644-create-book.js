module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('book', {
			book_id: {allowNull: false, primaryKey: true, type: Sequelize.UUID},
			title: {allowNull: false, type: Sequelize.STRING},
			genre: {allowNull: false, type: Sequelize.STRING},
			description: {allowNull: true, type: Sequelize.STRING},
			rating: {allowNull: false, type: Sequelize.INTEGER},
			author_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {model: 'author', key: 'author_id'}
			}
		}),

	down: (queryInterface, Sequelize) =>
		queryInterface.dropTable('book')
};