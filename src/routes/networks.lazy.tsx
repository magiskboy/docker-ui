import { createLazyFileRoute } from '@tanstack/react-router'
import { useAtom, useAtomValue } from 'jotai'
import { networkInspectorAtom, networkInspectorIdAtom, networksAtom } from '../atoms/networks'
import { Divider, Flex, Table, type TableColumnType, Button, Badge, Checkbox, theme } from 'antd';
import { useEffect } from 'react';
import { handleAxiosError } from '../utils/errors';
import ButtonGroup from 'antd/es/button/button-group';
import { IoIosRefresh } from 'react-icons/io';
import { compareStrings } from '../utils';
import { HiMagnifyingGlass } from "react-icons/hi2";
import { InspectorModal } from '../components';


export const Route = createLazyFileRoute('/networks')({
  component: Page,
})

function Page() {
  const { data: networks, refetch: refetchNetworks, isError: isFetchNetworksError, error: fetchNetworksError } = useAtomValue(networksAtom);
  const { token: {marginXS} } = theme.useToken();
  const [networkInspectorId, setNetworkInspectorId] = useAtom(networkInspectorIdAtom);
  const [{ data: networkInspector }] = useAtom(networkInspectorAtom);

  useEffect(() => {
    if (isFetchNetworksError) {
      handleAxiosError(fetchNetworksError, 'Error fetching networks');
    }
  }, [isFetchNetworksError, fetchNetworksError]);

  const mappedData = (networks ?? []).map(network => ({
    id: network.Id,
    name: network.Name,
    scope: network.Scope,
    driver: network.Driver,
    enableIpv6: network.EnableIPv6,
    attachable: network.Attachable,
    containers: network.Containers,
    key: network.Id,
  }));

  const columns: TableColumnType<typeof mappedData[0]>[] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      sorter: (a, b) => compareStrings(a.name ?? '', b.name ?? ''),
    },
    {
      key: 'scope',
      dataIndex: 'scope',
      title: 'Scope',
      filters: [
        { text: 'Local', value: 'local'},
        { text: 'Swarm', value: 'swarm'},
      ],
      onFilter: (value, record) => record.scope === value,
      filterMultiple: false,
    },
    {
      key: 'driver',
      dataIndex: 'driver',
      title: 'Driver',
      filters: [
        { text: 'null', value: 'null'},
        { text: 'bridge', value: 'bridge'},
        { text: 'host', value: 'host'},
        { text: 'overlay', value: 'overlay'},
        { text: 'macvlan', value: 'macvlan'},
      ],
      onFilter: (value, record) => record.driver === value,
      filterMultiple: false,
    },
    {
      key: 'enableIpv6',
      dataIndex: 'enableIpv6',
      title: 'Enable IPv6',
      render: value => <Checkbox checked={value} disabled />,
      filters: [
        { text: 'true', value: true},
        { text: 'false', value: false},
      ],
      onFilter: (value, record) => record.enableIpv6 === value,
      filterMultiple: false,
    },
    {
      key: 'attachable',
      dataIndex: 'attachable',
      title: 'Attachable',
      render: value => <Checkbox checked={value} disabled />,
      filters: [
        { text: 'true', value: true},
        { text: 'false', value: false},
      ],
      onFilter: (value, record) => record.attachable === value,
      filterMultiple: false,
    },
    {
      key: 'containers',
      dataIndex: 'containers',
      title: 'Containers',
      render: (value: typeof mappedData[0]['containers']) => 
        Object.values(value ?? {}).map(
          (container) => <Badge>{`${container.Name}: ${container.IPv4Address}`}</Badge>)
    },
    {
      key: 'actions',
      dataIndex: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Flex gap={marginXS}>
          <Button icon={<HiMagnifyingGlass />} onClick={() => setNetworkInspectorId(record.name ?? record.id ?? '')}/>
        </Flex>
      ),
    }
  ]

  return (
    <>
      <Flex justify='space-between'>
        <div></div>
        <ButtonGroup>
          <Button icon={<IoIosRefresh />} onClick={() => refetchNetworks()} />
        </ButtonGroup>
      </Flex>
      <Divider />
      <Table columns={columns} dataSource={mappedData} />
      <InspectorModal
        title={networkInspector?.Name ?? ''}
        content={JSON.stringify(networkInspector, null, 2)}
        open={!!networkInspectorId}
        onClose={() => setNetworkInspectorId('')}
      />
    </>
  )
}
