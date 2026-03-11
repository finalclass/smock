import { rpc } from './rpc';

export interface Comment {
  id: number;
  thread_id: number;
  author_name: string;
  body: string;
  created_at: string;
}

export function encodeComment(v: Comment): unknown[] {
  return [v.id, v.thread_id, v.author_name, v.body, v.created_at];
}

export function decodeComment(wire: unknown[]): Comment {
  return {
    id: wire[0] as number,
    thread_id: wire[1] as number,
    author_name: wire[2] as string,
    body: wire[3] as string,
    created_at: wire[4] as string,
  };
}

export interface MockReq {
  mock_id: number;
}

export function encodeMockReq(v: MockReq): unknown[] {
  return [v.mock_id];
}

export function decodeMockReq(wire: unknown[]): MockReq {
  return {
    mock_id: wire[0] as number,
  };
}

export interface IdReq {
  id: number;
}

export function encodeIdReq(v: IdReq): unknown[] {
  return [v.id];
}

export function decodeIdReq(wire: unknown[]): IdReq {
  return {
    id: wire[0] as number,
  };
}

export interface CreateThreadReq {
  mock_id: number;
  page_path: string;
  x_pct: number;
  y_pct: number;
  author_name: string;
  body: string;
}

export function encodeCreateThreadReq(v: CreateThreadReq): unknown[] {
  return [v.mock_id, v.page_path, v.x_pct, v.y_pct, v.author_name, v.body];
}

export function decodeCreateThreadReq(wire: unknown[]): CreateThreadReq {
  return {
    mock_id: wire[0] as number,
    page_path: wire[1] as string,
    x_pct: wire[2] as number,
    y_pct: wire[3] as number,
    author_name: wire[4] as string,
    body: wire[5] as string,
  };
}

export interface AddCommentReq {
  thread_id: number;
  author_name: string;
  body: string;
}

export function encodeAddCommentReq(v: AddCommentReq): unknown[] {
  return [v.thread_id, v.author_name, v.body];
}

export function decodeAddCommentReq(wire: unknown[]): AddCommentReq {
  return {
    thread_id: wire[0] as number,
    author_name: wire[1] as string,
    body: wire[2] as string,
  };
}

export interface Ok {
  ok: boolean;
}

export function encodeOk(v: Ok): unknown[] {
  return [v.ok];
}

export function decodeOk(wire: unknown[]): Ok {
  return {
    ok: wire[0] as boolean,
  };
}

export interface Thread {
  id: number;
  mock_id: number;
  page_path: string;
  x_pct: number;
  y_pct: number;
  resolved: boolean;
  created_at: string;
  comments: Comment[];
}

export function encodeThread(v: Thread): unknown[] {
  return [v.id, v.mock_id, v.page_path, v.x_pct, v.y_pct, v.resolved, v.created_at, v.comments.map(v => encodeComment(v))];
}

export function decodeThread(wire: unknown[]): Thread {
  return {
    id: wire[0] as number,
    mock_id: wire[1] as number,
    page_path: wire[2] as string,
    x_pct: wire[3] as number,
    y_pct: wire[4] as number,
    resolved: wire[5] as boolean,
    created_at: wire[6] as string,
    comments: (wire[7] as unknown[]).map(v => decodeComment(v as unknown[])),
  };
}

export interface ThreadList {
  threads: Thread[];
}

export function encodeThreadList(v: ThreadList): unknown[] {
  return [v.threads.map(v => encodeThread(v))];
}

export function decodeThreadList(wire: unknown[]): ThreadList {
  return {
    threads: (wire[0] as unknown[]).map(v => decodeThread(v as unknown[])),
  };
}

export interface Impl {
  list_threads_by_mock(req: MockReq): Promise<ThreadList>;
  create_thread(req: CreateThreadReq): Promise<Thread>;
  add_comment(req: AddCommentReq): Promise<Comment>;
  resolve_thread(req: IdReq): Promise<Thread>;
  delete_thread(req: IdReq): Promise<Ok>;
}

export const Proxy: Impl = {
  async list_threads_by_mock(req) {
    return decodeThreadList(await rpc("CommentAccess", "list_threads_by_mock", encodeMockReq(req)) as unknown[]);
  },
  async create_thread(req) {
    return decodeThread(await rpc("CommentAccess", "create_thread", encodeCreateThreadReq(req)) as unknown[]);
  },
  async add_comment(req) {
    return decodeComment(await rpc("CommentAccess", "add_comment", encodeAddCommentReq(req)) as unknown[]);
  },
  async resolve_thread(req) {
    return decodeThread(await rpc("CommentAccess", "resolve_thread", encodeIdReq(req)) as unknown[]);
  },
  async delete_thread(req) {
    return decodeOk(await rpc("CommentAccess", "delete_thread", encodeIdReq(req)) as unknown[]);
  },
};
