import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";
import { AlunoDisciplina } from "./AlunoDisciplina";   
import { Evento } from './Evento';
import { Participante } from './Participante';
import  {EventoParticipante}  from './EventoParticipante';

Aluno.belongsToMany(Disciplina, {
    through: AlunoDisciplina,
    foreignKey:"alunoId"
});

Disciplina.belongsToMany(Aluno, {
    through: AlunoDisciplina,
    foreignKey: "disciplinaId"
});

console.log("relações entre as models configuradas!");

Evento.belongsToMany(Participante, { through: EventoParticipante });
Participante.belongsToMany(Evento, { through: EventoParticipante });
