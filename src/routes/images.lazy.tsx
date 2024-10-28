import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { createLazyFileRoute } from '@tanstack/react-router'
import { Flex, Table, Tag, Button, theme, Divider, notification, Typography } from 'antd';
import type { TableColumnType, TableProps } from 'antd';
import { formatBytes, compareDates, compareNumbers, compareStrings, formatRelativeDate } from '../utils';
import { deleteImagesAtoms, imagesAtom } from '../atoms/images';
import ButtonGroup from 'antd/es/button/button-group';
import { AiOutlineDelete } from 'react-icons/ai';
import { GrView } from 'react-icons/gr';
import { handleAxiosError } from '../utils/errors';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
const { Text } = Typography;


export const Route = createLazyFileRoute('/images')({
  component: Page,
});

type ILabels = Record<string, string>;

function Page() {
  const [{data: images, isFetching, refetch, error: fetchImagesError, isError }] = useAtom(imagesAtom);
  const [{ mutate: deleteImages, status: deleteImageStatus }] = useAtom(deleteImagesAtoms);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { token: {marginXS }} = theme.useToken();

  useEffect(() => {
    if (deleteImageStatus === 'success') {
      notification.success({
        message: 'Success',
        description: 'Delete images successfully',
      });
      refetch();
    } 
    setSelectedRowKeys([]);
  }, [refetch, deleteImageStatus]);

  useEffect(() => {
    if (isError) {
      handleAxiosError(fetchImagesError, 'Error fetching images');
    }
  }, [isError, fetchImagesError]);

  const data = (images ?? []).map(image => ({
    id: image.Id,
    size: image.Size,
    name: image.RepoTags ? image.RepoTags[0].split(':')[0] : '',
    tag: image.RepoTags ? image.RepoTags[0].split(':')[1] : '',
    status: image.Containers > 0 ? 'In Use' : 'Unused',
    created: image.Created,
    key: image.Id,
  }));

  const columns: TableColumnType<typeof data[0]>[] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      sorter: (a, b) => compareStrings(a.name, b.name),
    },
    {
      key: 'tag',
      dataIndex: 'tag',
      title: 'Tag',
      filters: _.uniq(data.map(image => image.tag)).map(tag => ({text: tag, value: tag})),
      onFilter: (value, record) => record.tag === value,
      filterMultiple: true,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      filters: [
        { text: 'In Use', value: 'In Use'},
        { text: 'Unused', value: 'Unused'},
      ],
      onFilter: (value, record) => record.status === value,
      filterMultiple: false,
    },
    {
      key: 'created',
      dataIndex: 'created',
      title: 'Created',
      render: (value: number) => formatRelativeDate(value * 1000),
      sorter: (a, b) => compareDates(a.created, b.created),
    },
    {
      key: 'size',
      dataIndex: 'size',
      title: 'Size',
      render: (value: number) => formatBytes(value),
      sorter: (a, b) => compareNumbers(a.size, b.size),
    },
    {
      key: 'actions',
      dataIndex: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Flex gap={marginXS}>
          <Button icon={<GrView />} />
          {record.status !== 'Unused' && <Button
            danger
            icon={<AiOutlineDelete />}
            onClick={() => onDeleteImages([record.id])}
          />}
        </Flex>
      ),
    }
  ]

  const rowSelection: TableRowSelection<typeof data[0]> = {
    selectedRowKeys,
    onChange: keys => setSelectedRowKeys(keys),
  };

  
  const onDeleteImages = (keys?: string[]) => {
    deleteImages(keys ?? selectedRowKeys as string[]);
  }

  const isSelected = selectedRowKeys.length > 0;

  return (
    <>
      <Flex justify='space-between'>
        <Flex vertical>
          <Text strong>Images: {data.length}</Text>
          <Text strong>In Use: {data.filter(image => image.status === 'In Use').length}/{data.length}</Text>
          <Text strong>Disk Usage: {formatBytes(_.sumBy(data, 'size'))}</Text>
        </Flex>
        <ButtonGroup>
          <Button 
            color='danger' 
            variant='solid' 
            disabled={!isSelected} 
            onClick={() => onDeleteImages()} 
            icon={<AiOutlineDelete />}
          >
            Delete
          </Button>
        </ButtonGroup>
      </Flex>
      <Divider />
      <Table 
        dataSource={data} 
        columns={columns} 
        loading={isFetching || deleteImageStatus === 'pending'} 
        rowSelection={rowSelection}
      />
    </>
  )
}


export const ImageLabels: React.FC<{labels: ILabels}> = ({ labels }) => {
  const { token: {paddingXS }} = theme.useToken();

  return labels ? (
    <Flex gap={paddingXS} vertical>
        {Object.entries(labels).map(
          ([key, value]) => <Tag style={{width: 'fit-content'}}>{`${key} = ${value}`}</Tag>
        )}
    </Flex>
  ) : null;
}