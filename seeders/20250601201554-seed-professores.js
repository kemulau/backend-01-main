'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const professores = [
      {
        id: '1',
        nome: 'Jussara Sandri',
        email: 'jussara@ifpr.edu.br',
        matricula: 'P1001',
        senha: await bcrypt.hash('123456', 10),
        tipo: 'professor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:'2',
        nome: 'Wagner Weinert',
        email: 'wagner@ifpr.edu.br',
        matricula: 'P1002',
        senha: await bcrypt.hash('123456', 10),
        tipo: 'professor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:'3',
        nome: 'Elvis Canteri',
        email: 'elvis@ifpr.edu.br',
        matricula: 'P1003',
        senha: await bcrypt.hash('123456', 10),
        tipo: 'professor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:'4',
        nome: 'Maria Carolina',
        email: 'maria@ifpr.edu.br',
        matricula: 'P1004',
        senha: await bcrypt.hash('123456', 10),
        tipo: 'professor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:'5',
        nome: 'Roberto Teixeira',
        email: 'roberto@ifpr.edu.br',
        matricula: 'P1005',
        senha: await bcrypt.hash('123456', 10),
        tipo: 'professor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:'6',
        nome: 'Luccas Kayure',
        email: 'kayure@ifpr.edu.br',
        matricula: 'P1006',
        senha: await bcrypt.hash('123456', 10),
        tipo: 'professor',
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
