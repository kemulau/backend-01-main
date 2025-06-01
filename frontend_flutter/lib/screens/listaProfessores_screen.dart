import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ListaProfessoresScreen extends StatefulWidget {
  const ListaProfessoresScreen({super.key});

  @override
  State<ListaProfessoresScreen> createState() => _ListaProfessoresScreenState();
}

class _ListaProfessoresScreenState extends State<ListaProfessoresScreen> with SingleTickerProviderStateMixin {
  List<dynamic> professores = [];
  bool carregando = true;

  @override
  void initState() {
    super.initState();
    carregarProfessores();
  }

  Future<void> carregarProfessores() async {
    final lista = await ApiService.listarProfessores();
    setState(() {
      professores = lista;
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
          'Professores do IFPR',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF198754),
        elevation: 1,
      ),
      body: carregando
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
              itemCount: professores.length,
              itemBuilder: (context, index) {
                final prof = professores[index];

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
                        prof['nome']?[0].toUpperCase() ?? '',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text(
                      prof['nome'] ?? '',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text(prof['email'] ?? ''),
                        Text('Matrícula: ${prof['matricula'] ?? ''}'),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
