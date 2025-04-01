import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";
import { AlunoDisciplina } from "./AlunoDisciplina";   
import { Evento } from './Evento';
import { Participante } from './Participante';
import  {EventoParticipante}  from './EventoParticipante';


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
    
Evento.belongsToMany(Participante, {
    through: 'EventoParticipantes',
    foreignKey: 'eventoId',
  });
  
  Participante.belongsToMany(Evento, {
    through: 'EventoParticipantes',
    foreignKey: 'participanteId',
  });
  

  console.log("relações entre as models configuradas!");

