import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class NotasAlunoScreen extends StatefulWidget {
  const NotasAlunoScreen({super.key});

  @override
  State<NotasAlunoScreen> createState() => _NotasAlunoScreenState();
}

class _NotasAlunoScreenState extends State<NotasAlunoScreen> {
  List<dynamic> alunos = [];
  List<dynamic> notas = [];
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

  Future<void> carregarNotas(int alunoId, String nome) async {
    setState(() {
      carregando = true;
      alunoSelecionado = alunoId;
      nomeAluno = nome;
    });

    final dados = await ApiService.listarNotasAluno(alunoId);
    setState(() {
      notas = dados;
      carregando = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          alunoSelecionado == null
              ? 'Notas dos Alunos'
              : 'Notas de $nomeAluno',
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
                      : _buildListaNotas(ifprGreen),
    );
  }

  Widget _buildListaAlunos(Color color) {
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
            title: Text(aluno['nome']),
            subtitle: Text('Matrícula: ${aluno['matricula']}'),
            onTap: () => carregarNotas(aluno['id'], aluno['nome']),
          ),
        );
      },
    );
  }

  Widget _buildListaNotas(Color color) {
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
                    notas = [];
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: color,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: notas.isEmpty
              ? const Center(child: Text('Nenhuma nota encontrada.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: notas.length,
                  itemBuilder: (context, index) {
                    final nota = notas[index];
                    return Card(
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        title: Text(
                          nota['disciplina'] ?? '',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          'Média: ${nota['media'].toStringAsFixed(2)}',
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