import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAtom, useAtomValue } from 'jotai';

import { containersAtom, restartContainerAtom, startContainerAtom, stopContainerAtom, deleteContainerAtom, focusedContainerIdOrNameAtom, focusedContainerAtom } from '../../atoms/containers';
import { Divider, Table, Flex, Button, theme, Popconfirm } from 'antd';
import type { TableColumnType } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { useEffect, useState } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { FaRegCircleStop } from 'react-icons/fa6';
import { MdOutlineRestartAlt } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { handleAxiosError } from '../../utils/errors';
import { compareStrings } from '../../utils';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { InspectorModal } from '../../components';
import { IoPlayOutline } from "react-icons/io5";
import { IoLogoBuffer } from "react-icons/io";


export const Route = createLazyFileRoute('/containers/')({
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
  const [containerInspectorId, setContainerInspectorId] = useAtom(focusedContainerIdOrNameAtom);
  const [{ data: containerInspector }] = useAtom(focusedContainerAtom);
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const navigate = useNavigate();

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
        <Link to={'/containers/$containerId'} params={{'containerId': record.name}}>{record.name}</Link>,
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
          <Button onClick={() => {
            setContainerInspectorId(record.name);
            setShowInspectorModal(true);
          }} icon={<HiMagnifyingGlass />} />

          {record.state === 'running' ? 
            <Popconfirm
              title="Are you sure you want to stop this container?"
              onConfirm={() => stopContainer(record.id!)}
            >
              <Button icon={<FaRegCircleStop />} />
            </Popconfirm>
            : <Button icon={<IoPlayOutline />} onClick={() => startContainer(record.id!)} />
          }

          <Popconfirm
            title="Are you sure you want to restart this container?"
            onConfirm={() => restartContainer(record.id!)}
          >
            <Button icon={<MdOutlineRestartAlt />} />
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to delete this container?"
            onConfirm={() => deleteContainer(record.id!)}
          >
            <Button icon={<AiOutlineDelete />} />
          </Popconfirm>
          <Button icon={<IoLogoBuffer 
            onClick={() => navigate({
              to: '/containers/$containerId', 
              params: {containerId: record.name}, 
              hash: 'log',
            })} />} />
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
      <InspectorModal 
        title={containerInspectorId}
        content={containerInspector!} 
        onClose={() => setShowInspectorModal(false)} 
        open={showInspectorModal}
      />
    </>
  )
}
