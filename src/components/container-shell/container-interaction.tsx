import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import styles from './container-shell.module.css';
import { TerminalController } from './terminal-controller';
import { useAtom } from 'jotai';
import { focusedContainerAtom } from '../../atoms/containers';


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

      window.onresize = (() => {
        fitAddon.fit();
      });

      fitAddon.fit();

      const terminalController = new TerminalController(instance, name!, focusedContainer);
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

