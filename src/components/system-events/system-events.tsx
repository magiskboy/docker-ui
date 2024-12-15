import React, { useEffect, useState } from 'react';
import { Table, TableColumnType } from 'antd';
import { eventsAtom } from '../../atoms/system';
import { EventMessage } from '../../api/docker-engine';
import { Link } from '@tanstack/react-router';
import { useAtom } from 'jotai';


export const SystemEvents: React.FC<Props> = () => {
  const [events, setEvents] = useState<Array<EventMessage & {id: string}>>([]);
  const [eventsGenerator] = useAtom(eventsAtom);

  useEffect(() => {
    (async () => {
      for await (const item of eventsGenerator) {
        setEvents(prev => [...prev, item]);
      }
    })();
  }, [eventsGenerator]);


  const columns: TableColumnType<EventMessage & {id: string}>[] = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'Time',
      render: (value) => new Date(value*1000).toLocaleString(),
      sorter: (a, b) => (a.time ?? Date.now()) - (b.time ?? Date.now()),
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
    },
    {
      title: 'Actor',
      dataIndex: 'Actor',
      key: 'Actor',
      render: (value, record) => {
        if (record.Type === 'image') {
          const name = value.Attributes?.name;
          return <Link to='/images/$imageName' params={{imageName: name!}}>{name}</Link>
        }

        if (record.Type === 'container') {
          const name = value.Attributes?.name;
          return <Link to='/containers/$containerId' params={{containerId: name!}}>{name}</Link>
        }

        if (record.Type === 'network') {
          const name = value.Attributes?.name as string;
          return <Link to='/networks/$name' params={{name}}>{name}</Link>
        }

        if (record.Type === 'volume') {
          const name = value.Attributes?.destination as string;
          return <Link to='/volumes/$name' params={{name: value.ID}}>{name}</Link>
        }

        return value.ID;
      }
    },
    {
      title: 'Scope',
      dataIndex: 'scope',
      key: 'scope',
    },
  ];

  return <Table 
    rowKey={row => row.id + row.time + row.Type + row.time} 
    columns={columns} 
    dataSource={events} 
  />
};


interface Props {
  name?: string;
}

