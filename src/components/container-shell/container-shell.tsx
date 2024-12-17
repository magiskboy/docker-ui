import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import styles from './container-shell.module.css';
import { TerminalController } from '../../libs';
import { focusedContainerAtom } from '../../atoms/containers';
import { notification } from 'antd';


export const ContainerShell: React.FC<Props> = ({name}) => {
  const [instance, setInstance] = useState<Terminal>()
  const terminalRef = useRef<HTMLDivElement>(null);
  const [{data: focusedContainer}] = useAtom(focusedContainerAtom);

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
    if (instance && terminalRef.current && focusedContainer) {
      const fitAddon = new FitAddon();
      const webGlAddon = new WebglAddon();
      instance.loadAddon(fitAddon);
      instance.loadAddon(webGlAddon);
      instance.open(terminalRef.current);
      instance.writeln(`Connecting to container ${name}...`);
      instance.focus();
      fitAddon.fit();

      window.onresize = (() => {
        fitAddon.fit();
      });

      const terminalController = new TerminalController(instance, name!, focusedContainer, (e) => {
        notification.error({
          message: 'Error',
          description: e.message,
        });
      });
      terminalController.initialize();
    }

    return () => {
      instance?.dispose();
    }
  }, [instance, name, focusedContainer])
 

  return (
    <div className={styles['terminal']} ref={terminalRef}></div>
  )
}


interface Props {
  name: string;
}

