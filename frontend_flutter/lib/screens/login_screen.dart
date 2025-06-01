import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _idController = TextEditingController();
  final _senhaController = TextEditingController();

  void _fazerLogin() async {
    final id = _idController.text.trim();
    final senha = _senhaController.text;

    if (id.isEmpty || senha.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Preencha todos os campos')),
      );
      return;
    }

    final result = await ApiService.login(id, senha);

    if (result['success']) {
      final token = result['token'];
      final user = result['user'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);

      Navigator.pushReplacementNamed(context, '/dashboard', arguments: user);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Erro no login')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      backgroundColor: const Color(0xFFEFF3F6),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(25),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: const [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10,
                  offset: Offset(2, 5),
                )
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.school, size: 60, color: ifprGreen),
                const SizedBox(height: 16),
                const Text(
                  'Portal Acadêmico IFPR',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: ifprGreen,
                  ),
                ),
                const SizedBox(height: 30),

                // CAMPO MATRÍCULA/SIAPE
                TextField(
                  controller: _idController,
                  cursorColor: ifprGreen,
                  decoration: const InputDecoration(
                    labelText: 'Matrícula ou SIAPE',
                    labelStyle: TextStyle(color: ifprGreen),
                    prefixIcon: Icon(Icons.badge, color: ifprGreen),
                    border: OutlineInputBorder(),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: ifprGreen, width: 2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // CAMPO SENHA
                TextField(
                  controller: _senhaController,
                  obscureText: true,
                  cursorColor: ifprGreen,
                  decoration: const InputDecoration(
                    labelText: 'Senha',
                    labelStyle: TextStyle(color: ifprGreen),
                    prefixIcon: Icon(Icons.lock, color: ifprGreen),
                    border: OutlineInputBorder(),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: ifprGreen, width: 2),
                    ),
                  ),
                ),
                const SizedBox(height: 30),

                // BOTÃO ENTRAR
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _fazerLogin,
                    icon: const Icon(Icons.login, color: Colors.white),
                    label: const Text(
                      'Entrar',
                      style: TextStyle(color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: ifprGreen,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      textStyle: const TextStyle(fontSize: 16),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // LINK DE CADASTRO
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/cadastroAluno');
                  },
                  child: const Text(
                    'Ainda não tem conta? Cadastre-se',
                    style: TextStyle(color: ifprGreen),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
