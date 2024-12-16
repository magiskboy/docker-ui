import type { Server } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import Docker from 'dockerode';
import type { Duplex } from 'node:stream';
import { DOCKER_SOCKET } from './config';


export class WebsockerHandler {
  private readonly ws: WebSocketServer;
  private readonly docker: Docker;

  constructor(server: Server) {
    this.ws = new WebSocketServer({ server });
    this.docker = new Docker({
      socketPath: DOCKER_SOCKET,
    });
  }

  setup() {
    this.ws.on('connection', ws => {
      const vars: ContextVars = {
        ws,
        container: null,
        exec: null,
        stream: null
      }

      ws.on('open', () => {
        this.onOpen(vars);
      });

      ws.on('message', message => {
        this.onMessage(message.toString(), vars);
      });

      ws.on('close', () => {
        this.onClose(vars);
      });
    });

    this.ws.on('error', (error) => {
      console.error(error);
    });
  }

  onMessage(message: string, context: ContextVars) {
    const data = JSON.parse(message.toString());

    if (data.type === 'start') {
      context.container = this.docker.getContainer(data.containerName);
      context.container.exec({
        Cmd: data.command,
        User: 'root',
        WorkingDir: data.workingDir ?? '/',
        Tty: true,
        AttachStdout: true,
        AttachStdin: true,
        AttachStderr: true,
        ConsoleSize: data.consoleSize,
      }).then(exec => {
        context.exec = exec;
        exec.start({
          hijack: true,
          Detach: false,
          Tty: true,
          stdin: true,
        }).then(stream => {
          if (stream === null) return;
          context.stream = stream;

          stream.on('data', data => {
            context.ws.send(JSON.stringify({
              type: 'result',
              data: data.toString(),
            }));
          });

          stream.on('close', () => {
            context.ws.close();
          });
        })
      }).catch(e => {
        context.ws.send(JSON.stringify({
          type: 'error',
          message: e.message,
        }));
      });

      return;
    }

    if (data.type === 'command') {
      if (!context.stream) return;

      context.stream.write(data.command);

      return;
    }

    if (data.type === 'resize') {
      if (!context.stream) return;

      context.exec?.resize({
        h: data.consoleSize[0],
        w: data.consoleSize[1],
      });

      return;
    }

    context.ws.close();
  }

  onOpen(context: ContextVars) {
  }

  onClose(context: ContextVars) {
    
  }

}


interface ContextVars {
  ws: WebSocket;
  container: Docker.Container | null;
  exec: Docker.Exec | null;
  stream: Duplex | null;
}

