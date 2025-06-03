import 'package:flutter/material.dart';

class ProfessorDashboardScreen extends StatelessWidget {
  final Map<String, dynamic> user;

  const ProfessorDashboardScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isProfessor = user['tipo'] == 'professor';

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        title: const Text('Painel do Professor'),
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: theme.colorScheme.onPrimary,
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
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 500),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: theme.cardColor,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 12,
                        offset: Offset(2, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Icon(Icons.school, size: 60, color: theme.colorScheme.primary),
                      const SizedBox(height: 20),
                      Text(
                        'Olá, Professor(a) ${user['nome'] ?? ''}',
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.primary,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 30),

                      // Botões simplificados
                      _botaoMenu(
                        context,
                        icon: Icons.people,
                        texto: 'Alunos',
                        rota: '/alunos',
                        theme: theme,
                      ),
                      _botaoMenu(
                        context,
                        icon: Icons.person_outline,
                        texto: 'Professores',
                        rota: '/professores',
                        theme: theme,
                      ),
                    ],
                  ),
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
    required ThemeData theme,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: ElevatedButton.icon(
        icon: Icon(icon, color: Colors.white),
        label: Text(texto, style: const TextStyle(color: Colors.white)),
        onPressed: () => Navigator.pushNamed(context, rota),
        style: ElevatedButton.styleFrom(
          backgroundColor: theme.colorScheme.primary,
          minimumSize: const Size(double.infinity, 50),
          textStyle: const TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
