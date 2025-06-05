'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const presencas = [
      // Ana Luiza - A1001
      { alunoId: 1, disciplinaId: 1, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { alunoId: 1, disciplinaId: 2, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },

      // Ana Paula - A1002
      { alunoId: 2, disciplinaId: 1, presente: false, data: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { alunoId: 2, disciplinaId: 2, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },

      // Alan Tomaz - A1003
      { alunoId: 3, disciplinaId: 1, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { alunoId: 3, disciplinaId: 2, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },

      // Alice França - A1004
      { alunoId: 4, disciplinaId: 1, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { alunoId: 4, disciplinaId: 2, presente: false, data: new Date(), createdAt: new Date(), updatedAt: new Date() },

      // Thierry Cassino - A1005
      { alunoId: 5, disciplinaId: 1, presente: false, data: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { alunoId: 5, disciplinaId: 2, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },

      // Kemuly Lau -  A1006
      { alunoId: 6, disciplinaId: 1, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },
      { alunoId: 6, disciplinaId: 2, presente: true, data: new Date(), createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('presencas', presencas, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('presencas', null, {});
  }
};
