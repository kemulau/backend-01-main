# Backend API 🚀

API desenvolvida com **Node.js**, **Express**, **TypeScript** e **Sequelize**, que gerencia dados educacionais e eventos com relacionamentos complexos.

## 🔧 Funcionalidades

Esta API oferece suporte completo às seguintes entidades e operações:

### 📚 Alunos
- Cadastro, listagem, atualização e remoção de alunos
- Vinculação com disciplinas
- Registro de presença e nota por disciplina
- Cálculo de média e percentual de presença
- Situação final do aluno (Aprovado/Reprovado)

### 🧑‍🏫 Professores
- Cadastro, listagem, atualização e exclusão
- Armazenamento seguro da senha

### 📘 Disciplinas
- CRUD completo
- Relação com alunos

### 🏫 Cursos
- Cadastro e gerenciamento de cursos disponíveis

### 👥 Turmas
- Associação entre cursos, professores e alunos
- Gestão de turmas vinculadas a disciplinas

### ✅ Presenças
- Registro individual de presença por aluno/disciplina
- Cálculo do percentual de frequência

### 📝 Notas
- Registro de notas por aluno/disciplina
- Cálculo de média e verificação de aprovação

### 📅 Eventos
- Cadastro e listagem de eventos
- Associação de participantes a eventos

### 👤 Participantes
- Gerenciamento de dados de participantes de eventos

### 🔍 Relatórios e Cálculos
- Alunos reprovados por nota ou frequência (`/disciplinas/:id/reprovados`)
- Situação individual do aluno (`/alunos/:id/situacao`)
- Médias e frequências por aluno

  

## 🎯 Como executar

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados no arquivo `.env`.

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run start-dev
```

---

## 🧪 Scripts disponíveis

```bash
npm install express sequelize mysql2 sequelize-typescript cors dotenv # instala todas as dependêcias
npm install --save-dev typescript ts-node-dev @types/express @types/node # Roda as dependências de desenvolvimento
npm run start  # Inicia o servidor normalmente
npm run start-dev # Inicia com nodemon e ts-node
npx jest --runInBand --detectOpenHandles # Roda os testes em série e detecta handles abertos

```

---

## 📦 Dependências

- **express** – Framework para criação de aplicações web
- **sequelize** – ORM para bancos relacionais
- **sequelize-typescript** – Integração entre Sequelize e TypeScript
- **mysql2** – Driver do MySQL
- **typescript** – Superset do JavaScript com tipagem
- **ts-node** – Executa arquivos TypeScript diretamente no Node.js
- **nodemon** – Reinicia o servidor automaticamente a cada alteração
- **dotenv** – Gerencia variáveis de ambiente

---


Atividade Pair Programming, todos os testes ok (alan e kemuly ❤)

