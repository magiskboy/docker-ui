import { createLazyFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai';

import { containersAtom, restartContainerAtom, startContainerAtom, stopContainerAtom, deleteContainerAtom } from '../atoms/containers';
import { Divider, Table, Flex, Button, theme } from 'antd';
import type { TableColumnType } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { useEffect, useState } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { FaRegCircleStop } from 'react-icons/fa6';
import { MdOutlineRestartAlt } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegPlayCircle } from 'react-icons/fa';
import { handleAxiosError } from '../utils/errors';

export const Route = createLazyFileRoute('/containers')({
  component: Page,
})

function Page() {
  const { data: containers, error: fetchContainerError, isError: isFetchContainerError } = useAtomValue(containersAtom);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const { mutate: stopContainer } = useAtomValue(stopContainerAtom);
  const { mutate: restartContainer } = useAtomValue(restartContainerAtom);
  const { mutate: startContainer } = useAtomValue(startContainerAtom);
  const { mutate: deleteContainer } = useAtomValue(deleteContainerAtom);
  const { token: {paddingXS} } = theme.useToken();

  useEffect(() => {
    if (isFetchContainerError) {
      handleAxiosError(fetchContainerError, 'Error fetching containers');
    }
  }, [isFetchContainerError, fetchContainerError]);

  const mappedData = (containers ?? []).map(container => ({
    id: container.Id,
    name: container.Names?.[0].slice(1),
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
    },
    {
      key: 'ports',
      dataIndex: 'ports',
      title: 'Ports',
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
        <Flex gap={paddingXS}>
          <Button color={record.state === 'running' ? 'danger' : 'primary'} variant='solid' icon={
            record.state === 'running' ? <FaRegCircleStop /> : <FaRegPlayCircle />
          } onClick={() => {
            if (record.state === 'running') {
              stopContainer(record.id!)
            }
            else {
              startContainer(record.id!);
            }
          }} />
          <Button icon={<MdOutlineRestartAlt />} onClick={() => restartContainer(record.id!)} />
          <Button icon={<AiOutlineDelete onClick={() => deleteContainer(record.id!)} />} />
        </Flex>
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
