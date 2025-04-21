import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";
import { AlunoDisciplina } from "./AlunoDisciplina";
import { Evento } from './Evento';
import { Participante } from './Participante';
import { EventoParticipante } from './EventoParticipante';
import { Curso } from "./Curso";
import { Turma } from "./Turma";
import { Professor } from "./Professor";
import { Nota } from "./Nota";
import { Presenca } from "./Presenca";

// Relacionamento N:N entre Aluno e Disciplina
Aluno.belongsToMany(Disciplina, {
  through: AlunoDisciplina,
  foreignKey: 'alunoId',
  otherKey: 'disciplinaId'
});

Disciplina.belongsToMany(Aluno, {
  through: AlunoDisciplina,
  foreignKey: 'disciplinaId',
  otherKey: 'alunoId'
});

// Relacionamento N:N entre Evento e Participante
Evento.belongsToMany(Participante, {
  through: EventoParticipante,
  foreignKey: 'eventoId',
  otherKey: 'participanteId'
});

Participante.belongsToMany(Evento, {
  through: EventoParticipante,
  foreignKey: 'participanteId',
  otherKey: 'eventoId'
});

// Curso 1:N Turmas
Curso.hasMany(Turma, { foreignKey: 'cursoId' });
Turma.belongsTo(Curso, { foreignKey: 'cursoId' });

// Turma 1:N Alunos
Turma.hasMany(Aluno, { foreignKey: 'turmaId' });
Aluno.belongsTo(Turma, { foreignKey: 'turmaId' });

// Disciplina 1:N Notas
Disciplina.hasMany(Nota, { foreignKey: 'disciplinaId' });
Nota.belongsTo(Disciplina, { foreignKey: 'disciplinaId' });

// Aluno 1:N Notas
Aluno.hasMany(Nota, { foreignKey: 'alunoId' });
Nota.belongsTo(Aluno, { foreignKey: 'alunoId' });

// Disciplina 1:N Presenças
Disciplina.hasMany(Presenca, { foreignKey: 'disciplinaId' });
Presenca.belongsTo(Disciplina, { foreignKey: 'disciplinaId' });

// Aluno 1:N Presenças
Aluno.hasMany(Presenca, { foreignKey: 'alunoId' });
Presenca.belongsTo(Aluno, { foreignKey: 'alunoId' });

// Professor 1:N Turmas (se houver esse vínculo)
Professor.hasMany(Turma, { foreignKey: 'professorId' });
Turma.belongsTo(Professor, { foreignKey: 'professorId' });

console.log("relações entre as models configuradas! Vai nessa, gata!! 💅");
