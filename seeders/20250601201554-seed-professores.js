'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const professores = [
      {
        nome: 'Jussara Sandri',
        email: 'jussara@ifpr.edu.br',
        matricula: 'P1001',
        senha: await bcrypt.hash('123456', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Wagner Weinert',
        email: 'wagner@ifpr.edu.br',
        matricula: 'P1002',
        senha: await bcrypt.hash('123456', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Elvis Canteri',
        email: 'elvis@ifpr.edu.br',
        matricula: 'P1003',
        senha: await bcrypt.hash('123456', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Maria Carolina',
        email: 'maria@ifpr.edu.br',
        matricula: 'P1004',
        senha: await bcrypt.hash('123456', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Roberto Teixeira',
        email: 'roberto@ifpr.edu.br',
        matricula: 'P1005',
        senha: await bcrypt.hash('123456', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
            {
        nome: 'Luccas Kayure',
        email: 'kayure@ifpr.edu.br',
        matricula: 'P1006',
        senha: await bcrypt.hash('123456', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('professores', professores, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('professores', null, {});
  }
};
