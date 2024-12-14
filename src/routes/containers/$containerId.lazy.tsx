import { createLazyFileRoute } from '@tanstack/react-router'
import { Tabs } from 'antd';
import React, { useEffect, useRef } from 'react';
import { ContainerInspectResponse } from '../../api/docker-engine';
import { useAtom } from 'jotai';
import { containerApi, focusedContainerAtom, focusedContainerIdOrNameAtom } from '../../atoms/containers';
import { formatBytes } from '../../utils';
import { headingAtom } from '../../atoms/common';
import ReactJson from 'react-json-view';
import { ContainerShell, OverviewObjectProps, OverviewObject } from '../../components';


function Page() {
  const {params: {containerId}} = Route.useMatch();
  const [{data: containerInspector} ] = useAtom(focusedContainerAtom);
  const [,setContainerInspectorId] = useAtom(focusedContainerIdOrNameAtom);
  const [,setHeading] = useAtom(headingAtom);

  useEffect(() => {
    setContainerInspectorId(containerId);
  }, [containerId, setContainerInspectorId, setHeading]);

  const activeTab = window.location.hash ? window.location.hash.slice(1) : 'overview';

  const handleChangeTab = (key: string) => {
    window.location.hash = key;
  }

  return (
    <>
      <Tabs activeKey={activeTab} onChange={handleChangeTab} style={{height: '100%'}} items={[
        {
          key: 'overview',
          label: 'Overview',
          children: containerInspector ? <OverviewTab data={containerInspector} /> : null,
        },
        {
          key: 'json',
          label: 'JSON',
          children: containerInspector ? <JSONTab data={containerInspector} /> : null,
        },
        {
          key: 'log',
          label: 'Log',
          children: containerInspector ? <LogTab data={containerInspector} /> : null,
        },
        {
          key: 'shell',
          label: 'Shell',
          children: containerInspector ? <ShellTab data={containerInspector} /> : null,
        }
      ]} />
    </>
  )
}


const OverviewTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  const fieldConfig: OverviewObjectProps<ContainerInspectResponse>['fieldConfigs'] = [
    {
      name: 'Name',
      getValue: data => data.Name?.slice(1),
    },
    {
      name: 'Image',
    },
    {
      name: 'Command',
      getValue: data => data.Config?.Cmd,
    },
    {
      name: 'Args',
    },
    {
      name: 'Status',
      getValue: data => data.State?.Status,
    },
    {
      name: 'Hostname',
      getValue: data => data.Config?.Hostname,
    },
    {
      name: 'Port bindings',
      getValue: data => Array.from(Object.entries(data.HostConfig?.PortBindings ?? {}).entries()).map(([, [containerPort, value]]) => (
        value ? `${containerPort.split('/')[0]} -> ${value[0].HostPort}` : null
      )),
    },
    {
      name: 'Working dir',
      getValue: data => data.Config?.WorkingDir,
    },
    {
      name: 'Network mode',
      getValue: data => data.HostConfig?.NetworkMode,
    },
    {
      name: 'Created',
      getValue: data => data.Created ? new Date(data.Created).toLocaleString() : null,
    },
    {
      name: 'Environments',
      getValue: data => Object.values(data.Config?.Env ?? []),
    },
    {
      name: 'Memory',
      getValue: data => data.HostConfig?.Memory === 0 ? 'unlimited' : formatBytes(data.HostConfig?.Memory ?? 0),
    },
    {
      name: 'CPU quotas',
      getValue: data => data.HostConfig?.CpuQuota === 0 ? 'unlimited' : data.HostConfig?.CpuQuota,
    }
  ];

  return <OverviewObject data={data} fieldConfigs={fieldConfig} />
}


const JSONTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  return (
    <ReactJson src={data} displayDataTypes={false} />
  )  
}


const LogTab:React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!data.Name) return;

    containerApi.containerLogs({ 
      id: data.Name.slice(1), 
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
  }, [data.Name]);

  return (
    <div style={{height: '100%' }}>
      <pre ref={ref} style={{ fontFamily: 'Courier' }}></pre>
    </div>
  )
}

const ShellTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  return (
    <>
      <ContainerShell name={data.Name!.slice(1)} />
    </>
  )
}


export const Route = createLazyFileRoute('/containers/$containerId')({
  component: Page,
});

