import { createLazyFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai';
import { imageApi, imageInspectorAtom, imageInspectorNameAtom } from '../../atoms/images';
import React, { useEffect, useState } from 'react';
import { Typography, Tag, Flex, theme, Tabs, Row, Col, Table, TableColumnType, Tooltip} from 'antd';
import { HistoryResponseItem, ImageInspect } from '../../api/docker-engine';
import ReactJson from 'react-json-view'
import { formatBytes } from '../../utils';

const { Text } = Typography;


function Page() {
  const { params: {imageName} } = Route.useMatch();
  const [, setImageInspectorName] = useAtom(imageInspectorNameAtom);
  const [{data: imageInspector}] = useAtom(imageInspectorAtom);

  useEffect(() => {
    setImageInspectorName(imageName); 
  }, [imageName, setImageInspectorName]);

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
            children: imageInspector ? <OverviewTab data={imageInspector} /> : null,
          },
          {
            key: 'layers',
            label: 'Layers',
            children: imageInspector ? <LayersTab imageName={imageName} /> : null,
          },
          {
            key: 'json',
            label: 'JSON',
            children: imageInspector ? <JSONTab content={imageInspector} /> : null,
          }
        ]}
      />

    </>
  )
}

export const Route = createLazyFileRoute('/images/$imageName')({
  component: Page,
})

const LABEL_SPAN = 3;


const OverviewTab: React.FC<{data: ImageInspect}> = ({data}) => {
  const {token: {marginSM, marginXS}} = theme.useToken();

  return (
    <Flex gap={marginSM} vertical>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Name</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.RepoTags?.[0]}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Operating system</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Os} {data.OsVersion}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Architecture</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Architecture}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Command</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Config?.Cmd?.join(' ')}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Entrypoint</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Config?.Entrypoint}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Working dir</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Config?.WorkingDir || 'No set'}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Size</Text></Col>
        <Col span={12 - LABEL_SPAN}>{formatBytes(data.Size ?? 0)}</Col>
      </Row>
      {data.Created && <Row>
        <Col span={LABEL_SPAN}><Text strong>Created</Text></Col>
        <Col span={12 - LABEL_SPAN}>{(new Date(data.Created).toLocaleString())}</Col>
      </Row>}
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Environments</Text></Col>
        <Col span={12 - LABEL_SPAN}>
          <Flex vertical gap={marginXS}>
          {(data.Config?.Env ?? []).map(env => (
            <Tag key={env} style={{width: 'fit-content'}}>{env}</Tag>))}
          </Flex>
        </Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Exposed ports</Text></Col>
        <Col span={12 - LABEL_SPAN}>
          {(Object.keys(data.Config?.ExposedPorts ?? {})).map(port => (
            <Tag key={port} style={{width: 'fit-content'}}>{port}</Tag>))}
        </Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Labels</Text></Col>
        <Col span={12 - LABEL_SPAN}>
          <Flex vertical gap={marginXS}>
            {Object.entries(data.Config?.Labels ?? {}).map(([key, value]) => (
              <Tag key={key} style={{width: 'fit-content'}}>{`${key} = ${value}`}</Tag>))}
          </Flex>
        </Col>
      </Row>
    </Flex>
  )
}


const LayersTab: React.FC<{imageName: string}> = ({imageName}) => {
  const [layers, setLayers] = useState<HistoryResponseItem[]>([]);
  useEffect(() => {
    imageApi.imageHistory({ name: imageName }).then(res => {
      setLayers(res.data);
    });
  }, [imageName]);
  
  const columns: TableColumnType<HistoryResponseItem>[] = [
    {
      key: 'key',
      title: 'Created By',
      dataIndex: 'CreatedBy',
      ellipsis: true,
      render: (_, record) => <Tooltip placement='topLeft' title={record.CreatedBy}>{record.CreatedBy}</Tooltip>,
    },
    {
      key: 'created',
      title: 'Created',
      dataIndex: 'Created',
      render: (_, record) => new Date(record.Created*1000).toLocaleString(),
    },
    {
      key: 'size',
      title: 'Size',
      dataIndex: 'Size',
      render: (_, record) => formatBytes(record.Size ?? 0),
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={layers} />
    </>
  )
}

const JSONTab: React.FC<{content: ImageInspect}> = ({content}) => {
  return (
    <ReactJson src={content} displayDataTypes={false} />
  )
}

