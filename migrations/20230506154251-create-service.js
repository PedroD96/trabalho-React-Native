'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      typeService: {
        type: Sequelize.STRING
      },
      step: {
        type: Sequelize.INTEGER
      },
      sector: {
        type: Sequelize.STRING
      },
      descriptionService: {
        type: Sequelize.STRING
      },
      imagem: {
        type: Sequelize.BLOB('long')
      },
      enterpriseId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'enterprises',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Services');
  }
};
