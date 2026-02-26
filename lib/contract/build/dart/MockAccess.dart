import 'dart:convert';
import 'package:http/http.dart' as http;

class Mock {
  final int id;
  final int projectId;
  final String name;
  final String slug;
  final String status;
  final String entryFile;
  final String createdAt;
  final String updatedAt;

  const Mock({
    required this.id,
    required this.projectId,
    required this.name,
    required this.slug,
    required this.status,
    required this.entryFile,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Mock.fromWire(dynamic data) {
    final arr = data as List;
    return Mock(
      id: (arr[0] as int),
      projectId: (arr[1] as int),
      name: (arr[2] as String),
      slug: (arr[3] as String),
      status: (arr[4] as String),
      entryFile: (arr[5] as String),
      createdAt: (arr[6] as String),
      updatedAt: (arr[7] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
      projectId,
      name,
      slug,
      status,
      entryFile,
      createdAt,
      updatedAt,
    ];
  }
}

class MockFile {
  final int id;
  final int mockId;
  final String path;
  final String contentType;
  final int size;

  const MockFile({
    required this.id,
    required this.mockId,
    required this.path,
    required this.contentType,
    required this.size,
  });

  factory MockFile.fromWire(dynamic data) {
    final arr = data as List;
    return MockFile(
      id: (arr[0] as int),
      mockId: (arr[1] as int),
      path: (arr[2] as String),
      contentType: (arr[3] as String),
      size: (arr[4] as int),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
      mockId,
      path,
      contentType,
      size,
    ];
  }
}

class ProjectReq {
  final int projectId;

  const ProjectReq({
    required this.projectId,
  });

  factory ProjectReq.fromWire(dynamic data) {
    final arr = data as List;
    return ProjectReq(
      projectId: (arr[0] as int),
    );
  }

  List<dynamic> toWire() {
    return [
      projectId,
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

class SlugReq {
  final int projectId;
  final String slug;

  const SlugReq({
    required this.projectId,
    required this.slug,
  });

  factory SlugReq.fromWire(dynamic data) {
    final arr = data as List;
    return SlugReq(
      projectId: (arr[0] as int),
      slug: (arr[1] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      projectId,
      slug,
    ];
  }
}

class CreateReq {
  final int projectId;
  final String name;
  final String slug;
  final String entryFile;

  const CreateReq({
    required this.projectId,
    required this.name,
    required this.slug,
    required this.entryFile,
  });

  factory CreateReq.fromWire(dynamic data) {
    final arr = data as List;
    return CreateReq(
      projectId: (arr[0] as int),
      name: (arr[1] as String),
      slug: (arr[2] as String),
      entryFile: (arr[3] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      projectId,
      name,
      slug,
      entryFile,
    ];
  }
}

class StatusReq {
  final int id;
  final String status;

  const StatusReq({
    required this.id,
    required this.status,
  });

  factory StatusReq.fromWire(dynamic data) {
    final arr = data as List;
    return StatusReq(
      id: (arr[0] as int),
      status: (arr[1] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
      status,
    ];
  }
}

class AddFileReq {
  final int mockId;
  final String path;
  final String contentType;
  final int size;

  const AddFileReq({
    required this.mockId,
    required this.path,
    required this.contentType,
    required this.size,
  });

  factory AddFileReq.fromWire(dynamic data) {
    final arr = data as List;
    return AddFileReq(
      mockId: (arr[0] as int),
      path: (arr[1] as String),
      contentType: (arr[2] as String),
      size: (arr[3] as int),
    );
  }

  List<dynamic> toWire() {
    return [
      mockId,
      path,
      contentType,
      size,
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

class MockList {
  final List<Mock> mocks;

  const MockList({
    required this.mocks,
  });

  factory MockList.fromWire(dynamic data) {
    final arr = data as List;
    return MockList(
      mocks: (arr[0] as List).map((e) => Mock.fromWire(e)).toList(),
    );
  }

  List<dynamic> toWire() {
    return [
      mocks.map((e) => e.toWire()).toList(),
    ];
  }
}

class MockFileList {
  final List<MockFile> files;

  const MockFileList({
    required this.files,
  });

  factory MockFileList.fromWire(dynamic data) {
    final arr = data as List;
    return MockFileList(
      files: (arr[0] as List).map((e) => MockFile.fromWire(e)).toList(),
    );
  }

  List<dynamic> toWire() {
    return [
      files.map((e) => e.toWire()).toList(),
    ];
  }
}

class MockAccessClient {
  final http.Client _httpClient;
  final String _baseUrl;

  MockAccessClient(this._httpClient, String baseUrl)
      : _baseUrl = '$baseUrl/mock-access';

  Future<MockList> listByProject(ProjectReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/list_by_project'),
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
    return MockList.fromWire(decoded);
  }

  Future<Mock> $get(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/get'),
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
    return Mock.fromWire(decoded);
  }

  Future<Mock> getBySlug(SlugReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/get_by_slug'),
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
    return Mock.fromWire(decoded);
  }

  Future<Mock> create(CreateReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/create'),
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
    return Mock.fromWire(decoded);
  }

  Future<Mock> updateStatus(StatusReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/update_status'),
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
    return Mock.fromWire(decoded);
  }

  Future<Ok> delete(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/delete'),
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

  Future<MockFile> addFile(AddFileReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/add_file'),
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
    return MockFile.fromWire(decoded);
  }

  Future<MockFileList> listFiles(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/MockAccess/list_files'),
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
    return MockFileList.fromWire(decoded);
  }
}
