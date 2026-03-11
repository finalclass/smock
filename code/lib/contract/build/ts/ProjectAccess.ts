import { rpc } from './rpc';

export interface Project {
  id: number;
  name: string;
  token: string;
  api_key: string;
  created_at: string;
  user_id: number;
}

export function encodeProject(v: Project): unknown[] {
  return [v.id, v.name, v.token, v.api_key, v.created_at, v.user_id];
}

export function decodeProject(wire: unknown[]): Project {
  return {
    id: wire[0] as number,
    name: wire[1] as string,
    token: wire[2] as string,
    api_key: wire[3] as string,
    created_at: wire[4] as string,
    user_id: wire[5] as number,
  };
}

export interface ListReq {
  limit: number;
}

export function encodeListReq(v: ListReq): unknown[] {
  return [v.limit];
}

export function decodeListReq(wire: unknown[]): ListReq {
  return {
    limit: wire[0] as number,
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

export interface TokenReq {
  token: string;
}

export function encodeTokenReq(v: TokenReq): unknown[] {
  return [v.token];
}

export function decodeTokenReq(wire: unknown[]): TokenReq {
  return {
    token: wire[0] as string,
  };
}

export interface ApiKeyReq {
  api_key: string;
}

export function encodeApiKeyReq(v: ApiKeyReq): unknown[] {
  return [v.api_key];
}

export function decodeApiKeyReq(wire: unknown[]): ApiKeyReq {
  return {
    api_key: wire[0] as string,
  };
}

export interface UserReq {
  user_id: number;
}

export function encodeUserReq(v: UserReq): unknown[] {
  return [v.user_id];
}

export function decodeUserReq(wire: unknown[]): UserReq {
  return {
    user_id: wire[0] as number,
  };
}

export interface CreateReq {
  name: string;
  user_id: number;
}

export function encodeCreateReq(v: CreateReq): unknown[] {
  return [v.name, v.user_id];
}

export function decodeCreateReq(wire: unknown[]): CreateReq {
  return {
    name: wire[0] as string,
    user_id: wire[1] as number,
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

export interface ProjectList {
  projects: Project[];
}

export function encodeProjectList(v: ProjectList): unknown[] {
  return [v.projects.map(v => encodeProject(v))];
}

export function decodeProjectList(wire: unknown[]): ProjectList {
  return {
    projects: (wire[0] as unknown[]).map(v => decodeProject(v as unknown[])),
  };
}

export interface Impl {
  list(req: ListReq): Promise<ProjectList>;
  list_by_user(req: UserReq): Promise<ProjectList>;
  get(req: IdReq): Promise<Project>;
  get_by_token(req: TokenReq): Promise<Project>;
  get_by_api_key(req: ApiKeyReq): Promise<Project>;
  create(req: CreateReq): Promise<Project>;
  delete(req: IdReq): Promise<Ok>;
}

export const Proxy: Impl = {
  async list(req) {
    return decodeProjectList(await rpc("ProjectAccess", "list", encodeListReq(req)) as unknown[]);
  },
  async list_by_user(req) {
    return decodeProjectList(await rpc("ProjectAccess", "list_by_user", encodeUserReq(req)) as unknown[]);
  },
  async get(req) {
    return decodeProject(await rpc("ProjectAccess", "get", encodeIdReq(req)) as unknown[]);
  },
  async get_by_token(req) {
    return decodeProject(await rpc("ProjectAccess", "get_by_token", encodeTokenReq(req)) as unknown[]);
  },
  async get_by_api_key(req) {
    return decodeProject(await rpc("ProjectAccess", "get_by_api_key", encodeApiKeyReq(req)) as unknown[]);
  },
  async create(req) {
    return decodeProject(await rpc("ProjectAccess", "create", encodeCreateReq(req)) as unknown[]);
  },
  async delete(req) {
    return decodeOk(await rpc("ProjectAccess", "delete", encodeIdReq(req)) as unknown[]);
  },
};
