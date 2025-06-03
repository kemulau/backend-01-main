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
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'identificador': identificador,
          'senha': senha,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

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
          'message': erro['erro'] ?? 'Erro ao logar',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão ou servidor: $e',
      };
    }
  }

  /// Cadastra aluno (rota pública)
  static Future<bool> cadastrarAluno(String nome, String email, String matricula, String senha) async {
    try {
      final url = Uri.parse('$baseUrl/cadastrarAluno');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
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

  /// Retorna lista de professores (rota protegida)
  static Future<List<dynamic>> listarProfessores() async {
    try {
      final token = await getToken();
      final url = Uri.parse('$baseUrl/professores');

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Erro listarProfessores: ${response.statusCode} - ${response.body}');
        return [];
      }
    } catch (e) {
      print('Erro listarProfessores: $e');
      return [];
    }
  }

  /// Retorna lista de alunos (rota protegida)
  static Future<List<dynamic>> listarAlunos() async {
    try {
      final token = await getToken();
      final url = Uri.parse('$baseUrl/listarTodosAlunos');

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Erro listarAlunos: ${response.statusCode} - ${response.body}');
        return [];
      }
    } catch (e) {
      print('Erro listarAlunos: $e');
      return [];
    }
  }

  /// Recupera o token salvo localmente
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  /// Remove o token ao deslogar
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }
}
