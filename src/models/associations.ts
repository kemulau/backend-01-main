import { Aluno } from "./alunos";
import { Disciplina } from "./Disciplina";
import { AlunoDisciplina } from "./AlunoDisciplina";   

Aluno.belongsToMany(Disciplina, {
    through: AlunoDisciplina,
    foreignKey:"alunoId"
});

Disciplina.belongsToMany(Aluno, {
    through: AlunoDisciplina,
    foreignKey: "disciplinaId"
});

console.log("relações entre as models configuradas!");