import { createLazyFileRoute } from '@tanstack/react-router'
import { Collapse, CollapseProps, Tabs } from 'antd'
import { useEffect, useState } from 'react';
import { systemApi } from '../atoms/system';


export function Home() {
  const [activeTab, setActiveTab] = useState(window.location.hash ? window.location.hash.slice(1) : 'system');
  const onChangeTab = (key: string) => {
    window.location.hash = key
  }

  useEffect(() => {
    const onHashChange = (e: HashChangeEvent) => {
      setActiveTab(e.newURL.split('#')[1]);
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    }
  }, []);


  return (
    <Tabs 
      onChange={onChangeTab}
      activeKey={activeTab}
      items={[
        {
          key: 'system',
          label: 'System',
          children: <SystemTab />,
        },
        {
          key: 'events',
          label: 'Events',
          children: <EventsTab />,
        }
      ]}
    />
  )
}


const SystemTab: React.FC = () => {
  const items: CollapseProps['items'] = [
    {
      key: 'Containers',
      label: 'Containers',
      children: <></>
    },
    {
      key: 'Images',
      label: 'Images',
      children: null,
    },
    {
      key: 'Networking',
      label: 'Networking',
      children: null,
    },
    {
      key: 'CPU',
      label: 'CPU',
      children: null,
    },
    {
      key: 'Memory',
      label: 'Memory',
      children: null,
    },
    {
      key: 'Storage',
      label: 'Storage',
      children: null,
    },
    {
      key: 'Swarm',
      label: 'Swarm',
      children: null,
    },
    {
      key: 'Others',
      label: 'Others',
      children: null,
    }
  ];
  return (
    <Collapse items={items} />
  )
}


const EventsTab: React.FC = () => {
  useEffect(() => {
    systemApi.systemEvents(undefined, {
      onDownloadProgress(progressEvent) {
        const text = progressEvent.event?.target.responseText;
        console.log('---', text);
      },
    });
  }, []);
  return (
    <div>Events</div>
  )
}


export const Route = createLazyFileRoute('/')({
  component: Home,
})
