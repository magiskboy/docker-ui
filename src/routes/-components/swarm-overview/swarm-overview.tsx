import React from 'react';
import { SystemInfo } from '../../../api/docker-engine';
import { JsonViewer, OverviewObject, OverviewObjectProps } from '../../../components';
import { List, Typography, Tag, Modal } from 'antd';


const { Text } = Typography;


export const SwarmOverview: React.FC<Props> = ({systemInfo}) => {
  const [modal, contextHolder] = Modal.useModal();
  const fieldConfigs: OverviewObjectProps<SystemInfo>['fieldConfigs'] = [
    {
      name: 'NodeID',
      label: 'Node ID',
    },
    {
      name: 'NodeAddr',
      label: 'IP address',
    },
    {
      name: 'LocalNodeState',
      label: 'State',
    },
    {
      name: 'ControlAvailable',
      label: 'Control available',
    },
    {
      name: 'Nodes',
      label: 'Total number of nodes',
    },
    {
      name: 'Managers',
      label: 'Total number of managers',
    },
    {
      name: 'RemoteManagers',
      label: 'Total number of remote managers',
      getValue: d => d.Swarm?.RemoteManagers?.map(manager => manager.Addr),
    },
    {
      name: 'Cluster',
      render: (value, d) => {
        return (
          value ? <List>
            <List.Item>
              <Text strong>ID:</Text>
              <Text 
                onClick={() => modal.info({
                  title: 'Cluster info',
                  content: (
                    <JsonViewer
                      fetcher={() => Promise.resolve(d.Swarm?.Cluster ?? {})}
                      style={{height: 'calc(100vh - 200px)', overflow: 'scroll'}}
                    />
                  )
                })}
              >
                {d.Swarm?.Cluster?.ID}
              </Text>
            </List.Item>
            <List.Item>
              <Text strong>Addrress pool:</Text>
              {d.Swarm?.Cluster?.DefaultAddrPool?.map(item => <Tag key={item}>{item}</Tag>)}
            </List.Item>
          </List> : null
        )
      }
    },
  ];

  return (
    <>
      <OverviewObject fieldConfigs={fieldConfigs} data={systemInfo} labelSpan={12} collapsed showJson={false} />
      {contextHolder}
    </>
  ) 
}


interface Props {
  systemInfo: SystemInfo;
}

