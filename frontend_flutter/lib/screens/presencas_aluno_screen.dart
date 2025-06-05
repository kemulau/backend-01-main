import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class PresencasAlunoScreen extends StatefulWidget {
  const PresencasAlunoScreen({super.key});

  @override
  State<PresencasAlunoScreen> createState() => _PresencasAlunoScreenState();
}

class _PresencasAlunoScreenState extends State<PresencasAlunoScreen> {
  List<dynamic> alunos = [];
  List<dynamic> presencas = [];
  int? alunoSelecionado;
  String nomeAluno = '';
  bool carregando = true;
  bool acessoNegado = false;
  String erro = '';

  @override
  void initState() {
    super.initState();
    verificarPermissao();
  }

  Future<void> verificarPermissao() async {
    final prefs = await SharedPreferences.getInstance();
    final tipo = prefs.getString('tipoUsuario') ?? 'aluno';

    if (tipo != 'professor') {
      setState(() {
        acessoNegado = true;
        carregando = false;
      });
    } else {
      carregarAlunos();
    }
  }

  Future<void> carregarAlunos() async {
    try {
      final dados = await ApiService.listarAlunos();
      setState(() {
        alunos = dados;
        carregando = false;
      });
    } catch (e) {
      setState(() {
        erro = 'Erro ao carregar alunos: $e';
        carregando = false;
      });
    }
  }

  Future<void> carregarPresencas(int alunoId, String nome) async {
    setState(() {
      carregando = true;
      alunoSelecionado = alunoId;
      nomeAluno = nome;
      presencas = [];
    });

    try {
      final dados = await ApiService.listarPresencasDoAluno(alunoId);
      setState(() {
        presencas = dados;
        carregando = false;
      });
    } catch (e) {
      setState(() {
        erro = 'Erro ao carregar presenças: $e';
        carregando = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          alunoSelecionado == null ? 'Presenças dos Alunos' : 'Presenças - $nomeAluno',
        ),
        backgroundColor: Colors.white,
        foregroundColor: ifprGreen,
        centerTitle: true,
        elevation: 1,
      ),
      backgroundColor: const Color(0xFFF2F6FC),
      body: carregando
          ? const Center(child: CircularProgressIndicator())
          : erro.isNotEmpty
              ? Center(
                  child: Text(
                    erro,
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                )
              : acessoNegado
                  ? const Center(
                      child: Text(
                        'Acesso negado: apenas professores podem visualizar esta tela.',
                        style: TextStyle(color: Colors.red, fontSize: 16),
                        textAlign: TextAlign.center,
                      ),
                    )
                  : alunoSelecionado == null
                      ? _buildListaAlunos(ifprGreen)
                      : _buildListaPresencas(ifprGreen),
    );
  }

  Widget _buildListaAlunos(Color ifprGreen) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: alunos.length,
      itemBuilder: (context, index) {
        final aluno = alunos[index];
        return Card(
          elevation: 4,
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: ListTile(
            leading: const Icon(Icons.person, color: Color(0xFF198754)),
            title: Text(aluno['nome'] ?? ''),
            subtitle: Text('Matrícula: ${aluno['matricula'] ?? ''}'),
            onTap: () => carregarPresencas(aluno['id'], aluno['nome']),
          ),
        );
      },
    );
  }

  Widget _buildListaPresencas(Color ifprGreen) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              ElevatedButton.icon(
                icon: const Icon(Icons.arrow_back),
                label: const Text('Voltar'),
                onPressed: () {
                  setState(() {
                    alunoSelecionado = null;
                    presencas = [];
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: ifprGreen,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: presencas.isEmpty
              ? const Center(child: Text('Nenhum dado de presença encontrado.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: presencas.length,
                  itemBuilder: (context, index) {
                    final p = presencas[index];
                    return Card(
                      elevation: 3,
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: ListTile(
                        title: Text(
                          p['disciplina'] ?? '',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text('Presença: ${p['percentual'] ?? '0%'}'),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
