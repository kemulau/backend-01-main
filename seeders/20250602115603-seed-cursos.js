'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const cursos = [
      {
        nome: 'Análise e Desenvolvimento de Sistemas',
        descricao: 'Curso superior tecnológico com foco em desenvolvimento de software.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Engenharia de Software',
        descricao: 'Curso voltado ao desenvolvimento e gerenciamento de sistemas de software.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('cursos', cursos, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cursos', null, {});
  }
};
