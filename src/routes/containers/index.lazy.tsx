import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useAtomValue } from 'jotai';

import { containersAtom } from '../../atoms/containers';
import { Divider, Table, Flex, Button, Tag } from 'antd';
import type { TableColumnType } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { useEffect, useState } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { handleAxiosError } from '../../utils/errors';
import { compareStrings } from '../../utils';
import { ContainerToolbar } from './-components/container-toolbar';


export const Route = createLazyFileRoute('/containers/')({
  component: Page,
})

function Page() {
  const { data: containers, error: fetchContainerError, isError: isFetchContainerError } = useAtomValue(containersAtom);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (isFetchContainerError) {
      handleAxiosError(fetchContainerError, 'Error fetching containers');
    }
  }, [isFetchContainerError, fetchContainerError]);

  const mappedData = (containers ?? []).map(container => ({
    id: container.Id,
    name: container.Names?.[0].slice(1) ?? '',
    ports: container.Ports?.map(port => `${port.Type}:${port.IP ?? '0.0.0.0'}/${port.PublicPort ?? ''}:${port.PrivatePort}`),
    status: container.Status,
    state: container.State,
    key: container.Id,
  }));

  const columns: TableColumnType<typeof mappedData[0]>[] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      sorter: (a, b) => compareStrings(a.name, b.name),
      render: (_, record) => 
        <Link to={'/containers/$name'} params={{name: record.name}}>{record.name}</Link>,
    },
    {
      key: 'ports',
      dataIndex: 'ports',
      title: 'Ports',
      render: (_, record) => {
        return record.ports?.sort().map(port => <Tag key={port}>{port}</Tag>)
      },
      width: '25%'
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
    },
    {
      key: 'actions',
      dataIndex: 'actions',
      title: 'Actions',
      render: (_, record) => record.id ? (
        <ContainerToolbar container={{
          id: record.id,
          name: record.name,
          ports: record.ports ?? [],
          state: record.state ?? '',
        }} />
      ) : null
    }
  ]

  const rowSelection: TableRowSelection<typeof mappedData[0]> = {
    selectedRowKeys: selectedKeys,
    onChange: (keys) => setSelectedKeys(keys),
  }

  const isSelected = selectedKeys.length > 0;

  return (
    <>
      <Flex justify="space-between">
        <div></div>
        <ButtonGroup>
          <Button color="default" variant="solid" disabled={!isSelected}>Stop</Button>
          <Button color="danger" variant="solid" disabled={!isSelected}>Delete</Button>
        </ButtonGroup>
      </Flex>
      <Divider />
      <Table columns={columns} dataSource={mappedData} rowSelection={rowSelection} />
    </>
  )
}

