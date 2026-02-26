import 'dart:convert';
import 'package:http/http.dart' as http;

class Project {
  final int id;
  final String name;
  final String token;
  final String apiKey;
  final String createdAt;

  const Project({
    required this.id,
    required this.name,
    required this.token,
    required this.apiKey,
    required this.createdAt,
  });

  factory Project.fromWire(dynamic data) {
    final arr = data as List;
    return Project(
      id: (arr[0] as int),
      name: (arr[1] as String),
      token: (arr[2] as String),
      apiKey: (arr[3] as String),
      createdAt: (arr[4] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
      name,
      token,
      apiKey,
      createdAt,
    ];
  }
}

class ListReq {
  final int limit;

  const ListReq({
    required this.limit,
  });

  factory ListReq.fromWire(dynamic data) {
    final arr = data as List;
    return ListReq(
      limit: (arr[0] as int),
    );
  }

  List<dynamic> toWire() {
    return [
      limit,
    ];
  }
}

class IdReq {
  final int id;

  const IdReq({
    required this.id,
  });

  factory IdReq.fromWire(dynamic data) {
    final arr = data as List;
    return IdReq(
      id: (arr[0] as int),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
    ];
  }
}

class TokenReq {
  final String token;

  const TokenReq({
    required this.token,
  });

  factory TokenReq.fromWire(dynamic data) {
    final arr = data as List;
    return TokenReq(
      token: (arr[0] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      token,
    ];
  }
}

class ApiKeyReq {
  final String apiKey;

  const ApiKeyReq({
    required this.apiKey,
  });

  factory ApiKeyReq.fromWire(dynamic data) {
    final arr = data as List;
    return ApiKeyReq(
      apiKey: (arr[0] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      apiKey,
    ];
  }
}

class CreateReq {
  final String name;

  const CreateReq({
    required this.name,
  });

  factory CreateReq.fromWire(dynamic data) {
    final arr = data as List;
    return CreateReq(
      name: (arr[0] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      name,
    ];
  }
}

class Ok {
  final bool ok;

  const Ok({
    required this.ok,
  });

  factory Ok.fromWire(dynamic data) {
    final arr = data as List;
    return Ok(
      ok: (arr[0] as bool),
    );
  }

  List<dynamic> toWire() {
    return [
      ok,
    ];
  }
}

class ProjectList {
  final List<Project> projects;

  const ProjectList({
    required this.projects,
  });

  factory ProjectList.fromWire(dynamic data) {
    final arr = data as List;
    return ProjectList(
      projects: (arr[0] as List).map((e) => Project.fromWire(e)).toList(),
    );
  }

  List<dynamic> toWire() {
    return [
      projects.map((e) => e.toWire()).toList(),
    ];
  }
}

class ProjectAccessClient {
  final http.Client _httpClient;
  final String _baseUrl;

  ProjectAccessClient(this._httpClient, String baseUrl)
      : _baseUrl = '$baseUrl/project-access';

  Future<ProjectList> list(ListReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/ProjectAccess/list'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(request.toWire()),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    final decoded = jsonDecode(response.body);
    return ProjectList.fromWire(decoded);
  }

  Future<Project> $get(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/ProjectAccess/get'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(request.toWire()),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    final decoded = jsonDecode(response.body);
    return Project.fromWire(decoded);
  }

  Future<Project> getByToken(TokenReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/ProjectAccess/get_by_token'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(request.toWire()),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    final decoded = jsonDecode(response.body);
    return Project.fromWire(decoded);
  }

  Future<Project> getByApiKey(ApiKeyReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/ProjectAccess/get_by_api_key'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(request.toWire()),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    final decoded = jsonDecode(response.body);
    return Project.fromWire(decoded);
  }

  Future<Project> create(CreateReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/ProjectAccess/create'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(request.toWire()),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    final decoded = jsonDecode(response.body);
    return Project.fromWire(decoded);
  }

  Future<Ok> delete(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/ProjectAccess/delete'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(request.toWire()),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    final decoded = jsonDecode(response.body);
    return Ok.fromWire(decoded);
  }
}
