import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://127.0.0.1:5001';

  // -------------------- AUTENTICAÇÃO --------------------
  static Future<Map<String, dynamic>> login(String identificador, String senha) async {
    try {
      final url = Uri.parse('$baseUrl/login');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'identificador': identificador, 'senha': senha}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        await prefs.setString('tipoUsuario', data['usuario']['tipo']);

        return {
          'success': true,
          'token': data['token'],
          'user': data['usuario'],
        };
      } else {
        final erro = jsonDecode(response.body);
        return {'success': false, 'message': erro['erro'] ?? 'Erro ao logar'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Erro de conexão ou servidor: $e'};
    }
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('tipoUsuario');
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // -------------------- CADASTRO --------------------
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

  // -------------------- CONSULTAS PROTEGIDAS --------------------
  static Future<List<dynamic>> listarProfessores() async {
    return _getList('/professores');
  }

  static Future<List<dynamic>> listarAlunos() async {
    return _getList('/listarTodosAlunos');
  }

  static Future<List<dynamic>> listarDisciplinas() async {
    return _getList('/disciplinas');
  }

  static Future<List<dynamic>> listarNotasAluno(int alunoId) async {
    return _getList('/alunos/$alunoId/notas');
  }

  static Future<List<dynamic>> listarPresencasDoAluno(int alunoId) async {
    return _getList('/alunos/$alunoId/presencas');
  }

  static Future<List<dynamic>> listarSituacaoFinalDoAluno(int alunoId) async {
    return _getList('/alunos/$alunoId/situacao');
  }

  static Future<List<dynamic>> listarAlunosReprovados(int disciplinaId) async {
    return _getList('/disciplinas/$disciplinaId/reprovados');
  }

  static Future<List<dynamic>> listarDisciplinasDoAluno(int alunoId) async {
    // Correção: o backend espera um parâmetro de query e não como parte da URL
    return _getList('/listarTodasDisciplinasAluno?alunoId=$alunoId');
  }

  // -------------------- MÉTODO GENÉRICO DE GET COM TOKEN --------------------
  static Future<List<dynamic>> _getList(String endpoint) async {
    try {
      final token = await getToken();
      final url = Uri.parse('$baseUrl$endpoint');

      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Erro ao listar $endpoint: ${response.statusCode} - ${response.body}');
        return [];
      }
    } catch (e) {
      print('Erro em _getList: $e');
      return [];
    }
  }
}
