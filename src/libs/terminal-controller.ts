import type { Terminal } from '@xterm/xterm';
import { API_URL } from '../constants';
import { ContainerInspectResponse } from '../api/docker-engine';
import { StartTerminalMessage, ResizeTerminalMessage, StdinStreamTerminalMessage, StdoutStreamTerminalMessage, Message, ErrorTerminalMessage } from '../../server/message';


export class TerminalController {
  private ws: WebSocket;

  constructor(
    private readonly terminal: Terminal,
    private readonly containerName: string,
    private readonly container?: ContainerInspectResponse,
    private onError?: (error: Error) => void,
  ) {
    this.ws = this.createWebsocket();
    this.terminal.onData(data => {
      const message = new StdinStreamTerminalMessage({ data });
      this.ws.send(message.toString());
    });

    this.terminal.onResize(({cols, rows}) => {
      const message = new ResizeTerminalMessage({ consoleSize: [rows, cols] });
      this.ws.send(message.toString());
    });
  }

  private createWebsocket() {
    const host = new URL(API_URL);
    host.protocol = 'ws';
    return new WebSocket(host.origin);
  }

  initialize() {
    this.ws.onopen = () => {
      const message = new StartTerminalMessage({
        cmd: ['/bin/sh'],
        containerName: this.containerName,
        workingDir: this.container?.Config?.WorkingDir,
        consoleSize: [this.terminal.rows, this.terminal.cols],
      })
      this.ws.send(message.toString());
    };

    this.ws.onmessage = (event) => {
      const message = Message.fromString(event.data.toString());
      if (message.Type === ErrorTerminalMessage.name) {
        const data = message.Data as ErrorTerminalMessage['Data'];
        this.onError?.(new Error(data.message));
        return;
      }

      const data = message.Data as StdoutStreamTerminalMessage['Data'];
      this.terminal.write(data.data);
    };

    this.ws.onclose = () => {
      this.terminal.clear();
      this.terminal.writeln(`Connection to container ${this.containerName} closed`);

      this.ws = this.createWebsocket();
      this.initialize();
      this.terminal.writeln(`Reconnecting to container ${this.containerName}...`);
    }
  }
}

