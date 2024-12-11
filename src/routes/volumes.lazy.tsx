import { Table, Tooltip, Flex, Button, theme } from 'antd';
import { createLazyFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { volumesAtom, volumeInspectorAtom, volumeInspectorNameAtom } from '../atoms/volumes'
import { useEffect } from 'react';
import { handleAxiosError } from '../utils/errors';
import { TableColumnType } from 'antd';
import { formatRelativeDate } from '../utils';
import { HiMagnifyingGlass } from "react-icons/hi2";
import { InspectorModal } from '../components';

const MAX_VOLUME_NAME_LENGTH = 16;

function Page() {
  const [{ data: volumes, isFetching, error: isFetchVolumesError }] = useAtom(volumesAtom);
  const {token: {marginXS}} = theme.useToken();
  const [volumeInspectorName, setVolumeInspectorName] = useAtom(volumeInspectorNameAtom);
  const [{data: volumeInspector}] = useAtom(volumeInspectorAtom);

  useEffect(() => {
    if (isFetchVolumesError) {
      handleAxiosError(isFetchVolumesError, 'Error fetching volumes');
    }
  }, [isFetchVolumesError]);

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
      )
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
        content={JSON.stringify(volumeInspector, null, 2)}
        onClose={() => setVolumeInspectorName('')}
        open={!!volumeInspectorName}
      />
    </>
  )
}


export const Route = createLazyFileRoute('/volumes')({
  component: Page,
})

