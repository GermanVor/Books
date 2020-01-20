module.exports = {
	up: (queryInterface, Sequelize) =>
		queryInterface.createTable('author', {
			author_id: {allowNull: false, primaryKey: true, type: Sequelize.UUID},
			name: {allowNull: false, type: Sequelize.STRING},
			description: {allowNull: false, type: Sequelize.STRING}
		}),

	down: (queryInterface, Sequelize) =>
		queryInterface.dropTable('author')
};