import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import {
  imageApi,
  focusedImageAtom,
  focusedImageIdOrNameAtom,
} from '../../atoms/images'
import React, { useEffect, useState } from 'react'
import {
  Tabs,
  Table,
  TableColumnType,
  Tooltip,
} from 'antd'
import {
  ContainerSummary,
  HistoryResponseItem,
  ImageInspect,
} from '../../api/docker-engine'
import { formatBytes } from '../../utils'
import {
  OverviewObject,
  OverviewObjectProps,
} from '../../components'
import { ImageToolbar } from './-components/image-toolbar'


function Page() {
  const {
    params: { name },
  } = Route.useMatch()
  const [, setImageInspectorName] = useAtom(focusedImageIdOrNameAtom)
  const [{ data: imageInspector }] = useAtom(focusedImageAtom)

  useEffect(() => {
    setImageInspectorName(name)
  }, [name, setImageInspectorName])

  const activeTab = window.location.hash
    ? window.location.hash.slice(1)
    : 'overview'

  const handleChangeTab = (key: string) => {
    window.location.hash = key
  }

  return imageInspector ? (
    <Tabs
      activeKey={activeTab}
      onChange={handleChangeTab}
      tabBarExtraContent={
        <ImageToolbar 
          image={{
            Id: imageInspector.Id!,
            Containers: 0,
            RepoTags: imageInspector.RepoTags ?? [],
          }} 
          showInspector={false}
        />
      }
      items={[
        {
          key: 'overview',
          label: 'Overview',
          children: <OverviewTab data={imageInspector} />,
        },
        {
          key: 'layers',
          label: 'Layers',
          children: <LayersTab imageName={name} />,
        },
      ]}
    />
  ) : null
}

export const Route = createLazyFileRoute('/images/$name')({
  component: Page,
})

const OverviewTab: React.FC<{ data: ImageInspect }> = ({ data }) => {
  const fieldConfigs: OverviewObjectProps<ImageInspect>['fieldConfigs'] = [
    {
      name: 'Name',
      getValue: (d) => d.RepoTags?.[0],
    },
    {
      name: 'Os',
      label: 'OS',
    },
    {
      name: 'Architecture',
    },
    {
      name: 'Command',
      getValue: (d) => d.Config?.Cmd?.join(' '),
    },
    {
      name: 'Entrypoint',
      getValue: (d) => d.Config?.Entrypoint?.[0],
    },
    {
      name: 'Working dir',
      getValue: (d) => d.Config?.WorkingDir || '/',
    },
    {
      name: 'ContainerList',
      label: 'Containers',
      render: (value) => {
        return (
          <>
            {(value as ContainerSummary[]).map((container) =>
              container.Names?.[0].slice(1) ? (
                <Link
                  to="/containers/$name"
                  params={{ name: container.Names?.[0].slice(1) }}
                >
                  {container.Names?.[0].slice(1)}
                </Link>
              ) : (
                'Unknown'
              ),
            )}
          </>
        )
      },
    },
    {
      name: 'Created',
      getValue: (d) =>
        d.Created ? new Date(d.Created).toLocaleString() : null,
    },
    {
      name: 'Size',
      getValue: (d) => formatBytes(d.Size ?? 0),
    },
    {
      name: 'Environments',
      getValue: (d) => Object.values(d.Config?.Env ?? {}),
    },
    {
      name: 'Exposed ports',
      getValue: (d) => Object.keys(d.Config?.ExposedPorts ?? {}),
    },
  ]

  return (
    <OverviewObject data={data} fieldConfigs={fieldConfigs} />
  )
}

const LayersTab: React.FC<{ imageName: string }> = ({ imageName }) => {
  const [layers, setLayers] = useState<HistoryResponseItem[]>([])
  useEffect(() => {
    imageApi.imageHistory({ name: imageName }).then((res) => {
      setLayers(res.data)
    })
  }, [imageName])

  const columns: TableColumnType<HistoryResponseItem>[] = [
    {
      key: 'key',
      title: 'Command',
      dataIndex: 'CreatedBy',
      ellipsis: true,
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.CreatedBy}>
          {record.CreatedBy}
        </Tooltip>
      ),
    },
    {
      key: 'created',
      title: 'Time',
      dataIndex: 'Created',
      render: (_, record) => new Date(record.Created * 1000).toLocaleString(),
    },
    {
      key: 'size',
      title: 'Size',
      dataIndex: 'Size',
      render: (_, record) => formatBytes(record.Size ?? 0),
    },
  ]
  return (
    <>
      <Table columns={columns} dataSource={layers.reverse()} />
    </>
  )
}

