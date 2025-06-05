'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const turmas = [
      {
        nome: 'Turma A - Tarde',
        professorId: 1, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Turma B - Noite',
        professorId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Turma C - Manhã',
        professorId: 3,  
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('turmas', turmas, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('turmas', null, {});
  }
};
