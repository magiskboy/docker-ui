import type { Terminal } from '@xterm/xterm';
import { API_URL } from '../../constants';


export class TerminalController {
  private ws: WebSocket;

  constructor(private readonly terminal: Terminal, private readonly containerName: string) {
    const host = new URL(API_URL);
    host.protocol = 'ws';
    this.ws = new WebSocket(host.origin);
  }

  get Terminal(): Terminal {
    return this.terminal;
  }

  initialize() {
    this.terminal.onData((e) => this.ws.send(JSON.stringify({
      type: 'command',
      command: e,
    })));

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: 'start',
        command: ['/bin/sh'],
        containerName: this.containerName,
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.terminal.write(data.data);
    };
  }
}

