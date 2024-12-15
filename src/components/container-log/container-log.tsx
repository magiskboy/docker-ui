import React, { useRef, useEffect } from 'react';
import { containerApi } from '../../atoms/containers';


export const ContainerLog: React.FC<Props> = ({containerIdOrName}) => {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    containerApi.containerLogs({ 
      id: containerIdOrName, 
      follow: true, 
      stdout: true, 
      stderr: true,
      timestamps: false,
    }, {
      onDownloadProgress: (event) => {
        const text = event.event?.target.responseText;
        if (ref.current) {
          ref.current.innerHTML = text;
        }
      }
    });
  }, [containerIdOrName]);

  return (
    <div style={{height: '100%' }}>
      <pre ref={ref} style={{ fontFamily: 'Courier' }}></pre>
    </div>
  )
}

interface Props {
  containerIdOrName: string;
}

