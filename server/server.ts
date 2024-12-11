import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { WebSocketServer } from 'ws';
import Docker from 'dockerode';
import { Duplex } from 'node:stream';

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
  on: {
    proxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
  }
}));


app.use('/openapi', express.static(OPENAPI_DIR))
app.use('/', express.static(STATIC_DIR));

const server = app.listen(PORT, HOST);

const wss = new WebSocketServer({ server });

const docker = new Docker({
  socketPath: DOCKER_SOCKET,
});

wss.on('connection', (ws) => {
  const vars: {
    container: Docker.Container | null;
    exec: Docker.Exec | null;
    stream: Duplex | null;
  } = {
    container: null,
    exec: null,
    stream: null
  }

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'start') {
      vars.container = docker.getContainer(data.containerName);
      const exec = await vars.container.exec({
        Cmd: data.command,
        User: 'root',
        WorkingDir: '/',
        Tty: true,
        AttachStdout: true,
        AttachStdin: true,
        AttachStderr: true,
      });
      vars.stream = await exec.start({
        hijack: true,
        Detach: false,
        Tty: true,
        stdin: true,
      });

      vars.stream.on('data', data => {
        ws.send(JSON.stringify({
          type: 'result',
          data: data.toString(),
        }));
      });

      vars.stream.on('close', () => {
        ws.close();
      });

      return;
    }


    if (data.type === 'command') {
      if (!vars.stream) return;

      vars.stream.write(data.command);

      return;
    }

    ws.close();
  });
});

