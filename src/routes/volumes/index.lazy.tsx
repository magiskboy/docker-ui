import { Table, Tooltip, Flex, Button, theme, notification, Popconfirm } from 'antd';
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { volumesAtom, focusedVolumeAtom, focusedVolumeNameAtom, deleteVolumeAtom } from '../../atoms/volumes'
import { useEffect, useState } from 'react';
import { handleAxiosError } from '../../utils/errors';
import { TableColumnType } from 'antd';
import { formatRelativeDate, compareStrings } from '../../utils';
import { BsFiletypeJson } from "react-icons/bs";
import { InspectorModal } from '../../components';
import { AiOutlineDelete } from 'react-icons/ai';


function Page() {
  const [{ data: volumes, isFetching, error: isFetchVolumesError, refetch: refetchVolumes }] = useAtom(volumesAtom);
  const {token: {marginXS}} = theme.useToken();
  const [, setVolumeInspectorName] = useAtom(focusedVolumeNameAtom);
  const [{data: volumeInspector}] = useAtom(focusedVolumeAtom);
  const [{mutate: deleteVolume}] = useAtom(deleteVolumeAtom);
  const [showInspector, setShowInspector] = useState(false);

  useEffect(() => {
    if (isFetchVolumesError) {
      handleAxiosError(isFetchVolumesError, 'Error fetching volumes');
    }
  }, [isFetchVolumesError]);

  const onDeleteVolume = (id: string) => {
    deleteVolume(id, {
      onSuccess: () => {
        refetchVolumes();
        notification.success({
          message: 'Success',
          description: `Deleted ${id}`,
        });
      }
    })
  }

  const data = (volumes ?? []).map(volume => ({
    name: volume.Name,
    driver: volume.Driver,
    mountPoint: volume.Mountpoint,
    createdAt: volume.CreatedAt,
    key: volume.Name,
  }));

  const driverTypes = data.map(volume => volume.driver).filter((value, index, self) => self.indexOf(value) === index);

  const columns: TableColumnType<typeof data[0]>[] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      render: (_, record) => (
        <Tooltip title={record.mountPoint}>
          <Link to='/volumes/$name' params={{name: record.name}}>
            {record.name}
          </Link>
        </Tooltip>
      ),
      sorter: (a, b) => compareStrings(a.name, b.name),
    },
    {
      key: 'driver',
      dataIndex: 'driver',
      title: 'Driver',
      filters: driverTypes.map(driver => ({ text: driver, value: driver })),
      onFilter: (value, record) => record.driver === value,
      filterMultiple: true,
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: 'Created At',
      render: (value: number) => formatRelativeDate(value * 1000),
    },
    {
      key: 'actions',
      dataIndex: 'actions',
      title: 'Actions',
      render: (_,record) => (
        <Flex gap={marginXS}>
          <Button icon={<BsFiletypeJson />} onClick={() => {
            setVolumeInspectorName(record.name ?? '')
            setShowInspector(true);
          }}/>
          <Popconfirm
            title="Are you sure you want to delete this volume?"
            onConfirm={() => onDeleteVolume(record.name ?? '')}
          >
            <Button icon={<AiOutlineDelete />} />
          </Popconfirm>
        </Flex>
      ),
    }
  ]

  return (
    <>
      <Table
        dataSource={data} 
        columns={columns} 
        loading={isFetching} 
      />
      <InspectorModal
        title={volumeInspector?.Name ?? ''}
        content={volumeInspector!}
        onClose={() => {
          setShowInspector(false);
          setVolumeInspectorName('');
        }}
        open={showInspector}
      />
    </>
  )
}


export const Route = createLazyFileRoute('/volumes/')({
  component: Page,
})

