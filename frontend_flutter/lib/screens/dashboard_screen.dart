import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DashboardScreen extends StatefulWidget {
  final Map<String, dynamic> user;

  const DashboardScreen({super.key, required this.user});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String nome = '';
  String tipo = '';

  @override
  void initState() {
    super.initState();
    verificarToken();
  }

  Future<void> verificarToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null || token.isEmpty) {
      Navigator.pushReplacementNamed(context, '/');
    } else {
      setState(() {
        nome = widget.user['nome'] ?? 'Usuário';
        tipo = widget.user['tipo']?.toLowerCase() ?? 'aluno';
      });
    }
  }

  void logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    Navigator.pushReplacementNamed(context, '/');
  }

  void verProfessores() {
    Navigator.pushNamed(context, '/professores');
  }

  void verAlunos() {
    if (tipo == 'professor') {
      Navigator.pushNamed(context, '/alunos');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Acesso negado: você não tem permissão para visualizar esta informação.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      backgroundColor: const Color(0xFFF2F6FC),
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Portal IFPR'),
        backgroundColor: Colors.white,
        foregroundColor: ifprGreen,
        centerTitle: true,
        elevation: 1,
      ),
      body: Center(
        child: Container(
          width: 320,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 20,
                offset: Offset(0, 10),
              )
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircleAvatar(
                radius: 40,
                backgroundColor: ifprGreen,
                child: Icon(Icons.person, size: 40, color: Colors.white),
              ),
              const SizedBox(height: 16),
              Text(
                nome,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: ifprGreen,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Tipo de usuário: $tipo',
                style: const TextStyle(color: Colors.black54),
              ),
              const SizedBox(height: 30),
              ElevatedButton.icon(
                onPressed: verProfessores,
                icon: const Icon(Icons.school, color: Colors.white),
                label: const Text('Ver Professores'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: ifprGreen,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 45),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: verAlunos,
                icon: const Icon(Icons.group, color: Colors.white),
                label: const Text('Ver Alunos'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: ifprGreen,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 45),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: logout,
                icon: const Icon(Icons.logout, color: Colors.white),
                label: const Text('Sair'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 45),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
