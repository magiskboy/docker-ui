import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import { API_URL } from '../constants';


export const ContainerInteraction: React.FC<Props> = ({name}) => {
  const [instance, setInstance] = useState<Terminal>()
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const newInstance = new Terminal({
        cursorBlink: true,
      });
      setInstance(newInstance)

    return () => {
      instance?.dispose();
    }
  }, [terminalRef]);  // eslint-disable-line

  useEffect(() => {
    if (!name) return;

  }, [name]);

  useEffect(() => {
    if (instance && terminalRef.current) {
      const fitAddon = new FitAddon();
      const webGlAddon = new WebglAddon();
      instance.loadAddon(fitAddon);
      instance.loadAddon(webGlAddon);
      instance.open(terminalRef.current);
      instance.writeln(`Connecting to container ${name}...`);
      instance.focus();
      fitAddon.fit();

      const terminalController = new TerminalController(instance, name!);
      terminalController.initialize();
    }

    return () => {
      instance?.dispose();
    }
  }, [instance, name])
 

  return (
    <div style={{ height: '100%' }} ref={terminalRef}></div>
  )
}


interface Props {
  name: string;
}


class TerminalController {
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

