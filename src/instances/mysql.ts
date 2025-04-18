import { Sequelize } from 'sequelize-typescript';
import { SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Aluno } from '../models/Aluno';
import { Disciplina } from '../models/Disciplina';
import { Nota } from '../models/Nota';
import { Curso } from '../models/Curso';
import { Presenca } from '../models/Presenca';
import { AlunoDisciplina } from '../models/AlunoDisciplina';
import {Evento} from '../models/Evento';
import {Participante} from '../models/Participante';
import {EventoParticipante} from '../models/EventoParticipante';


dotenv.config();

const dbConfig: SequelizeOptions = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  models: [Aluno, Disciplina, AlunoDisciplina, Evento, Participante, EventoParticipante,  Nota, Presenca ],
  logging: false,
};

export const sequelize = new Sequelize(dbConfig);

export const conectaBanco = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
  }
};
