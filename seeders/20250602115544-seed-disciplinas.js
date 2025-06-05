'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const disciplinas = [
      {
        id: '1',
        nome: 'Lógica de Programação',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        nome: 'Banco de Dados',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('disciplinas', disciplinas, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('disciplinas', null, {});
  }
};
