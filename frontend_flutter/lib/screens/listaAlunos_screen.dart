import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ListaAlunosScreen extends StatefulWidget {
  const ListaAlunosScreen({super.key});

  @override
  State<ListaAlunosScreen> createState() => _ListaAlunosScreenState();
}

class _ListaAlunosScreenState extends State<ListaAlunosScreen> {
  List<dynamic> alunos = [];
  bool carregando = true;

  @override
  void initState() {
    super.initState();
    carregarAlunos();
  }

  Future<void> carregarAlunos() async {
    final dados = await ApiService.listarAlunos();
    setState(() {
      alunos = dados;
      carregando = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text(
          'Alunos Cadastrados',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF198754),
        elevation: 1,
      ),
      body: carregando
          ? const Center(child: CircularProgressIndicator())
          : alunos.isEmpty
              ? const Center(
                  child: Text(
                    'Nenhum aluno encontrado.',
                    style: TextStyle(fontSize: 16),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
                  itemCount: alunos.length,
                  itemBuilder: (context, index) {
                    final aluno = alunos[index];
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.shade300,
                            blurRadius: 8,
                            offset: const Offset(2, 4),
                          ),
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        leading: CircleAvatar(
                          backgroundColor: const Color(0xFF198754),
                          child: Text(
                            aluno['nome']?[0].toUpperCase() ?? '',
                            style: const TextStyle(color: Colors.white),
                          ),
                        ),
                        title: Text(
                          aluno['nome'],
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text('Matrícula: ${aluno['matricula']}'),
                            Text(aluno['email']),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
