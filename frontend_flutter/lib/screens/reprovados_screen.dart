import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ReprovadosScreen extends StatefulWidget {
  const ReprovadosScreen({super.key});

  @override
  State<ReprovadosScreen> createState() => _ReprovadosScreenState();
}

class _ReprovadosScreenState extends State<ReprovadosScreen> {
  List<dynamic> disciplinas = [];
  List<dynamic> reprovados = [];
  bool carregando = true;
  int? disciplinaSelecionada;

  @override
  void initState() {
    super.initState();
    carregarDisciplinas();
  }

  Future<void> carregarDisciplinas() async {
    final dados = await ApiService.listarDisciplinas();
    setState(() {
      disciplinas = dados;
      carregando = false;
    });
  }

  Future<void> carregarReprovados(int disciplinaId) async {
    setState(() {
      carregando = true;
      disciplinaSelecionada = disciplinaId;
    });

    final dados = await ApiService.listarAlunosReprovados(disciplinaId);
    setState(() {
      reprovados = dados;
      carregando = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Alunos Reprovados'),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: ifprGreen,
        elevation: 1,
      ),
      backgroundColor: const Color(0xFFF2F6FC),
      body: carregando
          ? const Center(child: CircularProgressIndicator())
          : disciplinaSelecionada == null
              ? ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: disciplinas.length,
                  itemBuilder: (context, index) {
                    final disc = disciplinas[index];
                    return Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: const Icon(Icons.book, color: ifprGreen),
                        title: Text(
                          disc['nome'] ?? '',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        onTap: () => carregarReprovados(disc['id']),
                      ),
                    );
                  },
                )
              : Column(
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
                                disciplinaSelecionada = null;
                                reprovados = [];
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
                      child: reprovados.isEmpty
                          ? const Center(child: Text('Nenhum aluno reprovado.'))
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: reprovados.length,
                              itemBuilder: (context, index) {
                                final aluno = reprovados[index];
                                return Card(
                                  elevation: 3,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10)),
                                  margin: const EdgeInsets.only(bottom: 12),
                                  child: ListTile(
                                    title: Text(
                                      aluno['nome'] ?? '',
                                      style: const TextStyle(fontWeight: FontWeight.bold),
                                    ),
                                    subtitle: Text(
                                      'Email: ${aluno['email'] ?? ''}\n'
                                      'Matrícula: ${aluno['matricula'] ?? ''}',
                                      style: const TextStyle(height: 1.4),
                                    ),
                                    leading: const Icon(Icons.person_off, color: Colors.red),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
    );
  }
}
