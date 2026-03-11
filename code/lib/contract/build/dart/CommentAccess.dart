import 'dart:convert';
import 'package:http/http.dart' as http;

class Comment {
  final int id;
  final int threadId;
  final String authorName;
  final String body;
  final String createdAt;

  const Comment({
    required this.id,
    required this.threadId,
    required this.authorName,
    required this.body,
    required this.createdAt,
  });

  factory Comment.fromWire(dynamic data) {
    final arr = data as List;
    return Comment(
      id: (arr[0] as int),
      threadId: (arr[1] as int),
      authorName: (arr[2] as String),
      body: (arr[3] as String),
      createdAt: (arr[4] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
      threadId,
      authorName,
      body,
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

class CreateThreadReq {
  final int mockId;
  final String pagePath;
  final double xPct;
  final double yPct;
  final String authorName;
  final String body;

  const CreateThreadReq({
    required this.mockId,
    required this.pagePath,
    required this.xPct,
    required this.yPct,
    required this.authorName,
    required this.body,
  });

  factory CreateThreadReq.fromWire(dynamic data) {
    final arr = data as List;
    return CreateThreadReq(
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

class AddCommentReq {
  final int threadId;
  final String authorName;
  final String body;

  const AddCommentReq({
    required this.threadId,
    required this.authorName,
    required this.body,
  });

  factory AddCommentReq.fromWire(dynamic data) {
    final arr = data as List;
    return AddCommentReq(
      threadId: (arr[0] as int),
      authorName: (arr[1] as String),
      body: (arr[2] as String),
    );
  }

  List<dynamic> toWire() {
    return [
      threadId,
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

class Thread {
  final int id;
  final int mockId;
  final String pagePath;
  final double xPct;
  final double yPct;
  final bool resolved;
  final String createdAt;
  final List<Comment> comments;

  const Thread({
    required this.id,
    required this.mockId,
    required this.pagePath,
    required this.xPct,
    required this.yPct,
    required this.resolved,
    required this.createdAt,
    required this.comments,
  });

  factory Thread.fromWire(dynamic data) {
    final arr = data as List;
    return Thread(
      id: (arr[0] as int),
      mockId: (arr[1] as int),
      pagePath: (arr[2] as String),
      xPct: (arr[3] as double),
      yPct: (arr[4] as double),
      resolved: (arr[5] as bool),
      createdAt: (arr[6] as String),
      comments: (arr[7] as List).map((e) => Comment.fromWire(e)).toList(),
    );
  }

  List<dynamic> toWire() {
    return [
      id,
      mockId,
      pagePath,
      xPct,
      yPct,
      resolved,
      createdAt,
      comments.map((e) => e.toWire()).toList(),
    ];
  }
}

class ThreadList {
  final List<Thread> threads;

  const ThreadList({
    required this.threads,
  });

  factory ThreadList.fromWire(dynamic data) {
    final arr = data as List;
    return ThreadList(
      threads: (arr[0] as List).map((e) => Thread.fromWire(e)).toList(),
    );
  }

  List<dynamic> toWire() {
    return [
      threads.map((e) => e.toWire()).toList(),
    ];
  }
}

class CommentAccessClient {
  final http.Client _httpClient;
  final String _baseUrl;

  CommentAccessClient(this._httpClient, String baseUrl)
      : _baseUrl = '$baseUrl/comment-access';

  Future<ThreadList> listThreadsByMock(MockReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/list_threads_by_mock'),
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
    return ThreadList.fromWire(decoded);
  }

  Future<Thread> createThread(CreateThreadReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/create_thread'),
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
    return Thread.fromWire(decoded);
  }

  Future<Comment> addComment(AddCommentReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/add_comment'),
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

  Future<Thread> resolveThread(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/resolve_thread'),
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
    return Thread.fromWire(decoded);
  }

  Future<Ok> deleteThread(IdReq request) async {
    final response = await _httpClient.post(
      Uri.parse('$_baseUrl/rpc/CommentAccess/delete_thread'),
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
