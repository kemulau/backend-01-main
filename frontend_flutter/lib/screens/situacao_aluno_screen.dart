import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SituacaoAlunoScreen extends StatefulWidget {
  const SituacaoAlunoScreen({super.key});

  @override
  State<SituacaoAlunoScreen> createState() => _SituacaoAlunoScreenState();
}

class _SituacaoAlunoScreenState extends State<SituacaoAlunoScreen> {
  List<dynamic> alunos = [];
  List<dynamic> situacoes = [];
  int? alunoSelecionado;
  String nomeSelecionado = '';
  bool carregando = true;
  String erro = '';

  @override
  void initState() {
    super.initState();
    carregarAlunos();
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

  Future<void> carregarSituacaoFinal(int alunoId, String nome) async {
    setState(() {
      alunoSelecionado = alunoId;
      nomeSelecionado = nome;
      carregando = true;
      erro = '';
    });

    try {
      final dados = await ApiService.listarSituacaoFinalDoAluno(alunoId);
      setState(() {
        situacoes = dados;
        carregando = false;
      });
    } catch (e) {
      setState(() {
        erro = 'Erro ao carregar situação: $e';
        carregando = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      appBar: AppBar(
        title: Text(alunoSelecionado == null
            ? 'Situação Final do Aluno'
            : 'Situação - $nomeSelecionado'),
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
              : alunoSelecionado == null
                  ? _buildListaAlunos()
                  : _buildSituacoes(),
    );
  }

  Widget _buildListaAlunos() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: alunos.length,
      itemBuilder: (context, index) {
        final aluno = alunos[index];
        return Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const CircleAvatar(
              backgroundColor: Color(0xFF198754),
              child: Icon(Icons.person, color: Colors.white),
            ),
            title: Text(
              aluno['nome'] ?? '',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF198754)),
            ),
            subtitle: Text('Matrícula: ${aluno['matricula'] ?? ''}'),
            onTap: () => carregarSituacaoFinal(aluno['id'], aluno['nome']),
          ),
        );
      },
    );
  }

  Widget _buildSituacoes() {
    const ifprGreen = Color(0xFF198754);

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
                    situacoes = [];
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
          child: situacoes.isEmpty
              ? const Center(child: Text('Nenhuma situação encontrada.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: situacoes.length,
                  itemBuilder: (context, index) {
                    final s = situacoes[index];
                    return Card(
                      elevation: 3,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: Icon(
                          s['status'] == 'Aprovado'
                              ? Icons.check_circle
                              : Icons.cancel,
                          color: s['status'] == 'Aprovado' ? Colors.green : Colors.red,
                          size: 32,
                        ),
                        title: Text(
                          s['disciplina'] ?? '',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          'Média: ${s['media']?.toStringAsFixed(1) ?? '0.0'}\n'
                          'Presença: ${s['presenca'] ?? '0'}%\n'
                          'Situação: ${s['status'] ?? 'Desconhecida'}',
                          style: const TextStyle(height: 1.5),
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}