import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class ListaAlunosScreen extends StatefulWidget {
  const ListaAlunosScreen({super.key});

  @override
  State<ListaAlunosScreen> createState() => _ListaAlunosScreenState();
}

class _ListaAlunosScreenState extends State<ListaAlunosScreen> {
  List<dynamic> alunos = [];
  bool carregando = true;
  bool acessoNegado = false;

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
    final dados = await ApiService.listarAlunos();
    setState(() {
      alunos = dados;
      carregando = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Lista de Alunos'),
        backgroundColor: Colors.white,
        foregroundColor: ifprGreen,
        centerTitle: true,
        elevation: 1,
      ),
      backgroundColor: const Color(0xFFF2F6FC),
      body: carregando
          ? const Center(child: CircularProgressIndicator())
          : acessoNegado
              ? const Center(
                  child: Text(
                    'Acesso negado: apenas professores podem visualizar esta lista.',
                    style: TextStyle(color: Colors.red, fontSize: 16),
                    textAlign: TextAlign.center,
                  ),
                )
              : alunos.isEmpty
                  ? const Center(child: Text('Nenhum aluno encontrado.'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: alunos.length,
                      itemBuilder: (context, index) {
                        final aluno = alunos[index];
                        return Card(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 4,
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            leading: const CircleAvatar(
                              backgroundColor: ifprGreen,
                              child: Icon(Icons.person, color: Colors.white),
                            ),
                            title: Text(
                              aluno['nome'],
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF198754),
                              ),
                            ),
                            subtitle: Text('Matrícula: ${aluno['matricula']}'),
                            trailing: Text(
                              aluno['email'],
                              style: const TextStyle(color: Colors.black54),
                            ),
                          ),
                        );
                      },
                    ),
    );
  }
}
