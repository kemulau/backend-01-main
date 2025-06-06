'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const alunos = [
      {
        id: '1',
        nome: 'Ana Luiza',
        email: 'ana.luiza@ifpr.edu.br',
        matricula: 'A1001',
        senha: await bcrypt.hash('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        nome: 'Ana Paula',
        email: 'ana.paula@ifpr.edu.br',
        matricula: 'A1002',
        senha: await bcrypt.hash('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        nome: 'Alan Tomaz',
        email: 'alan.tomaz@ifpr.edu.br',
        matricula: 'A1003',
        senha: await bcrypt.hash('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        nome: 'Alice França',
        email: 'alice.franca@ifpr.edu.br',
        matricula: 'A1004',
        senha: await bcrypt.hash('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        nome: 'Thierry Cassino',
        email: 'thierry.cassino@ifpr.edu.br',
        matricula: 'A1005',
        senha: await bcrypt.hash('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
        {
        id: '6',
        nome: 'Kemuly Lau',
        email: 'kemulau@ifpr.edu.br',
        matricula: 'A1006',
        senha: await bcrypt.hash('1234', 10),
        createdAt: new Date(),   
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('alunos', alunos, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alunos', null, {});
  }
};
