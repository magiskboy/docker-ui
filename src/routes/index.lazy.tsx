import { createLazyFileRoute } from '@tanstack/react-router'
import { Collapse, CollapseProps, Tabs } from 'antd'
import { useEffect, useState } from 'react';
import { SystemEvents } from '../components';
import { useAtom } from 'jotai';
import { systemAtom } from '../atoms/system';
import { SwarmOverview, ImageOverview, ContainerOverview, CPUOverview, MemoryOverview, NetworkOverview, RuntimeOverview, StorageOverview } from './-components';


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
  const [{data: systemInfo}] = useAtom(systemAtom);

  const items: CollapseProps['items'] = [
    {
      key: 'Containers',
      label: 'Containers',
      children: <ContainerOverview systemInfo={systemInfo!} />
    },
    {
      key: 'Images',
      label: 'Images',
      children: <ImageOverview systemInfo={systemInfo!} />,
    },
    {
      key: 'Networking',
      label: 'Networking',
      children: <NetworkOverview systemInfo={systemInfo!} />,
    },
    {
      key: 'CPU',
      label: 'CPU',
      children: <CPUOverview systemInfo={systemInfo!} />,
    },
    {
      key: 'Memory',
      label: 'Memory',
      children: <MemoryOverview systemInfo={systemInfo!} />,
    },
    {
      key: 'Storage',
      label: 'Storage',
      children: <StorageOverview systemInfo={systemInfo!} />,
    },
    {
      key: 'Runtime',
      label: 'Runtime',
      children: <RuntimeOverview systemInfo={systemInfo!} />,
    },
    {
      key: 'Swarm',
      label: 'Swarm',
      children: <SwarmOverview systemInfo={systemInfo!} />,
    },
  ];
  return (
    systemInfo ? <Collapse items={items} defaultActiveKey={[
      'Containers',
      'Images',
      'Networking',
      'CPU',
      'Memory',
      'Storage',
      'Runtime',
      'Swarm',
    ]} /> : null
  )
}


const EventsTab: React.FC = () => {
  return <SystemEvents />
}


export const Route = createLazyFileRoute('/')({
  component: Home,
})
