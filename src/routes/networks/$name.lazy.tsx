import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useAtom } from 'jotai';
import { focusedNetworkAtom, focusedNetworkIdOrNameAtom } from '../../atoms/networks';
import { useEffect } from 'react';
import { OverviewObjectProps, OverviewObject } from '../../components';
import type { Network, ImageInspect, Driver, IPAM } from '../../api/docker-engine';
import { Tabs, Row, Col, Typography, Tooltip } from 'antd';
import ReactJson from 'react-json-view';

const { Text } = Typography;

export const Route = createLazyFileRoute('/networks/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  const {params: {name}} = Route.useMatch();
  const [,setForcusedNetwordIdOrName] = useAtom(focusedNetworkIdOrNameAtom);
  const [{data: focusedNetwork}] = useAtom(focusedNetworkAtom);

  useEffect(() => {
    if (!name) return;
    setForcusedNetwordIdOrName(name);
  }, [name, setForcusedNetwordIdOrName]);

  const activeTab = window.location.hash ? window.location.hash.slice(1) : 'overview';

  const handleChangeTab = (key: string) => {
    window.location.hash = key;
  }

  return (
    <>
      <Tabs 
        activeKey={activeTab}
        onChange={handleChangeTab}
        items={[
          {
            key: 'overview',
            label: 'Overview',
            children: focusedNetwork ? <OverviewTab data={focusedNetwork} /> : null,
          },
          {
            key: 'json',
            label: 'JSON',
            children: focusedNetwork ? <JSONTab content={focusedNetwork} /> : null,
          }
        ]}
      />
    </>
  )
}


const OverviewTab: React.FC<{data: Network}> = ({data}) => {
  const fieldConfigs: OverviewObjectProps<Network>['fieldConfigs'] = [
      {
        name: 'Name',
      },
      {
        name: 'Driver',
      },
      {
        name: 'Scope',
      },
      {
        name: 'Created',
        getValue: d => d.Created ? new Date(d.Created).toLocaleString() : null,
      },
      {
        name: 'EnableIPv6',
        label: 'IPv6'
      },
      {
        name: 'Containers',
        render: containers => {
          if (!containers) {
            return null;
          }
          
          return (
            <Row key={'Containers'}>
              <Col span={3}><Text strong>Containers</Text></Col>
              <Col span={12 - 3}>
                {
                  Object.entries(containers).map(([id, container]) => (
                    <Tooltip key={id} title={container.IPv4Address} placement='topLeft'>
                      <Link key={id} to='/containers/$containerId' params={{containerId: container.Name}}>
                        {container.Name}
                      </Link>
                    </Tooltip>
                  ))
                }
              </Col>
            </Row>
          )
        }
      },
      {
        name: 'Options',
        getValue: d => Object.entries(d.Options ?? {}).map(([k, v]) => `${k}=${v}`),
      },
      {
        name: 'Labels',
        getValue: d => Object.entries(d.Labels ?? {}).map(([k, v]) => `${k}=${v}`)
      },
      {
        name: 'IPAM',
        getValue: d => d.IPAM?.Config?.[0].Subnet,
      }
  ]

  return <OverviewObject
    data={data}
    fieldConfigs={fieldConfigs}  
  />
}


const JSONTab: React.FC<{content: ImageInspect}> = ({content}) => {
  return (
    <ReactJson src={content} displayDataTypes={false} />
  )
}

