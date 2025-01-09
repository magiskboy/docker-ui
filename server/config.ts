import path from 'node:path';


export const ROOT_DIR = process.cwd() as string;

export const STATIC_DIR = path.join(ROOT_DIR, 'build', 'dist') as string;

export const OPENAPI_DIR = path.join(ROOT_DIR, 'openapi') as string;

export const HOST = process.env['HOST'] ?? '0.0.0.0' as string;

export const PORT = Number(process.env['PORT'] ?? '3000');

export const DOCKER_SOCKET = process.env['DOCKER_SOCKET'] ?? '/var/run/docker.sock';
