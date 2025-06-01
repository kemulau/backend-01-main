import 'package:flutter/material.dart';
import '../services/api_service.dart';

class CadastroAlunoScreen extends StatefulWidget {
  const CadastroAlunoScreen({super.key});

  @override
  State<CadastroAlunoScreen> createState() => _CadastroAlunoScreenState();
}

class _CadastroAlunoScreenState extends State<CadastroAlunoScreen> {
  final nomeController = TextEditingController();
  final emailController = TextEditingController();
  final matriculaController = TextEditingController();
  final senhaController = TextEditingController();
  bool _carregando = false;

  void _cadastrarAluno() async {
    final nome = nomeController.text.trim();
    final email = emailController.text.trim();
    final matricula = matriculaController.text.trim();
    final senha = senhaController.text;

    if (nome.isEmpty || email.isEmpty || matricula.isEmpty || senha.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Preencha todos os campos')),
      );
      return;
    }

    setState(() => _carregando = true);
    final sucesso = await ApiService.cadastrarAluno(nome, email, matricula, senha);
    setState(() => _carregando = false);

    if (sucesso) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Aluno cadastrado com sucesso')),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erro ao cadastrar aluno')),
      );
    }
  }

  InputDecoration _inputEstilo(String label, IconData icone) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF198754)), // cor verde do IFPR
      prefixIcon: Icon(icone, color: const Color(0xFF198754)),
      border: const OutlineInputBorder(),
      focusedBorder: const OutlineInputBorder(
        borderSide: BorderSide(color: Color(0xFF198754), width: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const ifprGreen = Color(0xFF198754);

    return Scaffold(
      backgroundColor: const Color(0xFFEFF3F6),
      appBar: AppBar(
        title: const Text('Cadastro de Aluno'),
        backgroundColor: ifprGreen,
      ),
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
                const Icon(Icons.person_add_alt_1, size: 60, color: ifprGreen),
                const SizedBox(height: 16),
                const Text(
                  'Cadastro de Aluno',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: ifprGreen,
                  ),
                ),
                const SizedBox(height: 30),
                TextField(
                  controller: nomeController,
                  cursorColor: ifprGreen,
                  decoration: _inputEstilo('Nome completo', Icons.person),
                ),
                const SizedBox(height: 15),
                TextField(
                  controller: emailController,
                  cursorColor: ifprGreen,
                  decoration: _inputEstilo('E-mail', Icons.email),
                ),
                const SizedBox(height: 15),
                TextField(
                  controller: matriculaController,
                  cursorColor: ifprGreen,
                  decoration: _inputEstilo('Matrícula', Icons.badge),
                ),
                const SizedBox(height: 15),
                TextField(
                  controller: senhaController,
                  obscureText: true,
                  cursorColor: ifprGreen,
                  decoration: _inputEstilo('Senha', Icons.lock),
                ),
                const SizedBox(height: 25),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _carregando ? null : _cadastrarAluno,
                    icon: const Icon(Icons.check_circle_outline, color: Colors.white),
                    label: Text(
                      _carregando ? 'Enviando...' : 'Cadastrar',
                      style: const TextStyle(color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      backgroundColor: ifprGreen,
                      textStyle: const TextStyle(fontSize: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
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
