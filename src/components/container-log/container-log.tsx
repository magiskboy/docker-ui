import React, { useRef, useEffect, useState } from 'react';
import { containerApi } from '../../atoms/containers';
import styles from './container-log.module.css';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';


export const ContainerLog: React.FC<Props> = ({containerIdOrName}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal]= useState<Terminal>();

  useEffect(() => {
    containerApi.containerLogs({ 
      id: containerIdOrName, 
      follow: true, 
      stdout: true, 
      stderr: true,
      timestamps: false,
    }, {
      onDownloadProgress: (event) => {
        const data = event.event?.target.responseText;
        const text: string = data.toString();
        const lines: string[] = [];
        for (const line of text.split('\n')) {
          lines.push(
            line.slice(line.indexOf(' ')),
          );
        }
        if (terminal) {
          terminal.write(lines.join('\r\n'));
        }
      }
    });
  }, [containerIdOrName, terminal]);

  useEffect(() => {
    if (ref.current) {
      const instance = new Terminal({disableStdin: true});
      setTerminal(instance);
    }
  }, [ref]);

  useEffect(() => {
    if (!(ref.current && terminal)) return;

    const fitAddon = new FitAddon();
    const webglAddon = new WebglAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webglAddon);

    terminal.open(ref.current);
    terminal.focus();
    terminal.scrollToBottom();

    fitAddon.fit();

    return () => {
      terminal.dispose();
    }

  }, [terminal]);  //@eslint-disable-line

  return (
    <div className={styles['container-log']} ref={ref}></div>
  )
}

interface Props {
  containerIdOrName: string;
}

