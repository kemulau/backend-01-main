import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/cadastro_aluno_screen.dart';
import 'screens/listaProfessores_screen.dart'; 
import 'screens/listaAlunos_screen.dart';
import 'screens/professorDashboard_screen.dart';
import 'theme/theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Portal IFPR',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: '/',
      onGenerateRoute: (settings) {
        if (settings.name == '/dashboard') {
          final user = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (_) => DashboardScreen(user: user),
          );
        }

        if (settings.name == '/professorDashboard') {
          final user = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (_) => ProfessorDashboardScreen(user: user),
          );
        }

        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => const LoginScreen());
          case '/cadastroAluno':
            return MaterialPageRoute(builder: (_) => const CadastroAlunoScreen());
          case '/professores':
            return MaterialPageRoute(builder: (_) => const ListaProfessoresScreen());
          case '/alunos':
            return MaterialPageRoute(builder: (_) => const ListaAlunosScreen());
          default:
            return MaterialPageRoute(
              builder: (_) => const Scaffold(
                body: Center(child: Text('Rota não encontrada')),
              ),
            );
        }
      },
    );
  }
}
