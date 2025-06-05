import 'package:flutter/material.dart';

class ProfessorDashboardScreen extends StatelessWidget {
  final Map<String, dynamic> user;

  const ProfessorDashboardScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);
    final isProfessor = user['tipo'] == 'professor';

    return Scaffold(
      backgroundColor: const Color(0xFFF2F6FC),
      appBar: AppBar(
        title: const Text('Painel do Professor'),
        backgroundColor: Colors.white,
        foregroundColor: ifprGreen,
        centerTitle: true,
        elevation: 1,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Sair',
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
          )
        ],
      ),
      body: isProfessor
          ? Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const Icon(Icons.school, size: 60, color: ifprGreen),
                    const SizedBox(height: 20),
                    Text(
                      'Olá, Professor(a) ${user['nome'] ?? ''}',
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: ifprGreen,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 30),

                    // Botões do dashboard
                    _botaoMenu(context, icon: Icons.people, texto: 'Alunos', rota: '/alunos'),
                    _botaoMenu(context, icon: Icons.person_outline, texto: 'Professores', rota: '/professores'),
                    _botaoMenu(context, icon: Icons.grade, texto: 'Notas do Aluno', rota: '/notasAluno'),
                    _botaoMenu(context, icon: Icons.check_circle_outline, texto: 'Presenças do Aluno', rota: '/presencasAluno'),
                    _botaoMenu(context, icon: Icons.warning_amber_outlined, texto: 'Reprovados na Disciplina', rota: '/reprovados'),
                    _botaoMenu(context, icon: Icons.analytics, texto: 'Situação do Aluno', rota: '/situacaoAluno'),
                  ],
                ),
              ),
            )
          : const Center(
              child: Text(
                'Acesso negado.\nEssa tela é exclusiva para professores.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18, color: Colors.red),
              ),
            ),
    );
  }

  Widget _botaoMenu(
    BuildContext context, {
    required IconData icon,
    required String texto,
    required String rota,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ElevatedButton.icon(
        icon: Icon(icon, color: Colors.white),
        label: Text(texto, style: const TextStyle(color: Colors.white)),
        onPressed: () => Navigator.pushNamed(context, rota),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF198754),
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: const TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
