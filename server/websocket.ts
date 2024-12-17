import type { Server } from 'node:http';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import Docker from 'dockerode';
import type { Duplex } from 'node:stream';
import { DOCKER_SOCKET } from './config';
import { ErrorTerminalMessage, Message, ResizeTerminalMessage, StartTerminalMessage, StdinStreamTerminalMessage, StdoutStreamTerminalMessage } from './message';


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
        this.onMessage(message, vars);
      });

      ws.on('close', () => {
        this.onClose(vars);
      });
    });

    this.ws.on('error', (error) => {
      console.error(error);
    });
  }

  onMessage(rawMessage: RawData, context: ContextVars) {
    const message = Message.fromString(rawMessage.toString())

    if (message.Type === StartTerminalMessage.name) {
      const data = message.Data as StartTerminalMessage['Data'];
      context.container = this.docker.getContainer(data.containerName);
      context.container.exec({
        Cmd: data.cmd,
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
            const message = new StdoutStreamTerminalMessage({
              data: data.toString()
            })
            context.ws.send(message.toString());
          });

          stream.on('close', () => {
            context.ws.close();
          });
        })
      }).catch(e => {
        const message = new ErrorTerminalMessage({
          message: e.message
        })
        context.ws.send(message.toString());
      });

      return;
    }

    if (message.Type === StdinStreamTerminalMessage.name) {
      if (!context.stream) return;
      const data = message.Data as StdinStreamTerminalMessage['Data'];
      context.stream.write(data.data);
      return;
    }

    if (message.Type === ResizeTerminalMessage.name) {
      if (!context.stream) return;

      const data = message.Data as ResizeTerminalMessage['Data'];
      context.exec?.resize({
        h: data.consoleSize[0],
        w: data.consoleSize[1],
      });

      return;
    }

    // context.ws.close();
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

