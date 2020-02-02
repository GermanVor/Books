module.exports = {
  up: (queryInterface, Sequelize) => {
    // Product belongsToMany Tag
    return queryInterface.createTable(
      'Enrolment',
      { 
        BookId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        AuthorId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    // remove table
    return queryInterface.dropTable('Enrolment');
  },
};