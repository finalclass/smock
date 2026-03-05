import 'dart:convert';
import 'package:http/http.dart' as http;

class Comment {
  final int id;
  final int mockId;
  final String pagePath;
  final double xPct;
  final double yPct;
  final String authorName;
  final String body;
  final bool resolved;
  final String createdAt;

  const Comment({
    required this.id,
    required this.mockId,
    required this.pagePath,
    required this.xPct,
    required this.yPct,
    required this.authorName,
    required this.body,
    required this.resolved,
    required this.createdAt,
  });

  factory Comment.fromWire(dynamic data) {
    final arr = data as List;
    return Comment(
      id: (arr[0] as int),
      mockId: (arr[1] as int),
      pagePath: (arr[2] as String),
      xPct: (arr[3] as double),
      yPct: (arr[4] as double),
      authorName: (arr[5] as String),
      body: (arr[6] as String),
      resolved: (arr[7] as bool),
      createdAt: (arr[8] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
      mockId,
      pagePath,
      xPct,
      yPct,
      authorName,
      body,
      resolved,
      createdAt,
    ];
  }
}

class MockReq {
  final int mockId;

  const MockReq({
    required this.mockId,
  });

  factory MockReq.fromWire(dynamic data) {
    final arr = data as List;
    return MockReq(
      mockId: (arr[0] as int),
    );
  }

  List<dynamic> toWire() {
    return [
      mockId,
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

class CreateReq {
  final int mockId;
  final String pagePath;
  final double xPct;
  final double yPct;
  final String authorName;
  final String body;

  const CreateReq({
    required this.mockId,
    required this.pagePath,
    required this.xPct,
    required this.yPct,
    required this.authorName,
    required this.body,
  });

  factory CreateReq.fromWire(dynamic data) {
    final arr = data as List;
    return CreateReq(
      mockId: (arr[0] as int),
      pagePath: (arr[1] as String),
      xPct: (arr[2] as double),
      yPct: (arr[3] as double),
      authorName: (arr[4] as String),
      body: (arr[5] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      mockId,
      pagePath,
      xPct,
      yPct,
      authorName,
      body,
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

class CommentList {
  final List<Comment> comments;

  const CommentList({
    required this.comments,
  });

  factory CommentList.fromWire(dynamic data) {
    final arr = data as List;
    return CommentList(
      comments: (arr[0] as List).map((e) => Comment.fromWire(e)).toList(),
    );
  }

  List<dynamic> toWire() {
    return [
      comments.map((e) => e.toWire()).toList(),
    ];
  }
}

class CommentAccessClient {
  final http.Client _httpClient;
  final String _baseUrl;

  CommentAccessClient(this._httpClient, String baseUrl)
      : _baseUrl = '$baseUrl/comment-access';

  Future<CommentList> listByMock(MockReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/list_by_mock'),
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
    return CommentList.fromWire(decoded);
  }

  Future<Comment> create(CreateReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/create'),
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
    return Comment.fromWire(decoded);
  }

  Future<Comment> resolve(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/resolve'),
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
    return Comment.fromWire(decoded);
  }

  Future<Ok> delete(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/delete'),
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
