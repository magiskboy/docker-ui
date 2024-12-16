import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {
  STATIC_DIR,
  OPENAPI_DIR,
  HOST,
  PORT,
  DOCKER_SOCKET,
} from './config';
import { WebsockerHandler } from './websocket';



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
const websocketHandler = new WebsockerHandler(server);
websocketHandler.setup();

