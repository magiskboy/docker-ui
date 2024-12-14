import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { createLazyFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai';
import { focusedVolumeAtom, focusedVolumeNameAtom } from '../../atoms/volumes';
import { Volume } from '../../api/docker-engine';
import { OverviewObject, type OverviewObjectProps} from '../../components';
import ReactJson from 'react-json-view';

export const Route = createLazyFileRoute('/volumes/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  const {params: {name}} = Route.useMatch();
  const [,setFocusedNameVolume] = useAtom(focusedVolumeNameAtom);
  const [{data: focusedVolume}] = useAtom(focusedVolumeAtom);

  useEffect(() => {
    if (!name) return;
    setFocusedNameVolume(name);
  }, [name, setFocusedNameVolume]);

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
            children: focusedVolume ? <OverviewTab data={focusedVolume} /> : null,
          },
          {
            key: 'json',
            label: 'JSON',
            children: focusedVolume ? <JSONTab content={focusedVolume} /> : null,
          }
        ]}
      />
    </>
  )
}


const OverviewTab: React.FC<{data: Volume}> = ({data}) => {
  const fieldConfigs: OverviewObjectProps<Volume>['fieldConfigs'] = [
      {
        name: 'Name',
      },
      {
        name: 'Driver',
      },
      {
        name: 'Scope',
      },
      {
        name: 'Mountpoint',
      },
      {
        name: 'Options',
        getValue: d => Object.entries(d.Options ?? {}).map(([k, v]) => `${k}=${v}`),
      },
      {
        name: 'Labels',
        getValue: d => Object.entries(d.Labels ?? {}).map(([k, v]) => `${k}=${v}`)
      },
      {
        name: 'CreatedAt',
        label: 'Created at',
        getValue: d => d.CreatedAt ? new Date(d.CreatedAt).toLocaleString() : null,
      }
  ]

  return <OverviewObject
    data={data}
    fieldConfigs={fieldConfigs}  
  />
}


const JSONTab: React.FC<{content: Volume}> = ({content}) => {
  return (
    <ReactJson src={content} displayDataTypes={false} />
  )
}