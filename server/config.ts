import path from 'node:path';


export const STATIC_DIR = path.join(path.dirname(__dirname), 'dist') as string;

export const OPENAPI_DIR = path.join(path.dirname(__dirname), 'openapi') as string;

export const HOST = process.env['HOST'] ?? 'localhost' as string;

export const PORT = Number(process.env['PORT'] ?? '3000');

export const DOCKER_SOCKET = process.env['DOCKER_SOCKET'] ?? '/var/run/docker.sock';
