'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const disciplinas = [
      {
        nome: 'Lógica de Programação',
        cargaHoraria: 60,
        professorId: 1, // Jussara Sandri
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Banco de Dados',
        cargaHoraria: 60,
        professorId: 2, // Wagner Weinert
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
