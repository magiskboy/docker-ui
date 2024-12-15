import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Col, Row, Tabs, Typography } from 'antd';
import React, { useEffect } from 'react';
import { ContainerInspectResponse } from '../../api/docker-engine';
import { useAtom } from 'jotai';
import { focusedContainerAtom, focusedContainerIdOrNameAtom } from '../../atoms/containers';
import { formatBytes } from '../../utils';
import { headingAtom } from '../../atoms/common';
import { ContainerShell, ContainerLog, OverviewObjectProps, OverviewObject, JsonViewer } from '../../components';


const { Text } = Typography;


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
    },
    {
      name: 'Image',
      getValue: data => data.Config?.Image,
      render: (value, data) => (
        <Row key="Image">
          <Col span={3}><Text strong>Image</Text></Col>
          <Col span={9}><Link to='/images/$imageName' params={{ imageName: data.Config?.Image as string}}>{value}</Link></Col>
        </Row>
      )
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


const JSONTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  return <JsonViewer fetcher={() => Promise.resolve(data)} />
}


const LogTab:React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  const nameOrId = data.Name ?? data.Id;
  return nameOrId ? <ContainerLog containerIdOrName={nameOrId} /> : null;
}

const ShellTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  return <ContainerShell name={data.Name!} />
}


export const Route = createLazyFileRoute('/containers/$containerId')({
  component: Page,
});

