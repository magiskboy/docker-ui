import { Table, Tooltip, Flex, Button, theme, notification, Popconfirm } from 'antd';
import { createLazyFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { volumesAtom, volumeInspectorAtom, volumeInspectorNameAtom, deleteVolumeAtom } from '../../atoms/volumes'
import { useEffect } from 'react';
import { handleAxiosError } from '../../utils/errors';
import { TableColumnType } from 'antd';
import { formatRelativeDate, compareStrings } from '../../utils';
import { HiMagnifyingGlass } from "react-icons/hi2";
import { InspectorModal } from '../../components';
import { AiOutlineDelete } from 'react-icons/ai';

const MAX_VOLUME_NAME_LENGTH = 16;

function Page() {
  const [{ data: volumes, isFetching, error: isFetchVolumesError, refetch: refetchVolumes }] = useAtom(volumesAtom);
  const {token: {marginXS}} = theme.useToken();
  const [volumeInspectorName, setVolumeInspectorName] = useAtom(volumeInspectorNameAtom);
  const [{data: volumeInspector}] = useAtom(volumeInspectorAtom);
  const [{mutate: deleteVolume}] = useAtom(deleteVolumeAtom);

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
        <Tooltip title={record.name}>
          {record.name.length > MAX_VOLUME_NAME_LENGTH ? `${record.name.slice(0, 16)}...` : record.name}
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
      key: 'mountPoint',
      dataIndex: 'mountPoint',
      title: 'Mount Point',
      render: (_, record) => (
        <Tooltip title={record.mountPoint}>
          {record.mountPoint.length > MAX_VOLUME_NAME_LENGTH ? `${record.mountPoint.slice(0, 16)}...` : record.mountPoint}
        </Tooltip>
      )
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
          <Button icon={<HiMagnifyingGlass />} onClick={() => setVolumeInspectorName(record.name ?? '')}/>
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
        onClose={() => setVolumeInspectorName('')}
        open={!!volumeInspectorName}
      />
    </>
  )
}


export const Route = createLazyFileRoute('/volumes/')({
  component: Page,
})

