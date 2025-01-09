import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { notification, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { ContainerInspectResponse } from '../../api/docker-engine';
import { useAtom } from 'jotai';
import { focusedContainerAtom, focusedContainerIdOrNameAtom } from '../../atoms/containers';
import { formatBytes } from '../../utils';
import { headingAtom } from '../../atoms/common';
import { ContainerShell, ContainerLog, OverviewObjectProps, OverviewObject } from '../../components';
import { ContainerToolbar } from './-components/container-toolbar';


function Page() {
  const {params: {name}} = Route.useMatch();
  const [{data: containerInspector} ] = useAtom(focusedContainerAtom);
  const [,setFocusedContainerIdOrName] = useAtom(focusedContainerIdOrNameAtom);
  const [,setHeading] = useAtom(headingAtom);
  const navigate = useNavigate();

  useEffect(() => {
    setFocusedContainerIdOrName(name);
  }, [name, setFocusedContainerIdOrName, setHeading]);

  const activeTab = window.location.hash ? window.location.hash.slice(1) : 'overview';

  const handleChangeTab = (key: string) => {
    window.location.hash = key;
  }

  return (
      containerInspector ? <Tabs activeKey={activeTab} onChange={handleChangeTab} style={{height: '100%'}} items={[
        {
          key: 'overview',
          label: 'Overview',
          children: <OverviewTab data={containerInspector} />,
        },
        {
          key: 'log',
          label: 'Log',
          children: <LogTab data={containerInspector} />,
        },
        {
          key: 'shell',
          label: 'Shell',
          children:  <ShellTab data={containerInspector} />,
          disabled: !containerInspector?.State?.Running,
        },
      ]} tabBarExtraContent={
        <ContainerToolbar 
          container={{
            id: containerInspector.Id!,
            name: containerInspector.Name!,
            ports: [],
            state: containerInspector.State?.Status ?? '',
          }}
          showLog={false} 
          showShell={false} 
          afterDelete={() => {
            navigate({to: '/containers'});
            notification.success({message: `Container ${name} was deleted`});
          }}
        />} 
      /> : null
  )
}


const OverviewTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  const fieldConfig: OverviewObjectProps<ContainerInspectResponse>['fieldConfigs'] = [
    {
      name: 'Name',
    },
    {
      name: 'Image',
      getValue: data => data.Config?.Image,
      render: (value, data) => <Link to='/images/$name' params={{name: data.Config?.Image as string}}>{value as string}</Link>
    },
    {
      name: 'Command',
      getValue: data => data.Config?.Cmd,
      verticalList: false,
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
      getValue: data => data.Config?.WorkingDir || '/',
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


const LogTab:React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  const nameOrId = data.Name ?? data.Id;
  return nameOrId ? <ContainerLog containerIdOrName={nameOrId} /> : null;
}

const ShellTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  return <ContainerShell name={data.Name!} />
}


export const Route = createLazyFileRoute('/containers/$name')({
  component: Page,
});

