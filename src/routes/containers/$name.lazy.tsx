import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { notification, Tabs, Splitter } from 'antd';
import React, { useEffect, useState } from 'react';
import { ContainerInspectResponse } from '../../api/docker-engine';
import { useAtom } from 'jotai';
import { containerApi, focusedContainerAtom, focusedContainerIdOrNameAtom } from '../../atoms/containers';
import { formatBytes } from '../../utils';
import { headingAtom } from '../../atoms/common';
import { ContainerShell, ContainerLog, OverviewObjectProps, OverviewObject } from '../../components';
import { ContainerToolbar } from './-components/container-toolbar';
import { Line, LineConfig } from '@ant-design/plots';
import _ from 'lodash';


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
        {
          key: 'monitor',
          label: 'Monitor',
          children: <MonitorTab container={containerInspector} />,
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

const MonitorTab: React.FC<{container: ContainerInspectResponse}> = ({container}) => {
  const [stats, setStats] = useState<object[]>([]);

  useEffect(() => {
    const containerName = container.Id ?? container.Name;
    if (!containerName) return;
    containerApi.containerStats({ id: containerName, stream: true }, {
      onDownloadProgress: (event) => {
        const data = event.event?.target.responseText;
        const text: string = data.toString();
        const statData = [];
        for (const line of text.split('\n').slice(-50)) {
          try {
            const item = JSON.parse(line);
            item['read'] = new Date(item['read']);
            statData.push(item);
          } catch {;}

        }

        setStats(_.sortBy(statData, ['read']));
      }
    });
  }, [container.Id, container.Name]);

  const memoryConfig: LineConfig = {
    scale: {
      x: {
        type: 'time'
      }
    },
    data: stats.reduce((prev, curr) => {
      prev.push({
        type: 'limit',
        value: _.get(curr, 'memory_stats.limit'),
        time: _.get(curr, 'read'),
      });
      prev.push({
        type: 'usage',
        value: _.get(curr, 'memory_stats.usage'),
        time: _.get(curr, 'read'),
      });
      return prev;
    }, []),
    xField: 'time',
    yField: 'value',
    colorField: 'type',
    smooth: true,
    axis: {
      y: {
        label: {
          formatter: (value: number) => `${value.toFixed(2)}%`
        }
      }
    },
    autoFit: true,
    containerAttributes: {
      style: {
        height: '100%',
      }
    }
  }

  const cpuConfig: LineConfig = {
    scale: {
      x: {
        type: 'time'
      }
    },
    data: stats.map((stat) => ({
      value: _.get(stat, 'cpu_stats.cpu_usage.total_usage')!, 
      time: _.get(stat, 'read'),
    })),
    xField: 'time',
    yField: 'value',
    smooth: true,
    axis: {
      y: {
        label: {
          formatter: (value: number) => `${value.toFixed(2)}%`
        }
      }
    },
    containerAttributes: {
      style: {
        height: '100%',
      }
    }
  }

  const networkConfig: LineConfig = {
    scale: {
      x: {
        type: 'time'
      }
    },
    data: stats.map((stat) => ({
      value: _.get(stat, 'networks.eth0.rx_bytes')!, 
      time: _.get(stat, 'read')!,
    })),
    xField: 'time',
    yField: 'value',
    smooth: true,
    axis: {
      y: {
        label: {
          formatter: (value: number) => `${value.toFixed(2)}%`
        }
      }
    },
    autoFit: true,
    containerAttributes: {
      style: {
        height: '100%',
      }
    }
  }

  return (
    <Splitter layout="vertical">
      <Splitter.Panel>
        <Splitter>
          <Splitter.Panel>
            <Line {...memoryConfig} />
          </Splitter.Panel>
          <Splitter.Panel>
            <Line {...cpuConfig} />
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>

      <Splitter.Panel>
        <Splitter>
          <Splitter.Panel>
            <Line {...networkConfig} />
          </Splitter.Panel>
          <Splitter.Panel>
            <Line {...cpuConfig} />
          </Splitter.Panel>
        </Splitter>
      </Splitter.Panel>
    </Splitter>
  )
}


export const Route = createLazyFileRoute('/containers/$name')({
  component: Page,
});

