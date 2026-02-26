import { rpc } from './rpc';

export interface Comment {
  id: number;
  mock_id: number;
  page_path: string;
  x_pct: number;
  y_pct: number;
  author_name: string;
  body: string;
  resolved: boolean;
  created_at: string;
}

export function encodeComment(v: Comment): unknown[] {
  return [v.id, v.mock_id, v.page_path, v.x_pct, v.y_pct, v.author_name, v.body, v.resolved, v.created_at];
}

export function decodeComment(wire: unknown[]): Comment {
  return {
    id: wire[0] as number,
    mock_id: wire[1] as number,
    page_path: wire[2] as string,
    x_pct: wire[3] as number,
    y_pct: wire[4] as number,
    author_name: wire[5] as string,
    body: wire[6] as string,
    resolved: wire[7] as boolean,
    created_at: wire[8] as string,
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

export interface CreateReq {
  mock_id: number;
  page_path: string;
  x_pct: number;
  y_pct: number;
  author_name: string;
  body: string;
}

export function encodeCreateReq(v: CreateReq): unknown[] {
  return [v.mock_id, v.page_path, v.x_pct, v.y_pct, v.author_name, v.body];
}

export function decodeCreateReq(wire: unknown[]): CreateReq {
  return {
    mock_id: wire[0] as number,
    page_path: wire[1] as string,
    x_pct: wire[2] as number,
    y_pct: wire[3] as number,
    author_name: wire[4] as string,
    body: wire[5] as string,
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

export interface CommentList {
  comments: Comment[];
}

export function encodeCommentList(v: CommentList): unknown[] {
  return [v.comments.map(v => encodeComment(v))];
}

export function decodeCommentList(wire: unknown[]): CommentList {
  return {
    comments: (wire[0] as unknown[]).map(v => decodeComment(v as unknown[])),
  };
}

export interface Impl {
  list_by_mock(req: MockReq): Promise<CommentList>;
  create(req: CreateReq): Promise<Comment>;
  resolve(req: IdReq): Promise<Comment>;
  delete(req: IdReq): Promise<Ok>;
}

export const Proxy: Impl = {
  async list_by_mock(req) {
    return decodeCommentList(await rpc("CommentAccess", "list_by_mock", encodeMockReq(req)) as unknown[]);
  },
  async create(req) {
    return decodeComment(await rpc("CommentAccess", "create", encodeCreateReq(req)) as unknown[]);
  },
  async resolve(req) {
    return decodeComment(await rpc("CommentAccess", "resolve", encodeIdReq(req)) as unknown[]);
  },
  async delete(req) {
    return decodeOk(await rpc("CommentAccess", "delete", encodeIdReq(req)) as unknown[]);
  },
};
