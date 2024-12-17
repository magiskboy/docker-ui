import React from 'react';
import { SystemInfo } from '../../../api/docker-engine';
import { OverviewObject, OverviewObjectProps } from '../../../components';
import { formatBytes } from '../../../utils';


export const MemoryOverview: React.FC<Props> = ({systemInfo}) => {
  const fieldConfigs: OverviewObjectProps<SystemInfo>['fieldConfigs'] = [
    {
      name: 'MemTotal',
      label: 'Total Memory',
      getValue: d => formatBytes(d.MemTotal ?? 0),
    },
    {
      name: 'MemoryLimit',
      label: 'Memory Limit',
    },
    {
      name: 'SwapLimit',
      label: 'Swap Limit',
    },
    {
      name: 'KernelMemoryTCP',
      label: 'Kernel Memory TCP',
    },
    {
      name: 'OomKillDisable',
      label: 'OomKill Disable',
    },
  ];

  return <OverviewObject data={systemInfo} fieldConfigs={fieldConfigs} labelSpan={12} collapsed />
}


interface Props {
  systemInfo: SystemInfo;
}
