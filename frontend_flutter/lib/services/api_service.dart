import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://127.0.0.1:5001';

  /// Realiza login e retorna o usuário + token salvo em SharedPreferences
  static Future<Map<String, dynamic>> login(String identificador, String senha) async {
    try {
      final url = Uri.parse('$baseUrl/login');

      final response = await http.post(
        url,
        headers: { 'Content-Type': 'application/json' },
        body: jsonEncode({
          'identificador': identificador,
          'senha': senha
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // salva token localmente
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);

        return {
          'success': true,
          'token': data['token'],
          'user': data['usuario'],
        };
      } else {
        final erro = jsonDecode(response.body);
        return {
          'success': false,
          'message': erro['erro'] ?? 'Erro ao logar'
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão ou servidor: $e'
      };
    }
  }

  /// Cadastra aluno e retorna true se sucesso (status 201)
  static Future<bool> cadastrarAluno(String nome, String email, String matricula, String senha) async {
    try {
      final url = Uri.parse('$baseUrl/cadastrarAluno');

      final response = await http.post(
        url,
        headers: { 'Content-Type': 'application/json' },
        body: jsonEncode({
          'nome': nome,
          'email': email,
          'matricula': matricula,
          'senha': senha,
        }),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Erro ao cadastrar aluno: $e');
      return false;
    }
  }

  /// Recupera o token salvo localmente
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  /// Remove token ao deslogar
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }
  
  static Future<List<dynamic>> listarProfessores() async {
  final url = Uri.parse('$baseUrl/professores');

  final response = await http.get(url);

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    return [];
  }
  
}
static Future<List<dynamic>> listarAlunos() async {
  final url = Uri.parse('$baseUrl/alunos');
  final response = await http.get(url);
  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    return [];
  }
}
}
