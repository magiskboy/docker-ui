import React from 'react';
import { SystemInfo } from '../../../api/docker-engine';
import { OverviewObject, OverviewObjectProps } from '../../../components';


export const NetworkOverview: React.FC<Props> = ({systemInfo}) => {
  const fieldConfigs: OverviewObjectProps<SystemInfo>['fieldConfigs'] = [
    {
      name: 'Drivers',
      getValue: d => d.Plugins?.Network,
      verticalList: false,
    },
    {
      name: 'Address pool',
      getValue: d => d.DefaultAddressPools?.map(item => item.Base)
    },
    {
      name: 'HttpProxy',
    },
    {
      name: 'HttpsProxy',
    },
    {
      name: 'Name',
      label: 'Hostname'
    },
    {
      name: 'IPv4Forwarding',
      label: 'IPv4 Forwarding'
    },
    {
      name: 'BridgeNfIptables',
    },
    {
      name: 'BridgeNfIP6tables',
    },
  ]
  return <OverviewObject data={systemInfo} fieldConfigs={fieldConfigs} collapsed showJson={false} />
}


interface Props {
  systemInfo: SystemInfo;
}
