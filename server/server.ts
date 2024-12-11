import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const STATIC_DIR = path.join(path.dirname(__dirname), 'dist')
const OPENAPI_DIR = path.join(path.dirname(__dirname), 'openapi')
const HOST = process.env['HOST'] ?? 'localhost';
const PORT = Number(process.env['PORT'] ?? '3000');
const DOCKER_SOCKET = process.env['DOCKER_SOCKET'] ?? '/var/run/docker.sock';

if (!fs.existsSync(DOCKER_SOCKET)) {
  console.error('Error: Docker socket not found');
  process.exit(1);
}

const app = express();
app.use(cors());

app.use('/api', createProxyMiddleware({
  target: {
    host: '',
    port: '',
    socketPath: DOCKER_SOCKET,
  },
  pathRewrite: { '^/api': '' },
  logger: console,
}));

app.use('/openapi', express.static(OPENAPI_DIR))
app.use('/', express.static(STATIC_DIR));

app.listen(PORT, HOST, () => {
  console.log(`Server started at http://${HOST}:${PORT}`);
});

