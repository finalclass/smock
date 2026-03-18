import { rpc } from './rpc';

export interface Mock {
  id: number;
  project_id: number;
  name: string;
  slug: string;
  status: string;
  entry_file: string;
  created_at: string;
  updated_at: string;
  ai_session_id: string;
}

export function encodeMock(v: Mock): unknown[] {
  return [v.id, v.project_id, v.name, v.slug, v.status, v.entry_file, v.created_at, v.updated_at, v.ai_session_id];
}

export function decodeMock(wire: unknown[]): Mock {
  return {
    id: wire[0] as number,
    project_id: wire[1] as number,
    name: wire[2] as string,
    slug: wire[3] as string,
    status: wire[4] as string,
    entry_file: wire[5] as string,
    created_at: wire[6] as string,
    updated_at: wire[7] as string,
    ai_session_id: wire[8] as string,
  };
}

export interface MockFile {
  id: number;
  mock_id: number;
  path: string;
  content_type: string;
  size: number;
}

export function encodeMockFile(v: MockFile): unknown[] {
  return [v.id, v.mock_id, v.path, v.content_type, v.size];
}

export function decodeMockFile(wire: unknown[]): MockFile {
  return {
    id: wire[0] as number,
    mock_id: wire[1] as number,
    path: wire[2] as string,
    content_type: wire[3] as string,
    size: wire[4] as number,
  };
}

export interface ProjectReq {
  project_id: number;
}

export function encodeProjectReq(v: ProjectReq): unknown[] {
  return [v.project_id];
}

export function decodeProjectReq(wire: unknown[]): ProjectReq {
  return {
    project_id: wire[0] as number,
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

export interface SlugReq {
  project_id: number;
  slug: string;
}

export function encodeSlugReq(v: SlugReq): unknown[] {
  return [v.project_id, v.slug];
}

export function decodeSlugReq(wire: unknown[]): SlugReq {
  return {
    project_id: wire[0] as number,
    slug: wire[1] as string,
  };
}

export interface CreateReq {
  project_id: number;
  name: string;
  slug: string;
  entry_file: string;
}

export function encodeCreateReq(v: CreateReq): unknown[] {
  return [v.project_id, v.name, v.slug, v.entry_file];
}

export function decodeCreateReq(wire: unknown[]): CreateReq {
  return {
    project_id: wire[0] as number,
    name: wire[1] as string,
    slug: wire[2] as string,
    entry_file: wire[3] as string,
  };
}

export interface StatusReq {
  id: number;
  status: string;
}

export function encodeStatusReq(v: StatusReq): unknown[] {
  return [v.id, v.status];
}

export function decodeStatusReq(wire: unknown[]): StatusReq {
  return {
    id: wire[0] as number,
    status: wire[1] as string,
  };
}

export interface AddFileReq {
  mock_id: number;
  path: string;
  content_type: string;
  size: number;
}

export function encodeAddFileReq(v: AddFileReq): unknown[] {
  return [v.mock_id, v.path, v.content_type, v.size];
}

export function decodeAddFileReq(wire: unknown[]): AddFileReq {
  return {
    mock_id: wire[0] as number,
    path: wire[1] as string,
    content_type: wire[2] as string,
    size: wire[3] as number,
  };
}

export interface SetAiSessionReq {
  id: number;
  ai_session_id: string;
}

export function encodeSetAiSessionReq(v: SetAiSessionReq): unknown[] {
  return [v.id, v.ai_session_id];
}

export function decodeSetAiSessionReq(wire: unknown[]): SetAiSessionReq {
  return {
    id: wire[0] as number,
    ai_session_id: wire[1] as string,
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

export interface MockList {
  mocks: Mock[];
}

export function encodeMockList(v: MockList): unknown[] {
  return [v.mocks.map(v => encodeMock(v))];
}

export function decodeMockList(wire: unknown[]): MockList {
  return {
    mocks: (wire[0] as unknown[]).map(v => decodeMock(v as unknown[])),
  };
}

export interface MockFileList {
  files: MockFile[];
}

export function encodeMockFileList(v: MockFileList): unknown[] {
  return [v.files.map(v => encodeMockFile(v))];
}

export function decodeMockFileList(wire: unknown[]): MockFileList {
  return {
    files: (wire[0] as unknown[]).map(v => decodeMockFile(v as unknown[])),
  };
}

export interface Impl {
  list_by_project(req: ProjectReq): Promise<MockList>;
  get(req: IdReq): Promise<Mock>;
  get_by_slug(req: SlugReq): Promise<Mock>;
  create(req: CreateReq): Promise<Mock>;
  update_status(req: StatusReq): Promise<Mock>;
  delete(req: IdReq): Promise<Ok>;
  add_file(req: AddFileReq): Promise<MockFile>;
  list_files(req: IdReq): Promise<MockFileList>;
  set_ai_session(req: SetAiSessionReq): Promise<Mock>;
}

export const Proxy: Impl = {
  async list_by_project(req) {
    return decodeMockList(await rpc("MockAccess", "list_by_project", encodeProjectReq(req)) as unknown[]);
  },
  async get(req) {
    return decodeMock(await rpc("MockAccess", "get", encodeIdReq(req)) as unknown[]);
  },
  async get_by_slug(req) {
    return decodeMock(await rpc("MockAccess", "get_by_slug", encodeSlugReq(req)) as unknown[]);
  },
  async create(req) {
    return decodeMock(await rpc("MockAccess", "create", encodeCreateReq(req)) as unknown[]);
  },
  async update_status(req) {
    return decodeMock(await rpc("MockAccess", "update_status", encodeStatusReq(req)) as unknown[]);
  },
  async delete(req) {
    return decodeOk(await rpc("MockAccess", "delete", encodeIdReq(req)) as unknown[]);
  },
  async add_file(req) {
    return decodeMockFile(await rpc("MockAccess", "add_file", encodeAddFileReq(req)) as unknown[]);
  },
  async list_files(req) {
    return decodeMockFileList(await rpc("MockAccess", "list_files", encodeIdReq(req)) as unknown[]);
  },
  async set_ai_session(req) {
    return decodeMock(await rpc("MockAccess", "set_ai_session", encodeSetAiSessionReq(req)) as unknown[]);
  },
};
