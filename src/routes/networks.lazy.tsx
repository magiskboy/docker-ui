import { createLazyFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { networksAtom } from '../atoms/networks'
import { Divider, Flex, Table, type TableColumnType, Button, Badge, Checkbox } from 'antd';
import { useEffect } from 'react';
import { handleAxiosError } from '../utils/errors';
import ButtonGroup from 'antd/es/button/button-group';
import { IoIosRefresh } from 'react-icons/io';

export const Route = createLazyFileRoute('/networks')({
  component: Page,
})

function Page() {
  const { data: networks, refetch: refetchNetworks, isError: isFetchNetworksError, error: fetchNetworksError } = useAtomValue(networksAtom);

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
    },
    {
      key: 'scope',
      dataIndex: 'scope',
      title: 'Scope',
    },
    {
      key: 'driver',
      dataIndex: 'driver',
      title: 'Driver',
    },
    {
      key: 'enableIpv6',
      dataIndex: 'enableIpv6',
      title: 'Enable IPv6',
      render: value => <Checkbox checked={value} disabled />
    },
    {
      key: 'attachable',
      dataIndex: 'attachable',
      title: 'Attachable',
      render: value => <Checkbox checked={value} disabled />
    },
    {
      key: 'containers',
      dataIndex: 'containers',
      title: 'Containers',
      render: (value: typeof mappedData[0]['containers']) => 
        Object.values(value ?? {}).map(
          (container) => <Badge>{`${container.Name}: ${container.IPv4Address}`}</Badge>)
    },
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
    </>
  )
}
